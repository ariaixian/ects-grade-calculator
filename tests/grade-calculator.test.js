const test = require('node:test');
const assert = require('node:assert/strict');
const { weightedAverage } = require('../script.js');

test('calculates an ECTS-weighted average', () => {
  const result = weightedAverage([
    { grade: 1.3, credits: 6 },
    { grade: 2.0, credits: 3 },
    { grade: 1.7, credits: 9 },
  ]);
  assert.equal(result.totalCredits, 18);
  assert.equal(result.average, 29.1 / 18);
});

test('accepts grading scales with values outside the German scale', () => {
  const result = weightedAverage([{ grade: 85, credits: 5 }, { grade: 95, credits: 5 }]);
  assert.equal(result.average, 90);
});

test('rejects missing courses and invalid credits', () => {
  assert.throws(() => weightedAverage([]), /at least one/);
  assert.throws(() => weightedAverage([{ grade: 1.3, credits: 0 }]), /greater than zero/);
});
