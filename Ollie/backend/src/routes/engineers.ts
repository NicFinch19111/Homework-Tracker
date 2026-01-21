import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../database/init';

const router = Router();

// Get all engineers
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  db.all('SELECT * FROM engineers', [], (err, engineers) => {
    if (err) return next(err);
    res.json(engineers);
  });
});

// Get engineer by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  db.get(
    'SELECT * FROM engineers WHERE id = ?',
    [req.params.id],
    (err, engineer) => {
      if (err) return next(err);
      if (!engineer) {
        return res.status(404).json({ error: 'Engineer not found' });
      }
      res.json(engineer);
    }
  );
});

// Create engineer
router.post(
  '/',
  [
    body('name').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('skills').optional().isString(),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, skills, availability_status = 'available' } = req.body;

    db.run(
      'INSERT INTO engineers (name, email, skills, availability_status) VALUES (?, ?, ?, ?)',
      [name, email, skills, availability_status],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Email already exists' });
          }
          return next(err);
        }

        db.get(
          'SELECT * FROM engineers WHERE id = ?',
          [this.lastID],
          (err, engineer) => {
            if (err) return next(err);
            res.status(201).json(engineer);
          }
        );
      }
    );
  }
);

// Update engineer
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  const { name, email, skills, availability_status } = req.body;
  const updates: string[] = [];
  const values: any[] = [];

  if (name !== undefined) {
    updates.push('name = ?');
    values.push(name);
  }
  if (email !== undefined) {
    updates.push('email = ?');
    values.push(email);
  }
  if (skills !== undefined) {
    updates.push('skills = ?');
    values.push(skills);
  }
  if (availability_status !== undefined) {
    updates.push('availability_status = ?');
    values.push(availability_status);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(req.params.id);

  db.run(
    `UPDATE engineers SET ${updates.join(', ')} WHERE id = ?`,
    values,
    function (err) {
      if (err) return next(err);
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Engineer not found' });
      }

      db.get(
        'SELECT * FROM engineers WHERE id = ?',
        [req.params.id],
        (err, engineer) => {
          if (err) return next(err);
          res.json(engineer);
        }
      );
    }
  );
});

// Delete engineer
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  db.run('DELETE FROM engineers WHERE id = ?', [req.params.id], function (err) {
    if (err) return next(err);
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Engineer not found' });
    }
    res.status(204).send();
  });
});

export default router;
