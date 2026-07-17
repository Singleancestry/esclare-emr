export const faqCategories = [
  "Underarm & Diode",
  "Facials & Skin",
  "Weight & Body",
  "HIFU & Doctor-Led",
  "Visits & Aftercare",
] as const;

export type FaqCategory = (typeof faqCategories)[number];

export type ClinicFaq = {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
};

export const clinicFaqs: ReadonlyArray<ClinicFaq> = [
  {
    id: "diode-permanent",
    category: "Underarm & Diode",
    question: "Is diode laser hair removal permanent?",
    answer:
      "Diode laser is intended for long-term hair reduction, not guaranteed permanent removal. Hair, skin, hormones, treatment area and session consistency all affect the response, and occasional maintenance may be advised.",
  },
  {
    id: "diode-whitening",
    category: "Underarm & Diode",
    question: "Does diode laser whiten the underarms?",
    answer:
      "Not directly. Diode laser targets hair follicles. Reduced shaving and irritation may help the area look calmer over time, while pigmentation concerns require a separate assessment and may need a dedicated brightening plan.",
  },
  {
    id: "diode-sessions",
    category: "Underarm & Diode",
    question: "How many diode sessions will I need?",
    answer:
      "A course of multiple sessions is usually needed because hair grows in cycles. ESCLARE commonly spaces diode sessions about four weeks apart, but the number and timing are adjusted to your area, hair growth and response.",
  },
  {
    id: "pico-after-diode",
    category: "Underarm & Diode",
    question: "Can Pico brightening and diode be done on the same underarm area?",
    answer:
      "They are not normally performed on the same area on the same day. Pico brightening may be considered about two weeks after diode once hair growth and skin response are suitable. Your provider will set the sequence after assessment.",
  },
  {
    id: "diode-preparation",
    category: "Underarm & Diode",
    question: "How should I prepare for diode laser?",
    answer:
      "Avoid waxing, plucking and epilating before the session because the follicle needs to remain present. Shaving instructions, sun-exposure precautions and product restrictions can vary, so follow the branch team's confirmed pre-care guidance.",
  },
  {
    id: "facial-selection",
    category: "Facials & Skin",
    question: "Which facial is right for acne, dullness or dehydration?",
    answer:
      "The best option depends on your skin condition, sensitivity and current products. A skin assessment helps the team select among cleansing, hydration, peel and professional skin-support services without over-treating the skin.",
  },
  {
    id: "pores",
    category: "Facials & Skin",
    question: "Can a facial permanently close enlarged pores?",
    answer:
      "No. Pores do not permanently open or close. Cleansing, exfoliation and appropriate skincare may improve how visible they look, but results vary and need maintenance.",
  },
  {
    id: "acne-scars",
    category: "Facials & Skin",
    question: "Can acne scars be completely removed?",
    answer:
      "Complete removal cannot be promised. Different scar types respond differently to peels, lasers, skin-support procedures and doctor-led care. Assessment is needed to set a realistic plan and discuss expected improvement.",
  },
  {
    id: "mccm-pdrn",
    category: "Facials & Skin",
    question: "What is MCCM PDRN Glow & Eye Rejuvenation?",
    answer:
      "It is a professional brightening, hydration and eye-contour protocol using MCCM Glutathione Peeling, PDRN and Out Contour Cocktail. It is priced at PHP 3,800 per session and is selected after a skin assessment.",
  },
  {
    id: "exosomes",
    category: "Facials & Skin",
    question: "Are exosome treatments proven to regenerate skin?",
    answer:
      "Research is still developing and product quality, delivery method and indications vary. ESCLARE does not promise regeneration or guaranteed results; any proposed skin-support treatment should be discussed with a qualified provider.",
  },
  {
    id: "weight-guarantee",
    category: "Weight & Body",
    question: "Is weight loss guaranteed with a clinic program?",
    answer:
      "No. Weight change varies with health history, nutrition, activity, adherence, sleep and medication response. A responsible plan uses measurable goals, follow-up and medical supervision when prescription treatment is involved.",
  },
  {
    id: "glp1-assessment",
    category: "Weight & Body",
    question: "Can anyone receive GLP-1 weight-management medicine?",
    answer:
      "No. Prescription medicines require a licensed clinician's assessment, including medical history, current medicines, contraindications and appropriate weight-related criteria such as BMI and health risk. Availability does not mean automatic suitability.",
  },
  {
    id: "lipo-drip",
    category: "Weight & Body",
    question: "Does a lipo drip burn body fat?",
    answer:
      "An IV drip should not be described as a proven fat-burning treatment. Body-composition concerns need evidence-based nutrition, activity and, when appropriate, clinician-supervised treatment. Ask what a proposed infusion contains and why it is recommended.",
  },
  {
    id: "body-contouring",
    category: "Weight & Body",
    question: "Is non-surgical body contouring a substitute for weight loss?",
    answer:
      "No. Body-contouring treatments may address selected areas but are not a treatment for obesity and do not replace sustainable weight management. Suitability and expectations should be assessed first.",
  },
  {
    id: "hifu-facelift",
    category: "HIFU & Doctor-Led",
    question: "Is HIFU the same as a surgical facelift?",
    answer:
      "No. HIFU is a non-surgical focused-ultrasound treatment and cannot reproduce the scope or predictability of surgery. Improvement, timing and longevity vary, and candidacy should be assessed.",
  },
  {
    id: "hifu-results",
    category: "HIFU & Doctor-Led",
    question: "When will I see HIFU results?",
    answer:
      "Some clients notice gradual changes over several weeks as the treated tissue responds. The degree and duration vary by age, skin quality, treatment area and individual response; results are not guaranteed.",
  },
  {
    id: "injectables-doctor",
    category: "HIFU & Doctor-Led",
    question: "Who performs injectable and thread treatments?",
    answer:
      "Injectables, HIKO nose lift and PDO thread procedures require an in-person assessment and treatment by an appropriately licensed physician. Product, dose, technique and candidacy are decided clinically.",
  },
  {
    id: "botox-brand",
    category: "HIFU & Doctor-Led",
    question: "Are all anti-wrinkle injections Botox?",
    answer:
      "Botox is a brand name for one botulinum toxin product. The exact licensed product, dose and expected effect should be confirmed during your doctor consultation rather than assumed from the general treatment name.",
  },
  {
    id: "doctor-schedule",
    category: "HIFU & Doctor-Led",
    question: "When are doctor-required treatments available?",
    answer:
      "Doctor-required consultations and treatments are scheduled on Saturdays from 1:00 PM to 5:00 PM, subject to doctor and branch confirmation. An appointment request is not a confirmed slot.",
  },
  {
    id: "booking-confirmation",
    category: "Visits & Aftercare",
    question: "Is an appointment request automatically confirmed?",
    answer:
      "No. Your requested time remains pending until ESCLARE confirms it through Facebook, phone call or SMS after checking staff, doctor, room and device availability.",
  },
  {
    id: "booking-details",
    category: "Visits & Aftercare",
    question: "What information and deposit are required to request an appointment?",
    answer:
      "Your full name is the only required personal detail, and no booking deposit is required. Choosing a branch, treatment, date and time helps the team review your request more quickly.",
  },
  {
    id: "branch-availability",
    category: "Visits & Aftercare",
    question: "Are all treatments available in Naga and Daet?",
    answer:
      "Naga offers all listed treatments subject to provider availability. Daet offers all listed treatments except Fractional Laser. Doctor-led and device-based services still require schedule confirmation.",
  },
  {
    id: "cancel-reschedule",
    category: "Visits & Aftercare",
    question: "Can I cancel or reschedule my visit?",
    answer:
      "Yes. Please contact the branch at least two hours before the appointment. Late arrivals are accommodated based on availability, and a missed appointment does not prevent you from requesting another booking.",
  },
  {
    id: "pregnancy",
    category: "Visits & Aftercare",
    question: "Can I receive treatment while pregnant or breastfeeding?",
    answer:
      "Some services, medicines and devices are not appropriate during pregnancy or breastfeeding. Disclose this before booking and again during assessment so the provider can defer or modify care safely.",
  },
  {
    id: "aftercare-reaction",
    category: "Visits & Aftercare",
    question: "What should I do if I have a reaction after treatment?",
    answer:
      "Follow the written aftercare, avoid unapproved products and contact the treating branch promptly if symptoms are severe, worsening or unexpected. Seek urgent medical care for breathing difficulty, severe swelling or other emergency symptoms.",
  },
];
