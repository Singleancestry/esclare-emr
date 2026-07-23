import { GLP1_PROGRAM_LABEL, type Treatment } from "@/lib/services/catalog";

export type TreatmentDetail = {
  concerns: ReadonlyArray<string>;
  howItWorks: string;
  potentialBenefits: ReadonlyArray<string>;
  suitableFor: string;
  medicalClearance: ReadonlyArray<string>;
  duration: string;
  sessions: string;
  downtime: string;
  beforecare: ReadonlyArray<string>;
  aftercare: ReadonlyArray<string>;
  expectedResults: string;
  faqs: ReadonlyArray<{ question: string; answer: string }>;
};

const concernOverrides: Record<string, ReadonlyArray<string>> = {
  "korean-facial": ["Congestion", "Dull-looking skin", "Dryness", "Routine facial maintenance"],
  "hydrajet-peel": ["Surface buildup", "Congestion", "Dullness", "Uneven-looking texture"],
  "intense-hydrating": ["Dehydration", "Tight or dull-looking skin", "Surface roughness"],
  "basic-detox": ["Excess oil", "Surface impurities", "Congestion"],
  exfoliare: ["Dullness", "Surface buildup", "Congestion", "Rough texture"],
  "exfoliare-cryo": ["Dullness", "Congestion", "Temporary redness after extraction"],
  "acne-cleanse": ["Acne-prone congestion", "Blackheads and whiteheads", "Excess oil"],
  "pico-glow-face": ["Uneven pigmentation", "Sun spots", "Post-acne marks", "Dull-looking tone"],
  "pico-glow-body": [
    "Selected body-area pigmentation",
    "Uneven-looking tone",
    "Post-inflammatory marks",
  ],
  "carbon-laser-peel": ["Oiliness", "Visible pores", "Dullness", "Uneven-looking texture"],
  "exilift-face": ["Mild loss of firmness", "Facial contour", "Skin-support goals"],
  "7d-hifu-face": ["Loss of firmness", "Jawline definition", "Lifting and tightening goals"],
  "hifu-abdomen": ["Abdominal contour", "Selected firmness concerns"],
  "hifu-flanks": ["Flank contour", "Selected firmness concerns"],
  armtox: ["Upper-arm contouring goals", "Muscle-related prominence assessed by a doctor"],
  sweatox: ["Excessive underarm sweating assessed by a doctor"],
  jawtox: ["Masseter prominence", "Jaw tension", "Lower-face contouring goals"],
  "fine-lines": ["Expression lines", "Selected facial wrinkles assessed by a doctor"],
  "hiko-nose-lift": ["Selected nose-shape and projection goals after anatomical assessment"],
  "pdo-threads": ["Selected facial laxity", "Contour and support goals"],
  "rejuran-h": ["Hydration", "Texture", "Fine-line appearance", "Skin quality goals"],
  "rejuran-eye": ["Eye-area texture", "Fine-line appearance", "Hydration goals"],
  "rejuran-scar": ["Selected acne scars", "Uneven texture", "Recovery-support goals"],
  "fractional-laser": [
    "Atrophic acne scars",
    "Uneven texture",
    "Selected pigmentation and fine lines",
  ],
  "mccm-pdrn": ["Dullness", "Dehydration", "Eye-area dryness", "Uneven-looking texture"],
  "glp-1-slimming": [
    "Medically guided appetite regulation",
    "Structured weight-management goals",
    "Progress and side-effect monitoring",
    "Nutrition, activity, and lifestyle support",
  ],
  "hikari-drip": ["Wellness goals considered only after clinical screening"],
  "zaguta-drip": ["Wellness goals considered only after clinical screening"],
  "laser-circumcision": [
    "Circumcision requested after doctor consultation and age-appropriate consent",
  ],
};

function categoryMechanism(treatment: Treatment) {
  if (treatment.slug === "glp-1-slimming")
    return "GLP-1 medicines act on hormone-signaling pathways involved in appetite, fullness, digestion, and glucose regulation. When a qualified prescriber considers treatment appropriate, medication is combined with practical nutrition, activity, and follow-up guidance. The exact medicine and dose are selected individually and are not confirmed from website information alone.";
  if (treatment.slug.startsWith("pico-"))
    return "The Pico platform delivers very short laser pulses selected for the pigment concern and skin response. Wavelength, treatment mode, and settings are chosen after assessment; not every pigmentation pattern should be treated the same way.";
  if (treatment.slug.includes("hifu"))
    return "Focused ultrasound energy is delivered at selected tissue depths to support a gradual firming response. The treatment area, cartridge depth, number of lines, and suitability depend on anatomy and professional assessment.";
  if (treatment.category === "Facials")
    return "The treatment combines cleansing and selected professional steps to address the surface concerns identified during assessment. Extraction, exfoliation, hydration, masks, or device-assisted steps are adjusted for sensitivity and current skin condition.";
  if (treatment.category === "Doctor Procedures")
    return "A licensed doctor evaluates anatomy, goals, health history, medicines, and contraindications before selecting a product, technique, treatment amount, and follow-up plan. The procedure is not confirmed from website information alone.";
  if (treatment.category === "Wellness")
    return "This clinic-administered wellness service requires suitability screening and an approved clinical protocol. Ingredients, route, and monitoring must be explained before consent; the service is not a substitute for diagnosis or treatment of disease.";
  return "The provider selects the professional protocol after reviewing the concern, skin condition, sensitivity, prior treatments, and realistic goals. Individual steps may be changed or postponed when the skin barrier or health history requires it.";
}

function durationFor(treatment: Treatment) {
  if (treatment.slug === "glp-1-slimming")
    return "The listed program covers four weeks. Appointment length and follow-up timing are set after consultation and may vary with the selected medicine, monitoring needs, and clinical response.";
  if (treatment.slug === "laser-circumcision")
    return "About 60-120 minutes including doctor review, preparation, procedure, and discharge guidance.";
  if (treatment.category === "Doctor Procedures")
    return "About 45-90 minutes including consultation, preparation, procedure, and immediate review.";
  if (treatment.slug.includes("hifu"))
    return "About 45-120 minutes depending on treatment area, anatomy, and planned treatment lines.";
  if (treatment.category === "Facials")
    return "About 45-90 minutes depending on extraction, sensitivity, and selected add-on steps.";
  if (treatment.category === "Laser and Brightening")
    return "About 30-75 minutes including assessment, cleansing, protection, treatment, and aftercare review.";
  return "About 45-90 minutes including assessment, preparation, treatment, and immediate aftercare guidance.";
}

function sessionsFor(treatment: Treatment) {
  if (treatment.slug === "glp-1-slimming")
    return "The four-week program includes medically directed follow-up and progress monitoring as appropriate. Eligibility, medication selection, dose changes, and continuation beyond four weeks require reassessment by a qualified medical professional.";
  if (treatment.category === "Doctor Procedures")
    return "The doctor determines whether one procedure, staged treatment, or maintenance review is appropriate. No fixed course should be assumed before assessment.";
  if (treatment.slug.includes("hifu"))
    return "Some clients are treated in a single planned session followed by review, while others may need a different or staged approach. Maintenance is individualized.";
  if (treatment.category === "Laser and Brightening")
    return "A series may be recommended because pigmentation and texture respond progressively. Intervals and total sessions depend on the concern, skin tone, settings, and recovery.";
  if (treatment.category === "Facials")
    return "The service may be booked as occasional maintenance or as part of a structured course. Frequency depends on sensitivity, acne activity, home care, and other procedures.";
  return "The appropriate number and spacing of sessions are decided after screening and response to the first visit.";
}

function careFor(treatment: Treatment) {
  const isDoctor = treatment.category === "Doctor Procedures";
  const isLaser = treatment.category === "Laser and Brightening";
  return {
    beforecare: [
      "Disclose medicines, allergies, pregnancy or breastfeeding, active infection, recent procedures, and prior adverse reactions.",
      isLaser
        ? "Avoid tanning and follow instructions about pausing irritating skincare before the visit."
        : "Arrive with the treatment area clean and follow any product or fasting instruction provided by the clinic.",
      isDoctor
        ? "Do not stop prescribed medicines or take pre-procedure products unless the treating doctor instructs you."
        : "Avoid adding several new active products immediately before treatment.",
    ],
    aftercare: [
      "Follow the written instructions for the exact procedure and contact the clinic if recovery differs from what was explained.",
      isLaser
        ? "Use gentle skincare and broad-spectrum sunscreen; avoid picking, heat, friction, and unapproved actives during recovery."
        : "Keep the area clean, avoid unnecessary rubbing or pressure, and use only approved products.",
      "Attend the recommended review and do not add another procedure until the clinic confirms appropriate timing.",
    ],
  };
}

export function getTreatmentDetail(treatment: Treatment): TreatmentDetail {
  if (treatment.slug === "glp-1-slimming") {
    return {
      concerns: concernOverrides[treatment.slug],
      howItWorks: categoryMechanism(treatment),
      potentialBenefits: [
        "May support appetite regulation and fullness when prescribed for an eligible patient.",
        "Provides a structured four-week period for medical monitoring and practical goal setting.",
        "Can combine prescription care with individualized nutrition, activity, sleep, and habit guidance.",
      ],
      suitableFor:
        "Adults who meet appropriate clinical criteria may be considered after consultation. GLP-1 medicine is not suitable for everyone, and the website price does not confirm eligibility, a prescription, or a particular product.",
      medicalClearance: [
        "Pregnancy, breastfeeding, or plans for pregnancy",
        "A personal or family history that may make a GLP-1 medicine inappropriate, including relevant thyroid or endocrine conditions",
        "Pancreatitis, gallbladder disease, significant digestive symptoms, or severe gastrointestinal disease",
        "Diabetes treatment, medicines that may interact, allergies, or another condition requiring prescriber review",
      ],
      duration: durationFor(treatment),
      sessions: sessionsFor(treatment),
      downtime:
        "There is usually no procedure downtime, but nausea, vomiting, diarrhea, constipation, abdominal discomfort, reduced appetite, headache, or fatigue may occur. Seek prompt medical advice for severe or persistent abdominal pain, repeated vomiting, dehydration, allergic symptoms, or any rapidly worsening reaction.",
      beforecare: [
        "Bring an accurate medical history and current list of prescriptions, supplements, allergies, and previous weight-management medicines.",
        "Disclose pregnancy or breastfeeding, diabetes, digestive, pancreatic, gallbladder, kidney, thyroid, or endocrine concerns.",
        "Do not purchase, share, start, stop, or change a prescription medicine without guidance from a qualified prescriber.",
      ],
      aftercare: [
        "Follow the prescribed dose and administration instructions exactly; do not increase or repeat a dose unless directed.",
        "Follow the clinician's hydration, nutrition, activity, side-effect, and follow-up guidance.",
        "Record relevant symptoms and progress, and contact the clinic before the next dose if side effects are severe, persistent, or concerning.",
      ],
      expectedResults:
        "Progress differs with health history, medicine response, dose, nutrition, activity, sleep, and adherence. ESCLARE does not promise a specific amount or rate of weight loss. Medication selection and continuation depend on ongoing assessment by a qualified medical professional.",
      faqs: [
        {
          question: "What is included in the listed price?",
          answer: `${GLP1_PROGRAM_LABEL}. Exact medication, dose, monitoring, and program inclusions are confirmed after consultation and assessment.`,
        },
        {
          question: "Will I receive a GLP-1 medicine automatically?",
          answer:
            "No. A qualified medical professional must assess eligibility, contraindications, current medicines, and treatment goals before selecting any medication. Another approach may be recommended.",
        },
        {
          question: "How much weight will I lose in four weeks?",
          answer:
            "No specific amount can be promised. Responses vary, and safe medical care focuses on tolerability, health, sustainable habits, and individualized progress rather than a guaranteed number.",
        },
        {
          question: "Can I continue after four weeks?",
          answer:
            "Continuation is not automatic. The prescriber must review response, side effects, adherence, and ongoing suitability before recommending another period or changing treatment.",
        },
        {
          question: "When should I contact the clinic?",
          answer:
            "Contact the clinic for troublesome or persistent side effects. Seek urgent medical care for severe abdominal pain, repeated vomiting, dehydration, breathing difficulty, facial swelling, or another serious reaction.",
        },
      ],
    };
  }

  const care = careFor(treatment);
  const concerns = concernOverrides[treatment.slug] ?? [treatment.summary];
  const doctorLanguage = treatment.doctorRequired
    ? "A doctor consultation is required to confirm anatomy, diagnosis-independent goals, consent, and suitability."
    : "A professional assessment is required to confirm the concern, skin condition, and suitability.";

  return {
    concerns,
    howItWorks: categoryMechanism(treatment),
    potentialBenefits: concerns.map(
      (concern) => `May help improve or support ${concern.toLowerCase()}.`,
    ),
    suitableFor: `${treatment.summary} ${doctorLanguage} Treatment may be delayed when the area is irritated or when health history needs clearance.`,
    medicalClearance: [
      "Pregnancy or breastfeeding where the selected procedure is not recommended or requires clearance",
      "Active infection, open wounds, or significant irritation in the treatment area",
      "Uncontrolled medical conditions, relevant medicines, or a history of serious treatment reactions",
      "A recent procedure that has not fully recovered",
    ],
    duration: durationFor(treatment),
    sessions: sessionsFor(treatment),
    downtime:
      treatment.category === "Doctor Procedures"
        ? "Downtime is procedure-dependent. Temporary swelling, tenderness, bruising, redness, or asymmetry may occur, and the doctor must explain procedure-specific warning signs."
        : "Downtime is usually minimal to moderate depending on treatment intensity and sensitivity. Temporary redness, warmth, tightness, dryness, peeling, or tenderness may occur.",
    beforecare: care.beforecare,
    aftercare: care.aftercare,
    expectedResults:
      "Changes may be gradual and can depend on baseline condition, treatment parameters, consistency, home care, and maintenance. Individual results vary; no result, duration, or number of sessions is guaranteed.",
    faqs: [
      {
        question: `What is ${treatment.name}?`,
        answer: treatment.summary,
      },
      {
        question: "How long should I allow for the visit?",
        answer: `${durationFor(treatment)} Actual timing may change with the treatment area, sensitivity, combination steps, and provider assessment.`,
      },
      {
        question: "How many sessions will I need?",
        answer: sessionsFor(treatment),
      },
      {
        question: "Is there downtime?",
        answer:
          "Recovery varies with the procedure and settings. The provider will explain expected temporary effects and when to contact the clinic.",
      },
      {
        question: "Can I book immediately online?",
        answer:
          "You can submit a preferred branch, date, and time. The appointment remains a request until ESCLARE confirms availability and any required consultation.",
      },
    ],
  };
}
