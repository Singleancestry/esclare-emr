export const educationCategories = [
  {
    slug: "laser-treatments",
    name: "Laser Treatments",
    description:
      "Plain-language guides to laser hair reduction, pigmentation care, treatment planning, and recovery.",
  },
  {
    slug: "weight-management",
    name: "Weight Management",
    description:
      "Doctor-led education about prescription-supported weight management, monitoring, and sustainable care.",
  },
  {
    slug: "skin-concerns",
    name: "Skin Concerns",
    description:
      "Calm, practical explanations of common concerns and why assessment matters before choosing a treatment.",
  },
  {
    slug: "mccm-skin-science",
    name: "MCCM Skin Science",
    description:
      "Professional skincare ingredients, clinic protocols, recovery support, and personalized treatment planning.",
  },
] as const;

export type EducationCategorySlug = (typeof educationCategories)[number]["slug"];
export type EditorialStatus =
  "draft" | "fact-checked" | "medical-review-required" | "approved" | "published";

export type ArticleSection = {
  id: string;
  title: string;
  paragraphs: ReadonlyArray<string>;
  bullets?: ReadonlyArray<string>;
};

export type ArticleFaq = { question: string; answer: string };
export type ArticleReference = { title: string; url: string };

export type EducationArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: EducationCategorySlug;
  tags: ReadonlyArray<string>;
  heroImage: string;
  heroAlt: string;
  author: string;
  reviewer: string | null;
  status: EditorialStatus;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  seoTitle: string;
  metaDescription: string;
  keyTakeaways: ReadonlyArray<string>;
  sections: ReadonlyArray<ArticleSection>;
  beforecare: ReadonlyArray<string>;
  aftercare: ReadonlyArray<string>;
  unsuitable: ReadonlyArray<string>;
  contactClinic: ReadonlyArray<string>;
  faqs: ReadonlyArray<ArticleFaq>;
  references: ReadonlyArray<ArticleReference>;
  relatedArticles: ReadonlyArray<string>;
  relatedTreatments: ReadonlyArray<{ label: string; href: string }>;
};

const standardFaqs: ReadonlyArray<ArticleFaq> = [
  {
    question: "Is a consultation required?",
    answer:
      "Yes. A consultation helps the clinic review your goals, skin or health history, current medicines, and whether another approach may be safer or more appropriate.",
  },
  {
    question: "Are results guaranteed?",
    answer:
      "No. Response varies with the concern, treatment plan, health factors, consistency, and aftercare. ESCLARE should confirm realistic expectations during assessment.",
  },
];

function withStandardFaqs(faqs: ReadonlyArray<ArticleFaq>) {
  return [...faqs, ...standardFaqs];
}

const laserReferences: ReadonlyArray<ArticleReference> = [
  {
    title: "American Academy of Dermatology: Laser hair removal FAQs",
    url: "https://www.aad.org/public/cosmetic/hair-removal/laser-hair-removal-faqs",
  },
  {
    title: "Systematic review of picosecond laser in dermatology",
    url: "https://pubmed.ncbi.nlm.nih.gov/32282094/",
  },
];

const regenerativeReferences: ReadonlyArray<ArticleReference> = [
  {
    title: "Systematic review of regenerative aesthetics",
    url: "https://pubmed.ncbi.nlm.nih.gov/39198280/",
  },
  {
    title: "Systematic review of polynucleotides in aesthetic medicine",
    url: "https://pubmed.ncbi.nlm.nih.gov/39645667/",
  },
];

const weightReferences: ReadonlyArray<ArticleReference> = [
  {
    title: "FDA prescribing information: Wegovy (semaglutide)",
    url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/215256s029lbl.pdf",
  },
  {
    title: "FDA prescribing information: Zepbound (tirzepatide)",
    url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/217806s042lbl.pdf",
  },
];

export const educationArticles: ReadonlyArray<EducationArticle> = [
  {
    slug: "diode-laser-hair-removal-guide",
    title: "Diode Laser Hair Removal: How It Works, Benefits, Sessions, and Aftercare",
    excerpt:
      "A practical guide to diode laser hair reduction, treatment areas, session planning, comfort, and aftercare.",
    category: "laser-treatments",
    tags: ["diode laser", "hair reduction", "underarms"],
    heroImage: "/images/optimized/treatments/diode/diode-underarm-treatment.webp",
    heroAlt: "Diode laser hair-reduction treatment for the underarm area",
    author: "ESCLARE Editorial Team",
    reviewer: null,
    status: "medical-review-required",
    published: false,
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-19",
    readingMinutes: 8,
    seoTitle: "Diode Laser Hair Removal Guide | ESCLARE",
    metaDescription:
      "Understand diode laser hair reduction, typical sessions, skin-tone considerations, beforecare, and aftercare at ESCLARE Naga and Daet.",
    keyTakeaways: [
      "Diode systems target pigment associated with the hair follicle to support gradual hair reduction.",
      "Hair grows in cycles, so a planned series is commonly needed.",
      "Skin tone, hair color, recent tanning, medicines, and treatment area affect suitability and settings.",
    ],
    sections: [
      {
        id: "how-it-works",
        title: "How diode laser hair reduction works",
        paragraphs: [
          "A diode laser delivers controlled light energy toward pigment in the hair shaft and follicle. The goal is to heat the follicle enough to reduce future growth while protecting the surrounding skin with appropriate settings and cooling.",
          "Unlike shaving, which cuts hair at the surface, or waxing, which pulls hair from the follicle, laser treatment aims to reduce regrowth over time. IPL uses broad-spectrum light; a diode device uses selected laser wavelengths. Neither approach should be chosen without assessing skin tone, hair color, and medical history.",
        ],
      },
      {
        id: "sessions",
        title: "Why several sessions are usually discussed",
        paragraphs: [
          "Laser responds best when hair is in an active growth phase, and not every follicle is in that phase on the same day. This is why treatment is usually planned as a course rather than a one-time visit.",
        ],
        bullets: [
          "Intervals depend on the body area and observed regrowth.",
          "Coarse, dark hair often responds differently from fine or light-colored hair.",
          "Hormonal factors can influence facial and body-hair regrowth.",
          "Maintenance may be discussed after the initial course.",
        ],
      },
      {
        id: "what-to-expect",
        title: "What to expect during the appointment",
        paragraphs: [
          "The team reviews the treatment area, recent sun exposure, medicines, skin sensitivity, and prior reactions. The area is prepared, protective eyewear is used, and the handpiece is applied in a planned pattern. Clients often describe warmth or a brief snapping sensation, but comfort varies.",
        ],
      },
    ],
    beforecare: [
      "Avoid waxing, plucking, or threading the treatment area before the session because the follicle must remain present.",
      "Follow the clinic's shaving timing and arrive with clean skin unless told otherwise.",
      "Disclose tanning, photosensitizing medicines, active irritation, pregnancy, and recent procedures.",
    ],
    aftercare: [
      "Use gentle cleansing and avoid heavy friction, heat, and irritating actives while the area feels sensitive.",
      "Use sun protection on exposed areas and follow the clinic's area-specific instructions.",
      "Do not scratch, pick, or treat temporary redness aggressively.",
    ],
    unsuitable: [
      "Active infection, open wounds, significant irritation, or a fresh tan in the treatment area",
      "Pregnancy, or a medicine/health history that requires clearance",
      "Hair color or density unlikely to respond well to the selected device",
    ],
    contactClinic: [
      "Blistering",
      "Severe or increasing pain",
      "Marked swelling",
      "Signs of infection",
    ],
    faqs: withStandardFaqs([
      {
        question: "Does diode laser remove hair permanently?",
        answer:
          "It is more accurate to describe the service as long-term hair reduction. Regrowth, hormones, treatment area, and maintenance needs vary.",
      },
      {
        question: "Is diode laser suitable for morena skin?",
        answer:
          "It may be suitable when the device, settings, cooling, and operator experience are appropriate. A skin assessment and careful test approach may be recommended.",
      },
      {
        question: "Can I wax between sessions?",
        answer:
          "Waxing or plucking can interfere with the follicle target. Ask the clinic which temporary hair-removal methods are acceptable between visits.",
      },
    ]),
    references: laserReferences,
    relatedArticles: ["why-underarms-become-dark"],
    relatedTreatments: [{ label: "4D Diode Laser Hair Reduction", href: "/diode-laser" }],
  },
  {
    slug: "pico-laser-facial-pigmentation",
    title: "Pico Laser for Facial Pigmentation, Acne Marks, Sun Spots, and Uneven Skin Tone",
    excerpt:
      "What picosecond laser technology may address, why pigment assessment matters, and how to protect recovery.",
    category: "laser-treatments",
    tags: ["pico laser", "pigmentation", "acne marks"],
    heroImage: "/images/optimized/treatments/pico-face/pico-face-treatment.webp",
    heroAlt: "Pico laser facial treatment with protective eyewear",
    author: "ESCLARE Editorial Team",
    reviewer: null,
    status: "medical-review-required",
    published: false,
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-19",
    readingMinutes: 8,
    seoTitle: "Pico Laser for Facial Pigmentation | ESCLARE",
    metaDescription:
      "Learn how Pico laser is considered for pigmentation, acne marks, sun spots, and uneven tone, including downtime and sun protection.",
    keyTakeaways: [
      "Picosecond devices deliver extremely short pulses that interact with selected pigment targets.",
      "Acne marks are not the same as active acne, and melasma requires especially careful assessment.",
      "Sun protection and conservative settings matter because post-inflammatory pigmentation can occur.",
    ],
    sections: [
      {
        id: "technology",
        title: "What Pico laser technology means",
        paragraphs: [
          "Pico refers to pulse duration measured in picoseconds. Short pulses can create photoacoustic effects that fragment selected pigment while limiting prolonged heat delivery. The wavelength, handpiece, fluence, and treatment mode still determine what the device actually does.",
        ],
      },
      {
        id: "concerns",
        title: "Pigmentation concerns are not all the same",
        paragraphs: [
          "Sun spots, post-acne marks, melasma, freckles, and deeper pigment patterns can look similar but behave differently. Active acne needs its own plan, while a flat dark mark left after acne may be approached as post-inflammatory pigmentation.",
          "Melasma can recur or worsen with heat, light, hormones, and irritation. Laser is not automatically the first or only option, so professional assessment and consistent sun protection are central to planning.",
        ],
      },
      {
        id: "what-to-expect",
        title: "What to expect",
        paragraphs: [
          "After cleansing and assessment, protective eyewear is applied and the provider treats the selected area with settings chosen for the concern and skin response. Temporary warmth, redness, mild swelling, darkening of spots, or sensitivity may occur. Downtime depends on the treatment mode and intensity.",
        ],
      },
    ],
    beforecare: [
      "Limit tanning and disclose recent sun exposure, peels, lasers, retinoids, and photosensitizing medicines.",
      "Arrive with clean skin and follow any instruction to pause irritating active ingredients.",
      "Tell the clinic about cold sores, keloid tendency, pregnancy, active infection, or prior pigment changes.",
    ],
    aftercare: [
      "Use gentle cleanser, moisturizer, and broad-spectrum sunscreen as directed.",
      "Avoid picking flaking or darkened spots and pause harsh actives until cleared.",
      "Reduce unnecessary heat and direct sun during early recovery.",
    ],
    unsuitable: [
      "Active infection, open lesions, or inflamed acne in the planned area",
      "Recent tanning or uncontrolled photosensitivity",
      "Pregnancy or medical factors needing clinician clearance",
    ],
    contactClinic: [
      "Blistering",
      "Increasing swelling",
      "Severe pain",
      "Spreading rash or discharge",
    ],
    faqs: withStandardFaqs([
      {
        question: "Can Pico laser cure melasma?",
        answer:
          "No treatment should be presented as a melasma cure. Melasma often needs long-term trigger control, sun protection, skincare, and carefully selected procedures.",
      },
      {
        question: "Can Pico laser treat active acne?",
        answer:
          "Active acne and leftover marks are different concerns. The provider should assess inflammation first and may recommend another acne-focused plan.",
      },
      {
        question: "Will my spots become darker first?",
        answer:
          "Temporary darkening or a peppered appearance can occur with some pigment treatments. Follow aftercare and contact the clinic if the reaction is severe or worsening.",
      },
    ]),
    references: laserReferences,
    relatedArticles: ["pico-laser-facial-rejuvenation", "why-underarms-become-dark"],
    relatedTreatments: [
      { label: "Pico Glow Face", href: "/treatments/pico-glow-face" },
      { label: "Request a skin assessment", href: "/appointment-request" },
    ],
  },
  {
    slug: "why-underarms-become-dark",
    title: "Why Underarms Become Dark and How Professional Treatments May Help",
    excerpt:
      "Friction, shaving, irritation, ingrown hairs, and health factors can all influence underarm discoloration.",
    category: "skin-concerns",
    tags: ["underarms", "pigmentation", "ingrown hairs"],
    heroImage: "/images/optimized/treatments/pico-underarm/pico-underarm-treatment.webp",
    heroAlt: "Professional Pico laser brightening treatment for the underarm area",
    author: "ESCLARE Editorial Team",
    reviewer: null,
    status: "medical-review-required",
    published: false,
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-19",
    readingMinutes: 7,
    seoTitle: "Why Underarms Become Dark | ESCLARE Skin Education",
    metaDescription:
      "Understand common causes of underarm darkening, gentle home care, and when diode, Pico, or professional peel assessment may help.",
    keyTakeaways: [
      "Underarm darkening is often influenced by repeated irritation rather than a simple lack of cleansing.",
      "Harsh bleaching, scrubbing, and fragranced products can worsen inflammation.",
      "Sudden, thick, widespread, or symptomatic discoloration should be medically assessed.",
    ],
    sections: [
      {
        id: "common-causes",
        title: "Common reasons underarms look darker",
        paragraphs: [
          "Shaving, friction from clothing, ingrown hairs, deodorant irritation, and inflammation can leave post-inflammatory pigmentation. Natural folds and hair shadow can also change how the area looks.",
          "Some patterns may relate to hormonal or metabolic conditions. Aesthetic treatment should not delay medical evaluation when the change is sudden, thickened, itchy, painful, or present in several body folds.",
        ],
      },
      {
        id: "professional-options",
        title: "How professional care may be planned",
        paragraphs: [
          "Diode hair reduction may reduce the repeated shaving cycle for suitable hair and skin. Pico laser or a professional peel may be considered for selected pigment concerns. The safest plan depends on the cause, current irritation, skin tone, and prior reactions.",
        ],
      },
      {
        id: "what-to-expect",
        title: "What to expect from an assessment",
        paragraphs: [
          "The provider asks about products, hair-removal habits, symptoms, medicines, and health history before examining the area. Treatment may be postponed until active irritation settles or medical causes are reviewed.",
        ],
      },
    ],
    beforecare: [
      "Stop aggressive scrubbing and avoid testing several new brightening products at once.",
      "Bring or list products that have caused burning, itching, or rash.",
      "Follow the specific shaving or active-ingredient instructions for the selected procedure.",
    ],
    aftercare: [
      "Reduce friction and use bland, fragrance-free care while the area recovers.",
      "Avoid scratching, picking ingrown hairs, and applying unapproved bleaching mixtures.",
      "Follow the separate aftercare given for diode, Pico, or peel treatment.",
    ],
    unsuitable: [
      "Active rash, infection, wounds, or significant inflammation",
      "Unexplained or rapidly changing discoloration awaiting medical assessment",
      "Known reactions to proposed products or procedures",
    ],
    contactClinic: ["Blistering", "Spreading rash", "Discharge", "Severe or increasing pain"],
    faqs: withStandardFaqs([
      {
        question: "Is dark underarm skin caused by poor hygiene?",
        answer:
          "Not necessarily. Friction, irritation, hair shadow, inflammation, products, and health factors can all contribute.",
      },
      {
        question: "Can diode laser whiten underarms?",
        answer:
          "Diode treatment targets hair rather than pigment. Reducing shaving-related irritation may improve the routine, but pigment needs its own assessment.",
      },
      {
        question: "Should I use strong bleaching products?",
        answer:
          "Harsh products can worsen irritation and pigmentation. Use only a plan appropriate for the area and your skin sensitivity.",
      },
    ]),
    references: laserReferences,
    relatedArticles: ["diode-laser-hair-removal-guide", "pico-laser-facial-pigmentation"],
    relatedTreatments: [
      { label: "4D Diode Laser", href: "/diode-laser" },
      { label: "Pico Glow Body Area", href: "/treatments/pico-glow-body" },
    ],
  },
  {
    slug: "glp-1-weight-management-programs",
    title: "Understanding GLP-1-Based Weight Management Programs",
    excerpt:
      "Why prescription-supported weight management requires medical assessment, gradual monitoring, nutrition, and long-term planning.",
    category: "weight-management",
    tags: ["GLP-1", "weight management", "medical consultation"],
    heroImage: "/images/optimized/clinic/esclare-naga-treatment-room-v2.webp",
    heroAlt: "Private ESCLARE consultation and treatment room",
    author: "ESCLARE Editorial Team",
    reviewer: null,
    status: "medical-review-required",
    published: false,
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-19",
    readingMinutes: 9,
    seoTitle: "GLP-1 Weight Management Programs | ESCLARE",
    metaDescription:
      "A cautious guide to GLP-1-based weight management, medical screening, monitoring, side effects, and lifestyle support.",
    keyTakeaways: [
      "GLP-1 pathways influence appetite, fullness, and glucose regulation, but prescription treatment is not suitable for everyone.",
      "A doctor must review medical history, medicines, pregnancy plans, and relevant risks before prescribing.",
      "Nutrition, hydration, movement, sleep, monitoring, and follow-up remain part of long-term care.",
    ],
    sections: [
      {
        id: "what-is-glp1",
        title: "What GLP-1 means",
        paragraphs: [
          "Glucagon-like peptide-1 is a hormone involved in appetite, fullness, digestion, and glucose-related signaling. Prescription medicines that act on this pathway may support weight management for eligible patients alongside reduced-calorie nutrition and physical activity.",
        ],
      },
      {
        id: "medical-supervision",
        title: "Why medical supervision is essential",
        paragraphs: [
          "Eligibility depends on more than a desired number on the scale. A doctor may review weight history, BMI in clinical context, related conditions, medicines, laboratory results, eating patterns, gastrointestinal history, and pregnancy plans.",
          "Dose changes and product-specific instructions must come from the prescriber. The website does not provide dosing advice or replace the official medication guide.",
        ],
      },
      {
        id: "what-to-expect",
        title: "What to expect in a structured program",
        paragraphs: [
          "A program may include an initial medical consultation, baseline review, nutrition and activity support, gradual prescription adjustments when appropriate, symptom checks, and follow-up decisions based on response and tolerability.",
        ],
      },
    ],
    beforecare: [
      "Prepare a complete medicine and supplement list and disclose prior weight-management medicines.",
      "Discuss pregnancy, breastfeeding, gallbladder, pancreatic, kidney, gastrointestinal, endocrine, and mental-health history.",
      "Do not start, stop, share, or combine prescription medicines without the prescriber.",
    ],
    aftercare: [
      "Follow the prescription label and clinic monitoring plan exactly.",
      "Prioritize hydration and the individualized nutrition plan, and report persistent side effects.",
      "Keep follow-up appointments so benefits, tolerability, and ongoing suitability can be reassessed.",
    ],
    unsuitable: [
      "Pregnancy, breastfeeding, or planning pregnancy without prescriber guidance",
      "A contraindication or important warning listed for the specific medicine",
      "A medical or medication history requiring another approach",
    ],
    contactClinic: [
      "Severe or persistent abdominal pain",
      "Repeated vomiting or inability to keep fluids down",
      "Signs of dehydration or a serious allergic reaction",
      "Any severe, rapidly worsening, or concerning symptom",
    ],
    faqs: withStandardFaqs([
      {
        question: "Is GLP-1 treatment a quick cosmetic injection?",
        answer:
          "No. These are prescription medicines with important warnings, monitoring needs, and product-specific instructions. They require doctor-led care.",
      },
      {
        question: "Can medication replace nutrition and exercise?",
        answer:
          "Medication is one part of care. Sustainable nutrition, activity, sleep, behavior support, and follow-up remain important.",
      },
      {
        question: "Will everyone lose the same amount of weight?",
        answer:
          "No. Response and side effects vary, and treatment may be changed or stopped based on the prescriber's assessment.",
      },
    ]),
    references: weightReferences,
    relatedArticles: ["tirzepatide-weight-management-guide"],
    relatedTreatments: [
      { label: "Request a medical weight-management consultation", href: "/appointment-request" },
    ],
  },
  {
    slug: "tirzepatide-weight-management-guide",
    title: "Tirzepatide for Weight Management: What Clients Should Know Before Starting",
    excerpt:
      "A doctor-review draft explaining tirzepatide's dual-pathway activity, assessment, monitoring, and safety responsibilities.",
    category: "weight-management",
    tags: ["tirzepatide", "GIP", "GLP-1"],
    heroImage: "/images/optimized/clinic/esclare-naga-preparation-area-v2.webp",
    heroAlt: "Organized ESCLARE clinical preparation area",
    author: "ESCLARE Editorial Team",
    reviewer: null,
    status: "medical-review-required",
    published: false,
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-19",
    readingMinutes: 9,
    seoTitle: "Tirzepatide Weight Management Guide | ESCLARE",
    metaDescription:
      "What clients should know about tirzepatide, GIP and GLP-1 activity, doctor assessment, side effects, follow-up, and precautions.",
    keyTakeaways: [
      "Tirzepatide acts at GIP and GLP-1 receptors and is a prescription medicine, not an over-the-counter slimming product.",
      "The official product label contains contraindications, warnings, dose progression, and storage instructions that must guide care.",
      "Results vary, and long-term planning includes nutrition, hydration, activity, monitoring, and follow-up.",
    ],
    sections: [
      {
        id: "dual-pathway",
        title: "Understanding GIP and GLP-1 activity",
        paragraphs: [
          "Tirzepatide is described as a glucose-dependent insulinotropic polypeptide, or GIP, receptor and GLP-1 receptor agonist. In plain language, it acts on two hormone-signaling pathways involved in appetite, fullness, and glucose-related regulation.",
        ],
      },
      {
        id: "assessment",
        title: "Assessment comes before prescription",
        paragraphs: [
          "A prescriber should review weight-related health needs, current medicines, prior reactions, relevant laboratory information, gastrointestinal and endocrine history, and pregnancy plans. Tirzepatide should not be borrowed, shared, or combined with another product without medical direction.",
        ],
      },
      {
        id: "what-to-expect",
        title: "What to expect from follow-up",
        paragraphs: [
          "The prescriber determines product selection and gradual dose progression using the current official label and the patient's response. Follow-up reviews appetite changes, gastrointestinal symptoms, hydration, nutrition, activity, and whether treatment remains appropriate.",
        ],
      },
    ],
    beforecare: [
      "Bring the exact names and doses of medicines, supplements, and prior injectable products.",
      "Discuss pregnancy plans and personal or family medical history requested by the prescriber.",
      "Read the official medication guide supplied with the prescribed product.",
    ],
    aftercare: [
      "Follow the prescribed schedule and storage instructions; do not improvise missed-dose or dose-change decisions.",
      "Maintain hydration and the individualized nutrition plan, including adequate protein when advised.",
      "Use resistance exercise only when appropriate for your health and plan.",
    ],
    unsuitable: [
      "Anyone with a label-listed contraindication for the prescribed product",
      "Pregnancy or planned pregnancy without direct prescriber guidance",
      "A health or medicine history that makes another plan safer",
    ],
    contactClinic: [
      "Severe or persistent abdominal pain",
      "Repeated vomiting, dehydration, or inability to eat or drink",
      "Symptoms of a serious allergic reaction",
      "Any urgent symptom listed in the medication guide",
    ],
    faqs: withStandardFaqs([
      {
        question: "Is tirzepatide the same as a single-pathway GLP-1 medicine?",
        answer:
          "No. Tirzepatide acts at both GIP and GLP-1 receptors. Product choice must be made by a qualified prescriber.",
      },
      {
        question: "Can I choose my own dose progression?",
        answer:
          "No. Dose progression is product-specific and must be directed by the prescriber using the current official label and your tolerability.",
      },
      {
        question: "Can tirzepatide be used during pregnancy?",
        answer:
          "Pregnancy planning and precautions require direct medical guidance. Do not use weight-management medication during pregnancy unless specifically managed by an appropriate clinician.",
      },
    ]),
    references: weightReferences,
    relatedArticles: ["glp-1-weight-management-programs"],
    relatedTreatments: [{ label: "Request a doctor consultation", href: "/appointment-request" }],
  },
  {
    slug: "pico-laser-facial-rejuvenation",
    title: "Pico Laser for Brighter-Looking Skin, Texture, and Facial Rejuvenation",
    excerpt:
      "How Pico treatment differs from traditional resurfacing concepts, where it may fit, and what it cannot promise.",
    category: "laser-treatments",
    tags: ["pico laser", "texture", "rejuvenation"],
    heroImage: "/images/optimized/treatments/pico-face/pico-face-overview.webp",
    heroAlt: "Aesthetician performing a Pico laser facial treatment",
    author: "ESCLARE Editorial Team",
    reviewer: null,
    status: "medical-review-required",
    published: false,
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-19",
    readingMinutes: 7,
    seoTitle: "Pico Laser Facial Rejuvenation | ESCLARE",
    metaDescription:
      "Learn about Pico laser for brighter-looking skin, texture, acne-mark appearance, downtime, intervals, and aftercare.",
    keyTakeaways: [
      "Pico treatment can be delivered in different modes; it is not automatically equivalent to ablative resurfacing.",
      "Improvement is progressive and depends on the concern, settings, skin response, and treatment course.",
      "Brightening means improving uneven or dull appearance, not changing natural skin color.",
    ],
    sections: [
      {
        id: "rejuvenation",
        title: "What facial rejuvenation can mean",
        paragraphs: [
          "In aesthetic care, rejuvenation may refer to improving the appearance of uneven pigment, rough texture, pores, fine lines, or selected acne marks. A Pico plan must identify which concern is being treated rather than use one setting for every goal.",
        ],
      },
      {
        id: "limitations",
        title: "Benefits and limitations",
        paragraphs: [
          "Pico treatment may support a clearer, more even, or refreshed appearance, but it cannot stop aging, erase every scar, or guarantee a particular shade or texture. Deeper scars and active skin disease may need another approach.",
        ],
      },
      {
        id: "what-to-expect",
        title: "What to expect",
        paragraphs: [
          "Treatment begins with assessment and cleansing, followed by protective eyewear and controlled passes over selected areas. Sensation and downtime vary by mode. Temporary redness, warmth, sensitivity, or darkening of pigment may occur.",
        ],
      },
    ],
    beforecare: [
      "Disclose active acne, cold sores, medicines, recent tanning, and recent procedures.",
      "Pause irritating skincare only when instructed by the clinic.",
      "Plan around important events until your expected recovery is understood.",
    ],
    aftercare: [
      "Use gentle skincare and broad-spectrum sunscreen.",
      "Avoid picking, scrubbing, and unapproved actives while recovering.",
      "Follow combination-treatment timing given by the provider.",
    ],
    unsuitable: [
      "Active infection, open skin, or uncontrolled inflammation",
      "Recent tanning or a history requiring modified settings or another treatment",
      "Pregnancy or medical factors needing clearance",
    ],
    contactClinic: ["Blistering", "Severe pain", "Marked swelling", "A reaction that worsens"],
    faqs: withStandardFaqs([
      {
        question: "Is Pico laser the same as fractional CO2 laser?",
        answer:
          "No. Devices and treatment modes differ in energy delivery, tissue interaction, downtime, and intended use.",
      },
      {
        question: "Will Pico laser whiten my natural skin color?",
        answer:
          "The goal is not permanent whitening or changing natural skin color. Treatment may be planned for selected uneven pigmentation or dull appearance.",
      },
      {
        question: "Can Pico be combined with skincare or facials?",
        answer:
          "Sometimes, but sequencing matters. The clinic should decide what is appropriate before or after laser treatment.",
      },
    ]),
    references: laserReferences,
    relatedArticles: ["pico-laser-facial-pigmentation"],
    relatedTreatments: [{ label: "Pico Glow Face", href: "/treatments/pico-glow-face" }],
  },
  {
    slug: "mccm-professional-skincare-guide",
    title: "MCCM Professional Skincare: Understanding Clinic Treatments and Home Care",
    excerpt:
      "How professional formulations differ from home care and why product selection starts with a skin assessment.",
    category: "mccm-skin-science",
    tags: ["MCCM", "professional skincare", "home care"],
    heroImage: "/images/optimized/treatments/mccm/mccm-pdrn-hero.webp",
    heroAlt: "MCCM professional-use skincare vial and packaging",
    author: "ESCLARE Editorial Team",
    reviewer: null,
    status: "medical-review-required",
    published: false,
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-19",
    readingMinutes: 6,
    seoTitle: "MCCM Professional Skincare Guide | ESCLARE",
    metaDescription:
      "Understand professional MCCM skincare, clinic protocols, home care, consultation, and realistic expectations.",
    keyTakeaways: [
      "Professional-use and home-care products may differ in strength, delivery, and supervision.",
      "Product selection should account for concern, skin type, sensitivity, current routine, and recent procedures.",
      "Professional skincare should support a plan, not be self-prescribed from a product name alone.",
    ],
    sections: [
      {
        id: "professional-vs-home",
        title: "Professional use and home care serve different roles",
        paragraphs: [
          "A clinic protocol may use products, devices, or delivery methods that require trained application. Home care is designed for repeat use between visits and should protect the barrier rather than compete with recovery.",
        ],
      },
      {
        id: "personalization",
        title: "Why consultation matters",
        paragraphs: [
          "Two clients with the same concern may need different ingredients because sensitivity, acne activity, pigmentation risk, medicines, and prior procedures differ. A recognizable brand does not make every formula suitable for every client.",
        ],
      },
      {
        id: "what-to-expect",
        title: "What to expect",
        paragraphs: [
          "The provider reviews your current routine and treatment history, identifies the priority concern, and explains which products are for clinic use, short-term recovery, or ongoing home care.",
        ],
      },
    ],
    beforecare: [
      "Bring a list or photos of current products.",
      "Disclose allergies and recent procedures.",
      "Pause products only when instructed.",
    ],
    aftercare: [
      "Introduce products gradually.",
      "Stop and seek advice for a significant reaction.",
      "Use sunscreen and barrier support as directed.",
    ],
    unsuitable: [
      "Known ingredient allergy",
      "Active severe irritation",
      "A routine already causing barrier damage",
    ],
    contactClinic: ["Rapid swelling", "Blistering", "Spreading rash", "Persistent burning"],
    faqs: withStandardFaqs([
      {
        question: "Is professional skincare always stronger?",
        answer:
          "Not always. The key differences may be formulation, delivery, intended use, and supervision.",
      },
      {
        question: "Can I copy a clinic protocol at home?",
        answer:
          "No. Some products and delivery methods are intended only for trained professional use.",
      },
      {
        question: "How quickly should I add new products?",
        answer:
          "Follow the clinic's plan and introduce changes gradually so irritation can be identified.",
      },
    ]),
    references: regenerativeReferences,
    relatedArticles: ["mccm-home-care-after-treatments", "mccm-professional-chemical-peels"],
    relatedTreatments: [{ label: "MCCM PDRN Glow", href: "/treatments/mccm-pdrn" }],
  },
  {
    slug: "exosomes-aesthetic-skincare",
    title: "Exosomes in Aesthetic Skincare: What They Are and How They May Support Recovery",
    excerpt:
      "A cautious look at cellular signaling particles, topical recovery support, evidence limitations, and administration differences.",
    category: "mccm-skin-science",
    tags: ["exosomes", "recovery", "regenerative aesthetics"],
    heroImage: "/images/optimized/treatments/mccm/mccm-pdrn-detail.webp",
    heroAlt: "Professional-use skincare packaging in a clinical product display",
    author: "ESCLARE Editorial Team",
    reviewer: null,
    status: "medical-review-required",
    published: false,
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-19",
    readingMinutes: 7,
    seoTitle: "Exosomes in Aesthetic Skincare | ESCLARE",
    metaDescription:
      "A client-friendly guide to exosomes, topical recovery support, evidence limitations, quality, and professional protocols.",
    keyTakeaways: [
      "Exosomes are extracellular vesicles involved in cell-to-cell signaling; product source and quality matter.",
      "Topical application and injection are not interchangeable procedures.",
      "Evidence is emerging and heterogeneous, so complete regeneration or age reversal claims are not justified.",
    ],
    sections: [
      {
        id: "what-they-are",
        title: "What exosomes are",
        paragraphs: [
          "Exosomes are tiny membrane-bound particles released by cells that can carry signaling molecules. In aesthetics, they are discussed as possible recovery-support ingredients, but products and evidence vary widely.",
        ],
      },
      {
        id: "routes",
        title: "Application method changes the risk",
        paragraphs: [
          "Applying a product to the surface after an appropriate procedure is different from microneedling-assisted delivery or injection. Sterility, regulation, source, and professional scope must be evaluated for each method.",
        ],
      },
      {
        id: "what-to-expect",
        title: "What to expect",
        paragraphs: [
          "When used in a clinic protocol, the provider should explain the product, intended route, evidence limitations, recovery plan, and alternatives before consent.",
        ],
      },
    ],
    beforecare: [
      "Disclose allergies and immune conditions.",
      "Ask what product and route are proposed.",
      "Do not apply unverified products to freshly treated skin.",
    ],
    aftercare: [
      "Follow barrier-care instructions.",
      "Avoid unapproved actives during recovery.",
      "Report unusual swelling, rash, or persistent pain.",
    ],
    unsuitable: [
      "Known product allergy",
      "Active infection",
      "An unverified or non-sterile product/procedure",
    ],
    contactClinic: ["Significant swelling", "Hives", "Increasing pain", "Signs of infection"],
    faqs: withStandardFaqs([
      {
        question: "Do exosomes completely regenerate skin?",
        answer: "No. That claim exceeds current clinical evidence.",
      },
      {
        question: "Are topical and injectable exosomes the same?",
        answer: "No. Route, risk, oversight, and evidence differ substantially.",
      },
      {
        question: "Can exosomes replace sunscreen and aftercare?",
        answer: "No. Barrier care and sun protection remain important.",
      },
    ]),
    references: regenerativeReferences,
    relatedArticles: ["pdrn-polynucleotides-guide", "mccm-home-care-after-treatments"],
    relatedTreatments: [{ label: "Request a skin consultation", href: "/appointment-request" }],
  },
  {
    slug: "pdrn-polynucleotides-guide",
    title: "PDRN and Polynucleotides in Skin Rejuvenation: A Client-Friendly Guide",
    excerpt:
      "What PDRN and polynucleotides mean, why delivery method matters, and where evidence remains limited.",
    category: "mccm-skin-science",
    tags: ["PDRN", "polynucleotides", "skin rejuvenation"],
    heroImage: "/images/optimized/treatments/mccm/mccm-pdrn-hero.webp",
    heroAlt: "MCCM PDRN professional formula displayed with its packaging",
    author: "ESCLARE Editorial Team",
    reviewer: null,
    status: "medical-review-required",
    published: false,
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-19",
    readingMinutes: 7,
    seoTitle: "PDRN and Polynucleotides Guide | ESCLARE",
    metaDescription:
      "Understand PDRN and polynucleotides, hydration and texture goals, delivery methods, temporary effects, and assessment.",
    keyTakeaways: [
      "PDRN and polynucleotides are DNA-derived materials discussed in wound healing and aesthetic research.",
      "Topical, mesotherapy-assisted, and injectable approaches are not equivalent.",
      "Early evidence is promising in selected settings but does not support universal outcomes.",
    ],
    sections: [
      {
        id: "definitions",
        title: "PDRN and polynucleotides in context",
        paragraphs: [
          "PDRN refers to shorter DNA-derived fragments, while polynucleotide products may use longer chains. Product processing, purity, concentration, and route all influence how a protocol should be evaluated.",
        ],
      },
      {
        id: "goals",
        title: "What aesthetic protocols may aim to support",
        paragraphs: [
          "Professional protocols may target hydration, barrier recovery, texture, or the appearance of fine lines. These are appearance and recovery goals, not promises to reverse aging or cure skin disease.",
        ],
      },
      {
        id: "what-to-expect",
        title: "What to expect",
        paragraphs: [
          "The provider should explain whether the approach is topical, assisted delivery, or injection; who performs it; expected temporary effects; alternatives; and the follow-up plan.",
        ],
      },
    ],
    beforecare: [
      "Disclose allergies, medicines, and prior injectable reactions.",
      "Clarify the exact product and route.",
      "Postpone treatment over active infection or broken skin.",
    ],
    aftercare: [
      "Keep the area clean as directed.",
      "Avoid rubbing and unapproved actives.",
      "Attend follow-up if swelling or sensitivity persists.",
    ],
    unsuitable: [
      "Active infection",
      "Known ingredient sensitivity",
      "A route or product not appropriate for the client's medical history",
    ],
    contactClinic: [
      "Increasing redness",
      "Severe swelling",
      "Discharge",
      "Persistent or severe pain",
    ],
    faqs: withStandardFaqs([
      {
        question: "Is PDRN simply 'salmon DNA'?",
        answer:
          "That phrase is incomplete. Products use processed DNA-derived fragments, and source, purification, formulation, and route matter.",
      },
      {
        question: "Is topical PDRN the same as an injectable?",
        answer: "No. Delivery, oversight, risk, and expected effects differ.",
      },
      {
        question: "How long do results last?",
        answer:
          "Evidence and protocols vary. The clinic should discuss realistic, non-guaranteed expectations for the selected product and route.",
      },
    ]),
    references: regenerativeReferences,
    relatedArticles: ["exosomes-aesthetic-skincare", "mccm-mesotherapy-solutions"],
    relatedTreatments: [{ label: "MCCM PDRN Glow", href: "/treatments/mccm-pdrn" }],
  },
  {
    slug: "vitamin-c-glutathione-brightening",
    title: "Vitamin C and Glutathione in Professional Brightening Treatments",
    excerpt:
      "How antioxidants may support brighter-looking, more even skin without promising permanent whitening.",
    category: "mccm-skin-science",
    tags: ["vitamin C", "glutathione", "brightening"],
    heroImage: "/images/optimized/treatments/mccm/mccm-eye-contour.webp",
    heroAlt: "Professional skincare vial and packaging on a clean neutral surface",
    author: "ESCLARE Editorial Team",
    reviewer: null,
    status: "medical-review-required",
    published: false,
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-19",
    readingMinutes: 6,
    seoTitle: "Vitamin C and Glutathione Brightening | ESCLARE",
    metaDescription:
      "Learn how Vitamin C and glutathione are discussed in professional brightening, sensitivity, sunscreen, and realistic expectations.",
    keyTakeaways: [
      "Antioxidants may support skin appearance but do not permanently change natural skin color.",
      "Formulation and stability affect Vitamin C products.",
      "Sunscreen and irritation control are central to pigment care.",
    ],
    sections: [
      {
        id: "antioxidants",
        title: "Antioxidants and skin appearance",
        paragraphs: [
          "Vitamin C participates in antioxidant pathways and is used in skincare for brightness and environmental-stress support. Glutathione is also discussed in antioxidant and pigment-related protocols, but route and evidence matter.",
        ],
      },
      {
        id: "limitations",
        title: "Realistic brightening expectations",
        paragraphs: [
          "Professional brightening aims to support a more even or less dull appearance. It should not promise permanent whitening, a change in natural skin color, or identical results for every client.",
        ],
      },
      {
        id: "what-to-expect",
        title: "What to expect",
        paragraphs: [
          "Assessment considers sensitivity, current actives, pigmentation pattern, and recent procedures before a formulation or combination treatment is selected.",
        ],
      },
    ],
    beforecare: [
      "Disclose sensitive-skin reactions.",
      "Avoid layering new strong actives before treatment.",
      "Bring your current routine for review.",
    ],
    aftercare: [
      "Use sunscreen daily.",
      "Introduce actives gradually.",
      "Stop and seek advice if burning or rash develops.",
    ],
    unsuitable: [
      "Known ingredient allergy",
      "Active dermatitis",
      "A damaged skin barrier requiring recovery first",
    ],
    contactClinic: ["Swelling", "Hives", "Blistering", "Persistent burning"],
    faqs: withStandardFaqs([
      {
        question: "Will glutathione permanently whiten skin?",
        answer:
          "No permanent whitening claim is appropriate. Natural skin color should be respected.",
      },
      {
        question: "Can Vitamin C irritate skin?",
        answer: "Yes. Form, concentration, pH, and the rest of the routine influence tolerability.",
      },
      {
        question: "Is sunscreen still needed?",
        answer: "Yes. Sun protection is essential when addressing uneven pigmentation.",
      },
    ]),
    references: regenerativeReferences,
    relatedArticles: ["mccm-professional-skincare-guide", "pico-laser-facial-pigmentation"],
    relatedTreatments: [{ label: "Professional skin support", href: "/treatments#skin-support" }],
  },
  {
    slug: "mccm-professional-chemical-peels",
    title: "MCCM Professional Chemical Peels: Types, Benefits, Downtime, and Aftercare",
    excerpt:
      "Why peel depth, formulation, skin tone, and recovery planning matter more than choosing the strongest option.",
    category: "mccm-skin-science",
    tags: ["chemical peel", "texture", "pigmentation"],
    heroImage: "/images/optimized/clinic/esclare-naga-preparation-area-v2.webp",
    heroAlt: "Clean clinical preparation area for professional skin treatments",
    author: "ESCLARE Editorial Team",
    reviewer: null,
    status: "medical-review-required",
    published: false,
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-19",
    readingMinutes: 7,
    seoTitle: "Professional Chemical Peels Guide | ESCLARE",
    metaDescription:
      "Understand professional chemical peels, superficial and deeper concepts, downtime, beforecare, aftercare, and warning signs.",
    keyTakeaways: [
      "A chemical peel creates controlled exfoliation; depth and formulation determine recovery.",
      "Stronger is not automatically better, especially for sensitive or pigment-prone skin.",
      "Sun protection and not picking peeling skin are essential.",
    ],
    sections: [
      {
        id: "peel-depth",
        title: "Superficial and deeper peel concepts",
        paragraphs: [
          "Superficial peels focus on the outer skin layers and may have lighter downtime. Deeper approaches create more injury, risk, and recovery and may require medical oversight. Product names alone do not reveal the full strength of a protocol.",
        ],
      },
      {
        id: "concerns",
        title: "Concerns a peel may be selected for",
        paragraphs: [
          "Depending on formulation, a peel may be considered for dullness, oiliness, superficial pigmentation, acne-prone skin, texture, or fine-line appearance. Active disease and deeper scars may need another plan.",
        ],
      },
      {
        id: "what-to-expect",
        title: "What to expect",
        paragraphs: [
          "After cleansing and protection of sensitive areas, the peel is applied for a controlled period and neutralized or removed according to protocol. Tingling, warmth, dryness, tightness, or visible peeling may occur.",
        ],
      },
    ],
    beforecare: [
      "Disclose retinoids, isotretinoin history, recent waxing, lasers, and irritation.",
      "Avoid tanning.",
      "Pause actives only as instructed.",
    ],
    aftercare: [
      "Do not pick peeling skin.",
      "Use gentle cleanser, moisturizer, and sunscreen.",
      "Avoid heat, exfoliation, and unapproved actives during recovery.",
    ],
    unsuitable: [
      "Open wounds or infection",
      "Active severe dermatitis",
      "A recent procedure or medicine that increases risk",
    ],
    contactClinic: ["Severe pain", "Blistering", "Marked swelling", "Signs of infection"],
    faqs: withStandardFaqs([
      {
        question: "Does a peel have to visibly peel to work?",
        answer: "No. Visible flaking varies with formulation, depth, and individual response.",
      },
      {
        question: "Is a stronger peel better?",
        answer: "No. Excessive strength can increase irritation, scarring, and pigment risk.",
      },
      {
        question: "Can I use retinoids immediately after?",
        answer: "Only restart strong actives when the clinic says your skin is ready.",
      },
    ]),
    references: laserReferences,
    relatedArticles: ["mccm-home-care-after-treatments", "professional-skincare-energy-treatments"],
    relatedTreatments: [{ label: "Facial treatments", href: "/treatments#facials" }],
  },
  {
    slug: "mccm-mesotherapy-solutions",
    title: "MCCM Mesotherapy Solutions: Hydration, Brightening, and Skin Rejuvenation",
    excerpt:
      "The important differences between topical application, microneedling-assisted delivery, and medical injection.",
    category: "mccm-skin-science",
    tags: ["mesotherapy", "hydration", "professional skincare"],
    heroImage: "/images/optimized/treatments/mccm/mccm-pdrn-detail.webp",
    heroAlt: "MCCM professional-use formula and packaging detail",
    author: "ESCLARE Editorial Team",
    reviewer: null,
    status: "medical-review-required",
    published: false,
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-19",
    readingMinutes: 7,
    seoTitle: "MCCM Mesotherapy Solutions Guide | ESCLARE",
    metaDescription:
      "Understand topical, microneedling-assisted, and injectable mesotherapy approaches, ingredients, sterile technique, and aftercare.",
    keyTakeaways: [
      "Mesotherapy is used inconsistently as a term, so the delivery method must be stated clearly.",
      "Topical use, assisted delivery, and injection carry different risks and provider requirements.",
      "Sterility, product authorization, and candidate assessment are essential.",
    ],
    sections: [
      {
        id: "meaning",
        title: "What mesotherapy can mean",
        paragraphs: [
          "The term may describe superficial application, device-assisted delivery, or small injections. These are not interchangeable. Clients should be told exactly what route is proposed and who is qualified to perform it.",
        ],
      },
      {
        id: "ingredients",
        title: "Hydration and brightening ingredients",
        paragraphs: [
          "Protocols may include humectants, antioxidants, peptides, or pigment-support ingredients. More ingredients do not automatically produce a better or safer result.",
        ],
      },
      {
        id: "what-to-expect",
        title: "What to expect",
        paragraphs: [
          "The visit should include skin assessment, consent for the exact route, sterile preparation where the barrier is crossed, application, and route-specific recovery instructions.",
        ],
      },
    ],
    beforecare: [
      "Disclose allergies and bleeding-risk medicines.",
      "Ask whether needles or microneedling are involved.",
      "Postpone over infected or irritated skin.",
    ],
    aftercare: [
      "Keep treated skin clean.",
      "Avoid makeup and actives for the instructed period.",
      "Do not touch the area unnecessarily.",
    ],
    unsuitable: ["Active infection", "Uncontrolled bleeding risk", "Known product allergy"],
    contactClinic: ["Increasing pain", "Spreading redness", "Pus or fever", "Severe swelling"],
    faqs: withStandardFaqs([
      {
        question: "Is all mesotherapy injectable?",
        answer:
          "No. The term is used for different delivery methods, which is why the clinic must name the exact route.",
      },
      {
        question: "Can a therapist perform injections?",
        answer:
          "Injection scope depends on professional licensing, product, and local requirements. ESCLARE must assign an appropriately qualified provider.",
      },
      {
        question: "Will I have small bumps?",
        answer:
          "Temporary marks or swelling depend on the delivery method. The provider should explain what is expected for your protocol.",
      },
    ]),
    references: regenerativeReferences,
    relatedArticles: ["pdrn-polynucleotides-guide", "mccm-professional-skincare-guide"],
    relatedTreatments: [
      { label: "Request a professional skin assessment", href: "/appointment-request" },
    ],
  },
  {
    slug: "professional-skincare-energy-treatments",
    title:
      "How Professional Skincare May Be Combined with Pico Laser, Fractional Laser, HIFU, and Other Treatments",
    excerpt:
      "Why sequencing, barrier recovery, and individualized timing matter when combining products with energy-based procedures.",
    category: "mccm-skin-science",
    tags: ["combination treatments", "Pico", "HIFU"],
    heroImage: "/images/optimized/treatments/hifu/hifu-face-treatment.webp",
    heroAlt: "HIFU handpiece positioned along the jawline during treatment",
    author: "ESCLARE Editorial Team",
    reviewer: null,
    status: "medical-review-required",
    published: false,
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-19",
    readingMinutes: 7,
    seoTitle: "Combining Skincare with Laser and HIFU | ESCLARE",
    metaDescription:
      "Learn why treatment sequencing, skin-barrier recovery, active ingredients, and personalized timing matter around Pico, fractional laser, HIFU, and diode.",
    keyTakeaways: [
      "Combination care is a sequence, not a shopping list.",
      "Barrier-disrupting procedures may require actives to pause before and after treatment.",
      "Fixed intervals should not be copied without clinician approval.",
    ],
    sections: [
      {
        id: "sequencing",
        title: "Why sequencing matters",
        paragraphs: [
          "Laser, fractional treatments, HIFU, diode, peels, and microneedling affect skin in different ways and depths. Combining them too closely can increase irritation without improving outcomes.",
        ],
      },
      {
        id: "barrier",
        title: "Protecting the skin barrier",
        paragraphs: [
          "After a barrier-disrupting treatment, the immediate priority may be gentle cleansing, moisturization, and sun protection. Retinoids, exfoliating acids, fragranced products, and additional procedures may need to wait.",
        ],
      },
      {
        id: "what-to-expect",
        title: "What to expect from planning",
        paragraphs: [
          "The provider maps the primary concern, treatment intensity, expected recovery, home care, and follow-up before deciding what can occur on the same day or at a later visit.",
        ],
      },
    ],
    beforecare: [
      "List recent procedures and current actives.",
      "Do not schedule overlapping treatments without review.",
      "Report active irritation or sun exposure.",
    ],
    aftercare: [
      "Follow the most restrictive recovery instruction from the combined plan.",
      "Restart actives only when cleared.",
      "Use daily sun protection.",
    ],
    unsuitable: [
      "A damaged skin barrier",
      "Active infection",
      "Insufficient recovery time between procedures",
    ],
    contactClinic: [
      "Unexpected blistering",
      "Increasing pain",
      "Marked swelling",
      "Delayed worsening",
    ],
    faqs: withStandardFaqs([
      {
        question: "Can Pico and a peel be done on the same day?",
        answer:
          "Sometimes combinations are planned, but fixed advice is unsafe. The clinic must assess intensity, formulation, and recovery risk.",
      },
      {
        question: "Can skincare improve HIFU results?",
        answer:
          "Skincare can support surface health, but it does not reproduce or guarantee the effects of an energy-based treatment.",
      },
      {
        question: "When can I restart retinoids?",
        answer:
          "Restart timing depends on the procedure and recovery. Follow your provider's instruction.",
      },
    ]),
    references: [...laserReferences, ...regenerativeReferences],
    relatedArticles: ["mccm-home-care-after-treatments", "pico-laser-facial-rejuvenation"],
    relatedTreatments: [
      { label: "Pico Glow Face", href: "/treatments/pico-glow-face" },
      { label: "7D HIFU Face", href: "/treatments/7d-hifu-face" },
    ],
  },
  {
    slug: "mccm-home-care-after-treatments",
    title: "A Practical Home-Care Guide After Professional Skin Treatments",
    excerpt:
      "A calm recovery checklist for cleansing, moisturizing, sunscreen, active ingredients, heat, makeup, and warning signs.",
    category: "mccm-skin-science",
    tags: ["aftercare", "skin barrier", "sunscreen"],
    heroImage: "/images/optimized/clinic/esclare-naga-treatment-room-v2.webp",
    heroAlt: "Prepared ESCLARE treatment room for professional skin care",
    author: "ESCLARE Editorial Team",
    reviewer: null,
    status: "medical-review-required",
    published: false,
    publishedAt: "2026-07-19",
    updatedAt: "2026-07-19",
    readingMinutes: 6,
    seoTitle: "Home Care After Professional Skin Treatments | ESCLARE",
    metaDescription:
      "Practical home care after professional skin treatments: gentle cleansing, barrier support, sunscreen, makeup, actives, and warning signs.",
    keyTakeaways: [
      "Follow the procedure-specific instructions given by ESCLARE.",
      "Gentle cleansing, moisturizer, and sunscreen are common recovery foundations.",
      "Severe or worsening symptoms should be reported rather than treated with random products.",
    ],
    sections: [
      {
        id: "first-days",
        title: "The first days of recovery",
        paragraphs: [
          "The skin may feel warm, tight, dry, or sensitive depending on the procedure. Avoid over-cleansing and unnecessary touching. Use only the products approved for your recovery stage.",
        ],
      },
      {
        id: "actives",
        title: "When to pause active ingredients",
        paragraphs: [
          "Retinoids, exfoliating acids, scrubs, benzoyl peroxide, and strong brightening products may need to pause. Restart timing depends on the procedure and how the skin is healing.",
        ],
      },
      {
        id: "what-to-expect",
        title: "What to expect",
        paragraphs: [
          "Normal recovery varies. Mild redness or dryness can be expected after some procedures, while others have little visible downtime. Your written aftercare should identify the expected pattern for your treatment.",
        ],
      },
    ],
    beforecare: [
      "Ask for written aftercare before leaving the clinic.",
      "Prepare gentle cleanser, moisturizer, and sunscreen.",
      "Plan around heat, exercise, swimming, and makeup restrictions.",
    ],
    aftercare: [
      "Cleanse gently and pat dry.",
      "Moisturize and protect from sun.",
      "Avoid heat, steam, friction, scratching, and picking until cleared.",
    ],
    unsuitable: [
      "This guide is not a substitute for procedure-specific advice.",
      "Do not self-treat a suspected infection or serious reaction.",
      "Do not restart prescription skin medicines without guidance.",
    ],
    contactClinic: [
      "Severe pain",
      "Blistering",
      "Spreading redness or discharge",
      "Swelling that affects breathing or vision",
    ],
    faqs: withStandardFaqs([
      {
        question: "When can I wear makeup?",
        answer:
          "Timing depends on whether the skin barrier was disrupted. Follow the instruction for your exact procedure.",
      },
      {
        question: "When can I exercise?",
        answer:
          "Heat and sweat may worsen irritation after some treatments. Use the clinic's procedure-specific timeline.",
      },
      {
        question: "Should I peel flaking skin?",
        answer: "No. Picking can increase irritation, infection, scarring, and pigment changes.",
      },
    ]),
    references: [...laserReferences, ...regenerativeReferences],
    relatedArticles: ["mccm-professional-skincare-guide", "mccm-professional-chemical-peels"],
    relatedTreatments: [{ label: "ESCLARE Aftercare Library", href: "/aftercare" }],
  },
];

export function getEducationCategory(slug: string) {
  return educationCategories.find((category) => category.slug === slug);
}

export function getEducationArticle(slug: string) {
  return educationArticles.find((article) => article.slug === slug);
}

export function getVisibleEducationArticles(includeDrafts = false) {
  return educationArticles.filter((article) => article.published || includeDrafts);
}

export function getCategoryArticles(category: string, includeDrafts = false) {
  return getVisibleEducationArticles(includeDrafts).filter(
    (article) => article.category === category,
  );
}
