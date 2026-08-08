export const EXAMPLE_DECKS = [
  {
    "id": "mcv4u-calculus-vectors",
    "title": "MCV4U \u2014 Grade 12 Calculus & Vectors",
    "description": "Official Ontario Ministry Curriculum: Rates of change, derivatives, curve sketching, exponential/trig derivatives, 3D vectors, dot/cross products, and planes",
    "emoji": "\ud83d\udcd0",
    "createdAt": "2026-08-08T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "mcv4u-u1-limits",
        "label": "Unit 1: Rates of Change & Limit Laws",
        "sourceSnippet": "The average rate of change measures \u0394y/\u0394x over an interval [a, b]. The instantaneous rate of change is the limit of average rates as \u0394x \u2192 0: lim (h\u21920) [f(a+h) - f(a)] / h, defining the tangent slope.",
        "example": "Worked Calculus Limit:\nEvaluate lim (x\u21923) (x\u00b2 - 9)/(x - 3):\nFactoring: (x - 3)(x + 3)/(x - 3) = x + 3.\nSubstituting x = 3 \u21d2 3 + 3 = 6.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "mcv4u-u2-derivatives",
        "label": "Unit 2: Power, Product, Quotient & Chain Rules",
        "sourceSnippet": "Differentiation rules enable systematic computation: Power Rule d/dx(x\u207f)=n x\u207f\u207b\u00b9, Product Rule (uv)'=u'v+uv', Quotient Rule (u/v)'=(u'v-uv')/v\u00b2, and Chain Rule d/dx[f(g(x))]=f'(g(x))g'(x).",
        "example": "Worked Derivative Problem:\nFind d/dx [(2x\u00b3 - 5)\u2074]:\nLet u = 2x\u00b3 - 5. d/dx = 4(2x\u00b3 - 5)\u00b3 \u00b7 (6x\u00b2) = 24x\u00b2(2x\u00b3 - 5)\u00b3.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "mcv4u-u3-optimization",
        "label": "Unit 3: Curve Sketching & Optimization",
        "sourceSnippet": "Critical points occur where f'(x)=0 or undefined. The first derivative test identifies local extrema. The second derivative f''(x) determines concavity (f''>0 concave up, f''<0 concave down) and inflection points.",
        "example": "Optimization Example:\nMaximize box volume V = x(20 - 2x)\u00b2:\ndV/dx = (20 - 2x)\u00b2 + 2x(20 - 2x)(-2) = 0 \u21d2 4x\u00b2 - 80x + 400 - 80x + 8x\u00b2 = 12x\u00b2 - 160x + 400 = 0 \u21d2 x = 10/3 cm.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "mcv4u-u4-transcendental",
        "label": "Unit 4: Exponential, Logarithmic & Trig Derivatives",
        "sourceSnippet": "Special derivatives: d/dx(e\u02e3) = e\u02e3, d/dx(a\u02e3) = a\u02e3 ln(a), d/dx(ln x) = 1/x, d/dx(sin x) = cos x, d/dx(cos x) = -sin x, d/dx(tan x) = sec\u00b2 x.",
        "example": "Trig & Exponential Derivative:\nFind d/dx [e\u00b2\u02e3 sin(3x)]:\n= 2e\u00b2\u02e3 sin(3x) + e\u00b2\u02e3 (3 cos(3x)) = e\u00b2\u02e3 [2 sin(3x) + 3 cos(3x)].",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "mcv4u-u5-vectors-intro",
        "label": "Unit 5: 2D & 3D Vectors & Representation",
        "sourceSnippet": "A vector possesses both magnitude and direction. In 3D Cartesian coordinates, vector v = [vx, vy, vz] has magnitude |v| = \u221a(vx\u00b2 + vy\u00b2 + vz\u00b2). Unit vectors i, j, k define the standard basis.",
        "example": "Vector Magnitude Calculation:\nFor u = [3, -4, 12]:\n|u| = \u221a(3\u00b2 + (-4)\u00b2 + 12\u00b2) = \u221a(9 + 16 + 144) = \u221a169 = 13 units.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "mcv4u-u6-dot-cross",
        "label": "Unit 6: Dot Product & Cross Product",
        "sourceSnippet": "Dot product u \u00b7 v = |u||v|cos \u03b8 = ux vx + uy vy + uz vz (scalar, used for work W=F\u00b7d). Cross product u \u00d7 v produces a vector perpendicular to both, with magnitude |u||v|sin \u03b8 (used for torque \u03c4=r\u00d7F).",
        "example": "Cross Product Calculation:\nIf A = [1, 2, 3] and B = [4, 5, 6]:\nA \u00d7 B = [(2\u00b76 - 3\u00b75), (3\u00b74 - 1\u00b76), (1\u00b75 - 2\u00b74)] = [-3, 6, -3].",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "mcv4u-u7-lines-planes",
        "label": "Unit 7: Equations of Lines & Planes in 3D",
        "sourceSnippet": "A 3D line is defined by vector equation r = r0 + t m. A 3D plane is defined by normal vector n = [A, B, C] giving Cartesian equation Ax + By + Cz + D = 0.",
        "example": "Plane Equation Calculation:\nFind plane equation passing through P(1, 2, 3) with normal n = [2, -1, 4]:\n2(x - 1) - 1(y - 2) + 4(z - 3) = 0 \u21d2 2x - y + 4z - 12 = 0.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      }
    ],
    "questions": [
      {
        "id": "q-mcv-1",
        "conceptId": "mcv4u-u1-limits",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "What does the limit of the secant line slopes as \u0394x \u2192 0 represent?",
        "options": [
          "Tangent line slope (instantaneous rate of change)",
          "Average rate of change",
          "Y-intercept",
          "Integral area"
        ],
        "answer": "Tangent line slope (instantaneous rate of change)",
        "explanation": "The limit of secant slopes defines the derivative and instantaneous rate of change."
      },
      {
        "id": "q-mcv-2",
        "conceptId": "mcv4u-u2-derivatives",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "What is the derivative of f(x) = x\u2075 using the Power Rule?",
        "options": [
          "5x\u2074",
          "x\u2074",
          "5x\u2075",
          "4x\u2074"
        ],
        "answer": "5x\u2074",
        "explanation": "d/dx(x\u207f) = n\u00b7x\u207f\u207b\u00b9 \u21d2 d/dx(x\u2075) = 5x\u2074."
      },
      {
        "id": "q-mcv-3",
        "conceptId": "mcv4u-u3-optimization",
        "type": "cloze",
        "difficulty": "medium",
        "prompt": "Points on a curve where f'(x) = 0 or f'(x) is undefined are called ___ points.",
        "options": null,
        "answer": "critical",
        "explanation": "Critical points mark potential local maxima, minima, or stationary points."
      },
      {
        "id": "q-mcv-4",
        "conceptId": "mcv4u-u6-dot-cross",
        "type": "short",
        "difficulty": "hard",
        "prompt": "If two non-zero vectors A and B have dot product A \u00b7 B = 0, what is the angle between them?",
        "options": null,
        "answer": "90 degrees",
        "explanation": "Since A \u00b7 B = |A||B| cos \u03b8 = 0, cos \u03b8 = 0 \u21d2 \u03b8 = 90\u00b0 (perpendicular/orthogonal)."
      }
    ]
  },
  {
    "id": "sph4u-physics-12",
    "title": "SPH4U \u2014 Grade 12 Physics",
    "description": "Official Ontario Ministry Curriculum: 2D Kinematics & Dynamics, Circular Motion & Universal Gravitation, Energy & Momentum, Electricity & Magnetism, and Light & Quantum Physics",
    "emoji": "\ud83d\ude80",
    "createdAt": "2026-08-08T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "sph4u-u1-kinematics",
        "label": "Unit 1: 2D Motion & Newton's Laws of Dynamics",
        "sourceSnippet": "2D motion resolves into orthogonal components. Newton's 2nd Law \u03a3F = m a governs acceleration. Static friction Fs \u2264 \u03bcs FN and kinetic friction Fk = \u03bck FN act parallel to contact surfaces.",
        "example": "Inclined Plane Calculation:\nA 10 kg box on a 30\u00b0 frictionless incline:\nParallel gravity force Fg,|| = m\u00b7g\u00b7sin(30\u00b0) = 10 \u00b7 9.81 \u00b7 0.5 = 49.05 N.\nAcceleration a = F / m = 49.05 / 10 = 4.905 m/s\u00b2.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "sph4u-u2-gravitation",
        "label": "Unit 2: Centripetal Acceleration & Gravitation",
        "sourceSnippet": "Uniform circular motion requires centripetal acceleration ac = v\u00b2/r = \u03c9\u00b2r directed toward the center. Newton's Law of Universal Gravitation Fg = G(m1 m2)/r\u00b2 governs orbital mechanics.",
        "example": "Satellite Speed Calculation:\nv = \u221a(G M / r). For Earth orbit at r = 7.0 \u00d7 10\u2076 m:\nv = \u221a((6.674 \u00d7 10\u207b\u00b9\u00b9 \u00b7 5.972 \u00d7 10\u00b2\u2074) / 7.0 \u00d7 10\u2076) = 7546 m/s.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "sph4u-u3-momentum",
        "label": "Unit 3: Energy, Work & Collisions",
        "sourceSnippet": "Work W = F d cos \u03b8. Kinetic energy Ek = \u00bdmv\u00b2 and gravitational potential Eg = mgh. Total mechanical energy is conserved in isolated systems. Linear momentum p = mv is conserved during all collisions (J = \u0394p = F \u0394t).",
        "example": "1D Inelastic Collision Problem:\nCar A (1000 kg at 20 m/s) hits stationary Car B (1500 kg) and stick together:\np_initial = 1000 \u00b7 20 + 0 = 20000 kg\u00b7m/s.\nv_final = 20000 / (1000 + 1500) = 8.0 m/s.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "sph4u-u4-fields",
        "label": "Unit 4: Electric & Magnetic Fields",
        "sourceSnippet": "Coulomb's Law Fe = k|q1 q2|/r\u00b2. Electric field intensity E = Fe/q. A charge q moving at velocity v through magnetic field B experiences Lorentz Force F = q(v \u00d7 B) with magnitude F = q v B sin \u03b8.",
        "example": "Lorentz Force Calculation:\nElectron (q = 1.6 \u00d7 10\u207b\u00b9\u2079 C) moving at 2 \u00d7 10\u2076 m/s perpendicular to 0.4 T magnetic field:\nF = 1.6 \u00d7 10\u207b\u00b9\u2079 \u00b7 2 \u00d7 10\u2076 \u00b7 0.4 = 1.28 \u00d7 10\u207b\u00b9\u00b3 N.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "sph4u-u5-quantum",
        "label": "Unit 5: Wave Nature of Light & Modern Physics",
        "sourceSnippet": "Young's double-slit experiment demonstrates wave interference: m \u03bb = d sin \u03b8. Photoelectric effect proves light particle nature with photon energy E = h f. Einstein's special relativity gives E = mc\u00b2 and time dilation t = t0 / \u221a(1 - v\u00b2/c\u00b2).",
        "example": "Photon Energy Calculation:\nFind energy of blue photon with frequency f = 6.0 \u00d7 10\u00b9\u2074 Hz:\nE = h f = (6.626 \u00d7 10\u207b\u00b3\u2074 J\u00b7s) \u00b7 (6.0 \u00d7 10\u00b9\u2074 s\u207b\u00b9) = 3.976 \u00d7 10\u207b\u00b9\u2079 Joules.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      }
    ],
    "questions": [
      {
        "id": "q-sph-1",
        "conceptId": "sph4u-u2-gravitation",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "Towards where is the centripetal acceleration vector directed in uniform circular motion?",
        "options": [
          "Towards the center of the circle",
          "Tangential to the path",
          "Outward away from center",
          "Opposite to velocity"
        ],
        "answer": "Towards the center of the circle",
        "explanation": "Centripetal acceleration points directly inward toward the center of the circular path."
      },
      {
        "id": "q-sph-2",
        "conceptId": "sph4u-u3-momentum",
        "type": "cloze",
        "difficulty": "medium",
        "prompt": "Impulse is defined as the change in ___ of an object.",
        "options": null,
        "answer": "momentum",
        "explanation": "Impulse J = F \u0394t = \u0394p (change in momentum)."
      }
    ]
  },
  {
    "id": "sch4u-chemistry-12",
    "title": "SCH4U \u2014 Grade 12 Chemistry",
    "description": "Official Ontario Ministry Curriculum: Organic Chemistry, Structure & Properties of Matter, Energy Changes & Rates of Reaction, Chemical Systems & Equilibrium, and Electrochemistry",
    "emoji": "\ud83e\uddea",
    "createdAt": "2026-08-08T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "sch4u-u1-organic",
        "label": "Unit 1: Organic Chemistry & Functional Groups",
        "sourceSnippet": "Organic compounds contain carbon backbones. Key functional groups include alcohols (-OH), aldehydes (-CHO), ketones (-CO-), carboxylic acids (-COOH), esters (-COO-), and amines (-NH2). Polymerization joins monomers via condensation or addition reactions.",
        "example": "Esterification Reaction:\nCarboxylic Acid + Alcohol \u21cc Ester + Water\nEthanoic acid + Ethanol \u21cc Ethyl ethanoate + H\u2082O.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "sch4u-u2-structure",
        "label": "Unit 2: Quantum Model, Bonding & VSEPR",
        "sourceSnippet": "Electrons inhabit atomic orbitals defined by quantum numbers (n, l, ml, ms). VSEPR theory predicts 3D molecular shapes based on electron pair repulsion around the central atom, determining molecular polarity and intermolecular forces.",
        "example": "VSEPR Shape Analysis:\nWater (H\u2082O) has 2 bonding pairs and 2 lone pairs around Oxygen:\nElectron Geometry = Tetrahedral, Molecular Geometry = Bent (104.5\u00b0 angle).",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "sch4u-u3-thermochemistry",
        "label": "Unit 3: Thermochemistry, Enthalpy & Kinetics",
        "sourceSnippet": "Enthalpy change \u0394H measures heat absorbed or released at constant pressure. Hess's Law states total \u0394H is independent of path. Rate laws Rate = k[A]\u1d50[B]\u207f quantify kinetics, where catalyst lowers activation energy Ea.",
        "example": "Hess's Law Calculation:\nTarget: C(s) + O\u2082(g) \u2192 CO\u2082(g)\nReaction 1: C(s) + \u00bdO\u2082(g) \u2192 CO(g)  \u0394H1 = -110.5 kJ\nReaction 2: CO(g) + \u00bdO\u2082(g) \u2192 CO\u2082(g) \u0394H2 = -283.0 kJ\nTotal \u0394H = \u0394H1 + \u0394H2 = -393.5 kJ.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "sch4u-u4-equilibrium",
        "label": "Unit 4: Chemical Equilibrium & Le Chatelier",
        "sourceSnippet": "Equilibrium constant Kc = [Products]/[Reactants] at equilibrium. Le Chatelier's principle states a system under stress shifts to relieve stress. Acid-base equilibrium relies on Ka, Kb, and pH = -log[H+].",
        "example": "Equilibrium Constant Calculation:\nFor N\u2082 + 3H\u2082 \u21cc 2NH\u2083 at equilibrium:\n[N\u2082]=0.1M, [H\u2082]=0.2M, [NH\u2083]=0.4M:\nKc = [NH\u2083]\u00b2 / ([N\u2082][H\u2082]\u00b3) = (0.4)\u00b2 / (0.1 \u00b7 0.2\u00b3) = 0.16 / 0.0008 = 200.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "sch4u-u5-electrochemistry",
        "label": "Unit 5: Electrochemistry & Galvanic Cells",
        "sourceSnippet": "Redox involves electron transfer: Oxidation Is Loss (OIL), Reduction Is Gain (RIG). Galvanic/voltaic cells generate electricity spontaneously (E\u00b0cell = E\u00b0cathode - E\u00b0anode > 0). Electrolysis uses external voltage to drive non-spontaneous reactions.",
        "example": "Standard Cell Potential:\nZn(s) | Zn\u00b2\u207a(aq) || Cu\u00b2\u207a(aq) | Cu(s)\nE\u00b0cathode (Cu\u00b2\u207a/Cu) = +0.34 V\nE\u00b0anode (Zn\u00b2\u207a/Zn) = -0.76 V\nE\u00b0cell = 0.34 - (-0.76) = +1.10 Volts.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      }
    ],
    "questions": [
      {
        "id": "q-sch-1",
        "conceptId": "sch4u-u1-organic",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "Which functional group contains a carbon double-bonded to oxygen and single-bonded to an -OH group (-COOH)?",
        "options": [
          "Carboxylic Acid",
          "Alcohol",
          "Aldehyde",
          "Ester"
        ],
        "answer": "Carboxylic Acid",
        "explanation": "Carboxylic acids feature the carboxyl functional group (-COOH)."
      },
      {
        "id": "q-sch-2",
        "conceptId": "sch4u-u5-electrochemistry",
        "type": "short",
        "difficulty": "medium",
        "prompt": "At which electrode does oxidation always occur in both galvanic and electrolytic cells?",
        "options": null,
        "answer": "Anode",
        "explanation": "Anode is always the site of oxidation (An Ox, Red Cat)."
      }
    ]
  },
  {
    "id": "sbi4u-biology-12",
    "title": "SBI4U \u2014 Grade 12 Biology",
    "description": "Official Ontario Ministry Curriculum: Biochemistry, Metabolic Processes (Respiration & Photosynthesis), Molecular Genetics, Homeostasis, and Population Dynamics",
    "emoji": "\ud83e\uddec",
    "createdAt": "2026-08-08T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "sbi4u-u1-biochem",
        "label": "Unit 1: Biochemistry & Enzyme Kinetics",
        "sourceSnippet": "Biological macromolecules (carbohydrates, lipids, proteins, nucleic acids) form via condensation reactions. Enzymes act as biological catalysts, lowering activation energy. Inhibitors (competitive vs non-competitive) regulate enzyme activity.",
        "example": "Enzyme Kinetics Principle:\nCompetitive inhibitors bind directly to the active site, increasing Km without changing Vmax.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "sbi4u-u2-respiration",
        "label": "Unit 2: Cellular Respiration & Photosynthesis",
        "sourceSnippet": "Cellular respiration converts glucose into ATP: Glycolysis (cytosol), Pyruvate Oxidation, Krebs Cycle (mitochondrial matrix), and Oxidative Phosphorylation (inner membrane ETC). Photosynthesis couples Light Reactions (thylakoid) with Calvin Cycle (stroma).",
        "example": "ATP Yield Balance Sheet:\n1 Molecule Glucose (C\u2086H\u2081\u2082O\u2086) + 6 O\u2082 \u2192 6 CO\u2082 + 6 H\u2082O + ~30-32 ATP energy equivalents.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "sbi4u-u3-genetics",
        "label": "Unit 3: Molecular Genetics & Gene Expression",
        "sourceSnippet": "DNA replication is semiconservative (Helicase, DNA Polymerase III/I, Ligase). Central Dogma: DNA \u2192 (Transcription via RNA Polymerase) \u2192 mRNA \u2192 (Translation at Ribosome) \u2192 Protein. Gene regulation occurs via operons (e.g., lac operon).",
        "example": "Transcription & Translation Sequence:\nDNA Code: 5'-TAC GGC TTA-3'\nmRNA Codons: 3'-AUG CCG AAU-5'\nAmino Acid Translation: Met - Pro - Asn.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "sbi4u-u4-homeostasis",
        "label": "Unit 4: Nervous System & Homeostasis",
        "sourceSnippet": "Homeostasis maintains internal stability via negative feedback loops. Neurons transmit action potentials via Na+/K+ voltage-gated channels. The nephron in kidneys filters blood and regulates water balance via ADH.",
        "example": "Action Potential Voltage Steps:\nResting Potential (-70mV) \u2192 Depolarization (Na+ influx to +40mV) \u2192 Repolarization (K+ efflux) \u2192 Hyperpolarization.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "sbi4u-u5-populations",
        "label": "Unit 5: Population Dynamics & Ecology",
        "sourceSnippet": "Population growth models include exponential growth dN/dt = r N and logistic growth dN/dt = r N ((K - N)/K), where K represents carrying capacity. Density-dependent factors (competition, disease) regulate population size.",
        "example": "Logistic Growth Calculation:\nIf K = 1000 and N = 500, environmental resistance factor (K-N)/K = 0.5 (growth at 50% max speed).",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      }
    ],
    "questions": [
      {
        "id": "q-sbi-1",
        "conceptId": "sbi4u-u2-respiration",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "Where in the eukaryotic cell does glycolysis take place?",
        "options": [
          "Cytosol (Cytoplasm)",
          "Mitochondrial Matrix",
          "Inner Mitochondrial Membrane",
          "Stroma"
        ],
        "answer": "Cytosol (Cytoplasm)",
        "explanation": "Glycolysis occurs in the cytosol without requiring oxygen."
      },
      {
        "id": "q-sbi-2",
        "conceptId": "sbi4u-u3-genetics",
        "type": "cloze",
        "difficulty": "medium",
        "prompt": "The process of synthesizing mRNA from a DNA template is called ___.",
        "options": null,
        "answer": "transcription",
        "explanation": "RNA Polymerase synthesizes mRNA during transcription."
      }
    ]
  },
  {
    "id": "ics4u-cs-12",
    "title": "ICS4U \u2014 Grade 12 Computer Science",
    "description": "Official Ontario Ministry Curriculum: Advanced OOP, Recursion, Sorting/Searching Algorithms, Linear/Non-linear Data Structures, and System Architecture",
    "emoji": "\ud83d\udcbb",
    "createdAt": "2026-08-08T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "ics4u-u1-oop",
        "label": "Unit 1: Object-Oriented System Architecture",
        "sourceSnippet": "OOP core pillars: Encapsulation (private fields, getters/setters), Inheritance (extends superclass), Polymorphism (method overriding/overloading), and Abstraction (abstract classes & interfaces).",
        "example": "Polymorphism Code Snippet:\nclass Shape { draw() {} }\nclass Circle extends Shape { draw() { console.log('O'); } }\nShape s = new Circle(); s.draw(); // Calls Circle's draw()",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "ics4u-u2-recursion",
        "label": "Unit 2: Recursion & Call Stack Analysis",
        "sourceSnippet": "Recursive functions break problems into smaller subproblems by calling themselves. Every recursive function requires a base case to halt recursion and unwind the execution call stack.",
        "example": "Recursive Fibonacci Function:\nfunction fib(n) {\n  if (n <= 1) return n; // Base Cases\n  return fib(n - 1) + fib(n - 2);\n}",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "ics4u-u3-algorithms",
        "label": "Unit 3: Sorting Algorithms & Big-O Complexity",
        "sourceSnippet": "Algorithmic complexity evaluates performance. Quadratic algorithms O(N\u00b2): Bubble, Selection, Insertion Sort. Logarithmic / Linearithmic O(N log N): Merge Sort, Quick Sort. Binary Search requires sorted arrays O(log N).",
        "example": "Big-O Comparison:\nSearching 1,000,000 items:\nLinear Search O(N) = 1,000,000 operations.\nBinary Search O(log\u2082 N) \u2248 20 operations!",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "ics4u-u4-datastructures",
        "label": "Unit 4: Dynamic Data Structures (Lists, Stacks, Queues, BST)",
        "sourceSnippet": "Abstract Data Types (ADTs): Linked Lists store nodes with data and pointers. Stacks use LIFO (Last-In-First-Out, push/pop). Queues use FIFO (First-In-First-Out, enqueue/dequeue). Binary Search Trees (BST) organize data for O(log N) operations.",
        "example": "Stack LIFO Example:\npush(10) -> push(20) -> pop() returns 20.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      }
    ],
    "questions": [
      {
        "id": "q-ics-1",
        "conceptId": "ics4u-u3-algorithms",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "What is the average time complexity of Merge Sort?",
        "options": [
          "O(N log N)",
          "O(N\u00b2)",
          "O(N)",
          "O(1)"
        ],
        "answer": "O(N log N)",
        "explanation": "Merge Sort uses divide-and-conquer to achieve O(N log N) in all cases."
      },
      {
        "id": "q-ics-2",
        "conceptId": "ics4u-u4-datastructures",
        "type": "short",
        "difficulty": "medium",
        "prompt": "Which data structure operates on a LIFO (Last-In, First-Out) principle?",
        "options": null,
        "answer": "Stack",
        "explanation": "Stacks store and retrieve elements in LIFO order."
      }
    ]
  },
  {
    "id": "mhf4u-functions-12",
    "title": "MHF4U \u2014 Grade 12 Advanced Functions",
    "description": "Official Ontario Ministry Curriculum: Polynomial & Rational Functions, Trigonometry, Exponential & Logarithmic Functions, and Function Transformations",
    "emoji": "\ud83d\udcc8",
    "createdAt": "2026-08-08T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "mhf4u-u1-polynomials",
        "label": "Unit 1: Polynomial Functions & Remainder Theorem",
        "sourceSnippet": "Polynomial functions f(x) = an x\u207f + ... + a0 have smooth curves. The Remainder Theorem states f(a) is the remainder when f(x) is divided by (x - a). If f(a) = 0, (x - a) is a factor.",
        "example": "Factor Theorem Problem:\nTest if (x - 2) is a factor of f(x) = x\u00b3 - 3x\u00b2 + 4:\nf(2) = (2)\u00b3 - 3(2)\u00b2 + 4 = 8 - 12 + 4 = 0 \u21d2 (x - 2) IS a factor!",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "mhf4u-u2-rationals",
        "label": "Unit 2: Rational Functions & Asymptotes",
        "sourceSnippet": "Rational functions f(x) = P(x)/Q(x) have vertical asymptotes where Q(x) = 0. Horizontal asymptotes depend on polynomial degrees: if deg(P) < deg(Q), y = 0; if deg(P) = deg(Q), y = leading coeff ratio.",
        "example": "Asymptote Analysis:\nFor f(x) = (3x\u00b2 + 2) / (x\u00b2 - 4):\nVertical Asymptotes at x\u00b2 - 4 = 0 \u21d2 x = 2 and x = -2.\nHorizontal Asymptote at y = 3/1 = 3.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "mhf4u-u3-trig",
        "label": "Unit 3: Trigonometric Ratios, Radians & Identities",
        "sourceSnippet": "Angles measured in radians: 2\u03c0 rad = 360\u00b0. Compound angle identities: sin(A \u00b1 B) = sin A cos B \u00b1 cos A sin B. Double angle identity: cos(2A) = cos\u00b2 A - sin\u00b2 A = 2cos\u00b2 A - 1.",
        "example": "Double Angle Calculation:\nIf sin \u03b8 = 3/5 in Quadrant I (cos \u03b8 = 4/5):\nsin(2\u03b8) = 2 sin \u03b8 cos \u03b8 = 2 \u00b7 (3/5) \u00b7 (4/5) = 24/25 = 0.96.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      }
    ],
    "questions": [
      {
        "id": "q-mhf-1",
        "conceptId": "mhf4u-u1-polynomials",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "If f(3) = 0 for a polynomial f(x), what binomial must be a factor of f(x)?",
        "options": [
          "(x - 3)",
          "(x + 3)",
          "3x",
          "(x - 0)"
        ],
        "answer": "(x - 3)",
        "explanation": "By the Factor Theorem, if f(a) = 0, then (x - a) is a factor."
      }
    ]
  },
  {
    "id": "mdm4u-data-management-12",
    "title": "MDM4U \u2014 Grade 12 Data Management",
    "description": "Official Ontario Ministry Curriculum: Counting Principles, Permutations & Combinations, Probability Distributions, and Statistics",
    "emoji": "\ud83d\udcca",
    "createdAt": "2026-08-08T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "mdm4u-u1-counting",
        "label": "Unit 1: Permutations & Combinations",
        "sourceSnippet": "Permutations nPr = n!/(n-r)! count ordered arrangements. Combinations nCr = n!/(r!(n-r)!) count unordered selections. Pascal's Triangle gives binomial coefficients.",
        "example": "Combination Selection:\nSelect 4 committee members out of 9 candidates:\n9C4 = 9! / (4! \u00b7 5!) = (9 \u00b7 8 \u00b7 7 \u00b7 6) / (4 \u00b7 3 \u00b7 2 \u00b7 1) = 126 ways.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      },
      {
        "id": "mdm4u-u2-distributions",
        "label": "Unit 2: Probability & Normal Distribution",
        "sourceSnippet": "Expected value E(X) = \u03a3 x P(x). Normal distribution N(\u03bc, \u03c3\u00b2) follows a bell curve where z = (x - \u03bc)/\u03c3 measures standard deviations from the mean.",
        "example": "Z-Score Calculation:\nFor mean \u03bc = 70, standard deviation \u03c3 = 10, find z-score for score x = 85:\nz = (85 - 70) / 10 = +1.5.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-08T12:00:00.000Z",
        "history": []
      }
    ],
    "questions": [
      {
        "id": "q-mdm-1",
        "conceptId": "mdm4u-u1-counting",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "Which formula (nPr or nCr) is used when the selection order does NOT matter?",
        "options": [
          "nCr (Combinations)",
          "nPr (Permutations)",
          "n! (Factorials)",
          "P(A|B)"
        ],
        "answer": "nCr (Combinations)",
        "explanation": "Combinations count unordered groups of items."
      }
    ]
  }
];
