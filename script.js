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
    const starField = document.querySelector('#star-field');
    let rowId = 0;

    function makeInput({ label, type, placeholder, value = '', step, min }) {
      const input = document.createElement('input');
      input.setAttribute('aria-label', label);
      input.type = type;
      input.placeholder = placeholder;
      input.value = value;
      if (step) input.step = step;
      if (min) input.min = min;
      return input;
    }

    function addCourse(values = {}) {
      rowId += 1;
      const row = document.createElement('tr');
      row.dataset.rowId = String(rowId);

      const nameCell = row.insertCell();
      nameCell.appendChild(makeInput({
        label: 'Course name',
        type: 'text',
        placeholder: 'name',
        value: values.name || '',
      }));

      const gradeCell = row.insertCell();
      gradeCell.appendChild(makeInput({
        label: 'Grade',
        type: 'number',
        placeholder: 'grade',
        value: values.grade || '',
        step: 'any',
      }));

      const creditsCell = row.insertCell();
      creditsCell.appendChild(makeInput({
        label: 'ECTS credits',
        type: 'number',
        placeholder: 'ects',
        value: values.credits || '',
        step: '0.1',
        min: '0.1',
      }));

      const selectCell = row.insertCell();
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.setAttribute('aria-label', `Select course ${rowId} for deletion`);
      selectCell.appendChild(checkbox);
      rows.appendChild(row);
    }

    function readCourses() {
      return [...rows.querySelectorAll('tr')]
        .filter((row) => !row.querySelector('input[type="checkbox"]').checked)
        .map((row) => {
          const name = row.querySelector('input[type="text"]').value.trim();
          const numbers = row.querySelectorAll('input[type="number"]');
          return { name, grade: numbers[0].value, credits: numbers[1].value };
        })
        .filter((course) => course.name || course.grade || course.credits);
    }

    function celebrate() {
      starField.replaceChildren();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      for (let index = 0; index < 36; index += 1) {
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = '★';
        star.style.left = `${Math.random() * 100}%`;
        star.style.setProperty('--star-size', `${12 + Math.random() * 18}px`);
        star.style.setProperty('--star-speed', `${3 + Math.random() * 4}s`);
        star.style.animationDelay = `${Math.random() * 1.5}s`;
        starField.appendChild(star);
      }

      window.setTimeout(() => starField.replaceChildren(), 8500);
    }

    function updateClock() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      document.querySelector('#clock').textContent = `${hours}✶${minutes}`;
    }

    document.querySelector('#add-course').addEventListener('click', () => addCourse());

    document.querySelector('#delete-selected').addEventListener('click', () => {
      const selected = [...rows.querySelectorAll('tr')]
        .filter((row) => row.querySelector('input[type="checkbox"]').checked);
      selected.forEach((row) => row.remove());
      if (rows.children.length === 0) addCourse();
      resultCard.hidden = true;
      errorOutput.textContent = selected.length ? '' : 'Select a course row to delete.';
    });

    document.querySelector('#calculate').addEventListener('click', () => {
      errorOutput.textContent = '';
      try {
        const courses = readCourses();
        const result = GradeCalculator.weightedAverage(courses);
        document.querySelector('#average').textContent = result.average.toFixed(2);
        document.querySelector('#course-count').textContent = String(courses.length);
        document.querySelector('#total-ects').textContent = result.totalCredits.toFixed(1);
        resultCard.hidden = false;
        celebrate();
      } catch (error) {
        resultCard.hidden = true;
        errorOutput.textContent = error instanceof Error
          ? error.message
          : 'Unable to calculate the average.';
      }
    });

    document.querySelector('#print').addEventListener('click', () => window.print());
    document.querySelector('#reset').addEventListener('click', () => {
      rows.replaceChildren();
      starField.replaceChildren();
      resultCard.hidden = true;
      errorOutput.textContent = '';
      addCourse();
    });

    addCourse();
    updateClock();
    window.setInterval(updateClock, 1000);
  });
}
