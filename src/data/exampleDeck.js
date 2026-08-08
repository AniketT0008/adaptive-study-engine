export const EXAMPLE_DECKS = [
  {
    "id": "example-cs-101",
    "title": "Intro to Computer Science",
    "description": "Variables, loops, algorithms, and Big-O notation",
    "emoji": "💻",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "binary-numbers",
        "label": "Binary Numbers",
        "sourceSnippet": "Binary (base-2) is the fundamental language of digital computers, using 0s and 1s to encode numbers, characters, and machine instructions.",
        "example": "Mathematical Conversion: 1011₂ = (1 × 2³) + (0 × 2²) + (1 × 2¹) + (1 × 2⁰) = 8 + 0 + 2 + 1 = 11₁₀.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-07T12:00:00.000Z",
        "history": []
      },
      {
        "id": "variables",
        "label": "Variables & Scope",
        "sourceSnippet": "A variable is a named storage location in memory used to hold dynamic data that can be updated during execution.",
        "example": "Code Snippet:\nlet score = 10;\nscore = score + 5; // score is now 15",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-07T12:00:00.000Z",
        "history": []
      },
      {
        "id": "big-o",
        "label": "Big-O Algorithmic Complexity",
        "sourceSnippet": "Big-O notation describes the upper bound performance of an algorithm in terms of time runtime or memory consumption as input N scales.",
        "example": "Complexity Comparison:\nLinear Search = O(N) (1,000 items → 1,000 steps)\nBinary Search = O(log N) (1,000 items → ~10 steps)",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-07T12:00:00.000Z",
        "history": []
      }
    ],
    "questions": [
      {
        "id": "q-cs-1",
        "conceptId": "binary-numbers",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "What base is the binary number system?",
        "options": ["Base-10", "Base-2", "Base-16", "Base-8"],
        "answer": "Base-2",
        "explanation": "Binary uses only two digits: 0 and 1."
      },
      {
        "id": "q-cs-2",
        "conceptId": "variables",
        "type": "cloze",
        "difficulty": "medium",
        "prompt": "A variable stores a named value in ___.",
        "options": null,
        "answer": "memory",
        "explanation": "Variables map symbolic identifiers to memory addresses."
      },
      {
        "id": "q-cs-3",
        "conceptId": "big-o",
        "type": "short",
        "difficulty": "hard",
        "prompt": "What is the Big-O time complexity of binary search?",
        "options": null,
        "answer": "O(log N)",
        "explanation": "Binary search halves the active search space with every comparison."
      }
    ]
  },
  {
    "id": "example-calc-101",
    "title": "Calculus & University Physics",
    "description": "Derivatives, integrals, kinematics, and Newton laws",
    "emoji": "📐",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "derivatives",
        "label": "Power Rule Derivatives",
        "sourceSnippet": "The power rule states that the derivative of x^n with respect to x is n * x^(n-1).",
        "example": "Worked Math Example:\nFind d/dx (3x⁴ - 5x² + 7):\n= 3(4x³) - 5(2x¹) + 0 = 12x³ - 10x.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-07T12:00:00.000Z",
        "history": []
      },
      {
        "id": "integration",
        "label": "Definite Integrals",
        "sourceSnippet": "Integration calculates the accumulated net signed area under a continuous curve f(x) over [a, b].",
        "example": "Worked Integral Example:\n∫₁³ 2x dx = [x²]₁³ = (3²) - (1²) = 9 - 1 = 8 units².",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-07T12:00:00.000Z",
        "history": []
      },
      {
        "id": "kinematics",
        "label": "Newton Second Law (F = ma)",
        "sourceSnippet": "Acceleration is directly proportional to net external force and inversely proportional to object mass.",
        "example": "Physics Calculation:\nA 5 kg block pushed with 20 N force on a frictionless surface:\na = F / m = 20 N / 5 kg = 4 m/s².",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-07T12:00:00.000Z",
        "history": []
      }
    ],
    "questions": [
      {
        "id": "q-calc-1",
        "conceptId": "derivatives",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "What is the derivative of x³ using the power rule?",
        "options": ["3x²", "x²", "3x³", "x⁴/4"],
        "answer": "3x²",
        "explanation": "d/dx (x³) = 3 * x^(3-1) = 3x²."
      },
      {
        "id": "q-calc-2",
        "conceptId": "integration",
        "type": "cloze",
        "difficulty": "medium",
        "prompt": "Integration measures the total accumulated ___ under a curve.",
        "options": null,
        "answer": "area",
        "explanation": "The definite integral equals the net area under f(x)."
      },
      {
        "id": "q-calc-3",
        "conceptId": "kinematics",
        "type": "short",
        "difficulty": "hard",
        "prompt": "What is the formula for Newton second law of motion?",
        "options": null,
        "answer": "F = ma",
        "explanation": "Force equals mass multiplied by acceleration."
      }
    ]
  },
  {
    "id": "example-chem-101",
    "title": "General & Organic Chemistry",
    "description": "Stoichiometry, chemical bonding, thermodynamics, and reaction mechanisms",
    "emoji": "🧪",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "stoichiometry",
        "label": "Molar Mass & Avogadro Number",
        "sourceSnippet": "One mole of any substance contains exactly 6.022 × 10²³ elementary entities (atoms, molecules, or ions).",
        "example": "Chemistry Calculation:\nFind moles of H₂O in 36g (Molar mass of H₂O = 18 g/mol):\n36g / 18 g/mol = 2.0 moles = 1.204 × 10²⁴ molecules.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-07T12:00:00.000Z",
        "history": []
      },
      {
        "id": "le-chatelier",
        "label": "Le Chatelier Principle",
        "sourceSnippet": "When a chemical system at equilibrium experiences a change in concentration, temperature, or pressure, the system shifts to counteract the imposition.",
        "example": "Equilibrium Shift Example:\nFor N₂(g) + 3H₂(g) ⇌ 2NH₃(g) (Exothermic ΔH < 0):\nIncreasing temperature shifts equilibrium left toward reactants.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-07T12:00:00.000Z",
        "history": []
      }
    ],
    "questions": [
      {
        "id": "q-chem-1",
        "conceptId": "stoichiometry",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "How many particles are in one mole of a pure substance?",
        "options": ["6.022 × 10²³", "3.00 × 10⁸", "9.81 × 10²", "1.602 × 10⁻¹⁹"],
        "answer": "6.022 × 10²³",
        "explanation": "Avogadro's constant defines the number of items per mole."
      },
      {
        "id": "q-chem-2",
        "conceptId": "le-chatelier",
        "type": "cloze",
        "difficulty": "medium",
        "prompt": "Le Chatelier principle states that a system at equilibrium responds to stress by shifting to ___ the stress.",
        "options": null,
        "answer": "counteract",
        "explanation": "The shift relieves the added concentration, temperature, or pressure."
      }
    ]
  },
  {
    "id": "example-psych-101",
    "title": "Intro to Psychology & Neuroscience",
    "description": "Classical conditioning, memory formation, and cognitive neuroscience",
    "emoji": "🧠",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "classical-conditioning",
        "label": "Pavlovian Conditioning",
        "sourceSnippet": "Classical conditioning pairs an unconditioned stimulus with a neutral stimulus until the neutral stimulus evokes a conditioned response.",
        "example": "Experiment Scenario:\nFood (Unconditioned Stimulus) → Bell (Conditioned Stimulus) → Salivation (Conditioned Response).",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-07T12:00:00.000Z",
        "history": []
      },
      {
        "id": "working-memory",
        "label": "Baddeley Working Memory Model",
        "sourceSnippet": "Working memory is a multi-component cognitive system responsible for temporarily holding and manipulating information during complex reasoning tasks.",
        "example": "Memory Capacity Rule:\nMiller Law specifies working memory capacity as 7 ± 2 chunks of information.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-07T12:00:00.000Z",
        "history": []
      }
    ],
    "questions": [
      {
        "id": "q-psych-1",
        "conceptId": "classical-conditioning",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "Who discovered classical conditioning through experiments with dogs?",
        "options": ["Ivan Pavlov", "B.F. Skinner", "Sigmund Freud", "Jean Piaget"],
        "answer": "Ivan Pavlov",
        "explanation": "Pavlov demonstrated conditioned reflexes using acoustic tones and food."
      },
      {
        "id": "q-psych-2",
        "conceptId": "working-memory",
        "type": "short",
        "difficulty": "medium",
        "prompt": "What is Miller magic number for short-term working memory capacity?",
        "options": null,
        "answer": "7",
        "explanation": "Miller classic 1956 paper established 7 ± 2 chunks."
      }
    ]
  },
  {
    "id": "example-econ-101",
    "title": "Microeconomics & Market Analysis",
    "description": "Supply and demand elasticity, equilibrium price, and market surplus",
    "emoji": "📈",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "supply-demand",
        "label": "Market Equilibrium Price",
        "sourceSnippet": "Market equilibrium occurs at the price level where quantity supplied equals quantity demanded, clearing excess supply or shortage.",
        "example": "Market Equilibrium Equation:\nQd = 100 - 2P, Qs = 20 + 2P\n100 - 2P = 20 + 2P ⇒ 4P = 80 ⇒ Equilibrium Price P* = $20.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-07T12:00:00.000Z",
        "history": []
      }
    ],
    "questions": [
      {
        "id": "q-econ-1",
        "conceptId": "supply-demand",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "What happens when market price is above the equilibrium price?",
        "options": ["Surplus (Excess Supply)", "Shortage (Excess Demand)", "Equilibrium", "Hyperinflation"],
        "answer": "Surplus (Excess Supply)",
        "explanation": "Higher prices encourage producers to supply more than consumers demand."
      }
    ]
  }
];