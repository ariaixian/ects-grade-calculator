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

Rows can be marked for deletion, and a completed calculation can be printed or
saved as a PDF through the browser's print dialog.

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

## Design

The interface preserves the original calculator's pale-pink canvas, custom
bubble and pixel typography, centered worksheet, star motif, and live clock.
The implementation was rebuilt as valid, responsive HTML with bounded motion,
keyboard-visible controls, and a tested calculation core.

## License

Application code is released under the [MIT License](LICENSE). The custom font
files in `assets/fonts` are original design assets and are not covered by the
software license.
