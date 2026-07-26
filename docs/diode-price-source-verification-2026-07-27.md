# Diode Price Source Verification

Date: 2026-07-27

Source: `Diode Price 7 27 2026.pdf`

The two-page PDF was extracted and visually inspected. It contains 14 treatment areas, session
quantities 1 through 6, and 84 regular prices. It contains no promotional price, validity period,
inclusion, discount percentage, or promotional condition.

The complete matrix is identical to the active `diodePackages` catalog and its exact-value unit
test at commit `2baebe7fe8548aeac6196112bac258499bb42e35`. The visible public table already uses the approved
service name, Philippine peso formatting, and the 1-6 session columns. No application or database
pricing change is required for this source.

Verification result: passed, 84 of 84 values matched. No value was estimated or calculated.
