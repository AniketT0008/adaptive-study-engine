function E(prompt, answer, d1, d2, d3, explanation) {
  return { prompt, answer, distractors: [d1, d2, d3], explanation };
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stemFromExample(example, answer) {
  const text = String(example).trim().replace(/[.,;]+$/, '');
  const escaped = escapeRegExp(answer);
  const trailing = new RegExp(`(?:gives|equals|is|prints|returns|produces|has|yields|=|:)?\\s*${escaped}$`, 'i');
  if (trailing.test(text)) {
    return text.replace(trailing, '').replace(/[.,;:=]+$/, '').trim();
  }
  const last = text.lastIndexOf(String(answer));
  if (last >= Math.max(0, text.length - String(answer).length - 8)) {
    const stem = `${text.slice(0, last).replace(/[.,;:=]+$/, '').trim()} ___`.trim();
    if (stem.length >= 28 && !/(?:the expression|the result|gives|so the)$/i.test(stem.replace(/_+/g, '').trim())) {
      return stem;
    }
  }
  return text;
}

const LESSON_PACKS = {};

function add(rows) {
  for (const line of rows.trim().split("\n")) {
    const [label, fact, example, answer, d1, d2, d3] = line.split("\t");
    const stem = stemFromExample(example, answer);
    LESSON_PACKS[label] = {
      snippet: `${fact} ${example}`,
      example,
      intuition: fact,
      worked: example,
      goal: `Use ${label} correctly and explain why the stated result follows.`,
      mistake: `For ${label}, a common error is concluding ${d1} instead of ${answer}.`,
      easy: E(
        `${fact} ${stem}. What is the result?`,
        answer,
        d1,
        d2,
        d3,
        `${fact} Therefore the worked result is ${answer}.`,
      ),
      medium: E(
        `Given this ${label} setup: ${example} Why is ${answer} the result rather than ${d1}?`,
        fact,
        `The result must be ${d1} because the given values can be ignored.`,
        `Average the givens and report ${d2} without using ${label}.`,
        `${answer} and ${d1} are interchangeable if the arithmetic looks neat.`,
        `${fact} Therefore the worked result is ${answer}.`,
      ),
      hard: E(
        `In this ${label} example: ${example} A student reported ${d1} instead of ${answer}. What failed?`,
        `They skipped the evaluation that produces ${answer} from the given setup.`,
        `Nothing failed; ${d1} is interchangeable with ${answer}.`,
        `Keep ${d1} and round until it matches ${d3}.`,
        `Drop units, signs, or regularity conditions, then keep ${d1}.`,
        `${example} The correct result is ${answer}.`,
      ),
    };
  }
}

add(`Variables and primitive types	C++ primitive types such as int, double, char, and bool determine representation and permitted operations.	int n = 7; double x = n / 2.0; gives x = 3.5.	x = 3.5	x = 3	x = 4	n becomes 3.5
Expressions and operators	C++ evaluates multiplicative operators before additive ones unless parentheses override precedence.	For 2 + 3 * 4, multiplication gives 12 first, so the expression is 14.	14	20	24	11
Input, output, and formatting	std::cin extracts typed values, while iomanip manipulators control std::cout formatting.	With double x = 3.14159, cout << fixed << setprecision(2) << x prints 3.14.	3.14	3.14159	3.1	314
Tracing and dry-running code	A trace table records each variable after every C++ statement and exposes order-dependent updates.	Starting x=2, then y=x+3 and x=y*2 leaves y=5 and x=10.	x=10 and y=5	x=5 and y=10	x=4 and y=5	x=10 and y=10
Boolean logic and conditionals	&& requires both operands true, || requires at least one, and ! negates a Boolean.	For x=7, the condition x>5 && x<10 is true, so its if branch runs.	the if branch runs	the else branch runs	both branches run	the condition is false
Loops and iteration patterns	A counted C++ loop separates initialization, continuation test, and update.	for (int i=0; i<4; ++i) executes its body for i=0,1,2,3: four times.	4 iterations	3 iterations	5 iterations	an infinite loop
Nested loops	A nested loop executes the inner loop fully for each outer iteration.	An outer loop of 3 iterations and inner loop of 4 iterations executes the body 3*4=12 times.	12	7	16	64
Error handling and defensive checks	Defensive checks reject invalid state before an unsafe operation such as division or indexing.	Before computing 10/d, checking d==0 prevents division when d is zero.	reject d=0	compute infinity	silently use d=1	access an array instead
Function signatures and return values	A C++ function signature specifies its name, parameter types, and return type.	int square(int x) { return x*x; } called with 5 returns 25.	25	10	5	0
Parameter passing	Pass-by-value copies an argument, whereas a reference parameter can modify the caller's object.	void inc(int& x){++x;} changes an argument n from 4 to 5.	n becomes 5	n stays 4	n becomes 8	n is destroyed
Scope and lifetime	A local automatic variable is visible only in its block and lives until that block exits.	An int x declared inside an if block cannot be named after the closing brace.	x is out of scope	x becomes global	x has value zero	x is a reference
Modular decomposition	Modular decomposition gives each function one coherent responsibility and a clear interface.	A program can read values, call mean(values), then call printReport(mean), isolating calculation from I/O.	mean performs the calculation	printReport sorts values	main must duplicate the formula	all code belongs in one function
Arrays and lists	A C++ array or vector stores an indexed sequence whose first valid index is zero.	For vector<int> v{8,3,6}, v[1] is 3.	3	8	6	an invalid access
Traversal and aggregation	Aggregation updates an accumulator once per traversed element.	Summing {2,5,7} from total=0 produces 0+2+5+7=14.	14	7	10	0
Searching collections	Linear search checks elements until a match is found or the collection ends.	In {4,9,2}, searching for 9 finds it at zero-based index 1 after two checks.	index 1	index 2	index 0	not found
Sorting fundamentals	Selection sort repeatedly places the smallest remaining element into the next position.	Sorting {3,1,2}, the first pass swaps 1 forward to obtain {1,3,2}.	{1,3,2}	{2,1,3}	{3,2,1}	{1,2,3} after no comparisons
References and aliases	A C++ reference is an alias, so writes through it affect the same object.	int x=6; int& r=x; r=9; leaves x equal to 9.	x=9	x=6	x=15	x is uninitialized
Pointers or object references	A pointer stores an address, and dereferencing accesses the pointed-to object.	int x=4; int* p=&x; *p=11; changes x to 11.	x=11	x=4	p=11	the address becomes zero
Classes and encapsulation	Encapsulation keeps representation private and exposes validated operations through public methods.	A BankAccount::deposit(20) method can add 20 to a private balance of 50, producing 70.	balance 70	balance 30	balance 50	balance 1000
Testing and debugging workflow	A focused test states inputs and expected output; a debugger then localizes deviations from that expectation.	Testing square(0), square(3), and square(-2) should expect 0, 9, and 4.	0, 9, and 4	0, 6, and -4	0, 9, and -2	1, 9, and 4`);

add(`Contracts, purpose, and examples	In Racket/Scheme, a contract states input and output classes, while a purpose explains the function's meaning.	For (square x) with contract Number -> Number, (square 4) evaluates to 16.	16	8	4	20
Tests and expected values	Racket check-expect compares an expression's actual value with an explicit expected value.	(check-expect (first (cons 7 empty)) 7) passes because first returns 7.	the test passes	the test returns empty	cons returns 14	first returns a list
Templates from data definitions	A Racket data definition determines the predicates and selectors used in a structural template.	A list template tests empty?, otherwise combines (first xs) with recursion on (rest xs).	first and rest	car only	map without a base case	numeric subtraction only
Helper functions and composition	Function composition feeds one Racket function's result into another without duplicating logic.	If add1 produces 6 from 5 and sqr receives 6, (sqr (add1 5)) evaluates to 36.	36	26	11	25
Expressions and evaluation	Racket uses applicative-order evaluation: operator and operands are evaluated before application.	(+ (* 2 3) 4) evaluates (* 2 3) to 6 and then returns 10.	10	14	24	9
Conditionals and predicates	A Racket cond chooses the first clause whose predicate is true.	For x=-2, [(positive? x) x] fails and [else (- x)] returns 2.	2	-2	0	#false
Local bindings	Racket local or let names intermediate values within a limited lexical scope.	(let ([x 3] [y 4]) (+ x y)) evaluates to 7.	7	12	34	1
Symbolic and numeric data	Symbols are atomic names compared with symbol=?, while numbers participate in arithmetic.	(symbol=? 'red 'red) is #true, whereas (+ 2 3) is 5.	#true and 5	#false and 5	#true and 6	'red and 23
Structural recursion on lists	Structural list recursion consumes one cons cell per call and recurs on rest until empty.	A length function on (cons 'a (cons 'b empty)) returns 2.	2	1	3	empty
Recursion on natural numbers	Recursion on naturals uses zero as the base case and subtracts one toward termination.	factorial 4 computes 4*3*2*1=24.	24	10	16	120
Trees and nested data	A tree recursion applies the data definition to every child, not merely the first branch.	A binary tree with root 5 and leaf children 2 and 8 has three nodes.	3	2	8	15
Accumulator-style reasoning	An accumulator records the answer-so-far and should have a precise invariant.	A tail-recursive sum over '(2 3 4) updates acc 0 to 2, 5, then 9.	9	7	4	0
Higher-order functions	A higher-order Racket function accepts or returns functions as values.	(map add1 (list 1 4 7)) produces '(2 5 8).	'(2 5 8)	'(1 4 7)	'(2 4 8)	12
Map, filter, and fold patterns	map transforms every item, filter keeps selected items, and foldr combines a list with a base value.	(foldr + 0 (filter even? (list 1 2 3 4))) returns 6.	6	10	4	2
Lambda expressions	A Racket lambda creates an anonymous function with lexically scoped parameters.	((lambda (x) (* x x)) 6) evaluates to 36.	36	12	6	42
Function-producing functions	A closure returned by a function remembers bindings from its defining environment.	((lambda (n) (lambda (x) (+ n x))) 5) produces a function that maps 3 to 8.	8	15	3	5
Backtracking search	Backtracking explores a choice and returns to try alternatives when that choice cannot complete a solution.	Choosing 2 then 4 cannot sum to 7, but backtracking to choose 3 then 4 succeeds.	3 and 4	2 and 4	2 and 3	no solution
Graphs and reachability	Graph reachability traverses neighbors while tracking visited vertices to avoid cycles.	With edges A-B and B-C, a search from A can reach C through B.	A-B-C	A-C directly	C-B-A is impossible	only A
Termination arguments	A Racket recursive function terminates when every call decreases a well-founded measure toward a base case.	In list recursion, length(rest xs)=length(xs)-1, eventually reaching empty.	list length decreases	list length increases	first becomes zero	map creates a cycle
Complexity intuition	Complexity tracks how work grows with input size independently of machine speed.	A single traversal using foldr on n list elements performs Θ(n) combining steps.	Θ(n)	Θ(1)	Θ(n²)	Θ(2ⁿ)`);

add(`Variables and assignment	Python assignment binds a name to an object, and later assignment can rebind that name.	x = 3 followed by x = x + 2 leaves x equal to 5.	5	3	6	2
Expressions and type conversion	Python conversion functions create values of a requested type when the text is valid.	int("12") + 3 evaluates to 15.	15	"123"	12	a TypeError
Console input/output	Python input returns text, while print renders values to standard output.	If the user enters 8, int(input()) * 2 computes and print displays 16.	16	"88"	8	2
Simple program tracing	A Python trace follows statement order and records each binding after mutation.	Starting a=2, b=a+5, a=b-1 leaves a=6 and b=7.	a=6 and b=7	a=2 and b=7	a=7 and b=6	a=1 and b=5
If/elif/else decisions	Python executes exactly the first true branch in an if/elif/else chain.	For score=82, if score>=90 fails and elif score>=80 selects the B branch.	the B branch	the A branch	the else branch	both A and B
Boolean operators	Python and requires both operands truthy, or needs one, and not reverses truth.	For x=5, x>0 and x%2==1 evaluates True.	True	False	5	1
While loops	A while loop repeats while its condition remains truthy and must make progress toward stopping.	With n=3 and n -= 1 each pass, the body runs for n=3,2,1: three times.	3 iterations	2 iterations	4 iterations	forever
For loops and ranges	Python range(start, stop, step) excludes stop.	list(range(2, 8, 2)) is [2, 4, 6].	[2, 4, 6]	[2, 4, 6, 8]	[0, 2, 4, 6]	[2, 8]
Function design	A well-designed Python function has a clear purpose, explicit parameters, and one meaningful result.	def area(w,h): return w*h called as area(3,4) returns 12.	12	7	34	None
Parameters and return values	Python parameters are local names bound to argument objects, and return sends a value to the caller.	def twice(x): return 2*x makes twice(6) evaluate to 12.	12	6	8	None
Text file reading	Iterating over a Python text file yields lines, often ending in newline characters.	If a file contains red\\nblue\\n, [line.strip() for line in f] gives ['red','blue'].	['red','blue']	['red\\n','blue\\n']	'redblue'	2
CSV-style data processing	CSV processing splits records into fields and converts numeric text before arithmetic.	For row "Ada,3,4", name,x,y = row.split(",") and int(x)+int(y) gives 7.	7	"34"	12	"Ada"
Lists and indexing	Python lists are mutable sequences indexed from zero; negative indices count from the end.	For a=[10,20,30], a[0] is 10 and a[-1] is 30.	10 and 30	20 and 30	10 and 20	30 and 10
List methods and slicing	append mutates a Python list, while a slice creates a selected sequence.	Starting a=[1,2,3], a.append(4) then a[1:3] yields [2,3].	[2,3]	[1,2,3]	[2,3,4]	[1,4]
Dictionaries and key lookup	A Python dictionary maps unique hashable keys to values; get can supply a missing-key default.	For d={'a':2}, d.get('b',0) returns 0.	0	2	'b'	a KeyError
Nested collections	Indexing nested Python collections applies one selector at each level.	For grid=[[1,2],[3,4]], grid[1][0] is 3.	3	2	4	1
Testing strategies	A unit test fixes inputs and expected outputs, including boundaries and exceptional cases.	For abs_value, assertions at -3, 0, and 4 should expect 3, 0, and 4.	3, 0, and 4	-3, 0, and 4	3, 1, and 4	-3, 0, and -4
Debugging techniques	A traceback identifies the exception type and stack location; inspecting nearby values tests the failure hypothesis.	If items has length 3, items[3] raises IndexError because the last valid index is 2.	IndexError	TypeError	KeyError	no error
Code style and documentation	PEP 8 favors readable names and docstrings state public behavior rather than narrating syntax.	A function named calculate_total(items) is clearer than ct(x), and its docstring can promise the returned sum.	calculate_total(items)	ct(x)	f1(a)	doIt(stuff)
Project decomposition	A Python project is easier to test when input, domain computation, and output are separate functions.	parse_row reads fields, compute_total calculates, and main coordinates them without embedding the formula in I/O.	compute_total calculates	parse_row prints everything	main duplicates every step	input performs sorting`);

add(`Primitive data types	Primitive values such as integers, floating-point numbers, characters, and Booleans have distinct representations.	Storing 7/2 in floating-point form gives 3.5 rather than integer 3.	3.5	3	4	7
Conditionals	A conditional maps mutually exclusive predicates to controlled actions.	With temperature=105, a condition temperature>100 selects the overheat warning.	the overheat warning	the normal branch	both branches	no branch
Loops	A loop expresses repeated work with a stopping condition and changing state.	A loop summing i=1 through 4 computes 1+2+3+4=10.	10	4	11	24
Functions	A function packages a named computation behind parameters and a return value.	A function max2(8,5) comparing its arguments returns 8.	8	5	13	3
Arrays and structures	An array stores homogeneous indexed elements, while a structure groups named fields.	For sensor[2]={12,19}, sensor[1] is 19; a Reading can separately hold value and time.	19	12	2	31
Searching	Binary search halves a sorted search interval after each comparison.	In [2,5,8,11,14], comparing target 11 with middle 8 discards the left half.	search the right half	search the left half	report not found	restart unsorted
Sorting	Insertion sort grows a sorted prefix by shifting larger values right.	Inserting 3 into [1,4,7] shifts 7 and 4, producing [1,3,4,7].	[1,3,4,7]	[3,1,4,7]	[1,4,7,3]	[7,4,3,1]
Libraries and APIs	An API contract specifies accepted inputs, returned values, and failure behavior.	If sqrt(25) follows the math-library contract, it returns 5.	5	625	12.5	-5 only
Requirements and constraints	A requirement states needed behavior, while a constraint limits acceptable implementations or resources.	"Respond within 200 ms" is a measurable performance constraint.	a performance constraint	a color preference	a sorting algorithm	an untestable slogan
Testing and validation	Validation checks inputs against requirements; testing checks outputs against specified expectations.	A percentage constrained to 0..100 must reject 125 before storage.	reject 125	store 125	clamp every value to zero	convert 125 to text
Modular design	Modules hide implementation details behind narrow interfaces, reducing coupling.	A sensor module exposing readTemperature() lets callers avoid depending on register addresses.	call readTemperature()	read registers everywhere	copy driver code	use a global address
Documentation	Useful documentation records contracts, units, assumptions, and non-obvious decisions.	Documenting that speed is in m/s prevents a caller from supplying km/h without conversion.	use m/s	use km/h unchanged	remove units	use either unit silently
Usability heuristics	Consistency, visibility of status, and error prevention reduce avoidable user mistakes.	Disabling Submit until required fields are filled applies error prevention.	error prevention	user recall	aesthetic minimalism	expert-only shortcuts
Interface feedback	Immediate feedback connects an action to the system's resulting state.	After Save, showing "Saved at 14:32" confirms completion.	completion is confirmed	the file is deleted	the action is pending forever	no state is visible
Accessibility basics	Accessible interfaces support keyboard operation, semantic labels, contrast, and text alternatives.	A labeled button reachable by Tab and activated by Enter supports keyboard users.	keyboard access	mouse-only access	color-only meaning	autoplay audio
User testing	User testing observes representative people attempting realistic tasks and records measurable failures.	If 4 of 5 users cannot find Checkout, the 80% failure rate identifies a navigation problem.	80%	20%	4%	100%
Rule-based reasoning	A rule-based system applies explicit antecedent-consequent rules to known facts.	Given fever=true and rule fever -> advise_rest, forward chaining derives advise_rest.	advise_rest	not fever	no conclusion	random class
Classification concepts	A classifier maps feature vectors to discrete labels using a learned or specified decision boundary.	If the rule is x>=0 -> positive, then x=2 receives label positive.	positive	negative	zero	unclassified
Training data and bias	A model can reproduce sampling and labeling biases present in its training data.	If 90% of training faces come from one group, equal overall accuracy can hide poor minority-group recall.	poor minority-group recall	guaranteed fairness	no need for subgroup metrics	perfect calibration
Human oversight	Human oversight supplies review, escalation, and authority for consequential automated decisions.	A low-confidence medical classification routed to a clinician is human-in-the-loop review.	clinician review	fully autonomous action	random relabeling	deleting confidence scores`);

add(`Partial derivatives	A partial derivative varies one coordinate while holding the others fixed.	For f(x,y)=x²y+3y, ∂f/∂x=2xy, so at (2,5) it is 20.	20	10	23	4
Gradient and directional derivative	The gradient ∇f points in steepest increase, and the directional derivative along unit u is ∇f·u.	For f=x²+y² at (3,4), ∇f=(6,8); along u=(1,0), D_u f=6.	6	8	10	14
Multiple integrals	A multiple integral accumulates density over area or volume with bounds describing the region.	∫₀¹∫₀² x dy dx = ∫₀¹ 2x dx = 1.	1	2	1/2	4
Jacobians and coordinate transforms	A coordinate transform multiplies area or volume by the absolute Jacobian determinant.	For polar x=r cosθ, y=r sinθ, |∂(x,y)/∂(r,θ)|=r.	r	1/r	r²	1
Line integrals	A scalar line integral uses ds, while work by a vector field uses F·dr.	For F=(y,x) and r(t)=(t,t), 0≤t≤1, F·r'=2t, so the work is 1.	1	2	1/2	0
Surface integrals	Flux through an oriented surface is ∬_S F·n dS.	For F=(0,0,2) through a horizontal unit square with upward normal, flux is 2.	2	1	0	-2
Green theorem	Green's theorem converts a positively oriented planar circulation integral to ∬(∂Q/∂x-∂P/∂y)dA.	For P=-y/2, Q=x/2 around the unit disk, the integrand is 1 and circulation is π.	π	2π	1	0
Divergence and Stokes theorems	The divergence theorem relates outward flux to ∭∇·F dV; Stokes relates boundary circulation to ∬(∇×F)·n dS.	For F=(x,y,z) on the unit ball, ∇·F=3 and outward flux is 3(4π/3)=4π.	4π	3π	4π/3	0
Continuum assumption	The continuum assumption treats density, pressure, and velocity as smooth fields despite molecular discreteness.	Air with mean free path 70 nm in a 7 mm channel has Kn=10⁻⁵, well within continuum flow.	Kn=10⁻⁵	Kn=10⁵	Kn=1	Kn=0.1
Velocity fields	A velocity field v(x,t) assigns a fluid velocity to every spatial point and time.	For v=(2x,-y), the velocity at (3,4) is (6,-4).	(6,-4)	(2,-1)	(3,4)	(8,3)
Streamlines and pathlines	A streamline is tangent to the instantaneous velocity field; a pathline follows one material particle through time.	In steady v=(1,x), streamlines satisfy dy/dx=x, hence y=x²/2+C.	y=x²/2+C	y=x+C	y=2x²+C	y=C
Material derivative	The material derivative Dφ/Dt=∂φ/∂t+v·∇φ combines local and convective change.	For φ=x²+t and v=(3,0), Dφ/Dt=1+6x, which at x=2 is 13.	13	5	12	7
Conservation of mass	Continuity is ∂ρ/∂t+∇·(ρv)=0; for steady incompressible flow, ∇·v=0.	In a pipe, A₁=2 m², V₁=3 m/s, A₂=1 m² gives V₂=A₁V₁/A₂=6 m/s.	6 m/s	1.5 m/s	3 m/s	12 m/s
Momentum balance	Fluid momentum balance equates rate of momentum change to body and surface forces.	A steady jet with mass flow 2 kg/s changing velocity from 3 to 8 m/s requires net force 2(8-3)=10 N.	10 N	5 N	16 N	22 N
Hydrostatics	In a static constant-density fluid, dp/dz=-ρg, so pressure rises with depth.	In water, ρ=1000 kg/m³ and h=2 m gives gauge pressure ρgh≈19.6 kPa.	19.6 kPa	9.8 kPa	2 kPa	196 kPa
Bernoulli equation	Along a steady inviscid incompressible streamline, p/ρ+V²/2+gz is constant.	At equal height, if V rises from 2 to 4 m/s, pressure drops by ρ(4²-2²)/2=6ρ Pa.	6ρ Pa	12ρ Pa	2ρ Pa	pressure rises by 6ρ Pa
Viscosity and shear stress	For a Newtonian fluid, shear stress is τ=μ du/dy.	If μ=0.01 Pa·s and du/dy=200 s⁻¹, τ=2 Pa.	2 Pa	20 Pa	0.02 Pa	200 Pa
Laminar flow	Laminar pipe flow has an ordered parabolic profile and, when fully developed, mean speed is half the centerline speed.	If centerline speed is 4 m/s, the mean is 2 m/s.	2 m/s	4 m/s	8 m/s	1 m/s
Boundary conditions	A viscous fluid satisfies no penetration at a solid wall and usually no slip relative to a stationary wall.	At a stationary wall y=0, the fluid velocity condition is v=0.	v=0	only pressure is zero	v is infinite	dv/dy=0 always
Dimensional analysis	Buckingham Π groups variables into dimensionless combinations that preserve physical similarity.	Reynolds number Re=ρVL/μ; with ρ=1, V=2, L=3, μ=0.5, Re=12.	12	3	6	24`);

add(`Relative motion	Relative position satisfies r_A/B=r_A-r_B, and differentiating in one inertial frame gives v_A/B=v_A-v_B.	If v_A=10i m/s and v_B=4i m/s, then v_A/B=6i m/s.	6i m/s	14i m/s	4i m/s	-6i m/s
Rotating frames	The transport theorem is (dA/dt)_I=(dA/dt)_R+ω×A.	If A=2i and ω=3k rad/s is fixed in the rotating frame, its inertial derivative is 6j.	6j	6i	-6j	0
Coriolis terms	Acceleration observed in a rotating frame includes 2ω×v_rel, the Coriolis term.	With ω=2k and v_rel=3i, Coriolis acceleration is 2(2k×3i)=12j.	12j	6j	-12j	12i
Coordinate choices	Coordinates should exploit constraints and symmetry while preserving the degrees of freedom.	A bead constrained to a circular hoop of radius R needs one angle θ, with r=R fixed.	one coordinate θ	two independent radii	three Cartesian coordinates plus θ	no coordinate
Newton-Euler equations	Rigid-body translation obeys ΣF=ma_G and rotation about the mass center obeys ΣM_G=Ḣ_G.	A 2 kg body under net force 10 N accelerates at 5 m/s².	5 m/s²	20 m/s²	12 m/s²	0.2 m/s²
Work and energy	Net work equals change in kinetic energy; conservative force work can be represented by potential energy.	Accelerating a 2 kg mass from 3 to 5 m/s changes kinetic energy by 1/2(2)(25-9)=16 J.	16 J	8 J	34 J	4 J
Impulse and momentum	Impulse ∫Fdt equals change in linear momentum.	A constant 6 N force acting 0.5 s gives impulse 3 N·s.	3 N·s	12 N·s	6.5 N·s	0.083 N·s
Central-force motion	A central force is radial, giving zero torque about the center and conserved angular momentum.	For mass m with transverse speed v at radius r, angular momentum magnitude is mrv.	mrv	mv/r	mr/v	zero
Generalized coordinates	Generalized coordinates are independent parameters that describe a constrained configuration.	A planar double pendulum has two degrees of freedom represented by angles θ₁ and θ₂.	θ₁ and θ₂	one angle only	x,y,z for both masses	no degrees of freedom
Lagrange equations	For L=T-V, Lagrange's equation is d/dt(∂L/∂q̇)-∂L/∂q=Q_nc.	For L=1/2 m q̇²-1/2 kq² with no nonconservative force, the equation is mq̈+kq=0.	mq̈+kq=0	mq̈-kq=0	mq̇+kq=0	q̈=0
D'Alembert principle	D'Alembert's principle makes applied minus inertial forces do zero virtual work for admissible virtual displacements.	For a translating mass, (F-ma)·δr=0 for arbitrary δr implies F=ma.	F=ma	F=-ma	F=0	a=0
Hamiltonian formulation	The Hamiltonian H=Σp_i q̇_i-L yields q̇_i=∂H/∂p_i and ṗ_i=-∂H/∂q_i.	For H=p²/(2m)+kq²/2, q̇=p/m.	q̇=p/m	q̇=kp	q̇=-kq	ṗ=p/m
Two-body problem	The two-body gravitational problem reduces to relative motion with gravitational parameter μ=G(m₁+m₂).	The relative equation is r̈=-μr/r³.	r̈=-μr/r³	r̈=μr/r²	r̈=-μr/r²	r̈=0
Orbital elements	Six Keplerian elements specify orbit size, shape, orientation, and position: a,e,i,Ω,ω,ν.	A circular equatorial orbit has e=0 and i=0.	e=0 and i=0	e=1 and i=90°	e=-1 and i=0	e=0 and i=180° only
Energy of orbits	Specific orbital energy is ε=v²/2-μ/r=-μ/(2a) for a Keplerian ellipse.	With μ=100 and a=10, ε=-100/(20)=-5.	-5	5	-10	0
Transfer maneuvers	A Hohmann transfer between coplanar circular orbits uses two tangential impulses and a transfer ellipse.	From radius r₁ to larger r₂, the first burn raises apoapsis and increases speed.	an increase in speed	a decrease to zero	a radial-only burn	no first burn
Angular momentum	Angular momentum H_O=r×mv and its derivative equals external moment about O.	For r=2i m and mv=3j kg·m/s, H_O=6k kg·m²/s.	6k	-6k	5k	6i
Euler equations	In body principal axes, rigid-body rotation satisfies M₁=I₁ω̇₁+(I₃-I₂)ω₂ω₃ and cyclic equations.	If rotation is only about axis 1 and M₁=0, then ω̇₁=0.	ω̇₁=0	ω₁=0	I₁=0	ω̇₁=I₁
Small oscillations	Linearizing near stable equilibrium gives Mq̈+Kq=0, whose eigenvalues determine natural frequencies.	For m=2 and k=8, ω_n=√(k/m)=2 rad/s.	2 rad/s	4 rad/s	16 rad/s	0.5 rad/s
Single-degree vibrations	An undamped SDOF oscillator obeys mẍ+kx=0 with period T=2π√(m/k).	For m=1 kg and k=4 N/m, ω_n=2 rad/s and T=π s.	T=π s	T=2π s	T=π/2 s	T=4π s`);

add(`Differential equation models	Physical balances produce differential equations connecting states, inputs, and parameters.	A mass-spring system driven by u(t) has mẍ+kx=u; with m=2,k=8 it is 2ẍ+8x=u.	2ẍ+8x=u	2ẋ+8x=u	8ẍ+2x=u	ẍ=0
Transfer functions	With zero initial conditions, a transfer function is G(s)=Y(s)/U(s).	For ẏ+2y=u, Laplace transformation gives G(s)=1/(s+2).	G(s)=1/(s+2)	G(s)=s+2	G(s)=2/(s+1)	G(s)=1/s²
Block diagrams	Series blocks multiply transfer functions, while parallel paths add and feedback forms a closed-loop ratio.	G₁(s)=2 and G₂(s)=1/(s+3) in series give 2/(s+3).	2/(s+3)	2s+6	1/(2s+3)	3/(s+2)
Linearization	A nonlinear model linearized at equilibrium uses its Jacobian, retaining first-order perturbation terms.	For f(x)=x² at x₀=2, δf≈f'(2)δx=4δx.	4δx	2δx	δx²	4+δx²
Step response	A unit-step response is the output to U(s)=1/s and reveals gain and time constants.	For G(s)=1/(s+2), Y(s)=1/[s(s+2)] and y(t)=0.5(1-e⁻²ᵗ).	0.5(1-e⁻²ᵗ)	1-e⁻ᵗ	e⁻²ᵗ	0.5e²ᵗ
Transient specifications	For a standard underdamped second-order system, percent overshoot depends on damping ratio and settling time scales inversely with ζω_n.	With ζ=0.5, percent overshoot is about 16.3%.	16.3%	50%	0%	86.5%
Bode plots	A Bode plot shows 20log₁₀|G(jω)| and phase versus logarithmic frequency.	A first-order pole contributes an asymptotic -20 dB/decade slope above its break frequency.	-20 dB/decade	+20 dB/decade	-40 dB/decade	0 dB/decade
Frequency-domain interpretation	Evaluating G(s) on s=jω gives sinusoidal steady-state gain and phase.	If G(j10) has magnitude 0.2, a 5-unit sinusoid produces amplitude 1.	1	25	5.2	0.04
Characteristic equations	Closed-loop poles are roots of the characteristic equation, commonly 1+G(s)H(s)=0.	For G(s)=K/[s(s+2)] with unity feedback, the characteristic equation is s²+2s+K=0.	s²+2s+K=0	s²+K=0	s+2K=0	s²+2s-K=0
Routh-Hurwitz criterion	A Routh array counts right-half-plane roots from sign changes in its first column.	For s²+3s+2, the first column 1,3,2 is positive, so there are zero right-half-plane poles.	zero	one	two	three
Root locus	A root locus traces closed-loop poles as gain K varies, beginning at open-loop poles and ending at zeros or infinity.	For 1+K/[s(s+2)]=0, K=0 starts poles at s=0 and s=-2.	s=0 and s=-2	s=1 and s=2	s=-1 only	s=±2j
Nyquist stability	The Nyquist criterion relates encirclements of -1 by G(s)H(s) to open-loop and closed-loop right-half-plane poles.	If P=0 and the plot makes no encirclement of -1, then Z=0 and the closed loop is stable.	Z=0	Z=1	Z=-1	P=1
PID control	A PID controller is C(s)=Kp+Ki/s+Kd s, combining proportional, integral, and derivative action.	With Kp=2, Ki=3, Kd=0.5, C(s)=2+3/s+0.5s.	2+3/s+0.5s	2s+3+0.5/s	5.5/s	2+3s
Lead-lag compensation	A lead compensator adds positive phase near crossover; lag mainly raises low-frequency gain relative to high frequency.	C(s)=(s+1)/(s+10) has its zero before its pole and is a lead form.	lead	lag	pure integrator	PID
Steady-state error	For unity feedback, system type and low-frequency loop gain determine polynomial-input steady-state error.	A type-1 system has zero steady-state error to a unit step.	zero	one	infinite	50%
Robustness tradeoffs	Larger bandwidth can improve speed but amplify noise and reduce tolerance to unmodeled high-frequency dynamics.	Raising crossover from 2 to 20 rad/s may speed response while exposing an ignored pole at 30 rad/s.	reduced robustness	guaranteed stability	no noise sensitivity	infinite phase margin
State-space models	A continuous LTI state-space model is ẋ=Ax+Bu, y=Cx+Du.	For A=[-2], B=[1], C=[3], D=[0], the equations are ẋ=-2x+u and y=3x.	ẋ=-2x+u, y=3x	ẋ=3x, y=-2x	ẋ=u, y=0	ẋ=-2u, y=x
Controllability and observability	Controllability uses rank[B AB ...]; observability uses rank[C; CA; ...].	For scalar A=-2,B=1,C=3, both matrices have rank 1, so the state is controllable and observable.	both controllable and observable	neither	controllable only	observable only
Pole placement	State feedback u=-Kx can assign poles of A-BK when the system is controllable.	For ẋ=-2x+u and desired pole -5, -2-K=-5 gives K=3.	K=3	K=-3	K=5	K=7
Sampling and discretization	Sampling maps a continuous pole s to discrete pole z=e^{sT}; stability requires |z|<1.	For s=-2 and T=0.5, z=e⁻¹≈0.368.	0.368	-1	2.718	1.5`);

add(`Parametrized curves	A regular curve r(t) has r'(t)≠0, and its velocity determines tangent direction.	For r(t)=(t,t²), r'(1)=(1,2).	(1,2)	(1,1)	(2,1)	(0,2)
Arc length	Arc length is L=∫ₐᵇ||r'(t)||dt and is invariant under regular reparametrization.	For r(t)=(3t,4t), 0≤t≤2, speed is 5 and L=10.	10	5	7	25
Curvature	For a unit-speed curve, curvature κ=||T'(s)||; generally κ=||r'×r''||/||r'||³.	A circle of radius 2 has κ=1/2.	1/2	2	4	0
Torsion and Frenet frames	The Frenet frame T,N,B satisfies T'=κN and B'=-τN for nonzero κ.	A planar circle has torsion τ=0 because its binormal is constant.	τ=0	τ=1/2	τ=2	τ is infinite
Parametrized surfaces	A regular surface patch X(u,v) requires X_u×X_v≠0.	For X(u,v)=(u,v,u+v), X_u×X_v=(-1,-1,1).	(-1,-1,1)	(1,1,1)	(0,0,0)	(u,v,1)
Tangent planes	The tangent plane is spanned by X_u,X_v and has normal X_u×X_v.	For z=x²+y² at (1,0,1), z-1=2(x-1).	z-1=2(x-1)	z=1	x+y+z=0	z-1=y
First fundamental form	The first fundamental form is I=E du²+2F dudv+G dv² with E=<X_u,X_u>, F=<X_u,X_v>, G=<X_v,X_v>.	For X(u,v)=(u,v,0), E=1,F=0,G=1.	E=1,F=0,G=1	E=0,F=1,G=0	E=1,F=1,G=1	E=2,F=0,G=2
Area element	A regular patch has area element dA=||X_u×X_v||du dv=√(EG-F²)du dv.	If E=4,F=0,G=9, then √(EG-F²)=6.	6	13	36	3
Normal curvature	Normal curvature in tangent direction v is κ_n=II(v,v)/I(v,v).	On a sphere of radius R with outward orientation, every principal normal curvature has magnitude 1/R.	1/R	R	1/R²	0
Gaussian curvature	Gaussian curvature K is the product k₁k₂ of principal curvatures.	A sphere of radius 2 has K=(1/2)(1/2)=1/4.	1/4	1/2	2	4
Mean curvature	Mean curvature H=(k₁+k₂)/2 is the average principal curvature.	If k₁=2 and k₂=4, then H=3.	3	8	2	6
Shape operator	The shape operator S(v)=-D_vN is self-adjoint, and its eigenvalues are principal curvatures.	If S has matrix diag(2,-1), its principal curvatures are 2 and -1.	2 and -1	1 and -2	2 and 1	-2 and -1
Covariant derivative	The surface covariant derivative is the tangent projection of the ambient derivative.	On the unit sphere, the ambient derivative of a tangent field splits into tangent and normal components; ∇ keeps the tangent component.	the tangent component	the normal component	both without projection	zero always
Parallel transport	A vector field is parallel along a curve when its covariant derivative along the curve vanishes.	Along a plane straight line, a constant vector has ∇_T V=0 and is parallel.	it is parallel	it has κ=1	it rotates by π	it is normal
Geodesic equations	In coordinates, a geodesic satisfies q̈ᵏ+Γᵏᵢⱼq̇ⁱq̇ʲ=0.	In the Euclidean plane all Christoffel symbols vanish, so geodesics satisfy ẍ=ÿ=0.	ẍ=ÿ=0	ẍ+ÿ=1	ẋ=ẏ=0	x²+y²=1
Geodesic curvature	Geodesic curvature measures the component of curve curvature tangent to the surface and normal to the curve.	A great circle on a sphere is a geodesic, so its geodesic curvature is 0.	0	1/R	R	π
Gauss map	The Gauss map N sends each oriented surface point to its unit normal on S².	For the unit sphere with outward orientation, N(p)=p.	N(p)=p	N(p)=-p	N(p)=0	N(p)=2p
Theorema egregium	Gauss's Theorema Egregium states that Gaussian curvature is determined intrinsically by the first fundamental form E,F,G.	A plane and cylinder are locally isometric and both have K=0.	both have K=0	the cylinder has K=1	the plane has K=-1	K depends on embedding only
Gauss-Bonnet theorem	For a compact oriented surface without boundary, ∫_S K dA=2πχ(S).	On the unit sphere, K=1 and area 4π, so the integral is 4π=2π·2.	4π	2π	π	0
Applications to topology	Total Gaussian curvature links geometry to Euler characteristic and hence topology.	A torus has χ=0, so Gauss-Bonnet gives ∫K dA=0.	0	2π	4π	-4π`);

add(`Conditional probability	Conditional probability restricts the sample space: P(A|B)=P(A∩B)/P(B) when P(B)>0.	If P(A∩B)=0.12 and P(B)=0.30, then P(A|B)=0.4.	0.4	0.036	0.18	2.5
Conditional expectation	Conditional expectation averages a random variable using the conditional distribution given observed information.	If X is 0 or 10 with conditional probabilities 0.7 and 0.3 given B, E[X|B]=3.	3	7	10	0.3
Transforms and generating functions	The probability generating function G_X(z)=E[z^X] encodes a nonnegative integer distribution and G'_X(1)=E[X].	For Bernoulli(p), G(z)=1-p+pz and G'(1)=p.	p	1-p	p²	1
Common actuarial distributions	Severity models use distributions such as exponential, gamma, lognormal, and Pareto according to tail behavior.	For exponential rate λ=0.2, mean severity is 1/λ=5.	5	0.2	25	e⁻⁵
Transition matrices	A Markov transition matrix has entries p_ij=P(X_{n+1}=j|X_n=i), with each row summing to one.	From state 1 with row (0.7,0.3), the one-step probability of state 2 is 0.3.	0.3	0.7	1.0	0
Classification of states	States communicate when each is reachable from the other; a closed communicating class cannot be left.	If A reaches B and B reaches A, then A and B communicate.	A and B communicate	A is absorbing	B is transient necessarily	they are independent
Stationary distributions	A stationary distribution satisfies πP=π and Σπ_i=1.	For P with every row (0.4,0.6), the stationary distribution is π=(0.4,0.6).	(0.4,0.6)	(0.6,0.4)	(1,0)	(0.5,0.5)
Absorbing chains	An absorbing state has p_ii=1; transient-state visits before absorption are summarized by N=(I-Q)⁻¹.	If Q=[0.5], then N=1/(1-0.5)=2 expected transient visits.	2	0.5	1	∞
Counting processes	A counting process N(t) is integer-valued, nondecreasing, and records event arrivals by time t.	If claim times are 1,3,7, then N(4)=2.	2	1	3	4
Exponential waiting times	An exponential waiting time with rate λ has survival P(T>t)=e^{-λt} and the memoryless property.	For λ=0.5, P(T>2)=e⁻¹≈0.368.	0.368	0.5	0.632	1
Thinning and superposition	Independent p-thinning of a Poisson process of rate λ yields rate pλ; independent Poisson rates add under superposition.	Thinning rate 10 by p=0.3 yields rate 3.	3	10.3	7	30
Non-homogeneous processes	A non-homogeneous Poisson process has time-varying intensity λ(t) and mean Λ(t)=∫₀ᵗλ(s)ds.	If λ(t)=2t, then E[N(3)]=∫₀³2t dt=9.	9	6	3	18
Renewal reward processes	The renewal-reward theorem gives long-run reward rate E[R]/E[X] under standard renewal assumptions.	If mean cycle reward is 12 and mean cycle length is 3, the long-run rate is 4.	4	36	9	0.25
Stopping times	A stopping time is determined by information available up to the current time, without looking into the future.	The first claim time T=min{t:N(t)≥1} is a stopping time.	a stopping time	not measurable	a stationary distribution	a transition probability
Long-run averages	For an irreducible positive recurrent Markov chain, long-run state proportions equal the stationary probabilities.	If π=(0.25,0.75), the long-run fraction in state 2 is 0.75.	0.75	0.25	1	0.5
Applications to claims	A compound Poisson aggregate S=Σ_{i=1}^{N}X_i has E[S]=E[N]E[X] when count and severities are independent.	If N has mean 4 and claim severity mean 500, expected aggregate claims are 2000.	2000	504	125	8000
Birth-death processes	A birth-death chain moves only between neighboring states, with birth rates λ_n and death rates μ_n.	For constant λ=2 and μ=5, the traffic ratio is ρ=λ/μ=0.4.	0.4	2.5	7	3
M/M/1 queues	An M/M/1 queue with arrival rate λ<μ has utilization ρ=λ/μ and mean system size L=ρ/(1-ρ).	With λ=3 and μ=5, ρ=0.6 and L=1.5.	L=1.5	L=0.6	L=2.5	L=3
Ruin probability intuition	Ruin risk increases with claim frequency and severity and decreases with premium loading and initial surplus.	In the classical model, raising initial surplus from 10 to 100 while other parameters stay fixed lowers ruin probability.	ruin probability decreases	it must increase	it becomes exactly one	claim frequency doubles
Simulation for actuarial systems	Monte Carlo simulation samples paths, computes a path statistic, and estimates its expectation with a sample average.	If simulated losses are 100,200,300,400, the estimated mean loss is 250.	250	1000	200	4`);

export function getLessonPack(label) {
  const pack = LESSON_PACKS[label];
  if (!pack) return null;
  const easy = pack.easy;
  const [wrong, other, extra] = easy.distractors;
  const medium = pack.medium || {
    prompt: `Given this ${label} example: ${pack.example} Which reasoning produces the correct result?`,
    answer: `${pack.intuition} Therefore the result is ${easy.answer}.`,
    distractors: [
      `The result must be ${wrong} because the example numbers can be ignored.`,
      `Average the givens and report ${other} without using ${label}.`,
      `${easy.answer} and ${wrong} are interchangeable if the arithmetic looks neat.`,
    ],
    explanation: easy.explanation,
  };
  const hard = pack.hard || {
    prompt: `A student working this ${label} example reported ${wrong} instead of ${easy.answer}: ${pack.example} What failed?`,
    answer: pack.mistake,
    distractors: [
      `Nothing failed; ${wrong} is interchangeable with ${easy.answer}.`,
      `Keep ${wrong} and round until it matches ${extra}.`,
      `Drop units, signs, or regularity conditions, then keep ${wrong}.`,
    ],
    explanation: pack.worked,
  };
  return { ...pack, medium, hard };
}
