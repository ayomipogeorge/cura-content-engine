import type { VideoScript } from "../types";

// Scripts 1-5 from the Cura Content System doc. To add a video, copy one of
// these, change the scenes, and add it to `scripts` at the bottom.
// Script 6 (founder on camera) is filmed, not animated, so it isn't here.

const s1: VideoScript = {
  id: "s01-hr-plan-fits-nobody",
  title: "Your staff health plan fits nobody",
  pillar: "The HR Fix",
  audience: "Employers / HR",
  leadPlatform: "LinkedIn",
  scenes: [
    {
      id: "one-plan",
      seconds: 3,
      text: "One plan. 40 people.",
      vo: "Your company picked one health plan for everyone.",
      visual: { kind: "people", count: 40, stampLabel: "Standard Plan" },
      exit: "push",
    },
    {
      id: "different-lives",
      seconds: 6,
      text: "Different lives. Same plan.",
      vo: "But a 24-year-old analyst, a mum of three and someone managing a long-term condition don't need the same cover.",
      visual: {
        kind: "personas",
        tagTone: "bad",
        people: [
          { name: "Analyst, 24", detail: "Single, healthy", chips: ["Check-ups"], tag: "Paying for extras" },
          { name: "Mum of three", detail: "Family of five", chips: ["Kids", "Maternity"], tag: "Kids not covered" },
          { name: "Long-term care", detail: "Monthly meds", chips: ["Prescriptions"], tag: "Meds not covered" },
        ],
      },
      exit: "wipe",
    },
    {
      id: "complaints",
      seconds: 6,
      text: "Sound familiar?",
      vo: "So HR hears the complaints, and the budget pays for cover nobody quite needs.",
      visual: {
        kind: "stack",
        style: "bubbles",
        target: "HR",
        items: ["My kids aren't covered", "Why can't I use this clinic?", "I never use this plan", "My meds aren't included"],
      },
      exit: "iris",
    },
    {
      id: "you-fund",
      seconds: 9,
      text: "You fund it.",
      vo: "With Cura, you fund a Health Wallet for each staff member and decide how much each person gets.",
      visual: {
        kind: "dashboard",
        editRow: 1,
        editTo: 45000,
        rows: [
          { name: "Tolu A.", role: "Analyst", amount: 25000 },
          { name: "Ngozi O.", role: "Operations", amount: 30000 },
          { name: "Emeka B.", role: "Sales", amount: 25000 },
          { name: "Halima S.", role: "Finance", amount: 35000 },
        ],
      },
      exit: "slide",
    },
    {
      id: "they-choose",
      seconds: 9,
      text: "They choose.",
      vo: "Each employee then chooses a plan from licensed HMOs that fits their budget, their family and their health.",
      visual: {
        kind: "walletsToPlans",
        people: ["Tolu", "Ngozi", "Emeka"],
        plans: ["Essential", "Family Plus", "Chronic Care"],
      },
      exit: "push",
    },
    {
      id: "end",
      seconds: 7,
      text: "One budget. Cover that fits.",
      vo: "One budget. Cover that actually fits. Book a demo at getcura.co.",
      visual: { kind: "end", line: "One budget. Cover that fits.", cta: "Book a demo" },
    },
  ],
};

const s2: VideoScript = {
  id: "s02-provider-paid-today",
  title: "You treated the patient. When do you get paid?",
  pillar: "Paid Today",
  audience: "Pharmacies and clinics",
  leadPlatform: "TikTok",
  scenes: [
    {
      id: "treated",
      seconds: 3,
      text: "You treated the patient.",
      vo: "You treated the patient today.",
      visual: {
        kind: "clip",
        file: "s02-pharmacy-counter.mp4",
        description: "A Lagos pharmacy counter: pharmacist hands over a bag, patient smiles and leaves",
      },
      exit: "push",
    },
    {
      id: "months",
      seconds: 5,
      text: "Paid in… months?",
      vo: "So why does getting paid take months?",
      visual: { kind: "calendar", label: "Still waiting" },
      exit: "wipe",
    },
    {
      id: "dont-wait",
      seconds: 6,
      text: "They don't wait.",
      vo: "Your suppliers, your staff and your rent don't wait that long.",
      visual: { kind: "stack", style: "slam", items: ["Supplier invoice", "Staff salaries", "Shop rent"] },
      exit: "iris",
    },
    {
      id: "paid-today",
      seconds: 8,
      text: "Paid. Today.",
      vo: "With Cura, patients pay from a Health Wallet their employer funds, and verified providers get paid the same day.",
      visual: { kind: "pay", provider: "Your pharmacy" },
      exit: "slide",
    },
    {
      id: "join",
      seconds: 4,
      text: "Join in three steps.",
      vo: "No chasing payments.",
      visual: { kind: "stack", style: "steps", items: ["Sign up", "Get verified", "Start receiving payments"] },
      exit: "push",
    },
    {
      id: "end",
      seconds: 4,
      text: "Join the network.",
      vo: "Join the Cura provider network at getcura.co.",
      visual: { kind: "end", line: "You did the work. Get paid today.", cta: "Join the provider network" },
    },
  ],
};

const s3: VideoScript = {
  id: "s03-plan-match-same-budget",
  title: "Same budget. Two people. Two different plans.",
  pillar: "Plan Match",
  audience: "Employees and HR",
  leadPlatform: "Instagram",
  scenes: [
    {
      id: "same-budget",
      seconds: 3,
      text: "Same budget.",
      vo: "Tolu and Ngozi work at the same company and get the same health budget.",
      visual: {
        kind: "personas",
        sameBudget: true,
        people: [
          { name: "Tolu", detail: "Health Wallet" },
          { name: "Ngozi", detail: "Health Wallet" },
        ],
      },
      exit: "slide",
    },
    {
      id: "different-needs",
      seconds: 7,
      text: "Different needs.",
      vo: "But Tolu is single and just wants good everyday cover. Ngozi needs care for herself and her two kids.",
      visual: {
        kind: "personas",
        tagTone: "neutral",
        people: [
          { name: "Tolu, 26", detail: "Single", chips: ["Just me", "Check-ups", "Dental"] },
          { name: "Ngozi, 34", detail: "Two children", chips: ["2 kids", "Paediatric care", "Maternity"] },
        ],
      },
      exit: "push",
    },
    {
      id: "cura-matches",
      seconds: 8,
      text: "Cura matches.",
      vo: "Cura looks at each person's wallet balance, their family and what they actually need,",
      visual: { kind: "planSort", factors: ["Budget", "Family size", "Health needs"] },
      exit: "wipe",
    },
    {
      id: "two-plans",
      seconds: 10,
      text: "Two plans. Both right.",
      vo: "and shows them plans from licensed HMOs that fit. Same budget, two very different plans, both the right one.",
      visual: {
        kind: "planAssign",
        people: [
          { name: "Tolu", plan: "Essential", benefits: ["GP visits", "Dental", "Lab tests"] },
          { name: "Ngozi", plan: "Family Plus", benefits: ["Covers 2 kids", "Paediatrics", "Maternity"] },
        ],
      },
      exit: "iris",
    },
    {
      id: "choose",
      seconds: 6,
      text: "Your money. Your choice.",
      vo: "They choose. Nobody gets a plan picked for them.",
      visual: {
        kind: "planAssign",
        drain: true,
        people: [
          { name: "Tolu", plan: "Essential", benefits: ["GP visits", "Dental", "Lab tests"] },
          { name: "Ngozi", plan: "Family Plus", benefits: ["Covers 2 kids", "Paediatrics", "Maternity"] },
        ],
      },
      exit: "push",
    },
    {
      id: "end",
      seconds: 6,
      text: "Ask HR about Cura.",
      vo: "Want this at your company? Ask HR about Cura.",
      visual: { kind: "end", line: "Your health money. Your choice.", cta: "Ask HR about Cura" },
    },
  ],
};

const s4: VideoScript = {
  id: "s04-five-staff-rule",
  title: "5 or more staff? This applies to you.",
  pillar: "HR in 60 Seconds",
  audience: "SME owners and HR",
  leadPlatform: "LinkedIn",
  scenes: [
    {
      id: "five-staff",
      seconds: 3,
      text: "5 or more staff?",
      vo: "If your business has five or more staff, this one's for you.",
      visual: { kind: "people", count: 5, popOneByOne: true, flashOnLast: true },
      exit: "push",
    },
    {
      id: "the-law",
      seconds: 8,
      text: "Health cover is a legal duty.",
      vo: "Under the National Health Insurance Authority Act 2022, employers with five or more staff are required to provide health insurance for their team.",
      note: "General information, not legal advice.",
      visual: {
        kind: "document",
        title: "NHIA Act 2022",
        lines: [
          "Establishes the National Health Insurance Authority",
          "Health insurance for every resident of Nigeria",
          "Covers employers and employees with 5 or more staff",
          "Delivered through accredited HMOs and state schemes",
        ],
        highlight: 2,
      },
      exit: "wipe",
    },
    {
      id: "accredited-hmo",
      seconds: 7,
      text: "Through an accredited HMO",
      vo: "Most businesses do this by enrolling their staff with an NHIA-accredited HMO.",
      visual: {
        kind: "document",
        title: "Accredited HMO",
        lines: ["Register the business", "Enrol every employee", "Receive membership details"],
        highlight: 1,
        pointTo: "Enrolment",
      },
      exit: "slide",
    },
    {
      id: "one-plan",
      seconds: 8,
      text: "One plan. Everyone.",
      vo: "The usual way is one plan for everyone, whether it fits them or not.",
      visual: { kind: "people", count: 12, stampLabel: "Standard Plan", shrug: true },
      exit: "iris",
    },
    {
      id: "cura-way",
      seconds: 12,
      text: "Your budget. Their choice.",
      vo: "With Cura, you fund each person's Health Wallet, they choose a plan from licensed HMOs, and every employee's cover and documents sit in one place.",
      visual: {
        kind: "walletsToPlans",
        people: ["Tolu", "Ngozi", "Emeka"],
        plans: ["Essential", "Family Plus", "Chronic Care"],
        folder: "Cover and documents",
      },
      exit: "push",
    },
    {
      id: "end",
      seconds: 7,
      text: "Cover your team will use.",
      vo: "Cover your team will actually use. Talk to us at getcura.co.",
      visual: { kind: "end", line: "Cover your team will actually use.", cta: "Talk to us" },
    },
  ],
};

const s5: VideoScript = {
  id: "s05-what-is-a-health-wallet",
  title: "What is a Health Wallet?",
  pillar: "Wallet Wednesday",
  audience: "Employees",
  leadPlatform: "TikTok",
  dark: true,
  scenes: [
    {
      id: "what",
      seconds: 3,
      text: "What's a Health Wallet?",
      vo: "What's a Health Wallet? Here it is in 30 seconds.",
      visual: { kind: "walletHero", mode: "spin", balance: 0 },
      exit: "push",
    },
    {
      id: "employer-funds",
      seconds: 7,
      text: "Your employer funds it.",
      vo: "It's money your employer sets aside for your health, in your name.",
      visual: { kind: "walletHero", mode: "fill", balance: 30000 },
      exit: "slide",
    },
    {
      id: "you-decide",
      seconds: 8,
      text: "You decide how to use it.",
      vo: "You use it to choose a health plan that suits you, or to pay at verified pharmacies and clinics.",
      visual: { kind: "walletHero", mode: "menu", balance: 30000, options: ["Health plans", "Pharmacies", "Clinics"] },
      exit: "wipe",
    },
    {
      id: "pay",
      seconds: 6,
      text: "No forms. No waiting.",
      vo: "You pay from the wallet, and the provider gets paid directly.",
      visual: { kind: "pay", provider: "Clinic" },
      exit: "iris",
    },
    {
      id: "end",
      seconds: 6,
      text: "Ask HR about Cura.",
      vo: "Want one? Ask your HR about Cura.",
      visual: { kind: "end", line: "Your health money. Your choice.", cta: "Ask HR about Cura" },
    },
  ],
};

export const scripts: VideoScript[] = [s1, s2, s3, s4, s5];
