export const EXAMPLE_DECKS = [
  {
    "id": "example-calc-101",
    "title": "Grade 12 Calculus & Vectors",
    "description": "Limits, derivatives, vector cross products, and equations of planes",
    "emoji": "📐",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "derivatives-power-rule",
        "label": "Power Rule & Chain Rule Derivatives",
        "sourceSnippet": "The power rule states d/dx (x^n) = n * x^(n-1). Combined with the chain rule d/dx [f(g(x))] = f'(g(x)) * g'(x), complex engineering rate-of-change functions are computed.",
        "example": "Worked Math Problem:\nFind d/dx [(3x² + 5)⁴]:\nLet u = 3x² + 5. Then d/dx = 4(3x² + 5)³ * (6x) = 24x(3x² + 5)³.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-07T12:00:00.000Z",
        "history": []
      },
      {
        "id": "vectors-cross-product",
        "label": "Vector Cross Product & Torque",
        "sourceSnippet": "The cross product of 3D vectors A × B produces a perpendicular vector with magnitude |A||B|sin(θ), representing physical quantities like torque and magnetic force.",
        "example": "Worked Vector Calculation:\nIf A = [1, 2, 3] and B = [4, 5, 6]:\nA × B = [(2*6 - 3*5), (3*4 - 1*6), (1*5 - 2*4)] = [-3, 6, -3].",
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
        "conceptId": "derivatives-power-rule",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "What is the derivative of x⁴ using the power rule?",
        "options": ["4x³", "x³", "4x⁴", "3x³"],
        "answer": "4x³",
        "explanation": "d/dx (x⁴) = 4 * x^(4-1) = 4x³."
      },
      {
        "id": "q-calc-2",
        "conceptId": "vectors-cross-product",
        "type": "short",
        "difficulty": "hard",
        "prompt": "What geometric relationship does A × B have to vectors A and B?",
        "options": null,
        "answer": "perpendicular",
        "explanation": "The cross product vector is orthogonal (perpendicular) to both input vectors."
      }
    ]
  },
  {
    "id": "example-phys-em",
    "title": "Grade 12 Physics: Electricity & Magnetism",
    "description": "Coulomb's Law, DC circuit analysis, and magnetic forces",
    "emoji": "⚡",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "coulomb-law",
        "label": "Coulomb's Law & Electric Fields",
        "sourceSnippet": "Coulomb's Law calculates the electrostatic force between charges: F = k * (|q1*q2| / r²), where k ≈ 8.99 × 10⁹ N·m²/C².",
        "example": "Physics Calculation:\nTwo 2μC charges separated by 0.1m:\nF = (8.99 × 10⁹) * (2 × 10⁻⁶ * 2 × 10⁻⁶) / (0.1)² = 3.596 N.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-07T12:00:00.000Z",
        "history": []
      },
      {
        "id": "lorentz-force",
        "label": "Magnetic Field & Lorentz Force",
        "sourceSnippet": "A charged particle moving through a magnetic field B experiences a magnetic force F = q(v × B) perpendicular to velocity and field.",
        "example": "Force Calculation:\nProton (q = 1.6 × 10⁻¹⁹ C) moving at 10⁶ m/s perpendicular to 0.5 T field:\nF = (1.6 × 10⁻¹⁹) * (10⁶) * (0.5) = 8.0 × 10⁻¹⁴ N.",
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
        "id": "q-em-1",
        "conceptId": "coulomb-law",
        "type": "cloze",
        "difficulty": "medium",
        "prompt": "Electrostatic force between two point charges is inversely proportional to the square of the ___.",
        "options": null,
        "answer": "distance",
        "explanation": "Coulomb's law obeys an inverse-square law with respect to separation distance r."
      }
    ]
  },
  {
    "id": "example-phys-kin",
    "title": "Grade 12 Physics: Dynamics & Kinematics",
    "description": "Projectile motion, centripetal acceleration, and work-energy theorem",
    "emoji": "🚀",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "projectile-motion",
        "label": "2D Projectile Kinematics",
        "sourceSnippet": "Projectile motion decomposes into independent horizontal motion (constant velocity dx = vx*t) and vertical motion under gravity (vy = vy0 - g*t).",
        "example": "Worked Calculation:\nLaunch velocity v0 = 20 m/s at 30°:\nvx = 20 cos(30°) = 17.32 m/s\nvy0 = 20 sin(30°) = 10.0 m/s\nTime to peak height = 10 / 9.81 = 1.02 s.",
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
        "id": "q-kin-1",
        "conceptId": "projectile-motion",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "What is the horizontal acceleration of an ideal projectile (ignoring air resistance)?",
        "options": ["0 m/s²", "9.81 m/s²", "4.9 m/s²", "Varies with angle"],
        "answer": "0 m/s²",
        "explanation": "No horizontal forces act on an ideal projectile, so horizontal acceleration is zero."
      }
    ]
  },
  {
    "id": "example-chem-12",
    "title": "Grade 12 Chemistry: Organic & Reaction Kinetics",
    "description": "Functional groups, chemical equilibrium, and reaction rates",
    "emoji": "🧪",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "reaction-kinetics",
        "label": "Rate Laws & Activation Energy",
        "sourceSnippet": "The rate law Rate = k[A]^m[B]^n quantifies how reactant concentrations affect reaction speed. Activation energy Ea is the minimum energy required to reach the transition state.",
        "example": "Arrhenius Formula:\nk = A * e^(-Ea / R*T), where R = 8.314 J/(mol·K).",
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
        "conceptId": "reaction-kinetics",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "What effect does adding a catalyst have on the activation energy (Ea) of a reaction?",
        "options": ["Lowers Ea", "Raises Ea", "No effect on Ea", "Doubles Ea"],
        "answer": "Lowers Ea",
        "explanation": "Catalysts provide an alternative reaction pathway with a lower activation energy."
      }
    ]
  },
  {
    "id": "example-bio-gen",
    "title": "Grade 12 Biology: Molecular Genetics & Enzymes",
    "description": "DNA replication, protein synthesis, and enzyme kinetics",
    "emoji": "🧬",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "dna-replication",
        "label": "Semiconservative DNA Replication",
        "sourceSnippet": "DNA Polymerase synthesizes new complementary strands in the 5' to 3' direction. Helicase unwinds the double helix, while DNA Ligase seals Okazaki fragments on the lagging strand.",
        "example": "Complementary Pairing Rule:\n5'-A-T-G-C-C-G-3' template synthesizes 3'-T-A-C-G-G-C-5'.",
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
        "id": "q-bio-1",
        "conceptId": "dna-replication",
        "type": "short",
        "difficulty": "medium",
        "prompt": "In what directional orientation does DNA polymerase synthesize new DNA strands?",
        "options": null,
        "answer": "5' to 3'",
        "explanation": "DNA Polymerase can only add nucleotides to the 3' hydroxyl end."
      }
    ]
  },
  {
    "id": "example-cs-12",
    "title": "Grade 12 Computer Science: Algorithms & OOP",
    "description": "Recursion, Big-O complexity, sorting algorithms, and object-oriented design",
    "emoji": "💻",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "recursion-base-case",
        "label": "Recursion & Base Cases",
        "sourceSnippet": "Recursion occurs when a function calls itself to solve smaller instances of a problem. Every recursive algorithm requires a base case to prevent infinite stack overflow.",
        "example": "Code Example:\nfunction factorial(n) {\n  if (n <= 1) return 1; // Base Case\n  return n * factorial(n - 1); // Recursive Call\n}",
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
        "conceptId": "recursion-base-case",
        "type": "cloze",
        "difficulty": "medium",
        "prompt": "A recursive function must have a ___ case to terminate recursion.",
        "options": null,
        "answer": "base",
        "explanation": "Without a base case, recursion continues infinitely causing stack overflow."
      }
    ]
  },
  {
    "id": "example-mech-statics",
    "title": "Intro to Mechanical Engineering: Statics",
    "description": "Free body diagrams, static equilibrium ΣF=0, and torque calculations",
    "emoji": "⚙️",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "static-equilibrium",
        "label": "Static Equilibrium (ΣF = 0, ΣM = 0)",
        "sourceSnippet": "A rigid body is in static equilibrium when the vector sum of all external forces is zero (ΣFx = 0, ΣFy = 0) and the sum of all moments around any pivot point is zero (ΣM = 0).",
        "example": "Worked Engineering Calculation:\nA 10m beam supported at ends with 500 N force applied at 4m from left:\nRight Reaction Force Rb * 10m = 500 N * 4m ⇒ Rb = 200 N, Ra = 300 N.",
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
        "id": "q-statics-1",
        "conceptId": "static-equilibrium",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "What are the two fundamental conditions for static equilibrium of a 2D rigid structure?",
        "options": ["ΣF = 0 and ΣM = 0", "ΣF = ma and ΣM = Iα", "Σv = 0 and Σa = 0", "ΣP = 0 and ΣV = 0"],
        "answer": "ΣF = 0 and ΣM = 0",
        "explanation": "Net force and net moment must both equal zero for static equilibrium."
      }
    ]
  },
  {
    "id": "example-ee-circuits",
    "title": "Intro to Electrical Engineering: Circuits",
    "description": "Ohm's Law, Kirchhoff's voltage and current laws, and resistor networks",
    "emoji": "🔌",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "kirchhoff-laws",
        "label": "Kirchhoff Current (KCL) & Voltage (KVL) Laws",
        "sourceSnippet": "KCL states the sum of currents entering a junction equals currents leaving (ΣI = 0). KVL states the directed sum of electrical potential differences around any closed loop is zero (ΣV = 0).",
        "example": "Circuit Analysis:\nFor a loop with 12V battery and resistors R1 = 4Ω, R2 = 2Ω in series:\nI = V / (R1 + R2) = 12V / 6Ω = 2 Amperes.\nVoltage drop across R1 = 2A * 4Ω = 8V.",
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
        "id": "q-ee-1",
        "conceptId": "kirchhoff-laws",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "Kirchhoff's Current Law (KCL) is a direct consequence of which physical conservation principle?",
        "options": ["Conservation of Charge", "Conservation of Energy", "Conservation of Momentum", "Conservation of Mass"],
        "answer": "Conservation of Charge",
        "explanation": "KCL reflects charge conservation: electric charge cannot accumulate at a node."
      }
    ]
  },
  {
    "id": "example-data-prob",
    "title": "Grade 12 Data Management & Probability",
    "description": "Permutations, combinations, expected value, and normal distributions",
    "emoji": "📊",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "combinations-permutations",
        "label": "Permutations vs Combinations",
        "sourceSnippet": "Permutations nPr = n! / (n-r)! count ordered arrangements. Combinations nCr = n! / (r!(n-r)!) count unordered selections.",
        "example": "Worked Probability Problem:\nChoose 3 students out of 10 for a lab team:\n10C3 = 10! / (3! * 7!) = (10 * 9 * 8) / (3 * 2 * 1) = 120 ways.",
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
        "id": "q-prob-1",
        "conceptId": "combinations-permutations",
        "type": "short",
        "difficulty": "medium",
        "prompt": "Which formula (nPr or nCr) is used when order does NOT matter?",
        "options": null,
        "answer": "nCr",
        "explanation": "Combinations (nCr) count unordered groupings of items."
      }
    ]
  },
  {
    "id": "example-mat-eng",
    "title": "Engineering Design & Materials Science",
    "description": "Stress-strain relationship, Young's Modulus, yield strength, and safety factors",
    "emoji": "🏗️",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "stress-strain",
        "label": "Hooke's Law & Young's Modulus (E)",
        "sourceSnippet": "Tensile stress σ = Force / Area. Tensile strain ε = ΔL / L0. In the elastic region, Hooke's Law states stress is directly proportional to strain: σ = E * ε.",
        "example": "Engineering Calculation:\nSteel rod under 100 MPa stress with E = 200 GPa:\nStrain ε = σ / E = (100 × 10⁶ Pa) / (200 × 10⁹ Pa) = 0.0005 (0.05% elongation).",
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
        "id": "q-mat-1",
        "conceptId": "stress-strain",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "What is the SI unit of stress (σ = Force / Area)?",
        "options": ["Pascal (Pa or N/m²)", "Joule (J)", "Newton (N)", "Dimensionless"],
        "answer": "Pascal (Pa or N/m²)",
        "explanation": "Stress has units of force per unit area, measured in Pascals (N/m²)."
      }
    ]
  }
];