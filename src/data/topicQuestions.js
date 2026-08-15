import { GRADE12_STEM_QUESTIONS } from './grade12StemQuestions.js';

function E(prompt, answer, d1, d2, d3, explanation) {
  return { prompt, answer, distractors: [d1, d2, d3], explanation };
}

function pack(easy, medium, hard) {
  return { easy, medium, hard };
}

/** Topic-specific MCQs keyed by exact lesson label. */
export const TOPIC_QUESTIONS = {
  ...GRADE12_STEM_QUESTIONS,
  'Data Types, Expressions, and Control Flow': pack(
    E('A loop should keep asking until the user enters a value in 1..10. Which structure is correct?', 'Repeat the prompt while the value is outside 1..10, then continue.', 'Ask once and crash if the value is invalid.', 'Use a for-loop that always runs exactly 10 times regardless of input.', 'Store the prompt in a float because validation is numeric.', 'Validation belongs in a loop whose condition is “input is still invalid.”'),
    E('Which expression is evaluated first in 2 + 3 * 4, and what is the result?', 'Multiplication first, result 14.', 'Addition first, result 20.', 'Left to right, result 24.', 'The compiler chooses randomly, result 11.', 'Multiplicative operators bind tighter than additive ones unless parentheses override them.'),
    E('A student writes if (x = 5) instead of if (x == 5) in a language that allows assignment in conditions. What failed?', 'Assignment was used where a comparison was required.', 'The loop ran forever because 5 is even.', 'Data types cannot be compared.', 'Control flow ignores Boolean values.', 'x = 5 assigns; x == 5 compares. Validation and branching need a Boolean test.'),
  ),
  'Methods, Parameters, and Scope': pack(
    E('What does calculateTax(subtotal, rate) return if it is defined as subtotal * rate?', 'The product of subtotal and rate.', 'The original subtotal unchanged.', 'Always 0 because helpers cannot return values.', 'The rate only.', 'A helper with those parameters computes subtotal*rate and returns that value.'),
    E('A local variable declared inside calculateTax is used in main. What happens?', 'It is out of scope in main.', 'It becomes global automatically.', 'It is a reference to subtotal.', 'It survives as 0.', 'Local parameters and variables live only in their function body.'),
    E('A student duplicates the tax formula in five screens instead of calling calculateTax. What is the design failure?', 'The same responsibility was not isolated in one function.', 'Parameters cannot be reused.', 'Scope forbids helper functions.', 'Return values are optional in modular code.', 'One helper with a clear contract avoids duplicated formulas.'),
  ),
  'Object-Oriented Design': pack(
    E('A Student object stores name, courses, and calculateAverage(). What does this model?', 'State and behaviour encapsulated together.', 'Only global functions with no data.', 'A stack of integers.', 'A SQL table with no methods.', 'A class bundles fields (state) with methods (behaviour).'),
    E('Why construct a Student instead of using three unrelated variables?', 'The object keeps related data and operations together and reusable.', 'Objects cannot store names.', 'Constructors forbid methods.', 'calculateAverage must be a global constant.', 'Encapsulation groups name, courses, and average logic on one instance.'),
    E('A student calls calculateAverage() before any grades exist and assumes 100. What should the class do?', 'Define a contract for empty courses, such as 0 or an error.', 'Return the student’s name.', 'Ignore encapsulation and use globals.', 'Treat missing data as 100 by default without documenting it.', 'Constructors and methods must handle empty or invalid state explicitly.'),
  ),
  'Inheritance, Polymorphism, and Interfaces': pack(
    E('After Shape s = new Circle(); s.draw() runs, which method is called?', 'Circle.draw().', 'Shape.draw() only, never the subclass.', 'Neither; polymorphism is compile-time only.', 'Object.toString().', 'The runtime type is Circle, so the overridden draw() runs.'),
    E('What is the point of a Shape reference that may point to Circle or Rectangle?', 'One interface can invoke the correct subclass behaviour.', 'All shapes must use identical field names only.', 'Inheritance forbids method overriding.', 'Interfaces delete constructors.', 'Polymorphism lets client code depend on Shape while instances vary.'),
    E('A student casts every Shape to Circle before draw(). What failed?', 'They ignored polymorphism and hardcoded one subclass.', 'Interfaces require casts.', 'draw() cannot be overridden.', 'new Circle() is illegal.', 'The Shape reference should call draw() and dispatch to the actual type.'),
  ),
  'Problem Decomposition and Modular Design': pack(
    E('Which split matches modular design for a grader app?', 'Separate input parsing, domain logic, and output formatting.', 'Put parsing, averaging, and printing in one 400-line main.', 'Keep domain logic inside the GUI event handler only.', 'Duplicate the average formula in every screen.', 'Each module should have one coherent responsibility.'),
    E('A change to report layout should not require rewriting the average calculation. Why?', 'Output formatting is a separate module from domain logic.', 'All code must live in main.', 'Layout and formulas share one function by definition.', 'Modular design forbids UI.', 'Clear interfaces isolate calculation from presentation.'),
    E('A team copies the parser into three programs. What is the design smell?', 'A shared input module was not extracted.', 'Parsing cannot be reused.', 'Domain logic must include I/O.', 'Modules may only be 10 lines.', 'Decomposition means one parser used by many callers.'),
  ),
  'Testing and Debugging Strategies': pack(
    E('A boundary test for a list processor should include which cases?', 'Empty list, one item, and maximum size.', 'Only the largest production dataset.', 'Only happy-path sample data from the README.', 'Random characters instead of the real type.', 'Boundary tests hit empty, singleton, and capacity limits.'),
    E('A test fails. What is the strongest next debugging step?', 'Reproduce the failing input and isolate the first violated invariant.', 'Rewrite all names before reproducing.', 'Catch every exception and return the sample output.', 'Increase input size until it is too slow to watch.', 'Debugging starts from a reproducible failure, then traces state.'),
    E('A program passes one typical input but fails in production. What was missing?', 'Tests for empty, boundary, duplicate, and invalid inputs.', 'Shorter variable names.', 'A larger font in the UI.', 'Deleting the unit tests.', 'One sample is not a test suite.'),
  ),
  'Version Control and Collaboration': pack(
    E('When should you commit a feature?', 'After it works, with a clear message, before starting the next task.', 'Once a week as “stuff”.', 'Only on the last day, as one giant commit.', 'Never; email zip files instead.', 'Small working commits keep history reviewable.'),
    E('What is a code review for?', 'Catch defects and share design before merging.', 'Replace tests.', 'Delete git history.', 'Force everyone onto one laptop.', 'Reviews inspect diffs against the team’s standards.'),
    E('A student force-pushes over a teammate’s work on shared main. What failed?', 'Shared history was rewritten instead of merging or reviewing.', 'Branches are forbidden.', 'Commit messages must be empty.', 'Issues cannot track work.', 'Collaborate with branches, reviews, and non-destructive history.'),
  ),
  'User Interface and Accessibility': pack(
    E('Why must a form label describe the input it controls?', 'Assistive tech and all users need a named control.', 'Labels are decorative only.', 'Placeholders replace labels legally.', 'Color alone is enough.', 'An accessible input has a programmatically associated label.'),
    E('A button is only a red icon with no text or aria-label. What fails?', 'Users who cannot see the color/icon get no name for the action.', 'Icons are always accessible.', 'Red is an accessibility standard.', 'Buttons cannot have labels.', 'Name, role, and state must not rely on color alone.'),
    E('A dialog traps keyboard focus forever with no close control. What failed?', 'Keyboard and screen-reader users cannot dismiss it.', 'Focus order does not matter.', 'Accessibility applies only to color contrast.', 'Mouse users are the only audience.', 'Responsive, readable UI includes keyboard operable dismiss.'),
  ),
  'Algorithm Analysis and Big-O': pack(
    E('Binary search is O(log n) because each step halves the search space. What does O(log n) describe?', 'How runtime grows as n grows, ignoring constants.', 'The exact millisecond time on one laptop.', 'That the algorithm uses extra memory only.', 'That n is always 2.', 'Big-O is an asymptotic growth class; halving each step is logarithmic.'),
    E('About how many comparisons does binary search need on 1,000,000 sorted items?', 'About 20.', 'About 1,000,000.', 'About 2.', 'Exactly n/2 always.', 'log2(10^6) ≈ 20. Each step halves the remaining range.'),
    E('A student claims bubble sort and binary search are both O(n). What failed?', 'They ignored different growth rates: nested scans vs halving.', 'Big-O cannot describe search.', 'Sorted data forbids log n.', 'O(log n) means slower than O(n).', 'Binary search is O(log n); naive bubble sort is O(n^2).'),
  ),
  'Searching Algorithms': pack(
    E('When is binary search valid?', 'The collection is sorted and you can discard half each step.', 'The collection is unsorted.', 'You may only scan from the end.', 'n is less than 10.', 'Binary search requires sorted order.'),
    E('Linear search on n items is which complexity in the worst case?', 'O(n).', 'O(1).', 'O(log n).', 'O(n^2) always.', 'It may inspect every element.'),
    E('A student binary-searches an unsorted array and “finds” a missing key. What failed?', 'The halving argument is invalid unless the data is ordered.', 'Linear search requires sorted data.', 'Index 0 is always the key.', 'Comparisons are forbidden.', 'Unsorted binary search is incorrect.'),
  ),
  'Sorting Algorithms': pack(
    E('Merge sort runs in O(n log n) but uses extra memory. What trade-off is that?', 'Faster guaranteed growth at the cost of auxiliary space.', 'O(1) extra memory and O(n^2) time.', 'No extra memory and unstable order.', 'It cannot sort numbers.', 'Merge sort’s merge step needs a temporary buffer.'),
    E('After selection sort’s first pass on {3,1,2}, what order is expected?', '{1,3,2}.', '{1,2,3} with no comparisons.', '{2,1,3}.', '{3,2,1}.', 'The smallest remaining item is swapped into the first position.'),
    E('A student uses extra O(n) memory for in-place insertion sort and calls it merge sort. What failed?', 'They mixed the memory/time trade-off of two different algorithms.', 'Insertion sort is O(log n).', 'Merge sort cannot use extra memory.', 'Sorting forbids stability.', 'Name the algorithm by its actual strategy and complexity.'),
  ),
  'Lists, Stacks, Queues, and Trees': pack(
    E('A stack returns which item first?', 'The most recently pushed item (LIFO).', 'The oldest item (FIFO).', 'A random item.', 'The median item.', 'Stack = last in, first out.'),
    E('A queue is the right structure for which access pattern?', 'FIFO: first inserted is first removed.', 'LIFO only.', 'Binary search of an unsorted stream.', 'O(1) access to the middle by index always.', 'Queues model waiting lines.'),
    E('A student uses a stack to schedule printer jobs in arrival order. What failed?', 'Arrival order needs a queue, not LIFO.', 'Trees cannot store jobs.', 'Stacks are FIFO.', 'Lists forbid indexing.', 'Pick the structure that matches the access pattern.'),
  ),
  'Recursion and Call Stack Tracing': pack(
    E('factorial(n)=n*factorial(n-1) with factorial(0)=1. What is factorial(3)?', '6.', '3.', '0.', '1.', '3*2*1*1 = 6; the base case stops the recursion.'),
    E('What happens if a recursive function has no base case?', 'The call stack grows until it overflows.', 'It returns 0 immediately.', 'The compiler inserts factorial.', 'It runs in O(1).', 'Every recursive call must eventually hit a base case.'),
    E('A student computes factorial(4) as 4+factorial(3). What failed?', 'The recurrence multiplies, it does not add.', 'The base case is factorial(4)=1.', 'Call stacks cannot nest.', 'n-1 is illegal.', 'The definition is n * factorial(n-1).'),
  ),
  'Ethics, Privacy, and Security': pack(
    E('Which data practice matches “collect only what the feature needs”?', 'Store the minimum fields required and protect them.', 'Log every keystroke “just in case.”', 'Share raw profiles with advertisers by default.', 'Skip consent because the app is free.', 'Privacy requires purpose limitation and protection.'),
    E('A login form stores passwords in plain text. What failed?', 'Secrets were not protected (hashing/salting).', 'Privacy does not apply to passwords.', 'Plain text is required for security audits.', 'Consent replaces hashing.', 'Security includes protecting credentials at rest.'),
    E('A feature is fair for the majority but systematically denies loans to one group. What should you evaluate?', 'Fairness, bias, and harm—not only average accuracy.', 'Only runtime Big-O.', 'Only UI color.', 'Whether git was used.', 'Ethics includes disparate impact, not just intent.'),
  ),
  'Environmental and Social Impact': pack(
    E('Why can efficient software have environmental value?', 'Cloud workloads consume energy; less work can mean less energy.', 'Software cannot affect energy use.', 'Faster code always uses more power.', 'Only hardware efficiency matters.', 'Compute and data movement have energy costs.'),
    E('Which statement is most accurate about AI automation?', 'It can shift jobs and concentrate power; impacts should be assessed.', 'It has no social consequences.', 'It always reduces inequality.', 'Energy use is unrelated to model size.', 'Social and environmental effects are part of the evaluation.'),
    E('A team trains a huge model for a tiny on-device feature. What should they question?', 'Whether the energy and hardware cost match the benefit.', 'Whether Big-O of print() is O(n^2).', 'Whether labels use Comic Sans.', 'Whether recursion is legal.', 'Scale compute to the actual need.'),
  ),
  'Emerging Technologies and Careers': pack(
    E('How should you compare AI tools for a school project?', 'Accuracy, bias risk, cost, and explainability.', 'Only which has the flashiest demo.', 'Only GitHub star count.', 'Only whether it uses recursion.', 'Technical and social criteria together.'),
    E('A career path in computing should be judged by which mix?', 'Technical skills plus ethical and social criteria.', 'Salary only.', 'Typing speed only.', 'Avoiding version control.', 'The course asks for technical and social evaluation.'),
    E('A student picks a tool because it “feels smart” with no accuracy check. What failed?', 'They skipped evidence: accuracy, bias, cost, explainability.', 'Feelings are the required metric.', 'Cost never matters.', 'Explainability is illegal.', 'Evaluate tools with named criteria.'),
  ),

  'Water, pH, and Biological Chemistry': pack(
    E('How does a buffer resist pH change?', 'It accepts or donates H+ ions.', 'It destroys all water polarity.', 'It removes hydrogen bonding.', 'It converts all acids to lipids.', 'Buffers bind extra H+ or release H+ to keep pH relatively stable.'),
    E('Why does water’s polarity matter in cells?', 'It supports hydrogen bonding and shapes reaction environments.', 'It makes all molecules hydrophobic.', 'It prevents pH from existing.', 'It stores genetic information.', 'Polar water interacts with ions and polar solutes.'),
    E('A student treats blood pH like a SCH4U strong-acid calculation and ignores buffers. What failed?', 'They skipped the biological buffering mechanism.', 'pH is unrelated to H+.', 'Buffers only exist in organic chemistry class.', 'Water cannot hydrogen-bond.', 'Physiology uses buffers, not just −log[H3O+] on a beaker.'),
  ),
  'Carbohydrates and Lipids': pack(
    E('Triglycerides form from glycerol and three fatty acids by which process?', 'Condensation (dehydration synthesis).', 'Hydrolysis only.', 'Transcription.', 'Oxidative phosphorylation.', 'Three condensation reactions join fatty acids to glycerol.'),
    E('Which pair of roles is correct?', 'Carbohydrates: energy/structure; lipids: energy storage and membranes.', 'Lipids encode genes; carbs are only enzymes.', 'Both are nucleic acids.', 'Triglycerides are proteins.', 'Match macromolecule to function.'),
    E('A student says triglycerides are assembled by hydrolysis. What failed?', 'Hydrolysis breaks bonds; condensation builds the fat.', 'Glycerol cannot bond.', 'Fatty acids are DNA bases.', 'Membranes forbid lipids.', 'Condensation releases water as the ester bonds form.'),
  ),
  'Proteins and Enzymes': pack(
    E('How do competitive inhibitors affect enzymes?', 'They bind the active site and can be overcome by adding substrate.', 'They permanently destroy ΔH of the reaction.', 'They bind DNA instead of protein.', 'They raise product energy only.', 'Competitive inhibitors compete for the active site; extra substrate outcompetes them.'),
    E('Why does protein structure determine function?', 'Folding creates the specific active site and binding surfaces.', 'Sequence does not matter.', 'All proteins are identical spheres.', 'Enzymes raise activation energy.', 'Shape is the catalytic and binding machinery.'),
    E('A student says enzymes change reactant and product energies (ΔH). What failed?', 'Catalysts lower Ea; they do not rewrite ΔH.', 'Inhibitors are carbohydrates.', 'Active sites bind only DNA.', 'Adding substrate never matters.', 'Enzymes change path, not equilibrium enthalpy.'),
  ),
  'Nucleic Acids and ATP': pack(
    E('ATP hydrolysis releases energy by doing what?', 'Breaking the terminal phosphate bond.', 'Splitting water at photosystem II.', 'Removing exons.', 'Pumping Na+ only.', 'The terminal phosphoanhydride bond is the accessible energy store.'),
    E('DNA, RNA, and ATP are all built from which class of monomer idea?', 'Nucleotide structure (base + sugar + phosphate).', 'Amino acids only.', 'Fatty acids only.', 'Monosaccharides only.', 'Nucleic acids and ATP share nucleotide architecture.'),
    E('A student claims ATP stores information like a gene. What failed?', 'ATP transfers energy; DNA/RNA store information.', 'Hydrolysis writes mRNA.', 'Phosphates are amino acids.', 'Bases are lipids.', 'Do not confuse energy currency with genetic sequence.'),
  ),
  'Glycolysis and Fermentation': pack(
    E('Net yield of glycolysis from one glucose?', '2 ATP and 2 NADH.', '36 ATP and 0 NADH.', '2 ATP and 0 pyruvate.', '0 ATP in all cells.', 'Glycolysis nets 2 ATP and 2 NADH and 2 pyruvate.'),
    E('When is fermentation used after glycolysis?', 'When oxygen is unavailable to reoxidize NADH.', 'Only in the Krebs cycle.', 'Only in the chloroplast stroma.', 'When Rubisco is absent.', 'Fermentation regenerates NAD+ without oxygen.'),
    E('A student says glycolysis requires mitochondria and oxygen. What failed?', 'Glycolysis is cytosolic and anaerobic; O2 is for later respiration.', 'Glucose cannot split.', 'NADH is DNA.', 'Fermentation makes 36 ATP.', 'Location and oxygen requirement were wrong.'),
  ),
  'Krebs Cycle and Electron Transport': pack(
    E('What does NADH do at the electron transport chain?', 'Donate electrons that help pump protons for ATP synthase.', 'Fix CO2 onto RuBP.', 'Splice exons.', 'Bind the active site of pepsin.', 'NADH oxidation drives the proton gradient.'),
    E('Where is most ATP from aerobic respiration made?', 'Oxidative phosphorylation at the inner membrane.', 'Glycolysis only.', 'Fermentation only.', 'The Calvin cycle.', 'The ETC + ATP synthase produce most ATP.'),
    E('A student blocks the ETC but expects Krebs to keep producing NAD+ normally. What failed?', 'Without the ETC, NADH is not reoxidized; Krebs stalls.', 'Krebs is in the nucleus.', 'Protons cannot be pumped in mitochondria.', 'ATP synthase fixes carbon.', 'The cycles are coupled through NAD+/NADH.'),
  ),
  'Photosynthesis Light Reactions': pack(
    E('How does photosystem II replace lost electrons?', 'Splitting H2O and releasing O2.', 'Fixing CO2 with Rubisco.', 'Hydrolyzing ATP only.', 'Removing Okazaki fragments.', 'Water is the electron donor; oxygen is the by-product.'),
    E('What do light reactions produce for the Calvin cycle?', 'ATP and NADPH.', 'Glucose directly in the thylakoid lumen.', 'Pyruvate.', 'Okazaki fragments.', 'The light reactions charge the energy carriers.'),
    E('A student says O2 comes from CO2 in the light reactions. What failed?', 'Released O2 comes from water, not from CO2.', 'PSII does not split water.', 'NADPH is a lipid.', 'Light reactions occur only at night.', 'Isotope experiments show water as the oxygen source.'),
  ),
  'Calvin Cycle and Carbon Fixation': pack(
    E('What does Rubisco do?', 'Attaches CO2 to RuBP during carbon fixation.', 'Splits water at PSII.', 'Makes ATP from NADH.', 'Joins Okazaki fragments.', 'Rubisco carboxylates RuBP.'),
    E('The Calvin cycle uses which products of the light reactions?', 'ATP and NADPH.', 'O2 and glucose.', 'Pyruvate and lactate.', 'DNA ligase.', 'Carbon fixation is powered by light-reaction carriers.'),
    E('A student thinks the Calvin cycle releases the O2 we breathe. What failed?', 'O2 is from water splitting; Calvin reduces carbon.', 'Rubisco splits water.', 'RuBP is a nucleotide.', 'ATP is not used.', 'Separate light reactions from carbon fixation.'),
  ),
  'DNA Replication': pack(
    E('Why does the lagging strand make Okazaki fragments?', 'Synthesis is 5′→3′ while the fork opens the other way on that strand.', 'Ligase copies DNA continuously.', 'Ribosomes read DNA backwards.', 'ATP hydrolysis writes bases.', 'Discontinuous synthesis is required on the lagging strand.'),
    E('What does DNA ligase do on the lagging strand?', 'Join Okazaki fragments.', 'Unwind the helix as helicase.', 'Charge tRNA.', 'Pump protons.', 'Ligase seals nicks after RNA primers are replaced.'),
    E('A student says replication is conservative (parent stays fully intact, child is all new). What failed?', 'Replication is semiconservative: each duplex has one old strand.', 'Ligase forbids fragments.', 'Helicase writes protein.', 'Proofreading deletes all DNA.', 'Meselson–Stahl: hybrid DNA after one generation.'),
  ),
  'Transcription and RNA Processing': pack(
    E('What happens during splicing?', 'Introns are removed and exons joined.', 'Okazaki fragments are ligated.', 'CO2 is fixed to RuBP.', 'ATP loses a phosphate only.', 'Eukaryotic pre-mRNA is spliced.'),
    E('Transcription makes which polymer from DNA?', 'RNA.', 'A polypeptide directly.', 'A triglyceride.', 'ATP only.', 'RNA polymerase synthesizes RNA.'),
    E('A student translates unspliced pre-mRNA as if it were mature mRNA in a eukaryote. What failed?', 'Introns would still be present; processing was skipped.', 'Exons cannot be joined.', 'Capping is optional DNA.', 'Ribosomes copy DNA.', 'Eukaryotic mRNA is capped, spliced, and polyadenylated first.'),
  ),
  'Translation and Protein Synthesis': pack(
    E('What does AUG typically code for to start translation?', 'Methionine (start).', 'Stop.', 'Tryptophan only in prokaryotes.', 'A lipid.', 'AUG is the start codon, methionine.'),
    E('Who delivers amino acids to the ribosome?', 'tRNAs.', 'DNA ligase.', 'Rubisco.', 'ATP synthase only.', 'tRNA anticodons match mRNA codons.'),
    E('A student reads DNA template directly as protein without mRNA. What failed?', 'Translation reads mRNA codons, not raw DNA, at the ribosome.', 'tRNA binds DNA ligase.', 'AUG is a fatty acid.', 'Ribosomes splice DNA.', 'Central dogma: DNA → RNA → protein.'),
  ),
  'Gene Regulation and Mutation': pack(
    E('What does a frameshift mutation do?', 'Change the reading frame downstream of an insertion or deletion.', 'Swap one codon for a similar amino acid only.', 'Always delete a whole chromosome.', 'Turn ATP into DNA.', 'Indels not in multiples of 3 shift every codon after the site.'),
    E('Gene regulation is mainly about what?', 'When and how much a gene is expressed.', 'Only DNA replication speed.', 'Only mitochondrial ATP yield.', 'Only population K.', 'Cells control expression, not just sequence presence.'),
    E('A student says all mutations destroy the protein. What failed?', 'Silent, regulatory, or missense effects can be mild or none.', 'Frameshifts never happen.', 'Regulation cannot change phenotype.', 'AUG cannot mutate.', 'Mutation outcomes vary by type and location.'),
  ),
  'Biotechnology': pack(
    E('PCR doubles target DNA each cycle using primers and which enzyme property?', 'Heat-stable polymerase.', 'DNA ligase as the only enzyme.', 'Rubisco.', 'Pepsin.', 'Taq-like polymerases survive denaturation temperatures.'),
    E('Gel electrophoresis separates DNA fragments by what?', 'Size (and charge in the field).', 'Amino-acid sequence only.', 'Lipid solubility only.', 'Population density.', 'Smaller fragments run farther in the gel.'),
    E('A student runs PCR without primers. What failed?', 'Polymerase has no specific 3′ start; the target will not amplify specifically.', 'Heat-stable means no template needed.', 'Primers are lipids.', 'Each cycle halves DNA.', 'Primers define the amplicon.'),
  ),
  'Negative Feedback Systems': pack(
    E('High blood glucose triggers insulin, lowering glucose toward the set point. What is this?', 'Negative feedback.', 'Positive feedback only.', 'Frameshift regulation.', 'Hardy–Weinberg.', 'The response opposes the stimulus.'),
    E('Name the three standard parts of a homeostatic loop.', 'Receptor, control centre, effector.', 'Intron, exon, ligase.', 'Producer, consumer, decomposer.', 'mRNA, tRNA, rRNA only.', 'Sensor → integrator → effector.'),
    E('A student describes insulin raising glucose further as negative feedback. What failed?', 'That would reinforce the stimulus (positive), not oppose it.', 'Set points cannot exist.', 'Effectors cannot be glands.', 'Receptors are only in skin.', 'Negative feedback reduces the error.'),
  ),
  'Nervous System Signalling': pack(
    E('Depolarization occurs when which channels open?', 'Voltage-gated sodium channels.', 'DNA ligase pores.', 'Rubisco channels.', 'Only potassium leak forever with no change.', 'Na+ influx depolarizes the membrane.'),
    E('How does a neuron carry a long-distance signal?', 'Action potentials along the axon, then synapses.', 'Hormones only in blood.', 'Okazaki fragments.', 'Calvin cycle intermediates.', 'Electrical spike then chemical synapse.'),
    E('A student says the action potential is Na+ leaving the cell. What failed?', 'Depolarization is Na+ entering; K+ exit is repolarization.', 'Synapses are in the nucleus.', 'Ions cannot move.', 'Threshold is optional.', 'Direction of Na+ flux was reversed.'),
  ),
  'Endocrine System Regulation': pack(
    E('What does ADH do in kidney collecting ducts?', 'Increases water reabsorption.', 'Fixes CO2.', 'Starts transcription of insulin only.', 'Blocks all ion channels forever.', 'ADH inserts aquaporins; more water is reabsorbed.'),
    E('Compared with neurons, hormones are typically?', 'Slower and longer-lasting via blood.', 'Faster than action potentials always.', 'Unable to leave glands.', 'DNA primers.', 'Endocrine = broadcast chemical signal.'),
    E('A student treats ADH as increasing urine volume. What failed?', 'More reabsorption means less urine water, not more.', 'Collecting ducts ignore ADH.', 'Hormones cannot reach kidneys.', 'ADH is an enzyme in glycolysis.', 'The physiological effect was inverted.'),
  ),
  'Kidney Function and Osmoregulation': pack(
    E('What does the loop of Henle help create?', 'A concentration gradient for water reabsorption.', 'Action potentials in axons.', 'Okazaki fragments.', 'RuBP.', 'The countercurrent multiplier sets up medullary osmolarity.'),
    E('Nephrons do which trio?', 'Filter, reabsorb useful substances, regulate water and ions.', 'Transcribe DNA, splice, translate.', 'Fix carbon, split water, make O2.', 'Store triglycerides only.', 'Filtration–reabsorption–secretion/osmoregulation.'),
    E('A student says the kidney only dumps everything in urine. What failed?', 'Most filtrate is reabsorbed; urine is the remainder plus secreted wastes.', 'Loops of Henle are in leaves.', 'Ions cannot be regulated.', 'ADH decreases reabsorption always.', 'Selective reabsorption is the point.'),
  ),
  'Population Growth Models': pack(
    E('Logistic growth slows as N approaches what?', 'Carrying capacity K.', 'Infinity with no limit.', 'Zero always.', 'The start codon.', 'dN/dt → 0 as N → K.'),
    E('Exponential models assume what about resources?', 'Unlimited (or density-independent) growth.', 'Immediate hard cap at K=1.', 'No births.', 'Only predator-prey cycles.', 'Exponential is density-independent growth.'),
    E('A student fits an exponential line through a population already at K. What failed?', 'Near K, logistic not exponential is the right model.', 'K cannot exist.', 'N is DNA.', 'Growth cannot slow.', 'Model must match density dependence.'),
  ),
  'Carrying Capacity and Limiting Factors': pack(
    E('Why is disease often density-dependent?', 'Spread often increases with crowding.', 'It never depends on N.', 'It only happens at K=0.', 'It is a frameshift.', 'Contact rate rises with density.'),
    E('A drought killing the same fraction at any density is which type of factor?', 'Density-independent.', 'Only density-dependent.', 'Genetic drift only.', 'A hormone.', 'Abiotic shocks can be density-independent.'),
    E('A student says carrying capacity is the birth rate. What failed?', 'K is the sustainable population size the environment can support.', 'K is mutation rate.', 'Limiting factors never exist.', 'Disease is density-independent always.', 'K is an environment-set ceiling, not a vital rate itself.'),
  ),
  'Predator-Prey and Competition': pack(
    E('Why do predator populations often lag prey?', 'Predators increase after prey are abundant enough to support them.', 'Predators reproduce first always.', 'They occupy the same trophic level.', 'Lag is a PCR artifact.', 'Prey peak → predator peak later.'),
    E('Competition influences communities how?', 'By limiting shared resources and species’ success.', 'By always creating mutualism.', 'By stopping evolution.', 'By fixing carbon.', 'Overlap in resources produces competition.'),
    E('A student plots predators peaking before prey every cycle as the default Lotka–Volterra pattern. What failed?', 'Classic cycles have prey leading, predators lagging.', 'Competition forbids cycling.', 'Lag means zero interaction.', 'K is the predator only.', 'The phase relationship was reversed.'),
  ),
  'Human Impacts and Sustainability': pack(
    E('A sustainable harvest stays where relative to renewal?', 'Below the ecosystem renewal rate.', 'Above all growth forever.', 'At mutation-selection balance only.', 'At PCR plateau.', 'Take less than replacement.'),
    E('Habitat loss, pollution, invasive species, and overuse are examples of what?', 'Human impacts on ecosystems.', 'Hardy–Weinberg assumptions.', 'Light reactions.', 'Stack ADTs.', 'Those are standard anthropogenic pressures.'),
    E('A student defines sustainability as “maximum yield this year.” What failed?', 'Sustainability requires not exceeding long-run renewal.', 'Renewal rates do not exist.', 'Invasives are beneficial always.', 'Pollution cannot change ecosystems.', 'This-year max often collapses next year’s stock.'),
  ),

  'Polynomial End Behaviour and Graphs': pack(
    E('A positive-leading-coefficient cubic does what as x → ±∞?', 'Falls left and rises right.', 'Rises left and falls right.', 'Rises both sides.', 'Falls both sides.', 'Odd degree, positive leading coefficient: down on the left, up on the right.'),
    E('What shapes a polynomial graph besides end behaviour?', 'Zeros and their multiplicities.', 'Vertical asymptotes from the leading term only.', 'A single horizontal asymptote from degree.', 'Random scatter.', 'Roots and multiplicity control intercepts and bounce/cross.'),
    E('A student says a cubic with positive leading coefficient rises on both ends. What failed?', 'That end behaviour is for even degree with positive leading coefficient.', 'Cubes cannot have zeros.', 'Multiplicity is always 0.', 'End behaviour ignores degree.', 'Even vs odd degree was mixed up.'),
  ),
  'Remainder and Factor Theorems': pack(
    E('If f(2)=0, what does the Factor Theorem say?', 'x−2 is a factor.', 'x+2 is a factor.', 'The remainder is 2.', 'f has no real roots.', 'f(a)=0 ⇔ (x−a) is a factor.'),
    E('The Remainder Theorem says f(a) equals what?', 'The remainder when f is divided by (x−a).', 'The leading coefficient.', 'Always 0.', 'The degree.', 'Synthetic/long division remainder is f(a).'),
    E('A student concludes x+2 is a factor because f(2)=0. What failed?', 'f(2)=0 means x−2 is the factor, not x+2.', 'Remainders cannot be zero.', 'Factor Theorem needs derivatives.', 'a cannot be 2.', 'The root is a=2, factor (x−2).'),
  ),
  'Polynomial Inequalities': pack(
    E('For (x−1)(x+2)>0, what must you do besides finding zeros?', 'Test signs on the intervals around −2 and 1.', 'Only plug x=0 and stop.', 'Divide by the variable without a sign chart.', 'Ignore the zeros.', 'Critical points split the line; test a point in each interval.'),
    E('The zeros of (x−1)(x+2) are?', 'x=1 and x=−2.', 'x=0 only.', 'x=2 and x=1.', 'No real zeros.', 'Set each factor to zero.'),
    E('A student includes the zeros in the solution of a strict > inequality. What failed?', 'Strict inequality excludes the roots where the product is 0.', 'Sign charts are illegal.', 'Both factors cannot be negative.', 'Testing intervals is optional.', 'Zeros satisfy =, not >.'),
  ),
  'Rational Functions and Asymptotes': pack(
    E('For (3x^2+2)/(x^2−4), where are the vertical asymptotes?', 'x=2 and x=−2.', 'x=0 only.', 'y=3 only.', 'There are none.', 'Denominator zero at ±2, numerator nonzero.'),
    E('What other features can a rational graph have?', 'Holes, horizontal or slant asymptotes, intercepts, and sign changes.', 'Only a single vertex like a parabola.', 'Only integer slopes.', 'No intercepts ever.', 'Cancel common factors for holes; compare degrees for HA/OA.'),
    E('A student cancels (x−2) and still draws a vertical asymptote at x=2. What failed?', 'A cancelled factor is a hole, not a VA, if it no longer remains in the denominator.', 'Holes are intercepts.', 'Degree never matters.', 'x=2 cannot be a hole.', 'Simplify before classifying discontinuities.'),
  ),
  'Radians and Unit Circle': pack(
    E('π radians equals how many degrees?', '180.', '90.', '360.', '1.', 'A half-turn has arc length πr, so its angle is π radians or 180 degrees.'),
    E('On the unit circle, the coordinates of an angle θ are?', '(cos θ, sin θ).', '(sin θ, cos θ).', '(θ, π).', '(1, θ).', 'x = cos, y = sin.'),
    E('A student converts π/2 to 180°. What failed?', 'π/2 is 90°, not 180°.', 'Radians cannot convert.', 'Unit circle forbids 90°.', 'π is 1 degree.', 'Half of 180° is 90°.'),
  ),
  'Transformations of Sinusoidal Functions': pack(
    E('For y=3sin(2(x−π/4))+1, what are amplitude and period?', 'Amplitude 3, period π.', 'Amplitude 2, period 3.', 'Amplitude 1, period 2π.', 'Amplitude 3, period 2π.', 'A=3; period=2π/2=π.'),
    E('What does the +1 do?', 'Vertical shift up 1.', 'Period becomes 1.', 'Amplitude becomes 1.', 'Phase shift of 1 radian only.', 'k in y=…+k is a vertical translation.'),
    E('A student uses period 2π for y=sin(2x). What failed?', 'The 2 compresses the period to π.', 'Amplitude is 2.', 'Phase is 2π.', 'Vertical shift is 2.', 'Period is 2π/|b|.'),
  ),
  'Trigonometric Identities': pack(
    E('sin²x + cos²x equals?', '1.', '0.', 'sin(2x).', '2.', 'Pythagorean identity.'),
    E('Why use identities when solving equations?', 'To rewrite the equation into solvable forms on the required interval.', 'To avoid the unit circle.', 'To change degrees into polynomials only.', 'They replace the domain.', 'Identities are algebraic tools, not decorations.'),
    E('A student “simplifies” sin²x + cos²x to sin(2x). What failed?', 'The sum of squares is 1, not the double-angle sine.', 'Pythagorean identities are optional.', 'cos²x is always 0.', 'Radians forbid identities.', 'sin(2x)=2sin x cos x, a different identity.'),
  ),
  'Trigonometric Equations': pack(
    E('2sin x − 1 = 0 on [0°, 360°) gives which solutions?', '30° and 150°.', '60° only.', '0° and 180°.', '90° and 270°.', 'sin x = 1/2 at 30° and 150° in that interval.'),
    E('What must a complete trig solution include?', 'All solutions in the requested interval after using identities/restrictions.', 'The first quadrant answer only.', 'A single calculator decimal.', 'The derivative of sine.', 'Sine is positive in QI and QII.'),
    E('A student reports only x=30° for 2sin x=1 on [0,360). What failed?', 'They missed the second quadrant solution 150°.', 'Sine is negative at 30°.', 'The interval forbids 150°.', 'Equations cannot have two roots.', 'Reference angle 30° appears twice where sine is positive.'),
  ),
  'Exponential Growth and Decay': pack(
    E('A(t)=A0(1+r)^t models what?', 'Compound growth (or decay if r is negative).', 'Linear slope only.', 'A sine wave.', 'A vertical asymptote of a rational.', 'Equal intervals multiply by a constant factor.'),
    E('What stays constant in a true exponential model over equal time steps?', 'The growth/decay factor.', 'The first difference.', 'The second derivative only.', 'The angle.', 'Ratios A(t+1)/A(t) are constant.'),
    E('A student fits a line through data that doubles every year. What failed?', 'Doubling is exponential, not linear.', '(1+r)^t is a sine.', 'A0 must be 0.', 'r cannot be positive.', 'Constant additive change ≠ constant multiplicative change.'),
  ),
  'Logarithms and Laws': pack(
    E('log(ab) equals?', 'log a + log b.', 'log a − log b.', 'log a * log b.', 'a^b.', 'Log of a product is a sum of logs.'),
    E('Logs invert which family of functions?', 'Exponentials.', 'Sine.', 'Absolute value.', 'Rationals only.', 'y=log_b x ⇔ b^y=x.'),
    E('A student writes log(a+b)=log a + log b. What failed?', 'The sum rule is for products, not sums.', 'Logs cannot invert exponentials.', 'log(ab)=log a − log b.', 'Bases must be 10.', 'There is no log-of-sum identity of that form.'),
  ),
  'Solving Exponential and Log Equations': pack(
    E('Solve 2^x = 10. Which exact form is correct?', 'x = log(10)/log(2).', 'x = 5.', 'x = 10/2.', 'x = log(2)/10.', 'Take log of both sides: x ln 2 = ln 10.'),
    E('Before taking logs, what must you check?', 'The argument of a log is positive and bases are valid.', 'That x is an integer.', 'That the graph is a sine wave.', 'That n! is defined.', 'Domain of log is (0, ∞); bases >0, ≠1.'),
    E('A student writes 2^x = 10 ⇒ x = 10 − 2. What failed?', 'Exponents are not solved by subtracting the base.', 'Logs invert addition only.', '2^x cannot equal 10.', 'Change of base is illegal.', 'Use logarithms or a common base, not linear subtraction.'),
  ),
  'Applications of Exponential Models': pack(
    E('A half-life model has which form?', 'A = A0 (1/2)^(t/h).', 'A = A0 + (1/2)t.', 'A = A0 t / h.', 'A = 2A0 + h.', 'Each half-life multiplies remaining amount by 1/2.'),
    E('What does h represent in A=A0(1/2)^(t/h)?', 'The time for the quantity to drop to half.', 'The initial amount.', 'A z-score.', 'The period of sine.', 'h is the half-life.'),
    E('A student uses a linear model for radioactive decay over many half-lives. What failed?', 'Decay is multiplicative; a line understates the long-run drop.', '(1/2)^(t/h) is a permutation.', 'Half-life requires a sine.', 'A0 must be zero.', 'Equal time steps multiply by a constant factor.'),
  ),
  'Combining Functions': pack(
    E('(f/g)(x) is undefined where?', 'g(x) = 0.', 'f(x) = 0 only.', 'x is positive.', 'f and g are both linear.', 'Quotients inherit zeros of the denominator as restrictions.'),
    E('A composition (f ∘ g)(x) means?', 'f(g(x)).', 'f(x)+g(x).', 'f(x)g(x).', 'g(f(x)) always, even if the problem writes f∘g.', 'Apply g first, then f.'),
    E('A student computes (f/g)(2) when g(2)=0. What failed?', 'Division by zero is not in the domain of f/g.', 'Composition forbids 2.', 'Sums cannot be defined.', 'f(2) must also be 0.', 'Check inherited restrictions before evaluating.'),
  ),
  'Inverse Functions': pack(
    E('How do you find an inverse from y = f(x) algebraically?', 'Swap x and y, then solve for y.', 'Differentiate both sides.', 'Negate every coefficient.', 'Take the absolute value.', 'The inverse reverses input and output.'),
    E('An inverse exists as a function on a domain when f is what?', 'One-to-one on that domain.', 'Any even degree polynomial.', 'Always a sine.', 'A circle.', 'Horizontal line test / injectivity.'),
    E('A student reflects y=x^2 over y=x and calls the whole parabola an inverse function. What failed?', 'The full parabola is not one-to-one, so the inverse is not a function unless the domain is restricted.', 'Squares cannot have inverses on [0,∞).', 'Swap is illegal.', 'Inverses require logs only.', 'Restrict the domain (e.g. x≥0) first.'),
  ),
  'Average and Instantaneous Rate of Change': pack(
    E('For f(x) = x^2, what is the average rate of change from x = 1 to x = 3?', '4.', '2.', '3.', '6.', 'Secant slope: [f(3)−f(1)]/(3−1)=(9−1)/2=4.'),
    E('How does instantaneous rate of change relate to the average rate?', 'It is the limit of secant slopes as the interval shrinks to a point.', 'It is always the average of all y-values.', 'It equals f(b)+f(a).', 'It is the y-intercept.', 'The derivative is the limiting secant slope.'),
    E('A student reports the average rate from 1 to 3 as f\'(2) without computing the secant. What failed?', 'Average rate uses the interval endpoints; f\'(2) is instantaneous at one point (equal here only by coincidence of this parabola).', 'Secants cannot be computed for x^2.', '3−1 is illegal.', 'Average rate is always 0.', 'Do the secant first; do not skip to a tangent because they happen to match.'),
  ),
  'Mathematical Modelling with Functions': pack(
    E('A rational model may fit rates that level off near what?', 'A horizontal asymptote.', 'A single vertex only.', 'A vertical intercept of sine.', 'K in a logistic with no check.', 'HAs describe long-run levelling.'),
    E('A good model must be checked against what?', 'Context and restrictions, not only an R² number.', 'The fanciest formula in the textbook.', 'Integer coefficients only.', 'Whether it uses logs.', 'Fit, domain, and meaning all matter.'),
    E('A student picks a cubic because it wiggles through every point, including noise. What failed?', 'Overfitting ignores whether the model is interpretable and stable.', 'Cubics cannot have end behaviour.', 'Restrictions never apply.', 'Context forbids checking residuals.', 'More wiggles are not automatically better.'),
  ),

  'Organized Counting Strategies': pack(
    E('3 mains and 4 sides give how many meals if one of each is chosen?', '12.', '7.', '3.', '64.', 'Fundamental counting principle: 3×4=12.'),
    E('Tree diagrams and tables are for what?', 'Organizing a sample space so cases are not double-counted or missed.', 'Computing derivatives.', 'Plotting sine.', 'Storing stacks.', 'Systematic listing is the point of organized counting.'),
    E('A student adds 3+4=7 meal combos. What failed?', 'Independent choices multiply, they do not add.', 'Trees cannot show meals.', 'Four sides forbid mains.', '12 is a permutation only.', '“And” for independent stages → multiply.'),
  ),
  'Permutations and Combinations': pack(
    E('9C4 committees of four from nine people equals?', '126.', '9×4.', '24.', '9!.', 'C(9,4)=126; order in a committee does not matter.'),
    E('When do you use permutations instead of combinations?', 'When order matters.', 'When order never matters.', 'When n=4 only.', 'When data are normal.', 'Arrangements vs selections.'),
    E('A student uses 9P4 for unordered committees. What failed?', 'Committees are combinations; permutations overcount by 4!.', 'C(n,k) requires order.', '9C4 is 9+4.', 'Factorials cannot be used.', 'Divide by k! when order is irrelevant.'),
  ),
  'Probability with Counting': pack(
    E('P(two aces from a deck) is which expression?', 'C(4,2)/C(52,2).', '4/52 + 4/52.', '2/52.', 'C(52,2)/C(4,2).', 'Favorable unordered pairs over all 2-card hands.'),
    E('Why does counting help probability here?', 'Large discrete sample spaces are easier as combinations than as lists.', 'Cards are continuous random variables.', 'C(n,k) is a z-score.', 'Decks have 4 cards.', 'Equally likely hands → ratio of counts.'),
    E('A student uses 4/52 × 4/51 without adjusting for unordered vs ordered consistently. What failed?', 'The counting model must match: ordered product or unordered combinations, not a mix.', 'Aces cannot be drawn.', 'C(4,2) is 8.', 'Replacement is required.', 'Stay in one sample-space model.'),
  ),
  'Conditional Probability': pack(
    E('P(A|B) equals?', 'P(A and B)/P(B).', 'P(A)+P(B).', 'P(A)P(B).', 'P(B|A) always.', 'Definition of conditional probability.'),
    E('What does conditioning do?', 'Updates likelihood given new information.', 'Deletes the sample space.', 'Forces independence.', 'Replaces combinations.', 'We restrict to the B world.'),
    E('A student uses P(A|B)=P(A)/P(B) always. What failed?', 'The numerator must be the joint P(A∩B), not P(A) alone.', 'B cannot have probability.', 'Independence is required.', 'Trees forbid conditioning.', 'Only if A⊂B does P(A∩B)=P(A).'),
  ),
  'Discrete Random Variables': pack(
    E('E(X) for a discrete RV is?', 'sum x P(x).', 'max x.', 'n p only.', 'z=(x−μ)/σ.', 'Expected value is the probability-weighted mean.'),
    E('Probabilities of a discrete RV must do what?', 'Sum to 1.', 'Each exceed 1.', 'Be negative for losses.', 'Equal the mean.', 'A distribution is a valid pmf.'),
    E('A student reports E(X) as the most likely x. What failed?', 'The mean need not be the mode or even a possible value.', 'Sums of p(x) can be 2.', 'x cannot be numeric.', 'P(x) is a z-score.', 'Expectation is an average, not the mode.'),
  ),
  'Binomial Distribution': pack(
    E('For X~Binomial(5, 0.20), P(X=1) equals?', '5(0.20)(0.80)^4.', '(0.20)(0.80)^4.', '5(0.20)^4(0.80).', '1−(0.80)^5.', 'C(5,1) p^1 (1−p)^4.'),
    E('Binomial trials must be what?', 'Fixed n, independent, two outcomes, constant p.', 'Dependent and unbounded n.', 'Normal with σ=1.', 'Sampling without a binary outcome.', 'Bernoulli trials with a cap n.'),
    E('A student uses Binomial when each trial changes p a lot (without replacement from a tiny deck). What failed?', 'p is not constant; hypergeometric may be required.', 'n cannot be 5.', 'Successes cannot be counted.', 'q=1−p is illegal.', 'Independence/constant-p was violated.'),
  ),
  'Normal Distribution and Z-Scores': pack(
    E('A score 85 with mean 70 and sd 10 has z equal to?', '1.5.', '0.67.', '7.0.', '15.', 'z=(85−70)/10=1.5.'),
    E('What does a z-score measure?', 'How many standard deviations a value is from the mean.', 'The residual of a line.', 'C(n,k).', 'A permutation.', 'Standardized relative standing.'),
    E('A student computes z=(70−85)/10. What failed?', 'They reversed observed and mean.', 'sd cannot be 10.', 'Normal curves forbid z.', '85 is not a number.', 'z=(x−μ)/σ, not (μ−x)/σ unless you want the opposite sign.'),
  ),
  'Sampling Distributions': pack(
    E('Larger samples usually do what to standard error?', 'Reduce it.', 'Always increase it.', 'Set it to 1.', 'Delete the population.', 'SE of the mean is σ/√n.'),
    E('A sampling distribution describes what?', 'How a statistic varies from sample to sample.', 'The population histogram only.', 'One person’s score.', 'A stack ADT.', 'The statistic is itself random.'),
    E('A student treats one sample mean as if it had no variability. What failed?', 'They ignored the sampling distribution of the mean.', 'n cannot grow.', 'SE is a residual.', 'Populations have no parameters.', 'Estimates bounce; SE quantifies that bounce.'),
  ),
  'One-Variable Statistics': pack(
    E('Which pair resists extreme outliers better?', 'Median and IQR.', 'Mean and standard deviation.', 'Maximum and range only.', 'Mode and n!.', 'The median/IQR are robust; mean/sd are not.'),
    E('Centre, spread, shape, and outliers summarize what?', 'One-variable data.', 'Two-variable residuals only.', 'A binomial n and p only.', 'A stack.', 'The four-plot story of a single quantitative variable.'),
    E('A student reports only the mean for a heavily skewed income distribution. What failed?', 'Skew and outliers make the mean a poor single summary; include median/shape.', 'IQR cannot be used.', 'Shape is illegal.', 'Outliers must be deleted silently.', 'Match the statistic to the distribution’s shape.'),
  ),
  'Two-Variable Data and Correlation': pack(
    E('A strong r can still come from what?', 'A lurking variable; correlation is not causation.', 'Proof that x causes y.', 'A binomial coefficient.', 'A vertical asymptote.', 'Association ≠ causal proof.'),
    E('Scatter plots and r describe what?', 'Association between two quantitative variables.', 'A single mean.', 'A permutation.', 'A pH buffer.', 'Visualize and measure linear association.'),
    E('A student says r=0.9 proves x causes y. What failed?', 'Even strong correlation can be confounding or reverse causation.', 'r cannot be 0.9.', 'Scatter plots require time.', 'Lurking variables are impossible.', 'Causal claims need design, not just r.'),
  ),
  'Linear Regression and Residuals': pack(
    E('Predicted 18, observed 21. Residual?', '+3.', '−3.', '+39.', '0.86.', 'Residual = observed − predicted = 3.'),
    E('What do residuals reveal?', 'Model fit and leftover pattern.', 'The population census.', 'Big-O.', 'pH.', 'A residual plot should look patternless if the line is adequate.'),
    E('A student computes residual as predicted − observed and gets −3 here. What failed?', 'The sign convention is observed minus predicted.', '18 cannot be a prediction.', 'Residuals must be 0.', 'Regression forbids 21.', 'Keep the textbook sign so over/under-prediction is consistent.'),
  ),
  'Confidence Intervals and Error': pack(
    E('A 95% interval is best described as?', 'A range of plausible parameter values under that method.', 'A guarantee the next point is inside.', 'The probability a random person scores 95.', 'The residual of y.', 'The method captures the parameter in 95% of repeated samples.'),
    E('Why mention sampling variability?', 'The interval accounts for sample-to-sample error.', 'Parameters bounce, statistics do not.', 'n is irrelevant.', '95 means p=0.95 for one trial.', 'Uncertainty is the point of the interval.'),
    E('A student says “there is a 95% chance this specific interval contains μ” as the definition taught in MDM4U. What is the careful correction?', '95% refers to the long-run success of the method, not a probability about a fixed interval after seeing it.', 'Intervals cannot contain μ.', '95% means z=95.', 'Error bars are residuals.', 'Once computed, the interval either does or does not contain μ.'),
  ),
  'Research Question Design': pack(
    E('Which is a better investigation question?', 'Does study time predict test score?', 'Is studying good?', 'Are tests real?', 'Should schools exist?', 'Specific, measurable variables beat vague value questions.'),
    E('A strong question needs what?', 'Defined variables that can actually be measured.', 'Only a topic noun.', 'A conclusion written first.', 'A p-value before data.', 'Operationalize the variables.'),
    E('A student asks “is social media bad?” with no metrics. What failed?', 'The question is not specific or measurable.', 'Social media cannot be studied.', 'Variables are illegal.', 'Only experiments are allowed.', 'Name the variables and the population.'),
  ),
  'Data Collection and Bias': pack(
    E('Voluntary response surveys often do what?', 'Overrepresent strong opinions.', 'Guarantee a census.', 'Remove all bias.', 'Force a normal distribution.', 'People with strong views self-select.'),
    E('What determines whether conclusions are trustworthy?', 'Sampling method, measurement quality, and bias.', 'Font size of the report.', 'Whether r is 0.9.', 'The app’s dark mode.', 'Garbage sample → garbage inference.'),
    E('A student tweets a poll and treats it as a random sample of Canadians. What failed?', 'The sampling frame is a voluntary, platform-biased group.', 'Tweets cannot be data.', 'Bias only happens in chemistry.', 'Random samples forbid numbers.', 'Convenience/voluntary samples do not support population claims.'),
  ),
  'Analysis Plan and Communication': pack(
    E('Two quantitative variables should usually be shown how?', 'A scatter plot, with residual patterns discussed.', 'A pie chart of means.', 'A stack trace.', 'A unit circle.', 'Match plot type to variable types.'),
    E('A good report includes what?', 'Methods, calculations, limitations, visuals, and justified conclusions.', 'Only the final number.', 'Only screenshots of an answer key.', 'Only the title.', 'Communicate the whole argument, including limits.'),
    E('A student hides limitations because the result “looks significant.” What failed?', 'Limitations are required; hiding them overclaims the data.', 'Visuals are forbidden.', 'Methods cannot be written.', 'Residuals must be deleted.', 'Honest communication includes what the study cannot say.'),
  ),
};

export function getTopicQuestions(label) {
  return TOPIC_QUESTIONS[label] || null;
}
