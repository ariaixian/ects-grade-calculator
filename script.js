(function exposeGradeCalculator(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GradeCalculator = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function createGradeCalculator() {
  function weightedAverage(courses) {
    if (!Array.isArray(courses) || courses.length === 0) {
      throw new Error('Add at least one complete course.');
    }

    let weightedTotal = 0;
    let totalCredits = 0;
    courses.forEach((course, index) => {
      const grade = Number(course.grade);
      const credits = Number(course.credits);
      if (!Number.isFinite(grade)) throw new Error(`Course ${index + 1} needs a valid grade.`);
      if (!Number.isFinite(credits) || credits <= 0) {
        throw new Error(`Course ${index + 1} needs ECTS credits greater than zero.`);
      }
      weightedTotal += grade * credits;
      totalCredits += credits;
    });

    return { average: weightedTotal / totalCredits, totalCredits };
  }

  return Object.freeze({ weightedAverage });
}));

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const rows = document.querySelector('#course-rows');
    const resultCard = document.querySelector('#result-card');
    const errorOutput = document.querySelector('#error');
    let rowId = 0;

    function addCourse(values = {}) {
      rowId += 1;
      const row = document.createElement('tr');
      row.dataset.rowId = rowId;
      row.innerHTML = `
        <td><input aria-label="Course name" type="text" value="${values.name || ''}" placeholder="e.g. Structural Biology"></td>
        <td><input aria-label="Grade" type="number" step="any" value="${values.grade || ''}" placeholder="1.7"></td>
        <td><input aria-label="ECTS credits" type="number" min="0.1" step="0.1" value="${values.credits || ''}" placeholder="6"></td>
        <td><button class="remove-course" type="button" aria-label="Remove course">×</button></td>
      `;
      row.querySelector('.remove-course').addEventListener('click', () => {
        row.remove();
        if (rows.children.length === 0) addCourse();
      });
      rows.appendChild(row);
    }

    function readCourses() {
      return [...rows.querySelectorAll('tr')]
        .map((row) => {
          const inputs = row.querySelectorAll('input');
          return { name: inputs[0].value.trim(), grade: inputs[1].value, credits: inputs[2].value };
        })
        .filter((course) => course.name || course.grade || course.credits);
    }

    document.querySelector('#add-course').addEventListener('click', () => addCourse());
    document.querySelector('#calculate').addEventListener('click', () => {
      errorOutput.textContent = '';
      try {
        const courses = readCourses();
        const result = GradeCalculator.weightedAverage(courses);
        document.querySelector('#average').textContent = result.average.toFixed(2);
        document.querySelector('#course-count').textContent = courses.length;
        document.querySelector('#total-ects').textContent = result.totalCredits.toFixed(1);
        resultCard.hidden = false;
      } catch (error) {
        resultCard.hidden = true;
        errorOutput.textContent = error instanceof Error ? error.message : 'Unable to calculate the average.';
      }
    });
    document.querySelector('#reset').addEventListener('click', () => {
      rows.innerHTML = '';
      resultCard.hidden = true;
      errorOutput.textContent = '';
      addCourse();
    });

    addCourse();
    addCourse();
    addCourse();
  });
}
