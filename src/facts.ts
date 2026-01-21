export const mathsFacts = [
  "🔢 Did you know? Zero is the only number that can't be written in Roman numerals!",
  "🔢 A 'jiffy' is an actual unit of time - it's 1/100th of a second!",
  "🔢 The number 4 is the only number with the same number of letters as its value!",
  "🔢 If you multiply 111,111,111 × 111,111,111 you get 12,345,678,987,654,321!",
  "🔢 A pizza that has radius 'z' and height 'a' has a volume of pi×z×z×a!",
  "🔢 The word 'hundred' comes from 'hundrath' which means 120, not 100!",
  "🔢 In a room of 23 people, there's a 50% chance two share the same birthday!",
  "🔢 The equals sign (=) was invented in 1557 by Robert Recorde!",
  "🔢 The number 9 is considered lucky in China because it sounds like 'long-lasting'!",
  "🔢 Butterflies can count! They can tell the difference between 2 and 3 flowers!",
];

export const spellingWords = [
  "✏️ Fun word: ONOMATOPOEIA - words that sound like what they mean (like 'buzz' or 'splash')!",
  "✏️ Fun word: SERENDIPITY - finding something good by accident!",
  "✏️ Fun word: BOOKKEEPER - the only English word with 3 double letters in a row!",
  "✏️ Fun word: PNEUMONOULTRAMICROSCOPICSILICOVOLCANOCONIOSIS - the longest word in English!",
  "✏️ Fun word: HIPPOPOTOMONSTROSESQUIPPEDALIOPHOBIA - fear of long words (ironically)!",
  "✏️ Fun word: AMBIDEXTROUS - able to use both hands equally well!",
  "✏️ Fun word: STRENGTHS - longest English word with only one vowel!",
  "✏️ Fun word: RHYTHM - longest common English word without A, E, I, O, or U!",
  "✏️ Fun word: QUEUE - if you remove the last 4 letters, it still sounds the same!",
  "✏️ Fun word: ALMOST - longest word with letters in alphabetical order!",
];

export const readingFacts = [
  "📚 Book fact: The smell of old books comes from a chemical breakdown called lignin!",
  "📚 Book fact: The first book ever printed was the Bible in 1455!",
  "📚 Book fact: Dr. Seuss wrote 'Green Eggs and Ham' using only 50 different words!",
  "📚 Book fact: The longest sentence in literature has 823 words (in Les Misérables)!",
  "📚 Book fact: Iceland publishes more books per person than any other country!",
  "📚 Book fact: The word 'bookworm' originally meant an insect that eats books!",
  "📚 Book fact: Harry Potter was rejected by 12 publishers before being accepted!",
  "📚 Book fact: Reading can reduce stress by up to 68% - more than listening to music!",
  "📚 Book fact: The most-read book in the world is 'The Bible' followed by Harry Potter!",
  "📚 Book fact: Your reading speed is about 250 words per minute on average!",
];

export function getRandomFact(subject: 'maths' | 'reading' | 'spelling'): string {
  const facts = subject === 'maths' ? mathsFacts : subject === 'reading' ? readingFacts : spellingWords;
  return facts[Math.floor(Math.random() * facts.length)];
}
