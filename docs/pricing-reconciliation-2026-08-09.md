# ESCLARE 2026 pricing reconciliation

Source reviewed: `2026 Menu of Services.xlsx` supplied by ESCLARE. The workbook is treated as authoritative only where an entry and its website match are clear. Prices absent from the workbook were left unchanged.

## Implemented confirmed matches

| Treatment or package          | Website location                   | Previous website value |                           Verified workbook value | Sessions / inclusions                                                            | Workbook sheet         | Status                                       |
| ----------------------------- | ---------------------------------- | ---------------------: | ------------------------------------------------: | -------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------- |
| HydroJelly Mask add-on        | Treatments → Facials               |             Not listed |                                              ₱350 | Facial add-on                                                                    | FACIALS                | Added                                        |
| Tattoo Laser Removal, Naga    | Treatments → Laser and Brightening |             Not listed | Starts at ₱2,500 up to 3×3 cm; ₱500 per excess cm | Per treatment                                                                    | PICO LASER naga        | Added                                        |
| Tattoo Laser Removal, Daet    | Treatments → Laser and Brightening |             Not listed | Starts at ₱1,200 up to 3×3 cm; ₱500 per excess cm | Buy 3+1 or 5+2 noted in workbook, not advertised as a standing website promotion | Pico Daet              | Added base price; package promotion withheld |
| Exilift chin                  | Lifting and Contouring → Exilift   |        Separate/absent |                                              ₱800 | Per session                                                                      | Facial slimming exilis | Grouped                                      |
| Exilift face                  | Lifting and Contouring → Exilift   |                 ₱1,800 |                                            ₱1,800 | Per session; workbook also lists 4- and 6-session packages                       | Facial slimming exilis | Confirmed                                    |
| Exilift abdomen               | Lifting and Contouring → Exilift   |            Not grouped |                                            ₱2,300 | Per session                                                                      | Exilift & MESO Body    | Grouped                                      |
| Exilift flanks                | Lifting and Contouring → Exilift   |            Not grouped |                                            ₱2,300 | Per session                                                                      | Exilift & MESO Body    | Grouped                                      |
| Exilift arms                  | Lifting and Contouring → Exilift   |            Not grouped |                                            ₱1,500 | Per session                                                                      | Exilift & MESO Body    | Grouped                                      |
| Exilift upper back / bra line | Lifting and Contouring → Exilift   |            Not grouped |                                            ₱1,500 | Per session                                                                      | Exilift & MESO Body    | Grouped                                      |
| Exilift front or back thighs  | Lifting and Contouring → Exilift   |            Not grouped |                                            ₱1,500 | Per session                                                                      | Exilift & MESO Body    | Grouped                                      |
| Exilift buttocks              | Lifting and Contouring → Exilift   |            Not grouped |                                            ₱2,300 | Per session                                                                      | Exilift & MESO Body    | Grouped                                      |
| HIFU face                     | Lifting and Contouring → HIFU      |                 ₱4,999 |                                            ₱4,999 | Per session; workbook lists ₱10,000 for 3 sessions                               | Facial slimming exilis | Confirmed                                    |
| HIFU abdomen                  | Lifting and Contouring → HIFU      |                 ₱3,999 |                                            ₱4,999 | Per session                                                                      | BODY HIFU & Exilift    | Corrected and grouped                        |
| HIFU flanks                   | Lifting and Contouring → HIFU      |                 ₱4,999 |                                            ₱3,999 | Per session                                                                      | BODY HIFU & Exilift    | Corrected and grouped                        |
| HIFU arms                     | Lifting and Contouring → HIFU      |             Not listed |                                            ₱3,999 | Per session                                                                      | BODY HIFU & Exilift    | Added to grouped card                        |
| HIFU thighs                   | Lifting and Contouring → HIFU      |             Not listed |                                            ₱4,999 | Per session                                                                      | BODY HIFU & Exilift    | Added to grouped card                        |

## Confirmed but intentionally not merged into the current cards

| Workbook entry                       |                  Verified value | Reason                                                                                                                       |
| ------------------------------------ | ------------------------------: | ---------------------------------------------------------------------------------------------------------------------------- |
| Collagen Serum ESTHEMAX              |                            ₱400 | Separate serum add-on; not the HydroJelly Mask price.                                                                        |
| Mesotherapy + Exilift combinations   | ₱2,800–₱4,000 depending on area | Combination procedures are not interchangeable with Exilift-only pricing and need their own approved service presentation.   |
| HIFU with Exilift combinations       | ₱4,999–₱5,999 depending on area | Combination service; not merged into HIFU-only pricing.                                                                      |
| Body Slimming RF sheet               |                          Varies | Uses alternate RF/PPC terminology and was not merged into the established Exilift service family without owner confirmation. |
| Time-limited or package-style offers |                          Varies | “Buy 2+1,” “Buy 3+1,” and similar offers were not promoted as permanent pricing because no validity period was supplied.     |

## Items requiring confirmation

- The workbook contains branch-specific Carbon Peel prices that differ between Naga and Daet. The current single website card remains unchanged until a branch-aware presentation is approved.
- The workbook contains several duplicate or near-duplicate facial and laser sheets with branch-specific values. Only the explicitly requested, unambiguous matches above were changed.
- Treatments not included in the workbook were preserved as required.
- The website has no historical promotion archive in the current public catalog, so expired or undated workbook promotions were not introduced.

## Consistency locations checked

- Central treatment catalog and formatted prices
- Treatment listing and detail routes
- Appointment treatment selector
- Treatment structured data generated from the central catalog
- Public search/education links related to the newly added services
- Unit tests for canonical catalog values
