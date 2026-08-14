import { createConcept, createDeck, createQuestion } from './models.js';
import { getQuestionSet, rotateOptions } from '../engine/teaching.js';

const BUILT_IN_CREATED_AT = '2026-08-08T12:00:00.000Z';

const CURRICULUM_SOURCES = {
  ontarioMath: 'Ontario Ministry of Education mathematics course descriptions and Grade 11-12 curriculum strands',
  ontarioScience: 'Ontario Ministry of Education Grade 11-12 science curriculum strands',
  ontarioComputerScience: 'Ontario Ministry of Education Grade 12 computer science curriculum expectations',
};

const SUBJECT_CURRICULA = [
  {
    id: 'mcv4u-calculus-vectors',
    title: 'MCV4U - Grade 12 Calculus & Vectors',
    description: 'Ontario-aligned calculus and vectors: limits, derivatives, curve sketching, optimization, vectors, lines, and planes.',
    emoji: '📐',
    source: CURRICULUM_SOURCES.ontarioMath,
    units: [
      {
        name: 'Rates of Change and Limits',
        lessons: [
          ['Average and Instantaneous Rate of Change', 'Average rate of change compares output change over an interval, while instantaneous rate of change is the limiting slope of secants at one point.', 'Compute the average rate from x = 1 to x = 3 for f(x)=x^2: (9-1)/(3-1)=4. Then compare to f\'(2)=4.'],
          ['Limit Laws and Algebraic Simplification', 'Limit laws allow sums, products, quotients, and powers to be evaluated after simplifying removable discontinuities.', 'lim x->3 (x^2-9)/(x-3) = lim x->3 (x+3) = 6 after factoring.'],
          ['Continuity and Discontinuities', 'A function is continuous at a when the value, two-sided limit, and agreement between them all exist.', 'For f(x)=(x^2-1)/(x-1), x=1 is removable because the simplified form x+1 has a hole at 2.'],
          ['Derivative from First Principles', 'The derivative f\'(a) is defined by lim h->0 [f(a+h)-f(a)]/h and represents tangent slope.', 'For f(x)=x^2, [f(x+h)-f(x)]/h = (2xh+h^2)/h = 2x+h, so f\'(x)=2x.'],
        ],
      },
      {
        name: 'Derivative Rules',
        lessons: [
          ['Power, Constant, and Sum Rules', 'Polynomial derivatives come from applying d/dx(x^n)=nx^(n-1), constants becoming zero, and sums term-by-term.', 'd/dx(4x^5-3x^2+7)=20x^4-6x.'],
          ['Product and Quotient Rules', 'Products and quotients require preserving both changing factors: (uv)\'=u\'v+uv\' and (u/v)\'=(u\'v-uv\')/v^2.', 'For y=x^2 sin x, y\'=2x sin x+x^2 cos x.'],
          ['Chain Rule and Composite Functions', 'The chain rule differentiates nested functions by multiplying the outer derivative by the inner derivative.', 'd/dx[(2x^3-5)^4]=4(2x^3-5)^3(6x^2).'],
          ['Implicit Differentiation', 'Implicit differentiation treats y as a function of x and applies dy/dx whenever differentiating y terms.', 'For x^2+y^2=25, 2x+2y y\'=0, so y\'=-x/y.'],
        ],
      },
      {
        name: 'Applications of Derivatives',
        lessons: [
          ['Critical Points and Monotonicity', 'Critical points occur where f\'(x)=0 or undefined, and derivative signs reveal increasing and decreasing intervals.', 'If f\' changes from positive to negative at x=2, f has a local maximum there.'],
          ['Concavity and Inflection Points', 'The second derivative describes concavity, and inflection points occur where concavity changes.', 'If f\'\'(x)=6x-12, concavity changes at x=2.'],
          ['Curve Sketching Workflow', 'A complete sketch uses intercepts, asymptotes, critical points, intervals, concavity, and end behaviour.', 'For a rational function, find vertical asymptotes first, then sign charts for f\' and f\'\'.'],
          ['Optimization Modelling', 'Optimization turns a real constraint into a single-variable function, then uses derivatives to maximize or minimize.', 'For an open box from a 20 cm square, maximize V=x(20-2x)^2 by solving V\'=0.'],
          ['Related Rates', 'Related rates connect changing quantities through an equation and differentiate both sides with respect to time.', 'For A=pi r^2, dA/dt=2pi r dr/dt.'],
        ],
      },
      {
        name: 'Transcendental Derivatives',
        lessons: [
          ['Exponential and Logarithmic Derivatives', 'Exponential and logarithmic functions use d/dx(e^x)=e^x, d/dx(a^x)=a^x ln a, and d/dx(ln x)=1/x.', 'd/dx(e^(2x) ln x)=2e^(2x)ln x+e^(2x)/x.'],
          ['Trigonometric Derivatives', 'Trigonometric derivatives connect slopes of sinusoidal functions: sin to cos, cos to -sin, tan to sec^2.', 'd/dx[sin(3x)]=3cos(3x).'],
          ['Logarithmic Differentiation', 'Logarithmic differentiation simplifies products, quotients, powers, and variable exponents before differentiating.', 'For y=x^x, ln y=x ln x, so y\'=x^x(ln x+1).'],
          ['Transcendental Optimization', 'Optimization with trig, exponential, or logarithmic models follows the same derivative sign and endpoint checks.', 'Maximize P(t)=te^-t by solving P\'=e^-t(1-t)=0.'],
        ],
      },
      {
        name: 'Vectors and Geometry',
        lessons: [
          ['Vector Representation in 2D and 3D', 'Vectors have magnitude and direction and can be represented geometrically or by Cartesian components.', 'For v=<3,-4,12>, |v|=sqrt(9+16+144)=13.'],
          ['Vector Operations and Linear Combinations', 'Vector addition, scalar multiplication, and linear combinations model displacement, force, and span.', '2<1,3,-1>-<4,0,2>=<-2,6,-4>.'],
          ['Dot Product, Projections, and Work', 'The dot product measures directional alignment and supports angle, projection, and work calculations.', 'If u dot v=0, the non-zero vectors are perpendicular.'],
          ['Cross Product, Area, and Torque', 'The cross product creates a vector perpendicular to two 3D vectors, with magnitude equal to parallelogram area.', '<1,2,3> x <4,5,6> = <-3,6,-3>.'],
          ['Lines and Planes in 3D', 'Lines use a point and direction vector; planes use a point and normal vector or two spanning directions.', 'A plane through (1,2,3) with normal <2,-1,4> is 2(x-1)-(y-2)+4(z-3)=0.'],
          ['Intersections and Distances', 'Vector equations solve intersections, skew lines, and distances between points, lines, and planes.', 'Distance from point P to plane Ax+By+Cz+D=0 is |APx+BPy+CPz+D|/sqrt(A^2+B^2+C^2).'],
        ],
      },
    ],
  },
  {
    id: 'sph4u-physics-12',
    title: 'SPH4U - Grade 12 Physics',
    description: 'Ontario-aligned physics: dynamics, energy, momentum, fields, waves, quantum physics, and relativity.',
    emoji: '🚀',
    source: CURRICULUM_SOURCES.ontarioScience,
    units: [
      {
        name: 'Dynamics',
        lessons: [
          ['2D Kinematics and Projectile Motion', 'Two-dimensional motion is solved by separating horizontal and vertical components that share time.', 'A projectile launched horizontally keeps constant vx while vy changes by ay=-9.81 m/s^2.'],
          ['Newton\'s Laws and Free-Body Diagrams', 'Net force determines acceleration through Sigma F=ma, and free-body diagrams organize every interaction force.', 'A 10 kg box with net force 49.05 N accelerates at 4.905 m/s^2.'],
          ['Friction, Tension, and Inclined Planes', 'Friction and tension problems require resolving forces parallel and perpendicular to motion.', 'On a 30 degree incline, the downslope gravity component is mg sin 30 degrees.'],
          ['Circular Motion and Centripetal Force', 'Objects moving in circles accelerate inward with ac=v^2/r, requiring a net centripetal force.', 'A car rounding a curve needs friction to supply mv^2/r toward the centre.'],
        ],
      },
      {
        name: 'Energy and Momentum',
        lessons: [
          ['Work and Energy Transfer', 'Work transfers energy when a force acts through a displacement: W=Fd cos theta.', 'A 20 N force over 3 m at 0 degrees does 60 J of work.'],
          ['Mechanical Energy Conservation', 'In isolated systems without non-conservative work, kinetic plus potential energy stays constant.', 'mgh at the top of a ramp can become 1/2mv^2 at the bottom.'],
          ['Power and Efficiency', 'Power measures the rate of energy transfer, and efficiency compares useful output to total input.', 'A motor doing 1200 J in 4 s has power 300 W.'],
          ['Momentum, Impulse, and Collisions', 'Momentum is conserved in isolated collisions, while impulse equals change in momentum.', 'Two carts sticking together use m1v1+m2v2=(m1+m2)vf.'],
        ],
      },
      {
        name: 'Gravitational, Electric, and Magnetic Fields',
        lessons: [
          ['Universal Gravitation and Orbits', 'Newtonian gravity follows an inverse-square force law and explains orbital speed and acceleration.', 'For circular orbit, GMm/r^2=mv^2/r, so v=sqrt(GM/r).'],
          ['Electric Force and Electric Field', 'Coulomb forces and electric fields describe how charges interact at a distance.', 'E=F/q and Fe=k|q1q2|/r^2.'],
          ['Electric Potential and Energy', 'Electric potential energy and potential difference track work per charge in electric fields.', 'Moving charge q through voltage V changes energy by qV.'],
          ['Magnetic Force and Charged Particles', 'Moving charges in magnetic fields experience Lorentz force perpendicular to velocity and field.', 'F=qvB sin theta for a charge moving through a uniform magnetic field.'],
          ['Electromagnetic Induction', 'Changing magnetic flux induces emf according to Faraday\'s law and direction by Lenz\'s law.', 'A coil entering a magnetic field develops current opposing the flux change.'],
        ],
      },
      {
        name: 'Waves, Light, and Modern Physics',
        lessons: [
          ['Wave Behaviour and Interference', 'Waves superpose, interfere, diffract, and form patterns based on path difference.', 'Constructive interference occurs when path difference is m lambda.'],
          ['Double-Slit and Diffraction Patterns', 'Young\'s experiment links bright fringes to wavelength, slit spacing, and angle.', 'm lambda = d sin theta for double-slit maxima.'],
          ['Photoelectric Effect and Photons', 'Light transfers energy in photons, with energy E=hf and threshold frequency determining emission.', 'If hf exceeds the work function, electrons are emitted with kinetic energy hf-phi.'],
          ['Special Relativity', 'At speeds near c, time dilation, length contraction, and mass-energy equivalence become measurable.', 'Moving clocks satisfy delta t = gamma delta t0 where gamma=1/sqrt(1-v^2/c^2).'],
        ],
      },
    ],
  },
  {
    id: 'sch4u-chemistry-12',
    title: 'SCH4U - Grade 12 Chemistry',
    description: 'Ontario-aligned chemistry: organic chemistry, bonding, thermochemistry, kinetics, equilibrium, acids/bases, and electrochemistry.',
    emoji: '🧪',
    source: CURRICULUM_SOURCES.ontarioScience,
    units: [
      {
        name: 'Organic Chemistry',
        lessons: [
          ['Hydrocarbons and Isomerism', 'Alkanes, alkenes, alkynes, aromatics, and structural isomers organize carbon compounds by bonding and structure.', 'C4H10 has two structural isomers: butane and 2-methylpropane.'],
          ['Functional Groups and Naming', 'Functional groups determine reactivity and naming patterns for alcohols, aldehydes, ketones, acids, esters, amines, and amides.', 'CH3CH2OH is ethanol because the -OH group creates an alcohol suffix.'],
          ['Organic Reactions', 'Addition, substitution, elimination, oxidation, reduction, esterification, and hydrolysis describe common organic transformations.', 'Ethanoic acid plus ethanol can form ethyl ethanoate and water.'],
          ['Polymers and Biochemical Molecules', 'Addition and condensation polymerization connect monomers into useful and biological macromolecules.', 'Ethene monomers form polyethene through addition polymerization.'],
        ],
      },
      {
        name: 'Structure and Properties of Matter',
        lessons: [
          ['Quantum Model and Electron Configuration', 'Orbitals, quantum numbers, and electron configurations explain periodic trends and bonding behaviour.', 'Oxygen has configuration 1s2 2s2 2p4.'],
          ['Periodic Trends', 'Atomic radius, ionization energy, electronegativity, and electron affinity vary predictably across the periodic table.', 'Ionization energy generally increases across a period as effective nuclear charge rises.'],
          ['Chemical Bonding and Molecular Polarity', 'Ionic, covalent, and metallic bonding plus electronegativity differences explain molecular polarity.', 'CO2 has polar bonds but is nonpolar overall because the linear bond dipoles cancel.'],
          ['VSEPR and Intermolecular Forces', 'VSEPR predicts molecular shape, while intermolecular forces explain boiling point, solubility, and state.', 'Water is bent because two bonding pairs and two lone pairs repel around oxygen.'],
        ],
      },
      {
        name: 'Energy Changes and Rates of Reaction',
        lessons: [
          ['Enthalpy and Calorimetry', 'Enthalpy change measures heat transfer at constant pressure and can be calculated from calorimetry.', 'q=mcDeltaT for water temperature changes in a coffee-cup calorimeter.'],
          ['Hess\'s Law and Formation Enthalpy', 'Because enthalpy is a state function, reactions can be added to calculate an unknown enthalpy change.', 'Add C+1/2O2->CO and CO+1/2O2->CO2 to get C+O2->CO2.'],
          ['Collision Theory and Activation Energy', 'Reaction rate depends on collision frequency, orientation, and particles exceeding activation energy.', 'A catalyst speeds a reaction by lowering Ea without being consumed.'],
          ['Rate Laws and Reaction Mechanisms', 'Rate laws express concentration dependence and mechanisms explain elementary steps and intermediates.', 'If rate=k[A]^2[B], doubling A quadruples the rate.'],
        ],
      },
      {
        name: 'Chemical Systems and Equilibrium',
        lessons: [
          ['Dynamic Equilibrium and Kc', 'Equilibrium occurs when forward and reverse rates are equal, producing a constant ratio of concentrations.', 'For N2+3H2 reversible 2NH3, Kc=[NH3]^2/([N2][H2]^3).'],
          ['Le Chatelier\'s Principle', 'A system at equilibrium shifts to reduce stress from concentration, pressure, volume, or temperature changes.', 'Adding reactant usually shifts equilibrium toward products.'],
          ['Acid-Base Equilibrium and pH', 'Weak acids and bases partially ionize, and Ka, Kb, pH, and pOH quantify equilibrium strength.', 'pH=-log[H+] and pOH=-log[OH-].'],
          ['Buffers and Titration Curves', 'Buffers resist pH change and titration curves reveal equivalence points and indicator choice.', 'A weak acid-strong base titration has equivalence point above pH 7.'],
        ],
      },
      {
        name: 'Electrochemistry',
        lessons: [
          ['Oxidation Numbers and Redox', 'Redox reactions transfer electrons; oxidation is loss and reduction is gain.', 'In Zn -> Zn2+ + 2e-, zinc is oxidized.'],
          ['Balancing Redox Reactions', 'Half-reaction methods balance atoms, charge, and electrons in acidic or basic solution.', 'Balance oxygen with H2O, hydrogen with H+, and charge with electrons in acidic solution.'],
          ['Galvanic Cells and Cell Potential', 'Galvanic cells convert spontaneous redox reactions into electrical energy.', 'Ecell = Ecathode - Eanode; positive Ecell means spontaneous.'],
          ['Electrolytic Cells and Faraday\'s Law', 'Electrolysis uses external voltage to drive non-spontaneous redox and relates charge to moles of electrons.', 'Q=It and moles electrons=Q/F.'],
        ],
      },
    ],
  },
  {
    id: 'sbi4u-biology-12',
    title: 'SBI4U - Grade 12 Biology',
    description: 'Ontario-aligned biology: biochemistry, metabolism, genetics, homeostasis, and population dynamics.',
    emoji: '🧬',
    source: CURRICULUM_SOURCES.ontarioScience,
    units: [
      {
        name: 'Biochemistry',
        lessons: [
          ['Water, pH, and Biological Chemistry', 'Water polarity, hydrogen bonding, and pH shape biological structure and reaction environments.', 'A buffer resists pH change by accepting or donating H+ ions.'],
          ['Carbohydrates and Lipids', 'Carbohydrates provide energy and structure, while lipids store energy and form membranes.', 'Triglycerides form from glycerol and three fatty acids by condensation.'],
          ['Proteins and Enzymes', 'Protein structure determines function, and enzymes lower activation energy for specific substrates.', 'Competitive inhibitors bind active sites and can be overcome by adding substrate.'],
          ['Nucleic Acids and ATP', 'DNA, RNA, and ATP use nucleotide structure to store information or transfer energy.', 'ATP hydrolysis releases energy by breaking the terminal phosphate bond.'],
        ],
      },
      {
        name: 'Metabolic Processes',
        lessons: [
          ['Glycolysis and Fermentation', 'Glycolysis splits glucose into pyruvate and can be followed by fermentation when oxygen is unavailable.', 'One glucose yields net 2 ATP and 2 NADH in glycolysis.'],
          ['Krebs Cycle and Electron Transport', 'Aerobic respiration harvests electron carriers and uses oxidative phosphorylation to make most ATP.', 'NADH donates electrons to the ETC, helping pump protons for ATP synthase.'],
          ['Photosynthesis Light Reactions', 'Light reactions convert solar energy into ATP and NADPH while splitting water.', 'Photosystem II replaces lost electrons by splitting H2O and releasing O2.'],
          ['Calvin Cycle and Carbon Fixation', 'The Calvin cycle uses ATP and NADPH to fix CO2 into carbohydrate precursors.', 'Rubisco attaches CO2 to RuBP during carbon fixation.'],
        ],
      },
      {
        name: 'Molecular Genetics',
        lessons: [
          ['DNA Replication', 'DNA replication is semiconservative and uses enzymes to unwind, copy, proofread, and ligate strands.', 'Lagging strand synthesis creates Okazaki fragments joined by DNA ligase.'],
          ['Transcription and RNA Processing', 'Transcription makes RNA from DNA, and eukaryotic transcripts are capped, spliced, and polyadenylated.', 'Introns are removed and exons joined during splicing.'],
          ['Translation and Protein Synthesis', 'Ribosomes read mRNA codons and tRNAs deliver amino acids to build polypeptides.', 'AUG codes for methionine and often starts translation.'],
          ['Gene Regulation and Mutation', 'Cells regulate gene expression, and mutations can alter proteins, regulation, or phenotype.', 'A frameshift mutation changes the reading frame downstream of insertion or deletion.'],
          ['Biotechnology', 'PCR, gel electrophoresis, sequencing, and genetic engineering analyze and manipulate DNA.', 'PCR doubles target DNA each cycle using primers and heat-stable polymerase.'],
        ],
      },
      {
        name: 'Homeostasis',
        lessons: [
          ['Negative Feedback Systems', 'Homeostasis uses receptors, control centres, and effectors to maintain stable internal conditions.', 'High blood glucose triggers insulin release, lowering glucose toward the set point.'],
          ['Nervous System Signalling', 'Neurons use ion gradients, action potentials, and synapses to transmit signals.', 'Depolarization occurs when voltage-gated sodium channels open.'],
          ['Endocrine System Regulation', 'Hormones travel through blood and coordinate slower, longer-lasting responses.', 'ADH increases water reabsorption in kidney collecting ducts.'],
          ['Kidney Function and Osmoregulation', 'Nephrons filter blood, reabsorb useful substances, and regulate water and ion balance.', 'The loop of Henle creates a concentration gradient for water reabsorption.'],
        ],
      },
      {
        name: 'Population Dynamics',
        lessons: [
          ['Population Growth Models', 'Exponential and logistic models describe population change under unlimited or limited resources.', 'Logistic growth slows as N approaches carrying capacity K.'],
          ['Carrying Capacity and Limiting Factors', 'Density-dependent and density-independent factors regulate population size and distribution.', 'Disease is density-dependent because spread often increases with crowding.'],
          ['Predator-Prey and Competition', 'Species interactions can create cycling populations and influence community structure.', 'Predator populations often lag behind prey population changes.'],
          ['Human Impacts and Sustainability', 'Human activity changes ecosystems through habitat loss, pollution, invasive species, and resource use.', 'A sustainable harvest stays below the ecosystem renewal rate.'],
        ],
      },
    ],
  },
  {
    id: 'ics4u-cs-12',
    title: 'ICS4U - Grade 12 Computer Science',
    description: 'Ontario-aligned computer science: advanced programming, modular design, algorithms, data structures, software engineering, and ethics.',
    emoji: '💻',
    source: CURRICULUM_SOURCES.ontarioComputerScience,
    units: [
      {
        name: 'Programming Concepts and Skills',
        lessons: [
          ['Data Types, Expressions, and Control Flow', 'Programs combine data, expressions, selection, and iteration to model precise logic.', 'Use a loop to validate input until a value is inside the allowed range.'],
          ['Methods, Parameters, and Scope', 'Functions and methods organize behaviour with parameters, return values, and local scope.', 'A helper function calculateTax(subtotal, rate) returns subtotal*rate.'],
          ['Object-Oriented Design', 'Classes model state and behaviour through encapsulation, constructors, methods, and object references.', 'A Student object can store name, courses, and calculateAverage().'],
          ['Inheritance, Polymorphism, and Interfaces', 'Inheritance shares common behaviour, while polymorphism lets one reference type call overridden methods.', 'Shape s = new Circle(); s.draw() calls Circle.draw().'],
        ],
      },
      {
        name: 'Software Development',
        lessons: [
          ['Problem Decomposition and Modular Design', 'Large programs are built by decomposing requirements into modules with clear responsibilities.', 'Separate input parsing, domain logic, and output formatting.'],
          ['Testing and Debugging Strategies', 'Testing checks expected behaviour and debugging isolates the cause of incorrect behaviour.', 'A boundary test checks an empty list, one item, and maximum size.'],
          ['Version Control and Collaboration', 'Teams use version control, branches, code reviews, and issue tracking to manage change.', 'Commit a working feature with a clear message before starting the next task.'],
          ['User Interface and Accessibility', 'Software should be usable, readable, responsive, and accessible to users with different needs.', 'A form label must describe the input it controls.'],
        ],
      },
      {
        name: 'Algorithms and Data Structures',
        lessons: [
          ['Algorithm Analysis and Big-O', 'Big-O notation describes how runtime or memory grows as input size increases.', 'Binary search is O(log n) because each step halves the search space.'],
          ['Searching Algorithms', 'Linear search scans each item, while binary search requires sorted data and repeatedly halves the range.', 'Searching one million sorted items by binary search takes about 20 comparisons.'],
          ['Sorting Algorithms', 'Sorting algorithms trade simplicity, speed, memory, and stability.', 'Merge sort runs in O(n log n) but uses extra memory.'],
          ['Lists, Stacks, Queues, and Trees', 'Data structures encode access patterns such as indexed access, LIFO, FIFO, and hierarchical search.', 'A stack returns the most recently pushed item first.'],
          ['Recursion and Call Stack Tracing', 'Recursive solutions solve a problem by solving smaller cases until a base case is reached.', 'factorial(n)=n*factorial(n-1) with factorial(0)=1.'],
        ],
      },
      {
        name: 'Computers and Society',
        lessons: [
          ['Ethics, Privacy, and Security', 'Computing decisions affect privacy, consent, security, fairness, and trust.', 'Collect only the data needed for a feature and protect it appropriately.'],
          ['Environmental and Social Impact', 'Hardware, networks, AI, and automation have environmental and social consequences.', 'Cloud workloads consume energy, so efficient software has environmental value.'],
          ['Emerging Technologies and Careers', 'Students evaluate current technologies and career paths using technical and social criteria.', 'Compare AI tools by accuracy, bias risk, cost, and explainability.'],
        ],
      },
    ],
  },
  {
    id: 'mhf4u-functions-12',
    title: 'MHF4U - Grade 12 Advanced Functions',
    description: 'Ontario-aligned advanced functions: polynomial, rational, trigonometric, exponential, logarithmic, transformations, and rates of change.',
    emoji: '📈',
    source: CURRICULUM_SOURCES.ontarioMath,
    units: [
      {
        name: 'Polynomial and Rational Functions',
        lessons: [
          ['Polynomial End Behaviour and Graphs', 'Degree, leading coefficient, zeros, and multiplicities shape polynomial graphs.', 'A positive cubic falls left and rises right.'],
          ['Remainder and Factor Theorems', 'The Remainder Theorem uses f(a), and the Factor Theorem identifies zeros and factors.', 'If f(2)=0, then x-2 is a factor.'],
          ['Polynomial Inequalities', 'Polynomial inequalities are solved with zeros, sign charts, and interval testing.', 'For (x-1)(x+2)>0, test intervals around -2 and 1.'],
          ['Rational Functions and Asymptotes', 'Rational graphs depend on holes, vertical asymptotes, horizontal/slant asymptotes, intercepts, and signs.', 'For (3x^2+2)/(x^2-4), vertical asymptotes are x=2 and x=-2.'],
        ],
      },
      {
        name: 'Trigonometric Functions',
        lessons: [
          ['Radians and Unit Circle', 'Radians measure angles by arc length over radius and connect trig values to coordinates on the unit circle.', 'pi radians equals 180 degrees.'],
          ['Transformations of Sinusoidal Functions', 'Amplitude, period, phase shift, and vertical shift transform sine and cosine graphs.', 'y=3sin(2(x-pi/4))+1 has amplitude 3 and period pi.'],
          ['Trigonometric Identities', 'Reciprocal, quotient, Pythagorean, compound-angle, and double-angle identities simplify expressions.', 'sin^2 x + cos^2 x = 1.'],
          ['Trigonometric Equations', 'Solving trig equations requires identities, restrictions, and all solutions over the requested interval.', '2sin x-1=0 gives x=30 degrees and 150 degrees on [0,360).'],
        ],
      },
      {
        name: 'Exponential and Logarithmic Functions',
        lessons: [
          ['Exponential Growth and Decay', 'Exponential models multiply by a constant factor over equal intervals.', 'A(t)=A0(1+r)^t models compound growth.'],
          ['Logarithms and Laws', 'Logarithms invert exponentials and laws convert products, quotients, and powers.', 'log(ab)=log a + log b.'],
          ['Solving Exponential and Log Equations', 'Equations use common bases, logarithms, domain restrictions, and inverse relationships.', '2^x=10 gives x=log(10)/log(2).'],
          ['Applications of Exponential Models', 'Half-life, population growth, interest, and cooling are modelled with exponential equations.', 'Half-life model A=A0(1/2)^(t/h).'],
        ],
      },
      {
        name: 'Function Transformations and Rates',
        lessons: [
          ['Combining Functions', 'Sums, differences, products, quotients, and compositions create new functions with inherited restrictions.', '(f/g)(x) excludes x values where g(x)=0.'],
          ['Inverse Functions', 'Inverse functions reverse input and output, requiring one-to-one behaviour over the chosen domain.', 'Swap x and y, then solve for y to find an inverse.'],
          ['Average and Instantaneous Rate of Change', 'Rates of change connect secant slopes, tangent slopes, and early derivative ideas.', 'Average rate from a to b is [f(b)-f(a)]/(b-a).'],
          ['Mathematical Modelling with Functions', 'Models are chosen, fitted, interpreted, and checked against context and restrictions.', 'A rational model may fit rates that level off near a horizontal asymptote.'],
        ],
      },
    ],
  },
  {
    id: 'mdm4u-data-management-12',
    title: 'MDM4U - Grade 12 Data Management',
    description: 'Ontario-aligned data management: counting, probability, distributions, statistics, regression, and culminating investigation.',
    emoji: '📊',
    source: CURRICULUM_SOURCES.ontarioMath,
    units: [
      {
        name: 'Counting and Probability',
        lessons: [
          ['Organized Counting Strategies', 'Tree diagrams, tables, and the fundamental counting principle organize complex sample spaces.', 'If a meal has 3 mains and 4 sides, there are 12 combinations.'],
          ['Permutations and Combinations', 'Permutations count ordered arrangements, while combinations count unordered selections.', '9C4=126 committees of four from nine people.'],
          ['Probability with Counting', 'Counting methods can compute probabilities for large discrete sample spaces.', 'P(two aces from a deck)=C(4,2)/C(52,2).'],
          ['Conditional Probability', 'Conditional probability updates likelihood when new information is known.', 'P(A|B)=P(A and B)/P(B).'],
        ],
      },
      {
        name: 'Probability Distributions',
        lessons: [
          ['Discrete Random Variables', 'A random variable assigns numbers to outcomes and has probabilities that sum to one.', 'Expected value E(X)=sum xP(x).'],
          ['Binomial Distribution', 'Binomial models count successes in fixed independent trials with constant probability.', 'P(X=k)=C(n,k)p^k(1-p)^(n-k).'],
          ['Normal Distribution and Z-Scores', 'Normal distributions use mean and standard deviation, with z-scores measuring relative position.', 'z=(x-mu)/sigma.'],
          ['Sampling Distributions', 'Sampling distributions describe how sample statistics vary from sample to sample.', 'Larger samples usually reduce standard error.'],
        ],
      },
      {
        name: 'Statistics and Data Analysis',
        lessons: [
          ['One-Variable Statistics', 'Centre, spread, shape, and outliers summarize one-variable data.', 'Median and IQR resist extreme outliers better than mean and standard deviation.'],
          ['Two-Variable Data and Correlation', 'Scatter plots and correlation describe association but do not prove causation.', 'A strong r value can still come from a lurking variable.'],
          ['Linear Regression and Residuals', 'Regression models predict one variable from another and residuals reveal model fit.', 'A residual is observed y minus predicted y.'],
          ['Confidence Intervals and Error', 'Confidence intervals estimate population parameters while accounting for sampling variability.', 'A 95 percent interval gives a range of plausible parameter values under the method.'],
        ],
      },
      {
        name: 'Culminating Investigation',
        lessons: [
          ['Research Question Design', 'A strong investigation begins with a specific, measurable question and appropriate variables.', 'Ask whether study time predicts test score, not whether studying is good.'],
          ['Data Collection and Bias', 'Sampling method, measurement quality, and bias determine whether conclusions are trustworthy.', 'Voluntary response surveys often overrepresent strong opinions.'],
          ['Analysis Plan and Communication', 'A good report explains methods, calculations, limitations, visuals, and justified conclusions.', 'Choose a scatter plot for two quantitative variables and explain residual patterns.'],
        ],
      },
    ],
  },
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function createLessonConcept(deck, unit, lesson, unitIndex, lessonIndex) {
  const [label, sourceSnippet, example] = lesson;
  return createConcept({
    id: `${deck.id}-u${unitIndex + 1}-l${lessonIndex + 1}-${slugify(label)}`,
    label,
    unit: unit.name,
    topics: [unit.name, label],
    sourceSnippet,
    example,
  });
}

function createLessonQuestions(concept) {
  return getQuestionSet(concept).map((spec) => (
    createQuestion({
      id: `q-${concept.id}-${spec.difficulty}`,
      conceptId: concept.id,
      difficulty: spec.difficulty,
      prompt: spec.prompt,
      options: rotateOptions(spec.answer, spec.distractors, `${concept.id}-${spec.difficulty}`),
      answer: spec.answer,
      explanation: spec.explanation,
      visual: spec.visual,
    })
  ));
}

function buildDeckFromCurriculum(curriculum) {
  const concepts = curriculum.units.flatMap((unit, unitIndex) =>
    unit.lessons.map((lesson, lessonIndex) => createLessonConcept(curriculum, unit, lesson, unitIndex, lessonIndex))
  );

  return {
    ...createDeck({
      id: curriculum.id,
      title: curriculum.title,
      description: curriculum.description,
      emoji: curriculum.emoji,
      courseCode: curriculum.id,
      units: curriculum.units.map((unit) => ({
        name: unit.name,
        topics: unit.lessons.map(([label]) => label),
      })),
      concepts,
      questions: concepts.flatMap(createLessonQuestions),
    }),
    createdAt: BUILT_IN_CREATED_AT,
    source: curriculum.source,
    curriculumVersion: 10,
  };
}

export const EXAMPLE_DECKS = SUBJECT_CURRICULA.map(buildDeckFromCurriculum);
