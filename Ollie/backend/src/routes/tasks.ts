import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../database/init';

const router = Router();

// Get all tasks
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const { category, status, assigned_to } = req.query;
  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params: any[] = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (assigned_to) {
    query += ' AND assigned_to = ?';
    params.push(assigned_to);
  }

  query += ' ORDER BY due_date ASC';

  db.all(query, params, (err, tasks) => {
    if (err) return next(err);
    res.json(tasks);
  });
});

// Get task by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, task) => {
    if (err) return next(err);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  });
});

// Create task
router.post(
  '/',
  [
    body('title').notEmpty().trim(),
    body('category').isIn(['below_ground', 'above_ground']),
    body('location').notEmpty().trim(),
    body('due_date').optional().isISO8601(),
    body('required_skills').optional().isString(),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      status = 'pending',
      priority = 'medium',
      category,
      required_skills,
      location,
      assigned_to,
      estimated_hours,
      due_date,
    } = req.body;

    db.run(
      `INSERT INTO tasks (title, description, status, priority, category, required_skills, location, assigned_to, estimated_hours, due_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        status,
        priority,
        category,
        required_skills,
        location,
        assigned_to,
        estimated_hours,
        due_date,
      ],
      function (err) {
        if (err) return next(err);

        db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, task) => {
          if (err) return next(err);
          res.status(201).json(task);
        });
      }
    );
  }
);

// Update task
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  const updates: string[] = [];
  const values: any[] = [];

  const allowedFields = [
    'title',
    'description',
    'status',
    'priority',
    'category',
    'required_skills',
    'location',
    'assigned_to',
    'estimated_hours',
    'due_date',
  ];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(req.body[field]);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(req.params.id);

  db.run(
    `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
    values,
    function (err) {
      if (err) return next(err);
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, task) => {
        if (err) return next(err);
        res.json(task);
      });
    }
  );
});

// Assign task to engineer
router.post('/:id/assign', (req: Request, res: Response, next: NextFunction) => {
  const { engineer_id } = req.body;

  if (!engineer_id) {
    return res.status(400).json({ error: 'engineer_id is required' });
  }

  // Verify engineer exists
  db.get(
    'SELECT * FROM engineers WHERE id = ?',
    [engineer_id],
    (err, engineer) => {
      if (err) return next(err);
      if (!engineer) {
        return res.status(404).json({ error: 'Engineer not found' });
      }

      // Update task
      db.run(
        'UPDATE tasks SET assigned_to = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [engineer_id, req.params.id],
        function (err) {
          if (err) return next(err);
          if (this.changes === 0) {
            return res.status(404).json({ error: 'Task not found' });
          }

          // Record assignment
          db.run(
            'INSERT INTO task_assignments (task_id, engineer_id) VALUES (?, ?)',
            [req.params.id, engineer_id],
            (err) => {
              if (err) return next(err);

              db.get(
                'SELECT * FROM tasks WHERE id = ?',
                [req.params.id],
                (err, task) => {
                  if (err) return next(err);
                  res.json(task);
                }
              );
            }
          );
        }
      );
    }
  );
});

// Delete task
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], function (err) {
    if (err) return next(err);
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send();
  });
});

export default router;
