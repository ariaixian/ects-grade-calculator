# ECTS Grade Calculator

A browser-based calculator for credit-weighted course averages. It accepts any
numeric grading scale and weights each grade by its European Credit Transfer
and Accumulation System (ECTS) value.

**Live application:**
[ariaixian.github.io/ects-grade-calculator](https://ariaixian.github.io/ects-grade-calculator/)

## Use

1. Add one row per course.
2. Enter the grade and ECTS credits for every included course.
3. Select **Calculate average**.

The application reports the weighted average, total credits, and number of
courses included. Blank rows are ignored. It does not convert between grading
systems or apply institution-specific rounding rules.

## Calculation

For grades `gᵢ` and credit values `cᵢ`:

```text
weighted average = Σ(gᵢ × cᵢ) / Σ(cᵢ)
```

The calculation is isolated in `script.js` and covered by automated tests.

## Run locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. To run the calculation tests:

```bash
npm test
```

All course data remains in the page and is discarded when the page is closed
or reset.

## License

Released under the [MIT License](LICENSE).
