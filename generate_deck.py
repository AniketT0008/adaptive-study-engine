import json

def build_ontario_curriculum():
    decks = [
        {
            "id": "mcv4u-calculus-vectors",
            "title": "MCV4U — Grade 12 Calculus & Vectors",
            "description": "Official Ontario Ministry Curriculum: Rates of change, derivatives, curve sketching, exponential/trig derivatives, 3D vectors, dot/cross products, and planes",
            "emoji": "📐",
            "createdAt": "2026-08-08T12:00:00.000Z",
            "streak": 0,
            "longestStreak": 0,
            "sessionLogs": [],
            "concepts": [
                {
                    "id": "mcv4u-u1-limits",
                    "label": "Unit 1: Rates of Change & Limit Laws",
                    "sourceSnippet": "The average rate of change measures Δy/Δx over an interval [a, b]. The instantaneous rate of change is the limit of average rates as Δx → 0: lim (h→0) [f(a+h) - f(a)] / h, defining the tangent slope.",
                    "example": "Worked Calculus Limit:\nEvaluate lim (x→3) (x² - 9)/(x - 3):\nFactoring: (x - 3)(x + 3)/(x - 3) = x + 3.\nSubstituting x = 3 ⇒ 3 + 3 = 6.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "mcv4u-u2-derivatives",
                    "label": "Unit 2: Power, Product, Quotient & Chain Rules",
                    "sourceSnippet": "Differentiation rules enable systematic computation: Power Rule d/dx(xⁿ)=n xⁿ⁻¹, Product Rule (uv)'=u'v+uv', Quotient Rule (u/v)'=(u'v-uv')/v², and Chain Rule d/dx[f(g(x))]=f'(g(x))g'(x).",
                    "example": "Worked Derivative Problem:\nFind d/dx [(2x³ - 5)⁴]:\nLet u = 2x³ - 5. d/dx = 4(2x³ - 5)³ · (6x²) = 24x²(2x³ - 5)³.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "mcv4u-u3-optimization",
                    "label": "Unit 3: Curve Sketching & Optimization",
                    "sourceSnippet": "Critical points occur where f'(x)=0 or undefined. The first derivative test identifies local extrema. The second derivative f''(x) determines concavity (f''>0 concave up, f''<0 concave down) and inflection points.",
                    "example": "Optimization Example:\nMaximize box volume V = x(20 - 2x)²:\ndV/dx = (20 - 2x)² + 2x(20 - 2x)(-2) = 0 ⇒ 4x² - 80x + 400 - 80x + 8x² = 12x² - 160x + 400 = 0 ⇒ x = 10/3 cm.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "mcv4u-u4-transcendental",
                    "label": "Unit 4: Exponential, Logarithmic & Trig Derivatives",
                    "sourceSnippet": "Special derivatives: d/dx(eˣ) = eˣ, d/dx(aˣ) = aˣ ln(a), d/dx(ln x) = 1/x, d/dx(sin x) = cos x, d/dx(cos x) = -sin x, d/dx(tan x) = sec² x.",
                    "example": "Trig & Exponential Derivative:\nFind d/dx [e²ˣ sin(3x)]:\n= 2e²ˣ sin(3x) + e²ˣ (3 cos(3x)) = e²ˣ [2 sin(3x) + 3 cos(3x)].",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "mcv4u-u5-vectors-intro",
                    "label": "Unit 5: 2D & 3D Vectors & Representation",
                    "sourceSnippet": "A vector possesses both magnitude and direction. In 3D Cartesian coordinates, vector v = [vx, vy, vz] has magnitude |v| = √(vx² + vy² + vz²). Unit vectors i, j, k define the standard basis.",
                    "example": "Vector Magnitude Calculation:\nFor u = [3, -4, 12]:\n|u| = √(3² + (-4)² + 12²) = √(9 + 16 + 144) = √169 = 13 units.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "mcv4u-u6-dot-cross",
                    "label": "Unit 6: Dot Product & Cross Product",
                    "sourceSnippet": "Dot product u · v = |u||v|cos θ = ux vx + uy vy + uz vz (scalar, used for work W=F·d). Cross product u × v produces a vector perpendicular to both, with magnitude |u||v|sin θ (used for torque τ=r×F).",
                    "example": "Cross Product Calculation:\nIf A = [1, 2, 3] and B = [4, 5, 6]:\nA × B = [(2·6 - 3·5), (3·4 - 1·6), (1·5 - 2·4)] = [-3, 6, -3].",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "mcv4u-u7-lines-planes",
                    "label": "Unit 7: Equations of Lines & Planes in 3D",
                    "sourceSnippet": "A 3D line is defined by vector equation r = r0 + t m. A 3D plane is defined by normal vector n = [A, B, C] giving Cartesian equation Ax + By + Cz + D = 0.",
                    "example": "Plane Equation Calculation:\nFind plane equation passing through P(1, 2, 3) with normal n = [2, -1, 4]:\n2(x - 1) - 1(y - 2) + 4(z - 3) = 0 ⇒ 2x - y + 4z - 12 = 0.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                }
            ],
            "questions": [
                {
                    "id": "q-mcv-1", "conceptId": "mcv4u-u1-limits", "type": "mcq", "difficulty": "easy",
                    "prompt": "What does the limit of the secant line slopes as Δx → 0 represent?",
                    "options": ["Tangent line slope (instantaneous rate of change)", "Average rate of change", "Y-intercept", "Integral area"],
                    "answer": "Tangent line slope (instantaneous rate of change)",
                    "explanation": "The limit of secant slopes defines the derivative and instantaneous rate of change."
                },
                {
                    "id": "q-mcv-2", "conceptId": "mcv4u-u2-derivatives", "type": "mcq", "difficulty": "easy",
                    "prompt": "What is the derivative of f(x) = x⁵ using the Power Rule?",
                    "options": ["5x⁴", "x⁴", "5x⁵", "4x⁴"],
                    "answer": "5x⁴",
                    "explanation": "d/dx(xⁿ) = n·xⁿ⁻¹ ⇒ d/dx(x⁵) = 5x⁴."
                },
                {
                    "id": "q-mcv-3", "conceptId": "mcv4u-u3-optimization", "type": "cloze", "difficulty": "medium",
                    "prompt": "Points on a curve where f'(x) = 0 or f'(x) is undefined are called ___ points.",
                    "options": None, "answer": "critical",
                    "explanation": "Critical points mark potential local maxima, minima, or stationary points."
                },
                {
                    "id": "q-mcv-4", "conceptId": "mcv4u-u6-dot-cross", "type": "short", "difficulty": "hard",
                    "prompt": "If two non-zero vectors A and B have dot product A · B = 0, what is the angle between them?",
                    "options": None, "answer": "90 degrees",
                    "explanation": "Since A · B = |A||B| cos θ = 0, cos θ = 0 ⇒ θ = 90° (perpendicular/orthogonal)."
                }
            ]
        },
        {
            "id": "sph4u-physics-12",
            "title": "SPH4U — Grade 12 Physics",
            "description": "Official Ontario Ministry Curriculum: 2D Kinematics & Dynamics, Circular Motion & Universal Gravitation, Energy & Momentum, Electricity & Magnetism, and Light & Quantum Physics",
            "emoji": "🚀",
            "createdAt": "2026-08-08T12:00:00.000Z",
            "streak": 0,
            "longestStreak": 0,
            "sessionLogs": [],
            "concepts": [
                {
                    "id": "sph4u-u1-kinematics",
                    "label": "Unit 1: 2D Motion & Newton's Laws of Dynamics",
                    "sourceSnippet": "2D motion resolves into orthogonal components. Newton's 2nd Law ΣF = m a governs acceleration. Static friction Fs ≤ μs FN and kinetic friction Fk = μk FN act parallel to contact surfaces.",
                    "example": "Inclined Plane Calculation:\nA 10 kg box on a 30° frictionless incline:\nParallel gravity force Fg,|| = m·g·sin(30°) = 10 · 9.81 · 0.5 = 49.05 N.\nAcceleration a = F / m = 49.05 / 10 = 4.905 m/s².",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "sph4u-u2-gravitation",
                    "label": "Unit 2: Centripetal Acceleration & Gravitation",
                    "sourceSnippet": "Uniform circular motion requires centripetal acceleration ac = v²/r = ω²r directed toward the center. Newton's Law of Universal Gravitation Fg = G(m1 m2)/r² governs orbital mechanics.",
                    "example": "Satellite Speed Calculation:\nv = √(G M / r). For Earth orbit at r = 7.0 × 10⁶ m:\nv = √((6.674 × 10⁻¹¹ · 5.972 × 10²⁴) / 7.0 × 10⁶) = 7546 m/s.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "sph4u-u3-momentum",
                    "label": "Unit 3: Energy, Work & Collisions",
                    "sourceSnippet": "Work W = F d cos θ. Kinetic energy Ek = ½mv² and gravitational potential Eg = mgh. Total mechanical energy is conserved in isolated systems. Linear momentum p = mv is conserved during all collisions (J = Δp = F Δt).",
                    "example": "1D Inelastic Collision Problem:\nCar A (1000 kg at 20 m/s) hits stationary Car B (1500 kg) and stick together:\np_initial = 1000 · 20 + 0 = 20000 kg·m/s.\nv_final = 20000 / (1000 + 1500) = 8.0 m/s.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "sph4u-u4-fields",
                    "label": "Unit 4: Electric & Magnetic Fields",
                    "sourceSnippet": "Coulomb's Law Fe = k|q1 q2|/r². Electric field intensity E = Fe/q. A charge q moving at velocity v through magnetic field B experiences Lorentz Force F = q(v × B) with magnitude F = q v B sin θ.",
                    "example": "Lorentz Force Calculation:\nElectron (q = 1.6 × 10⁻¹⁹ C) moving at 2 × 10⁶ m/s perpendicular to 0.4 T magnetic field:\nF = 1.6 × 10⁻¹⁹ · 2 × 10⁶ · 0.4 = 1.28 × 10⁻¹³ N.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "sph4u-u5-quantum",
                    "label": "Unit 5: Wave Nature of Light & Modern Physics",
                    "sourceSnippet": "Young's double-slit experiment demonstrates wave interference: m λ = d sin θ. Photoelectric effect proves light particle nature with photon energy E = h f. Einstein's special relativity gives E = mc² and time dilation t = t0 / √(1 - v²/c²).",
                    "example": "Photon Energy Calculation:\nFind energy of blue photon with frequency f = 6.0 × 10¹⁴ Hz:\nE = h f = (6.626 × 10⁻³⁴ J·s) · (6.0 × 10¹⁴ s⁻¹) = 3.976 × 10⁻¹⁹ Joules.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                }
            ],
            "questions": [
                {
                    "id": "q-sph-1", "conceptId": "sph4u-u2-gravitation", "type": "mcq", "difficulty": "easy",
                    "prompt": "Towards where is the centripetal acceleration vector directed in uniform circular motion?",
                    "options": ["Towards the center of the circle", "Tangential to the path", "Outward away from center", "Opposite to velocity"],
                    "answer": "Towards the center of the circle",
                    "explanation": "Centripetal acceleration points directly inward toward the center of the circular path."
                },
                {
                    "id": "q-sph-2", "conceptId": "sph4u-u3-momentum", "type": "cloze", "difficulty": "medium",
                    "prompt": "Impulse is defined as the change in ___ of an object.",
                    "options": None, "answer": "momentum",
                    "explanation": "Impulse J = F Δt = Δp (change in momentum)."
                }
            ]
        },
        {
            "id": "sch4u-chemistry-12",
            "title": "SCH4U — Grade 12 Chemistry",
            "description": "Official Ontario Ministry Curriculum: Organic Chemistry, Structure & Properties of Matter, Energy Changes & Rates of Reaction, Chemical Systems & Equilibrium, and Electrochemistry",
            "emoji": "🧪",
            "createdAt": "2026-08-08T12:00:00.000Z",
            "streak": 0,
            "longestStreak": 0,
            "sessionLogs": [],
            "concepts": [
                {
                    "id": "sch4u-u1-organic",
                    "label": "Unit 1: Organic Chemistry & Functional Groups",
                    "sourceSnippet": "Organic compounds contain carbon backbones. Key functional groups include alcohols (-OH), aldehydes (-CHO), ketones (-CO-), carboxylic acids (-COOH), esters (-COO-), and amines (-NH2). Polymerization joins monomers via condensation or addition reactions.",
                    "example": "Esterification Reaction:\nCarboxylic Acid + Alcohol ⇌ Ester + Water\nEthanoic acid + Ethanol ⇌ Ethyl ethanoate + H₂O.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "sch4u-u2-structure",
                    "label": "Unit 2: Quantum Model, Bonding & VSEPR",
                    "sourceSnippet": "Electrons inhabit atomic orbitals defined by quantum numbers (n, l, ml, ms). VSEPR theory predicts 3D molecular shapes based on electron pair repulsion around the central atom, determining molecular polarity and intermolecular forces.",
                    "example": "VSEPR Shape Analysis:\nWater (H₂O) has 2 bonding pairs and 2 lone pairs around Oxygen:\nElectron Geometry = Tetrahedral, Molecular Geometry = Bent (104.5° angle).",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "sch4u-u3-thermochemistry",
                    "label": "Unit 3: Thermochemistry, Enthalpy & Kinetics",
                    "sourceSnippet": "Enthalpy change ΔH measures heat absorbed or released at constant pressure. Hess's Law states total ΔH is independent of path. Rate laws Rate = k[A]ᵐ[B]ⁿ quantify kinetics, where catalyst lowers activation energy Ea.",
                    "example": "Hess's Law Calculation:\nTarget: C(s) + O₂(g) → CO₂(g)\nReaction 1: C(s) + ½O₂(g) → CO(g)  ΔH1 = -110.5 kJ\nReaction 2: CO(g) + ½O₂(g) → CO₂(g) ΔH2 = -283.0 kJ\nTotal ΔH = ΔH1 + ΔH2 = -393.5 kJ.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "sch4u-u4-equilibrium",
                    "label": "Unit 4: Chemical Equilibrium & Le Chatelier",
                    "sourceSnippet": "Equilibrium constant Kc = [Products]/[Reactants] at equilibrium. Le Chatelier's principle states a system under stress shifts to relieve stress. Acid-base equilibrium relies on Ka, Kb, and pH = -log[H+].",
                    "example": "Equilibrium Constant Calculation:\nFor N₂ + 3H₂ ⇌ 2NH₃ at equilibrium:\n[N₂]=0.1M, [H₂]=0.2M, [NH₃]=0.4M:\nKc = [NH₃]² / ([N₂][H₂]³) = (0.4)² / (0.1 · 0.2³) = 0.16 / 0.0008 = 200.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "sch4u-u5-electrochemistry",
                    "label": "Unit 5: Electrochemistry & Galvanic Cells",
                    "sourceSnippet": "Redox involves electron transfer: Oxidation Is Loss (OIL), Reduction Is Gain (RIG). Galvanic/voltaic cells generate electricity spontaneously (E°cell = E°cathode - E°anode > 0). Electrolysis uses external voltage to drive non-spontaneous reactions.",
                    "example": "Standard Cell Potential:\nZn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s)\nE°cathode (Cu²⁺/Cu) = +0.34 V\nE°anode (Zn²⁺/Zn) = -0.76 V\nE°cell = 0.34 - (-0.76) = +1.10 Volts.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                }
            ],
            "questions": [
                {
                    "id": "q-sch-1", "conceptId": "sch4u-u1-organic", "type": "mcq", "difficulty": "easy",
                    "prompt": "Which functional group contains a carbon double-bonded to oxygen and single-bonded to an -OH group (-COOH)?",
                    "options": ["Carboxylic Acid", "Alcohol", "Aldehyde", "Ester"],
                    "answer": "Carboxylic Acid",
                    "explanation": "Carboxylic acids feature the carboxyl functional group (-COOH)."
                },
                {
                    "id": "q-sch-2", "conceptId": "sch4u-u5-electrochemistry", "type": "short", "difficulty": "medium",
                    "prompt": "At which electrode does oxidation always occur in both galvanic and electrolytic cells?",
                    "options": None, "answer": "Anode",
                    "explanation": "Anode is always the site of oxidation (An Ox, Red Cat)."
                }
            ]
        },
        {
            "id": "sbi4u-biology-12",
            "title": "SBI4U — Grade 12 Biology",
            "description": "Official Ontario Ministry Curriculum: Biochemistry, Metabolic Processes (Respiration & Photosynthesis), Molecular Genetics, Homeostasis, and Population Dynamics",
            "emoji": "🧬",
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
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "sbi4u-u2-respiration",
                    "label": "Unit 2: Cellular Respiration & Photosynthesis",
                    "sourceSnippet": "Cellular respiration converts glucose into ATP: Glycolysis (cytosol), Pyruvate Oxidation, Krebs Cycle (mitochondrial matrix), and Oxidative Phosphorylation (inner membrane ETC). Photosynthesis couples Light Reactions (thylakoid) with Calvin Cycle (stroma).",
                    "example": "ATP Yield Balance Sheet:\n1 Molecule Glucose (C₆H₁₂O₆) + 6 O₂ → 6 CO₂ + 6 H₂O + ~30-32 ATP energy equivalents.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "sbi4u-u3-genetics",
                    "label": "Unit 3: Molecular Genetics & Gene Expression",
                    "sourceSnippet": "DNA replication is semiconservative (Helicase, DNA Polymerase III/I, Ligase). Central Dogma: DNA → (Transcription via RNA Polymerase) → mRNA → (Translation at Ribosome) → Protein. Gene regulation occurs via operons (e.g., lac operon).",
                    "example": "Transcription & Translation Sequence:\nDNA Code: 5'-TAC GGC TTA-3'\nmRNA Codons: 3'-AUG CCG AAU-5'\nAmino Acid Translation: Met - Pro - Asn.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "sbi4u-u4-homeostasis",
                    "label": "Unit 4: Nervous System & Homeostasis",
                    "sourceSnippet": "Homeostasis maintains internal stability via negative feedback loops. Neurons transmit action potentials via Na+/K+ voltage-gated channels. The nephron in kidneys filters blood and regulates water balance via ADH.",
                    "example": "Action Potential Voltage Steps:\nResting Potential (-70mV) → Depolarization (Na+ influx to +40mV) → Repolarization (K+ efflux) → Hyperpolarization.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "sbi4u-u5-populations",
                    "label": "Unit 5: Population Dynamics & Ecology",
                    "sourceSnippet": "Population growth models include exponential growth dN/dt = r N and logistic growth dN/dt = r N ((K - N)/K), where K represents carrying capacity. Density-dependent factors (competition, disease) regulate population size.",
                    "example": "Logistic Growth Calculation:\nIf K = 1000 and N = 500, environmental resistance factor (K-N)/K = 0.5 (growth at 50% max speed).",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                }
            ],
            "questions": [
                {
                    "id": "q-sbi-1", "conceptId": "sbi4u-u2-respiration", "type": "mcq", "difficulty": "easy",
                    "prompt": "Where in the eukaryotic cell does glycolysis take place?",
                    "options": ["Cytosol (Cytoplasm)", "Mitochondrial Matrix", "Inner Mitochondrial Membrane", "Stroma"],
                    "answer": "Cytosol (Cytoplasm)",
                    "explanation": "Glycolysis occurs in the cytosol without requiring oxygen."
                },
                {
                    "id": "q-sbi-2", "conceptId": "sbi4u-u3-genetics", "type": "cloze", "difficulty": "medium",
                    "prompt": "The process of synthesizing mRNA from a DNA template is called ___.",
                    "options": None, "answer": "transcription",
                    "explanation": "RNA Polymerase synthesizes mRNA during transcription."
                }
            ]
        },
        {
            "id": "ics4u-cs-12",
            "title": "ICS4U — Grade 12 Computer Science",
            "description": "Official Ontario Ministry Curriculum: Advanced OOP, Recursion, Sorting/Searching Algorithms, Linear/Non-linear Data Structures, and System Architecture",
            "emoji": "💻",
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
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "ics4u-u2-recursion",
                    "label": "Unit 2: Recursion & Call Stack Analysis",
                    "sourceSnippet": "Recursive functions break problems into smaller subproblems by calling themselves. Every recursive function requires a base case to halt recursion and unwind the execution call stack.",
                    "example": "Recursive Fibonacci Function:\nfunction fib(n) {\n  if (n <= 1) return n; // Base Cases\n  return fib(n - 1) + fib(n - 2);\n}",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "ics4u-u3-algorithms",
                    "label": "Unit 3: Sorting Algorithms & Big-O Complexity",
                    "sourceSnippet": "Algorithmic complexity evaluates performance. Quadratic algorithms O(N²): Bubble, Selection, Insertion Sort. Logarithmic / Linearithmic O(N log N): Merge Sort, Quick Sort. Binary Search requires sorted arrays O(log N).",
                    "example": "Big-O Comparison:\nSearching 1,000,000 items:\nLinear Search O(N) = 1,000,000 operations.\nBinary Search O(log₂ N) ≈ 20 operations!",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "ics4u-u4-datastructures",
                    "label": "Unit 4: Dynamic Data Structures (Lists, Stacks, Queues, BST)",
                    "sourceSnippet": "Abstract Data Types (ADTs): Linked Lists store nodes with data and pointers. Stacks use LIFO (Last-In-First-Out, push/pop). Queues use FIFO (First-In-First-Out, enqueue/dequeue). Binary Search Trees (BST) organize data for O(log N) operations.",
                    "example": "Stack LIFO Example:\npush(10) -> push(20) -> pop() returns 20.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                }
            ],
            "questions": [
                {
                    "id": "q-ics-1", "conceptId": "ics4u-u3-algorithms", "type": "mcq", "difficulty": "easy",
                    "prompt": "What is the average time complexity of Merge Sort?",
                    "options": ["O(N log N)", "O(N²)", "O(N)", "O(1)"],
                    "answer": "O(N log N)",
                    "explanation": "Merge Sort uses divide-and-conquer to achieve O(N log N) in all cases."
                },
                {
                    "id": "q-ics-2", "conceptId": "ics4u-u4-datastructures", "type": "short", "difficulty": "medium",
                    "prompt": "Which data structure operates on a LIFO (Last-In, First-Out) principle?",
                    "options": None, "answer": "Stack",
                    "explanation": "Stacks store and retrieve elements in LIFO order."
                }
            ]
        },
        {
            "id": "mhf4u-functions-12",
            "title": "MHF4U — Grade 12 Advanced Functions",
            "description": "Official Ontario Ministry Curriculum: Polynomial & Rational Functions, Trigonometry, Exponential & Logarithmic Functions, and Function Transformations",
            "emoji": "📈",
            "createdAt": "2026-08-08T12:00:00.000Z",
            "streak": 0,
            "longestStreak": 0,
            "sessionLogs": [],
            "concepts": [
                {
                    "id": "mhf4u-u1-polynomials",
                    "label": "Unit 1: Polynomial Functions & Remainder Theorem",
                    "sourceSnippet": "Polynomial functions f(x) = an xⁿ + ... + a0 have smooth curves. The Remainder Theorem states f(a) is the remainder when f(x) is divided by (x - a). If f(a) = 0, (x - a) is a factor.",
                    "example": "Factor Theorem Problem:\nTest if (x - 2) is a factor of f(x) = x³ - 3x² + 4:\nf(2) = (2)³ - 3(2)² + 4 = 8 - 12 + 4 = 0 ⇒ (x - 2) IS a factor!",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "mhf4u-u2-rationals",
                    "label": "Unit 2: Rational Functions & Asymptotes",
                    "sourceSnippet": "Rational functions f(x) = P(x)/Q(x) have vertical asymptotes where Q(x) = 0. Horizontal asymptotes depend on polynomial degrees: if deg(P) < deg(Q), y = 0; if deg(P) = deg(Q), y = leading coeff ratio.",
                    "example": "Asymptote Analysis:\nFor f(x) = (3x² + 2) / (x² - 4):\nVertical Asymptotes at x² - 4 = 0 ⇒ x = 2 and x = -2.\nHorizontal Asymptote at y = 3/1 = 3.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "mhf4u-u3-trig",
                    "label": "Unit 3: Trigonometric Ratios, Radians & Identities",
                    "sourceSnippet": "Angles measured in radians: 2π rad = 360°. Compound angle identities: sin(A ± B) = sin A cos B ± cos A sin B. Double angle identity: cos(2A) = cos² A - sin² A = 2cos² A - 1.",
                    "example": "Double Angle Calculation:\nIf sin θ = 3/5 in Quadrant I (cos θ = 4/5):\nsin(2θ) = 2 sin θ cos θ = 2 · (3/5) · (4/5) = 24/25 = 0.96.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                }
            ],
            "questions": [
                {
                    "id": "q-mhf-1", "conceptId": "mhf4u-u1-polynomials", "type": "mcq", "difficulty": "easy",
                    "prompt": "If f(3) = 0 for a polynomial f(x), what binomial must be a factor of f(x)?",
                    "options": ["(x - 3)", "(x + 3)", "3x", "(x - 0)"],
                    "answer": "(x - 3)",
                    "explanation": "By the Factor Theorem, if f(a) = 0, then (x - a) is a factor."
                }
            ]
        },
        {
            "id": "mdm4u-data-management-12",
            "title": "MDM4U — Grade 12 Data Management",
            "description": "Official Ontario Ministry Curriculum: Counting Principles, Permutations & Combinations, Probability Distributions, and Statistics",
            "emoji": "📊",
            "createdAt": "2026-08-08T12:00:00.000Z",
            "streak": 0,
            "longestStreak": 0,
            "sessionLogs": [],
            "concepts": [
                {
                    "id": "mdm4u-u1-counting",
                    "label": "Unit 1: Permutations & Combinations",
                    "sourceSnippet": "Permutations nPr = n!/(n-r)! count ordered arrangements. Combinations nCr = n!/(r!(n-r)!) count unordered selections. Pascal's Triangle gives binomial coefficients.",
                    "example": "Combination Selection:\nSelect 4 committee members out of 9 candidates:\n9C4 = 9! / (4! · 5!) = (9 · 8 · 7 · 6) / (4 · 3 · 2 · 1) = 126 ways.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                },
                {
                    "id": "mdm4u-u2-distributions",
                    "label": "Unit 2: Probability & Normal Distribution",
                    "sourceSnippet": "Expected value E(X) = Σ x P(x). Normal distribution N(μ, σ²) follows a bell curve where z = (x - μ)/σ measures standard deviations from the mean.",
                    "example": "Z-Score Calculation:\nFor mean μ = 70, standard deviation σ = 10, find z-score for score x = 85:\nz = (85 - 70) / 10 = +1.5.",
                    "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "nextReviewDate": "2026-08-08T12:00:00.000Z", "history": []
                }
            ],
            "questions": [
                {
                    "id": "q-mdm-1", "conceptId": "mdm4u-u1-counting", "type": "mcq", "difficulty": "easy",
                    "prompt": "Which formula (nPr or nCr) is used when the selection order does NOT matter?",
                    "options": ["nCr (Combinations)", "nPr (Permutations)", "n! (Factorials)", "P(A|B)"],
                    "answer": "nCr (Combinations)",
                    "explanation": "Combinations count unordered groups of items."
                }
            ]
        }
    ]
    return decks

def main():
    decks = build_ontario_curriculum()
    js_content = f"export const EXAMPLE_DECKS = {json.dumps(decks, indent=2)};\n"
    with open('src/data/exampleDeck.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"Successfully generated {len(decks)} complete Ontario Ministry Grade 12 curriculum decks!")

if __name__ == '__main__':
    main()
