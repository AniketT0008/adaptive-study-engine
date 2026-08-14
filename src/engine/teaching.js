function hash(value) {
  return [...String(value)].reduce((total, character) => ((total * 31) + character.charCodeAt(0)) >>> 0, 0);
}

function cleanSentence(value = '') {
  const text = String(value).replace(/\s+/g, ' ').trim();
  if (!text) return '';
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function uniqueParagraphs(paragraphs) {
  const seen = new Set();
  return paragraphs.filter((paragraph) => {
    const normalized = paragraph.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

/** Build a durable, offline textbook entry instead of displaying a one-line catalog summary. */
export function getTextbookDefinition({ label, unit, summary = '', example = '', support, paragraphCount = 3 }) {
  const existingParagraphs = String(summary).split(/\n\s*\n/).map(cleanSentence).filter(Boolean);
  if (existingParagraphs.length >= paragraphCount && String(summary).length >= 420) {
    return existingParagraphs.slice(0, paragraphCount).join('\n\n');
  }

  const definition = cleanSentence(summary) || `${label} is a central idea in ${unit || 'this lesson'}.`;
  const mechanism = cleanSentence(support?.intuition)
    || `${label} is understood by identifying the quantities or structures involved, the conditions under which the idea applies, and the relationship that connects cause to result.`;
  const workedMethod = cleanSentence(support?.workedExplanation)
    || `To use ${label}, name the givens and assumptions, carry out the governing step, and verify the conclusion against units, signs, boundary cases, or observable evidence.`;
  const concreteExample = cleanSentence(example);

  const paragraphs = uniqueParagraphs([
    `${definition} ${mechanism}`,
    `${workedMethod} The method is complete only when every symbol, structure, state, or input has been identified and the conditions that justify the governing relationship have been checked.`,
    concreteExample
      ? `Worked example: ${concreteExample} Follow the example from the givens through the governing step to the conclusion, then verify it using conservation, units, charge, limiting behaviour, a boundary case, or an independent test appropriate to ${label}.`
      : `Worked application: begin with a small explicit case, apply ${label} one step at a time, and state what each step changes or preserves. Finish with an independent check and predict how the result changes when one input or condition is altered.`,
  ]);

  return paragraphs.slice(0, paragraphCount).join('\n\n');
}

export function getUnitOverview(name, topics = [], concepts = []) {
  const topicNames = topics.filter(Boolean);
  const firstTopics = topicNames.slice(0, 4);
  const unitConcepts = concepts.filter((concept) => concept.unit === name);
  const scope = firstTopics.length
    ? `${firstTopics.join(', ')}${topicNames.length > firstTopics.length ? ', and related ideas' : ''}`
    : unitConcepts.slice(0, 4).map((concept) => concept.label).join(', ');
  const progression = topicNames.length > 1
    ? `The sequence moves from ${topicNames[0]} toward ${topicNames[topicNames.length - 1]}, so later lessons rely on definitions, representations, and checks introduced earlier.`
    : 'The lessons develop a shared vocabulary, a reliable method of reasoning, and ways to test whether a result is defensible.';
  const unitExample = unitConcepts.find((concept) => concept.example)?.example;

  return `${name} organizes the connected ideas of ${scope || 'the central concepts in this part of the course'}. Rather than treating the lessons as separate facts, the unit shows how their models and methods fit together. Each topic adds a tool for describing a system, carrying out a calculation or explanation, and interpreting the result in context.\n\n${progression} By the end of the unit, a learner should be able to choose an appropriate method, state its assumptions, connect multiple topics in one problem, and verify the final conclusion with evidence, units, limiting behaviour, or a test case.${unitExample ? `\n\nRepresentative example: ${cleanSentence(unitExample)} This example is a starting point: later lessons change the conditions or representation while preserving the unit’s central reasoning.` : ''}`;
}

export function rotateOptions(answer, distractors, seed) {
  const rotatedDistractors = distractors.map((_, index) => distractors[(index + (hash(seed) % distractors.length)) % distractors.length]);
  const answerIndex = hash(`${seed}-answer`) % (distractors.length + 1);
  return [
    ...rotatedDistractors.slice(0, answerIndex),
    answer,
    ...rotatedDistractors.slice(answerIndex),
  ];
}

export function getTeachingSupport(label, snippet = '', example = '') {
  const text = `${label} ${snippet}`.toLowerCase();
  const defaultSupport = {
    intuition: `${label} is useful because it turns the general idea in this unit into a decision you can defend. First identify what is given and what conditions apply; then use the rule to explain the result, not merely name it.`,
    workedExplanation: `Read the worked example as a chain of decisions: identify the target, state the governing idea, carry out the key operation, and check that the conclusion fits the assumptions.`,
  };

  if (/average and instantaneous rate/.test(text)) {
    return {
      intuition: 'Average rate of change is a secant slope: it connects two distinct points on the graph and summarizes change over an interval. Instantaneous rate is a tangent slope: it describes the graph at one point. The derivative is what the secant slopes approach as the interval shrinks.',
      workedExplanation: 'For average rate, write the two x-values first, find both function values, then compute Delta y / Delta x. Do not differentiate unless the question asks for an instantaneous rate.',
    };
  }
  if (/continuity and discontinuities/.test(text)) {
    return {
      intuition: 'Continuity means you can trace the graph through the point without lifting your pencil: the left-hand limit, right-hand limit, and actual function value all meet. A hole, jump, and vertical asymptote are different failures and need different fixes.',
      workedExplanation: 'Check continuity in three parts: calculate the left-hand limit, calculate the right-hand limit, then compare their common value with f(a). A removable discontinuity has a hole and can be repaired by defining f(a) to equal the limit.',
    };
  }
  if (/derivative from first principles/.test(text)) {
    return {
      intuition: 'First principles starts with a secant slope over a small horizontal change h. The limit as h approaches zero turns that secant slope into the exact tangent slope.',
      workedExplanation: 'Substitute f(x+h), expand, subtract f(x), factor h from the numerator, cancel only after h is a factor, then take the limit h to zero.',
    };
  }
  if (/power, constant, and sum rules/.test(text)) {
    return {
      intuition: 'Derivative rules are a fast summary of first principles: powers bring down their exponents, constants have no change, and independent terms can be differentiated separately.',
      workedExplanation: 'Differentiate each term on its own, reduce every power by one, remove constants, then combine like terms only after differentiating.',
    };
  }
  if (/product and quotient rules/.test(text)) {
    return {
      intuition: 'When two changing quantities are multiplied or divided, neither can be treated as constant. Product and quotient rules keep track of both rates of change.',
      workedExplanation: 'Name the two factors first, differentiate each one separately, substitute into the product or quotient rule, and simplify only after every term is present.',
    };
  }
  if (/chain rule/.test(text)) {
    return {
      intuition: 'A composite function is a process inside a process. The chain rule measures how the outside changes with its input and how quickly that input changes with x.',
      workedExplanation: 'Mark the inside function, differentiate the outside while keeping the inside unchanged, then multiply by the derivative of the inside function.',
    };
  }
  if (/related rates/.test(text)) {
    return {
      intuition: 'Related rates describes a geometric relationship while several quantities change in time. The relationship is true at every moment, so differentiating with respect to time connects their rates.',
      workedExplanation: 'Write one equation involving all changing variables, differentiate both sides with respect to time, substitute numerical values only at the end, and keep the rate units visible.',
    };
  }
  if (/dot product/.test(text)) {
    return {
      intuition: 'The dot product measures alignment. It is positive for similar directions, negative for opposing directions, and zero when non-zero vectors are perpendicular.',
      workedExplanation: 'Multiply matching components and add, or use |u||v|cos(theta). Then interpret the sign or use zero to test perpendicularity.',
    };
  }
  if (/cross product/.test(text)) {
    return {
      intuition: 'The cross product packages two ideas: a direction perpendicular to both vectors and a magnitude equal to the area they span.',
      workedExplanation: 'Use the determinant pattern carefully, keep the sign of each component, then verify the result is perpendicular to both original vectors with dot products.',
    };
  }
  if (/derivative from first principles/.test(text)) {
    return {
      intuition: 'First principles starts with the secant slope over a tiny horizontal change h. Algebra simplifies the difference quotient; the limit h to zero then leaves the exact tangent slope.',
      workedExplanation: 'Substitute f(x+h), expand carefully, subtract f(x), factor h from the numerator, cancel only after h is a factor, and finally take the limit h to zero.',
    };
  }
  if (/organic reactions/.test(text)) {
    return {
      intuition: 'Organic reaction names tell you what changes in the carbon skeleton or functional group. The useful question is not just “what reaction is this?” but “which bonds are made or broken, and what reagent or condition makes that change plausible?”',
      workedExplanation: 'For an esterification, identify the carboxylic acid and alcohol, remove water conceptually, then join the acyl carbon to the alcohol oxygen. Name the ester from the alcohol alkyl group followed by the acid-derived alkanoate.',
    };
  }
  if (/hydrocarbons|isomerism/.test(text)) {
    return {
      intuition: 'A molecular formula reports how many atoms are present, but an isomer shows how those atoms are connected. Carbon can form chains, branches, rings, and multiple bonds, so compounds with the same formula can have different shapes, intermolecular forces, boiling points, and reactivity. Structural isomers differ in connectivity; geometric isomers keep the same connectivity but differ in the spatial arrangement around a rigid double bond or ring.',
      workedExplanation: 'Begin by calculating the degree of unsaturation, then draw each distinct carbon skeleton before placing multiple bonds or functional groups. For C4H10, a straight four-carbon chain gives butane and a three-carbon chain with a methyl branch gives 2-methylpropane. Rotating or redrawing the same connectivity does not create a new isomer, so compare which carbon is bonded to which rather than comparing page orientation.',
    };
  }
  if (/functional groups|naming/.test(text)) {
    return {
      intuition: 'A functional group is the reactive region of an organic molecule and determines the suffix, numbering priority, polarity, and many characteristic reactions. The carbon skeleton supplies the parent name, while substituents and the highest-priority functional group specify exactly which compound is meant. A correct IUPAC name therefore acts like an address: parent chain, locations, substituents, and functional-group ending.',
      workedExplanation: 'Choose the longest chain containing the highest-priority functional group, number it to give that group the lowest possible locant, identify and alphabetize substituents, and finish with the correct suffix. CH3CH2OH has two carbons and an alcohol group, so the parent is ethane and the -e becomes -ol: ethanol. Numbering from the wrong end or choosing a longer chain that omits the principal group produces an invalid name.',
    };
  }
  if (/polymer|macromolecule/.test(text)) {
    return {
      intuition: 'A polymer is a large molecule built from repeating monomer units. Addition polymerization opens carbon-carbon double bonds without eliminating a small molecule, whereas condensation polymerization forms links such as esters or amides while releasing a molecule such as water. The repeating unit must show the bonds that continue through the chain, not merely a drawing of the original monomer.',
      workedExplanation: 'For ethene, open the C=C bond, connect many -CH2-CH2- units, place the repeat inside brackets, and write n outside. For a polyester, identify a diol and a dicarboxylic acid, form ester links at both ends, and account for the water removed. Check that every atom from the monomers is conserved across the repeat unit and the eliminated molecules.',
    };
  }
  if (/quantum model|electron configuration|orbital/.test(text)) {
    return {
      intuition: 'The quantum model describes electrons with orbitals: probability distributions characterized by principal level, subshell, orientation, and spin. Electrons fill lower-energy orbitals first, occupy equal-energy orbitals singly before pairing, and no two electrons in one atom share all four quantum numbers. Electron configuration explains valence structure and therefore periodic trends and bonding behaviour.',
      workedExplanation: 'Use the Aufbau order, place at most two opposite-spin electrons in each orbital, and apply Hund’s rule across p, d, or f orbitals. Oxygen has eight electrons: 1s2 2s2 2p4. Its three 2p orbitals receive one electron each before the fourth pairs, leaving two unpaired electrons; writing 2p4 without an orbital diagram can hide this chemically important detail.',
    };
  }
  if (/periodic trends/.test(text)) {
    return {
      intuition: 'Periodic trends are a competition between nuclear pull and distance or shielding. Across a period, more protons pull the same shell inward; down a group, extra shells place valence electrons farther from the nucleus.',
      workedExplanation: 'When comparing two elements, mark whether the move is across or down the table. Then explain atomic radius, ionization energy, or electronegativity using effective nuclear charge, shielding, and electron distance rather than memorizing an arrow.',
    };
  }
  if (/vsepr|intermolecular force/.test(text)) {
    return {
      intuition: 'VSEPR predicts molecular geometry by arranging electron domains around a central atom to minimize repulsion. Lone pairs repel more strongly than bonding pairs and compress bond angles. Intermolecular forces act between molecules: London dispersion occurs in all particles, dipole-dipole attraction occurs between polar molecules, and hydrogen bonding requires H bonded directly to N, O, or F.',
      workedExplanation: 'Draw a complete Lewis structure, count each single, double, or triple bond as one electron domain, include lone pairs, and name both electron-domain geometry and molecular shape. Water has four domains around oxygen but only two bonded atoms, so its electron geometry is tetrahedral and its molecular shape is bent. Its O-H bonds and bent shape create a net dipole, enabling hydrogen bonding and an unusually high boiling point.',
    };
  }
  if (/enthalpy|calorimetry/.test(text)) {
    return {
      intuition: 'Enthalpy change is the heat transferred at constant pressure. In an insulated coffee-cup calorimeter, heat lost by the reacting system is gained by the solution, so qreaction = -qsolution. The relation q = mcΔT works because specific heat capacity measures energy required per unit mass per degree of temperature change.',
      workedExplanation: 'Record the sign of ΔT = Tfinal - Tinitial, calculate qsolution = mcΔT, reverse the sign for qreaction, and divide by moles reacted if molar enthalpy is requested. Heating 100.0 g of water by 5.0 °C requires q = (100.0 g)(4.18 J g−1 °C−1)(5.0 °C) = 2.09 kJ. If the water warmed, the reaction released that energy, so the reaction enthalpy is negative.',
    };
  }
  if (/hess|formation enthalpy/.test(text)) {
    return {
      intuition: 'Hess’s law follows from enthalpy being a state function: ΔH depends only on initial and final states, not the route taken. Chemical equations can therefore be reversed, multiplied, and added like algebra, provided their enthalpy changes are reversed or multiplied in exactly the same way.',
      workedExplanation: 'Write the target equation, manipulate known equations until intermediate species cancel, apply the same operations to each ΔH, and add. Alternatively use ΔH°rxn = ΣnΔH°f(products) − ΣnΔH°f(reactants). Coefficients matter because enthalpy is extensive; reversing a reaction changes the sign, while catalysts do not change ΔH.',
    };
  }
  if (/collision theory|activation energy|catalyst/.test(text)) {
    return {
      intuition: 'A reaction occurs only when particles collide with enough kinetic energy to overcome the activation barrier and with an orientation that permits bonds to rearrange. Temperature increases both collision frequency and the fraction of particles above Ea. A catalyst supplies a different mechanism with lower activation energy but leaves reactant and product enthalpies—and therefore equilibrium position—unchanged.',
      workedExplanation: 'Use an energy-profile diagram to distinguish activation energy from ΔH. Raising temperature broadens the energy distribution so a larger area lies beyond Ea; increasing concentration mainly increases collision frequency. A catalyst lowers the peak for both forward and reverse pathways, so equilibrium is reached faster without changing K or the equilibrium composition.',
    };
  }
  if (/rate law|reaction mechanism/.test(text)) {
    return {
      intuition: 'A rate law relates reaction rate to reactant concentrations through experimentally determined orders: rate = k[A]^m[B]^n. The exponents describe sensitivity to concentration and generally cannot be copied from the overall balanced equation unless the reaction is elementary. A proposed mechanism must reproduce both the overall equation and the observed rate law.',
      workedExplanation: 'Compare trials where only one concentration changes. If doubling [A] quadruples rate, 2^m = 4 and m = 2; if changing [B] has no effect, n = 0. Then substitute one trial into the rate law to find k with appropriate units. For a mechanism, identify the slow step and eliminate intermediates from its rate expression using a preceding fast equilibrium when necessary.',
    };
  }
  if (/dynamic equilibrium|\bkc\b|equilibrium constant/.test(text)) {
    return {
      intuition: 'Dynamic equilibrium occurs in a closed system when forward and reverse reaction rates are equal. Concentrations remain constant but reactions continue microscopically. Kc is the product of equilibrium product concentrations raised to stoichiometric powers divided by the analogous reactant expression; pure solids and liquids are omitted because their activities are effectively constant.',
      workedExplanation: 'For N2(g) + 3H2(g) ⇌ 2NH3(g), write Kc = [NH3]^2/([N2][H2]^3). Substitute equilibrium—not initial—concentrations and retain every exponent. Compare Qc with Kc to predict direction: Q < K shifts forward, Q > K shifts reverse, and Q = K is already at equilibrium.',
    };
  }
  if (/le chatelier/.test(text)) {
    return {
      intuition: 'Le Châtelier’s principle predicts how an equilibrium composition responds to a disturbance. The system shifts in the direction that consumes an added species, replaces a removed species, or reduces a pressure change. Temperature is special because heat acts as a reactant or product; only temperature changes the value of K.',
      workedExplanation: 'Write the balanced equilibrium and mark heat on the correct side. Adding a reactant lowers Q and drives the forward reaction; decreasing volume favours the side with fewer moles of gas. A catalyst changes neither Q nor K and therefore causes no shift—it merely speeds both directions equally.',
    };
  }
  if (/acid-base|\bph\b|\bpoh\b/.test(text)) {
    return {
      intuition: 'Brønsted acids donate protons and bases accept them. Strong acids ionize essentially completely, whereas weak acids establish equilibria quantified by Ka. Because pH = −log[H3O+], a one-unit pH change represents a tenfold concentration change, not a linear change.',
      workedExplanation: 'Write the ionization equation, decide whether dissociation is complete or requires an ICE table, solve for [H3O+], and then take −log. A solution with [H3O+] = 1.0×10−3 mol L−1 has pH 3.00. For weak acids, check the small-x approximation against the 5% rule and distinguish initial acid concentration from equilibrium hydronium concentration.',
    };
  }
  if (/buffer|titration/.test(text)) {
    return {
      intuition: 'A buffer contains a weak acid/base conjugate pair that consumes small additions of OH− or H3O+. Its pH depends mainly on the ratio of base to acid, expressed by Henderson–Hasselbalch. A titration curve tracks the dominant species: before equivalence there may be a buffer region, at half-equivalence pH = pKa, and at equivalence stoichiometry determines the resulting acid-base equilibrium.',
      workedExplanation: 'First perform mole stoichiometry between titrant and analyte; only then choose the equilibrium calculation appropriate to the region. Before equivalence in a weak-acid/strong-base titration, calculate remaining HA and produced A− and use their ratio. At equivalence, A− hydrolysis makes the solution basic, so assuming pH 7 is a common error.',
    };
  }
  if (/oxidation number|\bredox\b/.test(text)) {
    return {
      intuition: 'Redox reactions transfer electrons. Oxidation is an increase in oxidation number and loss of electrons; reduction is a decrease and gain. The oxidizing agent is reduced because it accepts electrons, while the reducing agent is oxidized because it supplies them.',
      workedExplanation: 'Assign oxidation numbers using elemental values of zero, monatomic ion charges, and usual oxygen and hydrogen rules. In Zn + Cu2+ → Zn2+ + Cu, zinc changes 0 to +2 and loses two electrons, while copper changes +2 to 0 and gains them. Electron loss and gain must match after coefficients are applied.',
    };
  }
  if (/balancing redox/.test(text)) {
    return {
      intuition: 'The half-reaction method balances mass and charge separately for oxidation and reduction, then combines the halves so electrons cancel. In acidic solution H2O balances oxygen and H+ balances hydrogen; in basic solution an acidic balance is converted by adding OH− to both sides.',
      workedExplanation: 'Split the reaction, balance non-H/O atoms, balance O with H2O, H with H+, charge with electrons, and multiply halves to equalize electrons. Add and cancel identical species. For basic solution, add OH− to neutralize every H+, form water, cancel excess water, and verify both total atoms and net charge.',
    };
  }
  if (/galvanic cells? and cell potential/.test(text)) {
    return {
      intuition: 'A galvanic cell separates a spontaneous redox reaction so electrons travel through a wire. Oxidation occurs at the anode, reduction at the cathode, and a positive Ecell means the cell reaction is spontaneous as written.',
      workedExplanation: 'Write the two reduction half-reactions, identify the more positive reduction potential as the cathode, reverse the other half-reaction for oxidation, then calculate Ecell = Ecathode - Eanode. Never multiply voltage values by balancing coefficients.',
    };
  }
  if (/electrolytic|faraday|electrolysis/.test(text)) {
    return {
      intuition: 'An electrolytic cell uses external electrical energy to force a non-spontaneous redox reaction. Oxidation still occurs at the anode and reduction at the cathode, but the electrode signs reverse relative to a galvanic cell. Faraday’s law connects circuit charge to chemical amount because one mole of electrons carries approximately 96 485 C.',
      workedExplanation: 'Calculate charge with Q = It, convert to moles of electrons using ne− = Q/F, use the balanced half-reaction to convert electrons to moles of product, then convert to mass or gas volume. For Cu2+ + 2e− → Cu, two moles of electrons deposit one mole of copper. Ignoring that 2:1 ratio doubles the predicted mass.',
    };
  }
  if (/chemical bonding|molecular polarity|vsepr/.test(text)) {
    return {
      intuition: 'Bond polarity and molecular polarity are not the same. First identify polar bonds from electronegativity differences, then use the three-dimensional shape to decide whether their dipoles cancel.',
      workedExplanation: 'Draw the Lewis structure, count electron domains around the central atom, predict the VSEPR shape, then add the bond dipoles as vectors. A symmetric arrangement can be nonpolar even when individual bonds are polar.',
    };
  }
  if (/newton|force|motion|kinematic|projectile/.test(text)) {
    return {
      intuition: 'Physics equations are compressed models, not automatic calculators. A diagram makes the direction choices visible; the equation only works after its assumptions and coordinate signs match the situation.',
      workedExplanation: 'Draw and label the system, choose positive directions, list known quantities with units, select one governing equation, solve symbolically, and finally check that the sign and magnitude are physically sensible.',
    };
  }
  if (/probability|distribution|random|markov|poisson/.test(text)) {
    if (/markov|transition|state/.test(text)) {
      return {
        intuition: `${label} represents a system by named states and the probabilities of moving between them. The Markov property says the next-state distribution depends on the present state rather than the entire earlier path, so the transition matrix is a compact model of repeated change.`,
        workedExplanation: `Order the states, build a row-stochastic transition matrix, multiply the current distribution by that matrix, and interpret every resulting component as a probability. For long-run questions, solve πP = π together with probabilities summing to one and then check whether irreducibility or absorbing states affect the interpretation.`,
      };
    }
    if (/poisson|counting|waiting|renewal/.test(text)) {
      return {
        intuition: `${label} models random events distributed through time. A Poisson process assumes independent increments and a constant average rate, which makes counts Poisson-distributed and interarrival times exponential; changing either assumption changes the model.`,
        workedExplanation: `Define the time interval and rate in matching units, decide whether the question asks for a count or a waiting time, and write the event before calculating. Check that probabilities remain between zero and one and interpret the result as frequency or waiting-time risk, not as a guaranteed schedule.`,
      };
    }
    return {
      intuition: `${label} describes a repeatable uncertainty structure by connecting possible outcomes to probabilities or long-run frequencies. The key is defining the random quantity, population, and conditioning information before calculating, because a correct formula can answer the wrong question when the event is misread.`,
      workedExplanation: `For ${label}, state the random variable, identify the distribution or process and its parameters, write the event mathematically, calculate, and translate the probability or expectation back into context. Then test whether independence, sample size, or distributional assumptions are actually justified.`,
    };
  }
  if (/program|function|algorithm|data|recursion|class|testing/.test(text)) {
    if (/loop|iteration|control|condition|boolean/.test(text)) {
      return {
        intuition: `${label} controls which statements execute and how often. A condition is a Boolean claim about current program state; a loop is correct only when its invariant is preserved and its update eventually makes the stopping condition true.`,
        workedExplanation: `Trace ${label} with a table containing the condition, changed variables, and output after each iteration. Test zero iterations, exactly one iteration, and the first value outside the intended range; these cases reveal off-by-one errors and non-terminating updates.`,
      };
    }
    if (/function|parameter|return|scope|decomposition|helper/.test(text)) {
      return {
        intuition: `${label} packages a transformation behind a contract: valid inputs, promised output, and side effects. Parameters create local names for incoming values, return values communicate results, and scope determines where each binding can be used without accidental interference.`,
        workedExplanation: `Write the contract and two examples before the body, trace how each argument binds to a parameter, and verify every control path returns the promised kind of result. Separate one coherent responsibility per function and test boundary inputs independently.`,
      };
    }
    if (/array|list|collection|search|sort|traversal/.test(text)) {
      return {
        intuition: `${label} organizes multiple values so an algorithm can access or transform them systematically. Correct reasoning tracks index validity, element order, mutation, and the invariant that separates processed data from data still to examine.`,
        workedExplanation: `Use a small collection with distinct values, record each index and comparison, and trace one complete pass. Include empty, one-element, duplicate, already-sorted, and missing-target cases; then explain time cost in terms of collection length.`,
      };
    }
    if (/recursion|tree|backtracking|graph/.test(text)) {
      return {
        intuition: `${label} solves a structure by reducing it to smaller instances of the same kind. Correct recursive design requires a base case, a reduction that makes measurable progress, and a way to combine smaller answers without losing part of the structure.`,
        workedExplanation: `State the data definition, derive the recursive template, trace the call tree on the smallest non-trivial input, and verify that every recursive call is closer to a base case. For search, mark visited states or undo choices deliberately so cycles and stale state do not corrupt the result.`,
      };
    }
    return {
      intuition: `${label} becomes precise when data is traced through a small concrete example. The important question is what state changes, what must remain invariant, and which input boundary could violate the program’s contract.`,
      workedExplanation: `For ${label}, name the input and required output, choose a tiny example, trace every relevant variable or call, test a boundary case, and explain which invariant or contract remains true throughout.`,
    };
  }
  if (/cell|dna|protein|enzyme|population|homeostasis|photosynth/.test(text)) {
    if (/dna|gene|transcription|translation|inherit/.test(text)) {
      return {
        intuition: `${label} connects stored nucleotide information to a molecular or inherited outcome. Sequence matters because complementary base pairing copies information, while codons and regulatory regions determine when and how that information is expressed.`,
        workedExplanation: `Identify the DNA strand direction, apply complementary pairing, distinguish template from coding strand, and track the result through RNA or inheritance. State where the process occurs, which enzyme or cellular structure performs each step, and how an altered sequence could change the product.`,
      };
    }
    if (/population|ecology|selection|evolution/.test(text)) {
      return {
        intuition: `${label} describes change in populations rather than purposeful change in individuals. Resource limits, interactions, heritable variation, and differential reproductive success alter frequencies over generations and can produce feedback between species and environment.`,
        workedExplanation: `Define the population and time scale, identify the mechanism changing births, deaths, immigration, emigration, or allele frequencies, and interpret the graph or data. Separate correlation from mechanism and test whether density dependence or a limiting resource explains the observed pattern.`,
      };
    }
    return {
      intuition: `${label} is best understood as a biological mechanism: a structure or molecule performs a specific role, a signal or condition changes that activity, and an observable cellular or system-level outcome follows. Tracking this causal chain prevents vocabulary from replacing explanation.`,
      workedExplanation: `For ${label}, identify the structures or molecules involved, place events in causal order, state what changes at each step, and link the mechanism to the observed phenotype or system-level outcome. Include location, direction, and energy or matter transfer where relevant.`,
    };
  }
  const lenses = [
    `Treat ${label} as a model with defined inputs, a governing relationship, and an output that must be interpreted.`,
    `Understand ${label} by separating what is observed, what is assumed, and what mechanism connects the two.`,
    `${label} becomes useful when its representation—equation, diagram, process, or algorithm—is connected to a concrete case.`,
    `A rigorous account of ${label} states its scope, explains why each step follows, and identifies a check that could disprove a mistaken result.`,
  ];
  const lens = lenses[hash(label) % lenses.length];
  return {
    intuition: `${lens} ${defaultSupport.intuition}`,
    workedExplanation: `${defaultSupport.workedExplanation} Use the lesson example as evidence rather than decoration: ${example || snippet}`,
  };
}

export function getAppliedQuestionSpec(concept) {
  const text = `${concept.label} ${concept.sourceSnippet}`.toLowerCase();
  if (/average and instantaneous rate/.test(text)) {
    return {
      prompt: 'For f(x) = x^2, what is the average rate of change from x = 1 to x = 3?',
      answer: '4',
      distractors: ['2', '3', '6'],
      explanation: 'Use the secant slope: [f(3) - f(1)] / (3 - 1) = (9 - 1) / 2 = 4. This is average rate of change, not a tangent slope.',
    };
  }
  if (/continuity and discontinuities/.test(text)) {
    return {
      prompt: 'A graph approaches y = 2 from both sides at x = 1, but has an open circle there and f(1) is undefined. Which statement is correct?',
      answer: 'It has a removable discontinuity at x = 1.',
      distractors: ['It has a jump discontinuity at x = 1.', 'It is continuous because the limit exists.', 'It has a vertical asymptote at x = 1.'],
      explanation: 'The two-sided limit exists, but the function value is missing. Defining f(1) = 2 would make the function continuous there.',
    };
  }
  if (/derivative from first principles/.test(text)) {
    return { prompt: 'For f(x) = x^2, which expression must be simplified before taking the limit to find f\'(x) from first principles?', answer: '[(x + h)^2 - x^2] / h', distractors: ['[x^2 - (x + h)^2] / x', '[f(x) - f(h)] / h', '[x^2 + h^2] / h'], explanation: 'First principles uses [f(x+h)-f(x)]/h. Expand, factor h, cancel it, then take the limit.' };
  }
  if (/power, constant, and sum rules/.test(text)) {
    return { prompt: 'What is d/dx(4x^5 - 3x^2 + 7)?', answer: '20x^4 - 6x', distractors: ['20x^4 - 6x + 7', '4x^4 - 3x', '20x^5 - 6x^2'], explanation: 'Differentiate each term: 4x^5 becomes 20x^4, -3x^2 becomes -6x, and 7 becomes 0.' };
  }
  if (/product and quotient rules/.test(text)) {
    return { prompt: 'If y = x^2 sin x, which derivative is correct?', answer: '2x sin x + x^2 cos x', distractors: ['2x cos x', 'x^2 cos x', '2x sin x cos x'], explanation: 'Product rule gives (2x)(sin x) + (x^2)(cos x).' };
  }
  if (/chain rule/.test(text)) {
    return { prompt: 'What is d/dx[(2x^3 - 5)^4]?', answer: '24x^2(2x^3 - 5)^3', distractors: ['4(2x^3 - 5)^3', '24x^3(2x^3 - 5)^4', '8x^2(2x^3 - 5)^3'], explanation: 'Differentiate the outer fourth power, then multiply by the inner derivative, 6x^2.' };
  }
  if (/related rates/.test(text)) {
    return { prompt: 'A circle has A = pi r^2. If r = 3 cm and dr/dt = 2 cm/s, what is dA/dt?', answer: '12pi cm^2/s', distractors: ['6pi cm^2/s', '18pi cm^2/s', '12pi cm/s'], explanation: 'dA/dt = 2pi r(dr/dt) = 2pi(3)(2) = 12pi cm^2/s.' };
  }
  if (/dot product/.test(text)) {
    return { prompt: 'If non-zero vectors u and v have u dot v = 0, what must be true?', answer: 'The vectors are perpendicular.', distractors: ['The vectors have equal magnitude.', 'The vectors are parallel.', 'The cross product is zero.'], explanation: 'Because u dot v = |u||v|cos(theta), a zero dot product means theta = 90 degrees.' };
  }
  if (/cross product/.test(text)) {
    return { prompt: 'What geometric quantity is |u x v| for two vectors u and v?', answer: 'The area of the parallelogram spanned by u and v', distractors: ['The length of the projection of u onto v', 'The angle between u and v', 'The volume of the parallelepiped spanned by u and v'], explanation: '|u x v| = |u||v|sin(theta), the base-times-height area of the parallelogram.' };
  }
  if (/galvanic cells? and cell potential/.test(text)) {
    return {
      prompt: 'A galvanic cell has Ecathode = +0.34 V and Eanode = -0.76 V (both listed as reduction potentials). What is Ecell and what does its sign mean?',
      answer: '+1.10 V; the cell reaction is spontaneous.',
      distractors: ['-0.42 V; the cell reaction is spontaneous.', '+0.42 V; the cell reaction is non-spontaneous.', '-1.10 V; the cell reaction is non-spontaneous.'],
      explanation: 'Ecell = Ecathode - Eanode = +0.34 - (-0.76) = +1.10 V. A positive cell potential indicates a spontaneous galvanic-cell reaction.',
    };
  }
  if (/periodic trends/.test(text)) {
    return {
      prompt: 'Which explanation best accounts for atomic radius decreasing from left to right across a period?',
      answer: 'Effective nuclear charge increases while electrons are added to the same principal shell.',
      distractors: ['More shielding is added because a new principal shell begins.', 'The number of protons decreases, weakening attraction to valence electrons.', 'Valence electrons move farther from the nucleus as the period continues.'],
      explanation: 'Across a period, protons are added but electrons enter the same shell, so the nucleus pulls the electron cloud inward more strongly.',
    };
  }
  if (/organic reactions/.test(text)) {
    return {
      prompt: 'Ethanoic acid reacts with ethanol under acidic conditions. What organic product is expected?',
      answer: 'Ethyl ethanoate and water',
      distractors: ['Ethene and water', 'Ethanol and oxygen', 'Sodium ethanoate and hydrogen'],
      explanation: 'A carboxylic acid plus an alcohol undergoes esterification to form an ester and water.',
    };
  }
  if (/hydrocarbons|isomerism/.test(text)) {
    return { prompt: 'How many structural isomers does C4H10 have?', answer: '2: butane and 2-methylpropane', distractors: ['1: butane only', '3: butane, but-1-ene, and but-2-ene', '4: one for each carbon atom'], explanation: 'C4H10 forms either a straight four-carbon chain or a branched skeleton. Rotations of one connectivity are not new isomers.' };
  }
  if (/functional groups|naming/.test(text)) {
    return { prompt: 'Which name correctly identifies CH3CH2COOH?', answer: 'Propanoic acid', distractors: ['Propanal', 'Propanone', 'Propyl ethanoate'], explanation: 'The molecule has three carbons and a terminal carboxyl group, so it uses the -oic acid suffix.' };
  }
  if (/vsepr|intermolecular force/.test(text)) {
    return { prompt: 'The displayed model has two bonds and two lone pairs around its central atom. What shape and strongest intermolecular force describe H2O?', answer: 'Bent; hydrogen bonding', distractors: ['Linear; London dispersion only', 'Tetrahedral; ionic bonding', 'Trigonal planar; dipole-induced dipole only'], explanation: 'Four electron domains give tetrahedral electron geometry, but two bonded atoms give a bent molecular shape. O−H bonds enable hydrogen bonding.' };
  }
  if (/chemical bonding|molecular polarity/.test(text)) {
    return { prompt: 'CO2 contains polar C=O bonds. Why is the molecule nonpolar overall?', answer: 'Its linear geometry makes the equal bond dipoles cancel.', distractors: ['Carbon and oxygen have identical electronegativities.', 'Double bonds cannot possess dipoles.', 'The molecule alternates between unrelated polar structures.'], explanation: 'Molecular polarity is the vector sum of bond dipoles. The two equal dipoles oppose one another in linear CO2.' };
  }
  if (/enthalpy|calorimetry/.test(text)) {
    return { prompt: 'A reaction warms 100.0 g of water by 5.0 °C. Using c = 4.18 J g−1 °C−1, how much heat does the water absorb?', answer: '2.09 kJ', distractors: ['0.0836 kJ', '20.9 kJ', '−2.09 kJ'], explanation: 'qwater = mcΔT = (100.0)(4.18)(5.0) = 2090 J = 2.09 kJ. The reaction has the opposite sign.' };
  }
  if (/hess|formation enthalpy/.test(text)) {
    return { prompt: 'If a thermochemical equation is reversed and then multiplied by 2, what happens to ΔH?', answer: 'Its sign reverses and its magnitude doubles.', distractors: ['Only its sign reverses.', 'Only its magnitude doubles.', 'It remains unchanged because enthalpy is a state function.'], explanation: 'Reversing swaps initial and final states; scaling the reaction scales the amount of energy.' };
  }
  if (/collision theory|activation energy|catalyst/.test(text)) {
    return { prompt: 'On an energy-profile diagram, what changes when a catalyst is introduced?', answer: 'The activation-energy peak is lower, but reactant and product energies are unchanged.', distractors: ['The product energy falls, making ΔH more negative.', 'Only the forward barrier falls; the reverse barrier rises.', 'The reactant energy rises above the original peak.'], explanation: 'A catalyst provides a lower-energy pathway for both directions without changing ΔH or K.' };
  }
  if (/rate law|reaction mechanism/.test(text)) {
    return { prompt: 'For rate = k[A]^2[B], what happens when [A] doubles and [B] stays constant?', answer: 'The rate becomes four times as large.', distractors: ['The rate doubles.', 'The rate becomes eight times as large.', 'The rate does not change.'], explanation: 'The [A] factor changes by 2² = 4; the [B] factor is unchanged.' };
  }
  if (/dynamic equilibrium|\bkc\b|equilibrium constant/.test(text)) {
    return { prompt: 'For N2(g) + 3H2(g) ⇌ 2NH3(g), which Kc expression is correct?', answer: '[NH3]^2 / ([N2][H2]^3)', distractors: ['[N2][H2]^3 / [NH3]^2', '2[NH3] / ([N2] + 3[H2])', '[NH3] / ([N2][H2])'], explanation: 'Equilibrium concentrations are raised to stoichiometric powers, with products over reactants.' };
  }
  if (/le chatelier/.test(text)) {
    return { prompt: 'For N2(g) + 3H2(g) ⇌ 2NH3(g), what happens when volume decreases at constant temperature?', answer: 'The system shifts right, toward fewer moles of gas.', distractors: ['It shifts left, toward more gas particles.', 'Kc increases and forces a shift right.', 'No shift occurs because all species are gases.'], explanation: 'Compression favours two product moles over four reactant moles. Kc is unchanged at constant temperature.' };
  }
  if (/acid-base|\bph\b|\bpoh\b/.test(text)) {
    return { prompt: 'What is the pH when [H3O+] = 1.0 × 10−3 mol L−1?', answer: '3.00', distractors: ['−3.00', '11.00', '0.001'], explanation: 'pH = −log(1.0 × 10−3) = 3.00.' };
  }
  if (/buffer|titration/.test(text)) {
    return { prompt: 'At half-equivalence in a weak-acid/strong-base titration, which relationship is true?', answer: 'pH = pKa because [A−] = [HA].', distractors: ['pH = 7 because acid and base moles are equal.', 'pOH = pKa because all HA has reacted.', 'pH = Ka because concentrations cancel.'], explanation: 'Half the weak acid has become conjugate base, so Henderson–Hasselbalch gives pH = pKa.' };
  }
  if (/electrolytic|faraday|electrolysis/.test(text)) {
    return { prompt: 'A current of 2.00 A flows for 965 s. How many moles of electrons pass? Use F = 96 500 C mol−1.', answer: '0.0200 mol e−', distractors: ['0.0100 mol e−', '0.200 mol e−', '1930 mol e−'], explanation: 'Q = It = 1930 C, and Q/F = 0.0200 mol e−.' };
  }
  if (/circular motion|centripetal/.test(text)) {
    return { prompt: 'A 2.0 kg object moves at 6.0 m/s in a circle of radius 3.0 m. What inward force is required?', answer: '24 N', distractors: ['4 N', '12 N', '72 N'], explanation: 'Fc = mv²/r = (2.0)(6.0²)/(3.0) = 24 N.' };
  }
  if (/work and energy transfer/.test(text)) {
    return { prompt: 'A 20 N force acts through 3.0 m in the displacement direction. How much work is done?', answer: '60 J', distractors: ['6.7 J', '23 J', '0 J'], explanation: 'W = Fd cos 0° = (20)(3.0) = 60 J.' };
  }
  if (/power and efficiency/.test(text)) {
    return { prompt: 'A motor transfers 1200 J in 4.0 s. What is its average power?', answer: '300 W', distractors: ['4.8 kW', '1204 W', '0.0033 W'], explanation: 'P = ΔE/Δt = 1200/4.0 = 300 W.' };
  }
  if (/momentum|impulse|collision/.test(text)) {
    return { prompt: 'A 2.0 kg cart at 3.0 m/s sticks to a stationary 1.0 kg cart. What is their final speed?', answer: '2.0 m/s', distractors: ['1.0 m/s', '3.0 m/s', '6.0 m/s'], explanation: '(2.0)(3.0) = (3.0)vf, so vf = 2.0 m/s.' };
  }
  if (/electric force|electric field/.test(text)) {
    return { prompt: 'A +2.0 μC charge experiences 0.060 N east. What is the electric field?', answer: '3.0 × 10^4 N/C east', distractors: ['1.2 × 10−7 N/C east', '3.0 × 10^4 N/C west', '1.2 × 10−4 N/C east'], explanation: 'E = F/q = 0.060/(2.0 × 10−6) = 3.0 × 10^4 N/C east.' };
  }
  if (/magnetic force/.test(text)) {
    return { prompt: 'A charge moves parallel to a uniform magnetic field. What magnetic force acts?', answer: 'Zero, because sin 0° = 0.', distractors: ['qvB in the motion direction', 'qvB opposite the field', 'A force determined only by charge sign'], explanation: 'FB = qvB sin θ, so parallel vectors produce zero force.' };
  }
  if (/double-slit|diffraction/.test(text)) {
    return { prompt: 'Wavelength increases while slit spacing and screen distance stay fixed. What happens to bright-fringe spacing?', answer: 'It increases.', distractors: ['It decreases.', 'It remains unchanged.', 'All bright fringes disappear.'], explanation: 'Δy = λL/d, so fringe spacing increases with wavelength.' };
  }
  if (/special relativity/.test(text)) {
    return { prompt: 'At v = 0.80c, what is γ = 1/√(1−v²/c²)?', answer: '1.67', distractors: ['0.60', '0.80', '2.78'], explanation: 'γ = 1/√(1−0.64) = 1/0.60 ≈ 1.67.' };
  }
  if (/binomial distribution/.test(text)) {
    return { prompt: 'For X ~ Binomial(5, 0.20), which expression equals P(X = 1)?', answer: '5(0.20)(0.80)^4', distractors: ['(0.20)(0.80)^4', '5(0.20)^4(0.80)', '1 − (0.80)^5'], explanation: 'Choose one success position and multiply one success by four failures.' };
  }
  if (/normal distribution|z-score/.test(text)) {
    return { prompt: 'A score is 85 with mean 70 and standard deviation 10. What is its z-score?', answer: '1.5', distractors: ['0.67', '7.0', '15'], explanation: 'z = (85 − 70)/10 = 1.5.' };
  }
  if (/linear regression|residual/.test(text)) {
    return { prompt: 'A model predicts 18 and the observed value is 21. What is the residual?', answer: '+3', distractors: ['−3', '+39', '0.86'], explanation: 'Residual = observed − predicted = 21 − 18 = +3.' };
  }
  const example = concept.example || concept.sourceSnippet || '';
  const numericMatch = example.match(/(?:=|equals|is)\s*(-?\d+(?:\.\d+)?)/i);
  if (numericMatch) {
    const value = Number(numericMatch[1]);
    const direction = value >= 0 ? 'positive' : 'negative';
    return {
      prompt: `Which statement best applies ${concept.label} to the worked example in this lesson?`,
      answer: `The result is ${value}, so the quantity is ${direction}.`,
      distractors: [
        'The calculation should be ignored because the example has no numerical result.',
        'The result must be zero because the concept is defined by a change.',
        'The sign can be removed before interpreting the physical or mathematical meaning.',
      ],
      explanation: `Use the worked example as evidence: keep the numerical value and its sign, then interpret what that result means for ${concept.label}.`,
    };
  }

  return {
    prompt: `Which approach best demonstrates ${concept.label} in a new problem?`,
    answer: `State the given information, apply ${concept.label}, and check the result against the problem conditions.`,
    distractors: [
      'State the definition only and skip the given information.',
      'Choose a formula first and ignore whether its assumptions match the problem.',
      'Give a final answer without showing the key reasoning step.',
    ],
    explanation: `A strong application of ${concept.label} starts from the givens, uses the appropriate method, and checks the result against the conditions of the problem.`,
  };
}

function getTransferQuestionSpec(concept) {
  const text = `${concept.label} ${concept.shortDefinition || concept.sourceSnippet}`.toLowerCase();
  const method = concept.workedExplanation || `Apply ${concept.label} from the stated givens and verify the result.`;

  if (/galvanic cells? and cell potential/.test(text)) {
    return { prompt: 'Given E°red(Cu2+/Cu) = +0.34 V and E°red(Zn2+/Zn) = −0.76 V, which complete interpretation is correct for a Zn–Cu galvanic cell?', answer: 'Zn is the anode, Cu is the cathode, and E°cell = +1.10 V.', distractors: ['Cu is the anode, Zn is the cathode, and E°cell = +1.10 V.', 'Zn is the anode, Cu is the cathode, and E°cell = −0.42 V.', 'Zn is the cathode, Cu is the anode, and E°cell = −1.10 V.'], explanation: 'The more positive reduction occurs at Cu. Zinc is oxidized, and E°cell = 0.34 − (−0.76) = +1.10 V.' };
  }
  if (/periodic trends/.test(text)) {
    return { prompt: 'Which comparison and explanation are both correct?', answer: 'Mg has a smaller radius than Na because its greater effective nuclear charge pulls electrons in the same shell more strongly.', distractors: ['Mg has a larger radius than Na because it has more protons.', 'Na has a higher first ionization energy because its radius is larger.', 'Na and Mg have equal radii because their valence electrons occupy n = 3.'], explanation: 'Across Period 3, shielding changes little while nuclear charge rises. Magnesium therefore pulls its n = 3 electrons closer and generally has the higher ionization energy.' };
  }
  if (/newton|force|kinematic|projectile|energy|momentum|electric|magnetic|wave|relativity/.test(text)) {
    return { prompt: `A student starts a ${concept.label} problem by substituting numbers before drawing the system or choosing signs. What is the strongest correction?`, answer: 'Define the system and positive direction, write the governing equation symbolically, then substitute values with units.', distractors: ['Keep the substitution but remove negative signs to avoid direction errors.', 'Choose whichever equation contains the most given numbers.', 'Average all given values before selecting a physical model.'], explanation: method };
  }
  if (/program|function|loop|array|list|recursion|algorithm|class|testing|data/.test(text)) {
    return { prompt: `Which test strategy gives the strongest evidence that an implementation of ${concept.label} is correct?`, answer: 'Trace a normal case, a boundary case, and a case that would violate the function contract if unchecked.', distractors: ['Run one typical input and accept the program if it does not crash.', 'Inspect only the final output and ignore intermediate state.', 'Use the largest possible input first and skip small examples.'], explanation: method };
  }
  if (/probability|distribution|markov|poisson|statistics|regression|sampling|counting/.test(text)) {
    return { prompt: `Which setup is essential before calculating a result with ${concept.label}?`, answer: 'Define the random variable or population, identify the conditioning information, and verify the model assumptions.', distractors: ['Choose the formula with the most parameters and infer the random variable afterward.', 'Treat observed association as proof of causation.', 'Discard units and context so only the numerical answer remains.'], explanation: method };
  }

  return { prompt: `A student must transfer ${concept.label} to a new problem. Which plan is most defensible?`, answer: `Identify the givens and assumptions, apply the governing mechanism for ${concept.label}, and check the result independently.`, distractors: [`Repeat the definition of ${concept.label} without using the new givens.`, 'Substitute into the first familiar formula and ignore its conditions.', 'Choose the answer that matches the worked example even if the inputs differ.'], explanation: method };
}

function getErrorAnalysisQuestionSpec(concept) {
  const text = `${concept.label} ${concept.shortDefinition || ''}`.toLowerCase();
  const mistake = concept.commonMistake || `applying ${concept.label} without checking its assumptions`;

  if (/galvanic|electrolytic|redox|equilibrium|acid|buffer|enthalpy|rate|bond|vsepr|organic|periodic/.test(text)) {
    return {
      prompt: `Two students obtain different results for ${concept.label}. Which audit is most likely to locate a chemically meaningful error?`,
      answer: 'Check the balanced species and states, mole or electron ratios, governing expression, sign convention, and whether equilibrium or reaction conditions match the calculation.',
      distractors: [
        'Force every coefficient and exponent to equal the number of atoms in the largest molecule.',
        'Keep the setup but reverse every sign because chemical products must have positive values.',
        'Average the two numerical answers; experimental uncertainty normally makes their mean chemically correct.',
      ],
      explanation: `Chemical errors usually arise from species bookkeeping, stoichiometric ratios, signs, states, or inappropriate assumptions. ${concept.workedExplanation || ''}`.trim(),
    };
  }
  if (/derivative|limit|vector|function|optimization|probability|distribution|regression|statistics/.test(text)) {
    return {
      prompt: `A solution to ${concept.label} has correct arithmetic but an unjustified setup. Which revision is strongest?`,
      answer: 'Restate the domain and assumptions, derive the required expression from the definition or model, and test it with an endpoint, sign, unit, or special case.',
      distractors: [
        'Keep the setup and add more decimal places so the approximation appears stable.',
        'Differentiate or average every quantity once more, regardless of what the question asks.',
        'Replace the original data with values that make the familiar formula easier to use.',
      ],
      explanation: `Correct arithmetic cannot repair a model that does not apply. ${concept.workedExplanation || ''}`.trim(),
    };
  }
  if (/force|motion|energy|momentum|field|wave|orbit|fluid|dynamics|vibration/.test(text)) {
    return {
      prompt: `A ${concept.label} calculation gives a plausible magnitude but the wrong physical conclusion. What should be checked first?`,
      answer: 'Recheck the system boundary, vector directions, sign convention, units, and assumptions before repeating the symbolic calculation.',
      distractors: [
        'Change the sign of the final number only; the diagram and coordinate system cannot affect the model.',
        'Use conservation of energy even if external non-conservative work crosses the chosen system boundary.',
        'Treat every vector quantity as positive because magnitude is the only physically measurable property.',
      ],
      explanation: `A plausible number can still describe the wrong direction or system. ${concept.workedExplanation || ''}`.trim(),
    };
  }
  if (/program|function|loop|array|list|recursion|algorithm|class|testing|data/.test(text)) {
    return {
      prompt: `An implementation of ${concept.label} passes its sample input but fails in production. Which debugging step gives the best evidence?`,
      answer: 'Trace state against the contract on empty, one-item, boundary, duplicate, and invalid inputs, then isolate the first violated invariant.',
      distractors: [
        'Add a catch-all exception handler that returns the sample output for every failure.',
        'Rewrite the program with shorter variable names before reproducing the failing input.',
        'Increase the input size until the failure becomes too slow to observe.',
      ],
      explanation: `A passing example does not establish correctness across the input domain. ${concept.workedExplanation || ''}`.trim(),
    };
  }

  return {
    prompt: `A student is ${mistake.charAt(0).toLowerCase()}${mistake.slice(1).replace(/[.]$/, '')}. Which revision best repairs the reasoning?`,
    answer: `State the relevant condition for ${concept.label}, redo the key step from the givens, and verify the conclusion against the original problem.`,
    distractors: [
      'Keep the same work but round the final answer more aggressively.',
      `Quote the definition of ${concept.label} again without changing the calculation or explanation.`,
      'Remove units, signs, and boundary conditions so the result is easier to compare.',
    ],
    explanation: `The error is conceptual, not cosmetic. A correct solution must repair the assumption or setup, then recompute and check the result. ${concept.workedExplanation || ''}`.trim(),
  };
}

export function getQuestionSet(concept) {
  return [
    { difficulty: 'easy', ...getAppliedQuestionSpec(concept) },
    { difficulty: 'medium', visual: true, ...getTransferQuestionSpec(concept) },
    { difficulty: 'hard', ...getErrorAnalysisQuestionSpec(concept) },
  ];
}
