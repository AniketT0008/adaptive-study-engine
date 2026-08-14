function E(prompt, answer, d1, d2, d3, explanation) {
  return { prompt, answer, distractors: [d1, d2, d3], explanation };
}

function pack(easy, medium, hard) {
  return { easy, medium, hard };
}

/** Real MCV4U / SPH4U / SCH4U items keyed by exact lesson label. */
export const GRADE12_STEM_QUESTIONS = {
  'Limit Laws and Algebraic Simplification': pack(
    E('What is lim x→3 (x²−9)/(x−3)?', '6', '0', 'The limit does not exist.', '9', 'Factor: (x−3)(x+3)/(x−3)=x+3 for x≠3, so the limit is 6.'),
    E('Why must you factor before substituting x=3 in (x²−9)/(x−3)?', 'Direct substitution is 0/0, a removable discontinuity.', 'The function is already continuous at 3.', 'Limit laws forbid algebra.', 'The limit is always 0 when the numerator is 0.', '0/0 is indeterminate; cancel the common factor, then take the limit.'),
    E('A student reports lim x→3 (x²−9)/(x−3) as undefined because the original function has no value at 3. What failed?', 'A missing function value does not decide the two-sided limit after simplification.', 'The limit must equal f(3).', 'Factoring changes the limit.', 'x+3 cannot be used.', 'Limits ask what f approaches, not whether f(3) exists.'),
  ),
  'Continuity and Discontinuities': pack(
    E('f is continuous at a when which three things agree?', 'lim x→a f(x) exists, f(a) exists, and they are equal.', 'Only f(a) exists.', 'Only the right-hand limit exists.', 'f′(a) exists.', 'Value, two-sided limit, and agreement are all required.'),
    E('For f(x)=(x²−1)/(x−1), what kind of discontinuity is x=1?', 'Removable (a hole); the simplified graph is y=x+1 with f approaching 2.', 'Jump discontinuity.', 'Infinite discontinuity / vertical asymptote.', 'None; it is continuous at 1 as written.', 'The algebra cancels, leaving a hole at (1, 2).'),
    E('A student says a function with a hole at a is discontinuous, so lim x→a cannot exist. What failed?', 'Removable discontinuities still have a finite two-sided limit.', 'Holes forbid limits.', 'Continuity is the same as differentiability.', 'Jump discontinuities are removable.', 'Continuity fails at a hole; the limit can still exist.'),
  ),
  'Derivative from First Principles': pack(
    E('For f(x)=x², what is [f(x+h)−f(x)]/h simplified before h→0?', '2x+h', '2x', 'x²+h', 'h', '(x²+2xh+h²−x²)/h=2x+h.'),
    E('Why cancel h only after it is a factor of the numerator?', 'Otherwise you divide by zero for the difference quotient at h=0.', 'h is never allowed in a derivative.', 'First principles forbids algebra.', 'The limit is always 0.', 'The difference quotient is undefined at h=0; cancel for h≠0, then take the limit.'),
    E('A student plugs h=0 into [f(x+h)−f(x)]/h before simplifying and stops. What failed?', 'They evaluated an indeterminate 0/0 instead of taking a limit after algebra.', 'The derivative is always 0.', 'x² cannot be differentiated.', 'h must stay 1.', 'First principles is a limit, not substitution of h=0 into the raw quotient.'),
  ),
  'Power, Constant, and Sum Rules': pack(
    E('d/dx(4x⁵−3x²+7) equals?', '20x⁴−6x', '4x⁴−3x', '20x⁵−6x²', '4x⁵−3x²', 'Bring down exponents: 4·5x⁴−3·2x+0.'),
    E('Why does the constant 7 disappear?', 'The derivative of a constant is 0; constants do not change with x.', 'Constants become 7x.', 'Sum rule forbids constants.', 'Only the highest power matters.', 'd/dx(c)=0 for any constant c.'),
    E('A student writes d/dx(4x⁵)=4x⁴. What failed?', 'They dropped the factor 5 from the power rule.', 'Constants cannot be differentiated.', 'The sum rule adds 1.', 'x⁵ becomes x⁶.', 'd/dx(xⁿ)=n xⁿ⁻¹, so 4·5x⁴=20x⁴.'),
  ),
  'Product and Quotient Rules': pack(
    E('For y=x² sin x, y′ equals?', '2x sin x + x² cos x', '2x cos x', 'x² cos x', '2x sin x', '(uv)′=u′v+uv′ with u=x², v=sin x.'),
    E('The quotient rule (u/v)′ is which formula?', '(u′v−uv′)/v²', '(u′v+uv′)/v²', 'u′/v′', 'uv′−u′v', 'Keep the original denominator squared; subtract uv′.'),
    E('A student differentiates x² sin x as 2x cos x. What failed?', 'They treated it as a chain of one factor instead of a product of two changing factors.', 'sin x is constant.', 'Product rule is only for quotients.', 'x² cannot be differentiated.', 'Both factors change, so both terms of the product rule are required.'),
  ),
  'Chain Rule and Composite Functions': pack(
    E('d/dx[(2x³−5)⁴] equals?', '4(2x³−5)³(6x²)', '4(2x³−5)³', '(2x³−5)³(6x²)', '8x²(2x³−5)⁴', 'Outer power 4, keep the inside, multiply by inner derivative 6x².'),
    E('What does the chain rule multiply?', 'The outer derivative (evaluated at the inside) times the inside derivative.', 'Only the inside derivative.', 'Only the outer power.', 'The second derivative.', 'd/dx f(g(x))=f′(g(x))·g′(x).'),
    E('A student writes d/dx[(2x³−5)⁴]=4(2x³−5)³ and stops. What failed?', 'They forgot to multiply by the inner derivative 6x².', 'The power rule is illegal.', '2x³−5 is constant.', 'Chain rule divides by 4.', 'The inside is not x; it still depends on x.'),
  ),
  'Implicit Differentiation': pack(
    E('From x²+y²=25, y′ equals?', '−x/y', 'x/y', '−y/x', '2x+2y', '2x+2y y′=0 ⇒ y′=−x/y (y≠0).'),
    E('Why does differentiating y² with respect to x produce 2y y′?', 'y is a function of x, so the chain rule applies to y².', 'y is a constant.', 'Implicit means ignore y.', 'Squares differentiate to 2x.', 'd/dx[y²]=2y·dy/dx.'),
    E('A student differentiates x²+y²=25 as 2x+2y=0. What failed?', 'They treated y as if it did not depend on x.', 'The circle has no derivative.', 'y′ must be 1.', '25 differentiates to 25.', 'Every y term needs a factor of y′.'),
  ),
  'Critical Points and Monotonicity': pack(
    E('If f′ changes from positive to negative at x=2, what happens there?', 'f has a local maximum at x=2.', 'f has a local minimum at x=2.', 'f is undefined at x=2.', 'f′′ must be zero only.', 'First-derivative test: + to − is a local max.'),
    E('Critical points of f occur where?', 'f′(x)=0 or f′ is undefined, and x is in the domain of f.', 'f(x)=0 only.', 'f′′(x)>0 only.', 'x is an intercept.', 'Candidates for extrema are zeros and undefined points of f′.'),
    E('A student lists every zero of f as a critical point. What failed?', 'Critical points are about f′, not about roots of f.', 'f′ cannot be zero.', 'Maxima require f=0.', 'Domain does not matter.', 'f(x)=0 is an intercept, not a critical-point test.'),
  ),
  'Concavity and Inflection Points': pack(
    E('If f′′(x)=6x−12, where can concavity change?', 'x=2', 'x=6', 'x=12', 'x=0 only', 'Set 6x−12=0 ⇒ x=2, then confirm a sign change of f′′.'),
    E('An inflection point requires what?', 'A concavity change, not merely f′′=0.', 'f′=0 and f=0.', 'f′′>0 everywhere.', 'A vertical asymptote.', 'f′′=0 is a candidate; the sign of f′′ must actually switch.'),
    E('A student calls every root of f′′ an inflection point without a sign chart. What failed?', 'f′′ can touch zero without changing sign (no inflection).', 'Inflection requires f=0.', 'Concavity is f′.', 'x=2 is illegal.', 'Confirm the concavity change, not only the equation f′′=0.'),
  ),
  'Curve Sketching Workflow': pack(
    E('For a rational function, what should you find first among these?', 'Vertical asymptotes (zeros of the denominator after cancelling holes).', 'Only the y-intercept.', 'Only f′′ zeros.', 'The second-derivative test alone.', 'Breaks in the domain organize the rest of the sketch.'),
    E('A complete sketch uses which combination?', 'Intercepts, asymptotes, critical points, monotonicity, concavity, and end behaviour.', 'Only a table of random x-values.', 'Only the first derivative.', 'Only holes.', 'Sign charts for f′ and f′′ sit on top of intercepts and asymptotes.'),
    E('A student plots three points and draws a smooth wiggle through them, skipping asymptotes. What failed?', 'The graph can jump across a VA; sample points do not replace the analytic skeleton.', 'Rational functions have no VAs.', 'End behaviour is optional.', 'Critical points are intercepts.', 'Asymptotes and sign charts constrain the shape before you plot.'),
  ),
  'Optimization Modelling': pack(
    E('An open box from a 20 cm square with square corners of side x has volume?', 'V=x(20−2x)²', 'V=x(20−x)²', 'V=20x²', 'V=x²(20−2x)', 'Height x, base (20−2x) by (20−2x).'),
    E('After writing V(x), what is the next calculus step?', 'Compute V′, solve V′=0 in the feasible interval, and compare with endpoints.', 'Set V=0 only.', 'Ignore the domain of x.', 'Maximize x instead of V.', 'Critical points plus endpoints of 0<x<10.'),
    E('A student maximizes V without restricting 0<x<10. What failed?', 'x must leave a positive square base; outside that interval the model is invalid.', 'V′ cannot be zero.', 'Squares cannot be boxes.', '20−2x is always 20.', 'State the geometric domain before solving.'),
  ),
  'Related Rates': pack(
    E('If A=πr², how are dA/dt and dr/dt related?', 'dA/dt=2πr dr/dt', 'dA/dt=πr² dr/dt', 'dA/dt=2πr', 'dA/dt=πr', 'Differentiate both sides with respect to t; r is a function of t.'),
    E('When should you substitute the given numerical radius?', 'After differentiating, at the instant asked.', 'Before differentiating, replacing r with a number in the original equation.', 'Never; related rates are purely symbolic.', 'Only if A is constant.', 'Differentiate the general relation first; plug in values last.'),
    E('A student writes A=π(5)² then differentiates and gets dA/dt=0. What failed?', 'They froze r at 5 before differentiating, killing the rate.', 'π cannot appear in related rates.', 'dA/dt is always 0.', 'r cannot change.', 'Keep r variable until after d/dt.'),
  ),
  'Exponential and Logarithmic Derivatives': pack(
    E('d/dx(e^(2x) ln x) equals?', '2e^(2x) ln x + e^(2x)/x', 'e^(2x)/x', '2e^(2x) ln x', 'e^(2x) ln x', 'Product rule: (2e^(2x))ln x + e^(2x)(1/x).'),
    E('d/dx(ln x) for x>0 is?', '1/x', 'ln x', 'x', 'e^x', 'The derivative of the natural log is the reciprocal.'),
    E('A student writes d/dx(e^(2x))=e^(2x). What failed?', 'They forgot the chain-rule factor 2.', 'e^(2x) cannot be differentiated.', 'ln x is required.', 'The product rule deletes e^(2x).', 'd/dx e^(u)=e^(u) u′ with u=2x.'),
  ),
  'Trigonometric Derivatives': pack(
    E('d/dx[sin(3x)] equals?', '3 cos(3x)', 'cos(3x)', '−3 cos(3x)', '3 sin(3x)', 'Chain rule: cos(3x) times 3.'),
    E('d/dx[cos x] equals?', '−sin x', 'sin x', 'sec² x', '−cos x', 'The cosine derivative is negative sine.'),
    E('A student writes d/dx[sin(3x)]=cos(3x). What failed?', 'They omitted the inner derivative 3.', 'sin cannot be differentiated.', '3x is constant.', 'The answer must be −sin.', 'Angle 3x is not x.'),
  ),
  'Logarithmic Differentiation': pack(
    E('For y=x^x (x>0), ln y equals?', 'x ln x', 'ln x + x', 'x^x', 'ln(x^x)/x', 'ln(x^x)=x ln x.'),
    E('After ln y=x ln x, y′ equals?', 'x^x (ln x+1)', 'x^x ln x', 'x^(x−1)', '1/x', 'y′/y=ln x+1, so y′=y(ln x+1)=x^x(ln x+1).'),
    E('A student writes d/dx(x^x)=x·x^(x−1). What failed?', 'Power rule needs a constant exponent; here the exponent is variable.', 'Logs cannot be used.', 'x^x is e^x.', 'The derivative is 0.', 'Take ln first when the exponent depends on x.'),
  ),
  'Transcendental Optimization': pack(
    E('For P(t)=t e^(−t), P′(t)=0 at which positive critical point?', 't=1', 't=0', 't=e', 't=2', 'P′=e^(−t)(1−t)=0 ⇒ t=1.'),
    E('Why check the sign of P′ or the second derivative at t=1?', 'To classify max vs min (here a maximum for this model).', 'Critical points are automatically maxima.', 'e^(−t) is never positive.', 't=1 is an endpoint.', 'P′ changes from + to − at t=1.'),
    E('A student solves e^(−t)=0 for critical points of P. What failed?', 'e^(−t) is never zero; the factor (1−t) gives the critical point.', 'P has no critical points.', 't cannot be 1.', 'Logs are required first.', 'Set the whole product P′ to zero, not a never-zero factor.'),
  ),
  'Vector Representation in 2D and 3D': pack(
    E('For v=⟨3,−4,12⟩, |v| equals?', '13', '11', '19', '5', 'sqrt(9+16+144)=sqrt(169)=13.'),
    E('A vector is determined by what two geometric ideas?', 'Magnitude and direction (or an equivalent component triple).', 'Only its first component.', 'A single scalar.', 'Its unit only.', '⟨a,b,c⟩ encodes both length and direction in coordinates.'),
    E('A student reports |⟨3,−4,12⟩| as 3−4+12=11. What failed?', 'Magnitude is the Euclidean norm, not the signed sum of components.', '3D vectors have no length.', 'Absolute values add.', '|v| is always 1.', 'Use sqrt(x²+y²+z²).'),
  ),
  'Vector Operations and Linear Combinations': pack(
    E('2⟨1,3,−1⟩−⟨4,0,2⟩ equals?', '⟨−2,6,−4⟩', '⟨−2,3,−3⟩', '⟨2,6,−2⟩', '⟨−4,6,2⟩', '⟨2,6,−2⟩−⟨4,0,2⟩=⟨−2,6,−4⟩.'),
    E('Scalar multiplication of a vector does what?', 'Scales magnitude and reverses direction if the scalar is negative.', 'Adds 1 to each component.', 'Always produces a unit vector.', 'Deletes the z-component.', 'c⟨a,b⟩=⟨ca,cb⟩.'),
    E('A student computes 2⟨1,3,−1⟩ as ⟨2,3,−1⟩. What failed?', 'The scalar must multiply every component.', 'Subtraction is illegal.', '2 only scales x.', 'Linear combinations require unit vectors.', '2⟨1,3,−1⟩=⟨2,6,−2⟩.'),
  ),
  'Dot Product, Projections, and Work': pack(
    E('If u·v=0 for nonzero u and v, the vectors are?', 'Perpendicular', 'Parallel', 'Equal', 'Opposite', 'Cosine of the angle is 0, so the angle is 90°.'),
    E('Work by a constant force F along displacement d is?', 'F·d', 'F×d', '|F|+|d|', '|F×d|', 'W=|F||d|cosθ=F·d.'),
    E('A student concludes two vectors are parallel because their dot product is 0. What failed?', 'A zero dot product (for nonzero vectors) means perpendicular, not parallel.', 'Dot product is a vector.', 'Parallel vectors have dot product 0.', 'Work forbids cosine.', 'Parallel nonzero vectors have |u·v|=|u||v|.'),
  ),
  'Cross Product, Area, and Torque': pack(
    E('⟨1,2,3⟩×⟨4,5,6⟩ equals?', '⟨−3,6,−3⟩', '⟨−3,−6,−3⟩', '⟨3,6,3⟩', '⟨32, 32, 32⟩', 'i(12−15)−j(6−12)+k(5−8)=⟨−3,6,−3⟩.'),
    E('The magnitude |u×v| equals?', 'The area of the parallelogram spanned by u and v.', 'The work u·v.', 'Always 0.', '|u|+|v|', '|u||v|sinθ is that parallelogram area.'),
    E('A student treats u×v as a scalar equal to u·v. What failed?', 'The cross product is a vector perpendicular to both; the dot product is a scalar.', 'Cross products exist in 2D as triples.', 'Area is u·v.', '⟨−3,6,−3⟩ is a scalar.', 'In 3D, × produces a vector; · produces a number.'),
  ),
  'Lines and Planes in 3D': pack(
    E('A plane through (1,2,3) with normal ⟨2,−1,4⟩ has equation?', '2(x−1)−(y−2)+4(z−3)=0', '2x−y+4z=0', 'x+2y+3z=0', '⟨2,−1,4⟩·⟨x,y,z⟩=1', 'n·(r−r0)=0 with r0=(1,2,3).'),
    E('A line in 3D is determined by?', 'A point and a direction vector.', 'A normal vector only.', 'Two scalars.', 'A single coordinate.', 'Its vector equation is r=r0+t d: r0 fixes a point and d supplies the line direction.'),
    E('A student writes the plane as 2x−y+4z=0 using that normal but ignoring (1,2,3). What failed?', 'The constant term must match the given point; 2(1)−(2)+4(3)=12, not 0.', 'Normals cannot define planes.', '(1,2,3) is the normal.', 'Lines use two normals.', 'Plug the point in to fix D in Ax+By+Cz+D=0.'),
  ),
  'Intersections and Distances': pack(
    E('Distance from point P to plane Ax+By+Cz+D=0 is?', '|APx+BPy+CPz+D|/sqrt(A²+B²+C²)', '|A+B+C+D|', 'sqrt(A²+B²+C²)', 'APx+BPy+CPz', 'The formula is the absolute value of the plane function at P over the normal’s magnitude.'),
    E('Skew lines in 3D are lines that?', 'Are not parallel and do not intersect (they lie in different planes).', 'Always intersect.', 'Are coplanar and parallel.', 'Have the same direction vector.', '3D allows non-intersecting, non-parallel lines.'),
    E('A student uses 2D “intersect or parallel” as the only 3D options. What failed?', 'They omitted the skew case.', 'Planes cannot contain lines.', 'Distance formulas require 2D.', 'Direction vectors must be equal.', 'In 3D, check parallelism, then whether a connecting segment is perpendicular / coplanar.'),
  ),

  '2D Kinematics and Projectile Motion': pack(
    E('A projectile launched horizontally has which horizontal acceleration (no air resistance)?', '0; vx is constant.', '−9.81 m/s².', 'g downward and forward.', 'v²/r.', 'Horizontal and vertical motions share time but not acceleration.'),
    E('Why can you solve projectile problems by components?', 'ax and ay are independent; they share the same elapsed time t.', 'Speed is always constant.', 'Gravity acts horizontally.', 'Range equals height.', 'Use x=vxt and y=vy0 t+½ay t² with ay=−g.'),
    E('A student uses a single 1D equation with the full launch speed as if the motion were along a straight line at constant a=g. What failed?', 'The acceleration is vertical only; the path is a parabola, not a 1D line along the velocity vector.', 'Time cannot be shared.', 'vx must change at −g.', 'Horizontal range is ½gt².', 'Split components; do not treat the trajectory as one 1D kinematics line.'),
  ),
  "Newton's Laws and Free-Body Diagrams": pack(
    E('A 10 kg box with net force 49.05 N has acceleration?', '4.905 m/s²', '49.05 m/s²', '10 m/s²', '0.204 m/s²', 'a=Fnet/m=49.05/10.'),
    E('A free-body diagram should show what?', 'Every force on the object of interest, drawn at that object.', 'Forces the object exerts on other objects only.', 'Velocity and acceleration as forces.', 'Only gravity.', 'ΣF=ma uses forces ON the system.'),
    E('A student includes the box’s force on the table as a force on the box. What failed?', 'FBDs list forces on the chosen object, not action-reaction partners on other objects.', 'Newton’s third law forbids tables.', 'Mass cannot be 10 kg.', 'Net force is always zero.', 'Draw only forces acting on the box.'),
  ),
  'Friction, Tension, and Inclined Planes': pack(
    E('On a 30° incline, the downslope component of gravity is?', 'mg sin 30°', 'mg cos 30°', 'mg', 'μ mg', 'Resolve mg into parallel (sin) and perpendicular (cos) to the slope.'),
    E('Kinetic friction (standard model) has magnitude?', 'μk N, opposite the velocity along the surface.', 'μk mg always, even on an incline, along the vertical.', 'μs N at rest, in the direction of motion.', 'mg sinθ always.', 'N is the normal, not always mg.'),
    E('A student uses mg as the normal force on a 30° incline (no other vertical forces). What failed?', 'The normal is mg cos 30°, not mg.', 'Friction is mg.', 'Tension is mg sinθ.', 'Inclines forbid normals.', 'Perpendicular equilibrium: N=mg cosθ.'),
  ),
  'Circular Motion and Centripetal Force': pack(
    E('For uniform circular motion, ac equals?', 'v²/r toward the centre', 'v²/r away from the centre', '0 because speed is constant', 'g only', 'Direction changes, so there is inward acceleration.'),
    E('A car rounding a level curve gets centripetal force from what (typically)?', 'Static friction toward the centre.', 'Gravity.', 'The car’s speed itself as a force.', 'Air resistance only.', 'ΣF inward = mv²/r; on flat ground that is friction.'),
    E('A student says constant speed around a circle means ΣF=0. What failed?', 'Constant speed is not constant velocity; net force is inward and nonzero.', 'Centripetal force is fictitious and never in ΣF.', 'v²/r is a force you draw extra.', 'Mass cancels so force is 0.', 'Need a real inward force equal to mv²/r.'),
  ),
  'Work and Energy Transfer': pack(
    E('A 20 N force along 3 m at 0° does how much work?', '60 J', '23 J', '6.67 J', '0 J', 'W=Fd cos0°=20·3·1=60 J.'),
    E('Work is zero when?', 'The force is perpendicular to the displacement (or d=0).', 'The object moves.', 'Force is nonzero.', 'Energy exists.', 'W=Fd cosθ; cos90°=0.'),
    E('A student computes W=20 N + 3 m = 23. What failed?', 'Work is a product with cosine, not a sum of force and distance.', 'Joules are newtons.', 'Angle is added.', 'Work is always 0.', 'Multiply F, d, and cosθ.'),
  ),
  'Mechanical Energy Conservation': pack(
    E('If non-conservative work is zero, what stays constant?', 'K+U (mechanical energy)', 'K only', 'U only', 'Momentum only', 'ΔK+ΔU=0 when Wnc=0.'),
    E('mgh at the top of a frictionless ramp becomes what at the bottom (from rest)?', '½mv² with v=sqrt(2gh)', 'mgh still, and v=0', '½mv²+mgh with both nonzero in the same way', 'mv', 'Loss in U equals gain in K.'),
    E('A student uses K+U conservation on a rough ramp with obvious heating. What failed?', 'Friction does non-conservative work; mechanical energy is not conserved.', 'Mass cancels so friction is 0.', 'U cannot convert to K.', 'Ramps forbid g.', 'Use Wnc=ΔEmechanical, or include thermal energy.'),
  ),
  'Power and Efficiency': pack(
    E('A motor doing 1200 J in 4 s has average power?', '300 W', '4800 W', '1200 W', '4 W', 'P=W/t=1200/4=300 W.'),
    E('Efficiency is which ratio?', 'Useful energy (or power) output / total energy (or power) input', 'Input / output', 'Force / time', 'Work × time', 'e=Eout/Ein ≤ 1 for ordinary machines.'),
    E('A student reports efficiency as 300 W because that was the power. What failed?', 'Power is a rate; efficiency is a dimensionless fraction of useful to total.', 'Watts are efficiency units.', 'Time cancels efficiency.', '1200 J is efficiency.', 'Compute useful/total, not the wattage alone.'),
  ),
  'Momentum, Impulse, and Collisions': pack(
    E('Two carts sticking together after colliding are modelled how?', 'm1v1+m2v2=(m1+m2)vf  (inelastic, momentum conserved if isolated)', 'K is conserved and they bounce', 'vf=v1+v2', 'Impulse is zero always', 'Perfectly inelastic: one combined mass; momentum still conserved if ΣFext=0.'),
    E('Impulse equals?', 'Change in momentum, also F_avg Δt', 'Force only', 'Mass only', '½mv²', 'Impulse is J=Δp; for a constant or average force it is also F_avg Δt.'),
    E('A student conserves kinetic energy for carts that stick. What failed?', 'Sticking is inelastic; K is not conserved, though p may be.', 'Masses cannot add.', 'vf must be v1.', 'Impulse forbids sticking.', 'Use momentum, then check that K dropped.'),
  ),
  'Universal Gravitation and Orbits': pack(
    E('For a circular orbit, v equals?', 'sqrt(GM/r)', 'GM/r²', 'GMm/r²', 'sqrt(GMm/r)', 'GMm/r²=mv²/r ⇒ v=sqrt(GM/r).'),
    E('Newton’s gravitational force magnitude is?', 'GMm/r²', 'GMm/r', 'mg only', 'mv² always', 'Inverse-square attraction along the line of centres.'),
    E('A student sets GMm/r²=mv and solves for v. What failed?', 'Centripetal force is mv²/r, not mv.', 'G is optional.', 'Mass m cannot cancel.', 'Orbits require magnetic force.', 'Equate gravity to mv²/r, then cancel m.'),
  ),
  'Electric Force and Electric Field': pack(
    E('E and F on a test charge q are related by?', 'E=F/q (vector form F=qE)', 'E=Fq', 'E=k q', 'F=E/r²', 'Field is force per unit charge.'),
    E('Coulomb’s law magnitude is?', 'k|q1 q2|/r²', 'k|q1 q2|/r', 'qE/r', 'k(q1+q2)/r²', 'Inverse-square along the line joining charges.'),
    E('A student uses F=k q1 q2 / r (not squared). What failed?', 'The Coulomb force is inverse-square, like gravity’s 1/r².', 'k is optional.', 'Fields are scalars only.', 'r is added to q.', 'Write 1/r², not 1/r.'),
  ),
  'Electric Potential and Energy': pack(
    E('Moving charge q through potential difference V changes electric PE by?', 'qV', 'V/q', 'q/V', '½qV²', 'ΔU=qΔV (with consistent sign convention).'),
    E('Potential difference is what conceptually?', 'Work per unit charge by the field (or against it, depending on sign convention taught).', 'Force per charge.', 'Charge per force.', 'Energy with no charge.', 'V=U/q; it is not the same as E.'),
    E('A student treats V and E as the same quantity with the same units. What failed?', 'E is N/C or V/m; V is J/C. They are related by a gradient, not identical.', 'Energy cannot change.', 'qV is force.', 'Potential is always 0.', 'Do not swap field and potential.'),
  ),
  'Magnetic Force and Charged Particles': pack(
    E('Magnitude of magnetic force on a charge is?', 'F=qvB sinθ', 'F=qE', 'F=qV', 'F=B/q', 'v and B with the angle between them; F is perpendicular to both.'),
    E('The magnetic force does no work on a charge when?', 'F is always perpendicular to v, so it can change direction but not speed (uniform B, no E).', 'F is parallel to v.', 'B is zero only.', 'q is negative.', 'W=F·d; F⊥v ⇒ power F·v=0.'),
    E('A student uses F=qvB with θ ignored when v is parallel to B. What failed?', 'sin0°=0, so F=0 when v is along B.', 'Parallel v always maximizes F.', 'q must be 0.', 'B cannot be uniform.', 'Check the angle between v and B.'),
  ),
  'Electromagnetic Induction': pack(
    E('Faraday’s law says induced emf equals?', 'Minus the rate of change of magnetic flux', 'B·A always, even if B is constant and the loop is still', 'qV', 'k q1 q2 / r²', 'ε=−dΦB/dt; Lenz gives the minus sign’s meaning.'),
    E('Lenz’s law says the induced current does what?', 'Opposes the change in flux that produced it.', 'Maximizes the flux change.', 'Flows only if E=0.', 'Cancels Faraday’s law.', 'The induced B field fights the increase or decrease of ΦB.'),
    E('A student applies electrolytic Faraday’s law (moles of metal) to a coil entering a magnetic field. What failed?', 'Induction uses magnetic flux and dΦB/dt, not electroplating charge.', 'Coils cannot have emf.', 'Lenz’s law is chemistry.', 'Flux is moles of electrons.', 'This lesson is electromagnetic induction, not electrolysis.'),
  ),
  'Wave Behaviour and Interference': pack(
    E('Constructive interference occurs when path difference is?', 'm λ (integer number of wavelengths)', '(m+½) λ only', 'Always λ/4', 'Speed of sound', 'In phase: extra path is a whole number of wavelengths.'),
    E('Waves can occupy the same space because they?', 'Superpose: the net displacement is the sum of individual displacements.', 'Destroy the medium.', 'Travel only in solids.', 'Cannot diffract.', 'Interference is superposition with a consistent phase relation.'),
    E('A student says destructive interference means the waves vanish forever. What failed?', 'They cancel at some locations; energy is redistributed, not globally destroyed.', 'Path difference cannot be λ/2.', 'Superposition is illegal.', 'm must be 0.', 'Nodes and antinodes are a spatial pattern.'),
  ),
  'Double-Slit and Diffraction Patterns': pack(
    E('Bright double-slit maxima satisfy?', 'm λ = d sinθ', 'm λ = d / sinθ', 'λ = d m θ (with θ in degrees only)', 'd = m / λ', 'Young: extra path d sinθ = mλ for maxima.'),
    E('If slit spacing d decreases (λ fixed), the pattern does what?', 'Fringes spread (larger θ for each m).', 'Fringes pack closer.', 'Wavelength becomes 0.', 'm becomes negative only.', 'sinθ=mλ/d; smaller d ⇒ larger θ.'),
    E('A student uses mλ=d sinθ for dark fringes without shifting by ½. What failed?', 'Minima are (m+½)λ = d sinθ in the usual convention.', 'd cannot be in the formula.', 'θ must be 90°.', 'Bright fringes are destructive.', 'Know which condition is max vs min.'),
  ),
  'Photoelectric Effect and Photons': pack(
    E('Electron KE_max after emission is?', 'hf−φ', 'hf', 'φ−hf', 'h/λ only, ignoring φ', 'Energy conservation: photon energy minus work function.'),
    E('If hf < φ, what happens?', 'No electrons are emitted, regardless of intensity (in the photon model).', 'More intense light still ejects electrons immediately.', 'KE becomes negative.', 'φ becomes hf.', 'Threshold frequency f0=φ/h.'),
    E('A student says brighter red light (below threshold) must eject electrons because it carries more energy. What failed?', 'Intensity raises photon number, not photon energy; each photon is still hf<φ.', 'φ is intensity.', 'h is optional.', 'Red light has the highest f.', 'Frequency (photon energy) gates emission; brightness does not.'),
  ),
  'Special Relativity': pack(
    E('Time dilation: moving clocks run according to?', 'Δt = γ Δt0 with γ=1/sqrt(1−v²/c²)', 'Δt = Δt0 / v', 'γ=v/c', 'Δt=Δt0 always', 'Proper time Δt0 is the time in the clock’s rest frame.'),
    E('γ equals 1 when?', 'v=0 (or v≪c, γ≈1)', 'v=c', 'v=c/2 only', 'Always', 'γ grows as v approaches c.'),
    E('A student uses γ=1−v²/c² instead of 1/sqrt(1−v²/c²). What failed?', 'They dropped the square root and the reciprocal.', 'c cannot appear.', 'Proper time is Δt.', 'Length contraction uses +v².', 'Write γ=(1−β²)^(−1/2).'),
  ),

  'Hydrocarbons and Isomerism': pack(
    E('C4H10 has how many structural isomers?', 'Two: butane and 2-methylpropane', 'One', 'Four aromatic rings', 'None; alkanes cannot isomerize', 'n-butane vs isobutane (2-methylpropane).'),
    E('Alkanes, alkenes, and alkynes differ primarily by what?', 'Carbon–carbon bond type (single, double, triple) and the matching general formulas.', 'Only boiling point.', 'Whether they contain oxygen.', 'Nuclear charge only.', 'Saturation vs unsaturation is a bonding difference.'),
    E('A student claims C4H10’s isomers have different molecular formulas. What failed?', 'Structural isomers share a formula and differ in connectivity.', 'Isomers must be aromatic.', 'Butane is C4H8.', 'Branching changes the formula.', 'Same C4H10, different carbon skeleton.'),
  ),
  'Functional Groups and Naming': pack(
    E('CH3CH2OH is named ethanol because of which group?', 'The −OH alcohol group (suffix -ol)', 'An aldehyde −CHO', 'A ketone C=O in the middle', 'A carboxylic acid −COOH', 'Two carbons, saturated, alcohol suffix.'),
    E('Functional groups matter because they?', 'Control reactivity and the IUPAC suffix/prefix pattern.', 'Only change colour.', 'Are the carbon chain length only.', 'Replace isomerism.', '−OH vs C=O vs −COOH are different families.'),
    E('A student names CH3CH2OH as ethane. What failed?', 'They ignored the alcohol functional group that changes the suffix.', 'Ethane has an −OH.', 'IUPAC forbids -ol.', 'CH3CH2OH is a ketone.', 'The parent is still two carbons, but the suffix is -ol.'),
  ),
  'Organic Reactions': pack(
    E('Ethanoic acid + ethanol (acid catalyst) can form?', 'Ethyl ethanoate and water (esterification)', 'Ethene only', 'A polymer with no water', 'Methane and CO2 only', 'Condensation: acid + alcohol → ester + H2O.'),
    E('Addition to an alkene typically does what to the C=C?', 'Breaks the π bond and adds atoms across the carbons.', 'Removes hydrogen to make an alkyne.', 'Always forms a carboxylic acid.', 'Is substitution on an aromatic ring only.', 'C=C is the reactive site for addition.'),
    E('A student calls esterification an addition reaction because two molecules combine. What failed?', 'It is a condensation (water is eliminated), not addition across a double bond.', 'Esters cannot form.', 'Ethanol cannot react.', 'Acids only neutralize bases.', 'Name the mechanism class correctly.'),
  ),
  'Polymers and Biochemical Molecules': pack(
    E('Ethene monomers form polyethene by which process?', 'Addition polymerization (double bonds open and link)', 'Condensation with loss of water from ethene itself', 'Ionic bonding of NaCl type', 'Nuclear fusion', 'Each C=C becomes a C−C link in the chain.'),
    E('Condensation polymerization typically releases what?', 'A small molecule such as water (or HCl) as monomers join', 'Only heat', 'Free ethene', 'Electrons to an anode', 'Nylon/polyesters vs addition polyethene.'),
    E('A student says polyethene formation is condensation because a long chain “condenses.” What failed?', 'Ethene addition has no small-molecule by-product; condensation polymers do.', 'Polymers cannot be addition.', 'Monomers must be amino acids.', 'C=C forbids linking.', 'Use the presence/absence of a by-product to classify.'),
  ),
  'Quantum Model and Electron Configuration': pack(
    E('Oxygen’s electron configuration is?', '1s² 2s² 2p⁴', '1s² 2s² 2p⁶', '1s² 2p⁶', '2s² 2p⁴', 'Eight electrons: two in 1s, two in 2s, four in 2p.'),
    E('Hund’s rule for the 2p subshell of oxygen says what before pairing?', 'Place one electron in each of the three 2p orbitals, then pair the fourth.', 'Pair all 2p electrons first.', 'Skip 2s.', 'Fill 3s next.', 'Three 2p orbitals; four electrons ⇒ two unpaired.'),
    E('A student writes oxygen as 1s² 2s² 2p⁶. What failed?', 'That is neon; oxygen has eight electrons, not ten.', 'p subshells hold 8.', '1s cannot hold 2.', 'Configurations ignore atomic number.', 'Z=8 determines the electron count.'),
  ),
  'Periodic Trends': pack(
    E('Ionization energy generally does what across a period?', 'Increases as effective nuclear charge rises (with known exceptions).', 'Always decreases.', 'Is constant.', 'Depends only on mass number.', 'Harder to remove an electron as Zeff increases left to right.'),
    E('Atomic radius generally does what down a group?', 'Increases as principal energy level increases.', 'Decreases because Zeff always wins.', 'Stays identical.', 'Becomes zero.', 'New shells make atoms larger down a group.'),
    E('A student says ionization energy decreases across a period because atoms get heavier. What failed?', 'Mass is not the trend driver; Zeff and radius dominate, and IE typically increases across a period.', 'Heavier atoms always lose electrons easier across a period.', 'Radius increases left to right.', 'Groups are periods.', 'Do not confuse down-a-group with across-a-period.'),
  ),
  'Chemical Bonding and Molecular Polarity': pack(
    E('CO2 has polar bonds but is nonpolar overall because?', 'The linear bond dipoles cancel.', 'Carbon cannot form polar bonds.', 'Oxygen is electropositive.', 'CO2 is ionic.', 'Two equal C=O dipoles point opposite ways.'),
    E('A large electronegativity difference typically indicates what bonding?', 'Ionic character (electron transfer) rather than equal sharing.', 'A metallic lattice of CO2.', 'Hydrogen bonding inside one H2 molecule only.', 'No bonding.', 'ΔEN is a guide, not a sharp law, but it is the SCH4U tool.'),
    E('A student concludes CO2 is polar because each C=O bond is polar. What failed?', 'Molecular polarity is the vector sum of bond dipoles; here they cancel.', 'Linear molecules are always polar.', 'Cancel requires bent shape.', 'Oxygen cannot be electronegative.', 'Shape plus bond dipoles, not bonds alone.'),
  ),
  'VSEPR and Intermolecular Forces': pack(
    E('Water is bent because oxygen has what electron-pair geometry drivers?', 'Two bonding pairs and two lone pairs (tetrahedral electron geometry, bent molecular shape).', 'Two bonding pairs and no lone pairs (linear).', 'Six bonding pairs (octahedral).', 'Only hydrogen bonds as electron pairs.', 'AX2E2 ⇒ bent, ~104.5°.'),
    E('Hydrogen bonding as an IMF requires what?', 'H attached to N, O, or F, interacting with a lone pair on N, O, or F.', 'Any molecule with hydrogen.', 'Only London forces.', 'Ionic lattices only.', 'Water’s high boiling point vs H2S is the standard comparison.'),
    E('A student predicts water is linear like CO2 because both have two hydrogens/oxygens “attached.” What failed?', 'They ignored lone pairs on oxygen that occupy space and bend the molecule.', 'VSEPR only counts nuclei.', 'CO2 is bent.', 'IMFs determine shape.', 'Electron pairs, including lone pairs, set the shape.'),
  ),
  'Enthalpy and Calorimetry': pack(
    E('q for a temperature change in a coffee-cup calorimeter (water) is?', 'q=mcΔT', 'q=m/cΔT', 'q=c/ΔT', 'q=ΔT/mc', 'Heat absorbed by water equals m c ΔT at constant pressure (approx. ΔH).'),
    E('Enthalpy change ΔH refers to heat at what condition?', 'Constant pressure', 'Constant volume only, always', 'Zero kelvin', 'No temperature change ever', 'qp=ΔH for the system’s process.'),
    E('A student uses q=mcΔT with c of water but forgets the sign when the reaction heats the water. What failed?', 'If water’s T rises, the reaction released heat: qsys is negative of qwater (insulated cup).', 'c cannot be used.', 'ΔT is always 0.', 'Mass is moles only.', 'Assign the heat to the reaction with the opposite sign of the surroundings.'),
  ),
  "Hess's Law and Formation Enthalpy": pack(
    E('Hess’s law works because enthalpy is what kind of function?', 'A state function: path independence lets you add reactions.', 'A path function like work in every process.', 'Only defined for elements.', 'A rate constant.', 'ΔH depends on initial and final states, so reaction algebra is legal.'),
    E('Adding C+½O2→CO and CO+½O2→CO2 gives what net reaction?', 'C+O2→CO2', '2CO→C+CO2', 'C+CO2→2CO', 'CO→C+½O2', 'The intermediate CO cancels.'),
    E('A student adds ΔH values but forgets to reverse the sign when a reaction is reversed. What failed?', 'Reversing a reaction reverses the sign of ΔH.', 'State functions cannot be added.', 'Formation enthalpies are rates.', 'CO cannot cancel.', 'Match each ΔH to the direction you actually use.'),
  ),
  'Collision Theory and Activation Energy': pack(
    E('A catalyst speeds a reaction by doing what?', 'Lowering Ea without being consumed', 'Raising temperature only', 'Being consumed as a reactant', 'Changing ΔH to be more negative always', 'More collisions exceed the lower barrier; catalyst regenerates.'),
    E('Collision theory says rate depends on what three ideas?', 'Frequency, orientation, and energy ≥ Ea', 'Only colour', 'Only ΔH', 'Only the product yield', 'Not every collision is effective.'),
    E('A student says a catalyst is consumed like a reactant because it appears in a mechanism step. What failed?', 'Net, a catalyst is regenerated; it is not a stoichiometric reactant.', 'Ea cannot change.', 'Orientation is irrelevant.', 'Temperature is the catalyst.', 'Check the net equation: catalyst cancels.'),
  ),
  'Rate Laws and Reaction Mechanisms': pack(
    E('If rate=k[A]²[B], doubling [A] does what to the rate (B fixed)?', 'Quadruples it', 'Doubles it', 'Halves it', 'No change', 'Second order in A: 2²=4.'),
    E('Rate laws are determined how (experimentally)?', 'By measuring how rate depends on concentrations; not from the overall balanced equation alone.', 'Always by copying stoichiometric coefficients.', 'From ΔH only.', 'From colour of k.', 'Orders are experimental; they may match an elementary step.'),
    E('A student writes rate=k[A][B] just because the overall equation is A+B→products. What failed?', 'Overall stoichiometry is not the rate law unless the reaction is elementary.', 'k cannot include B.', 'Second order is illegal.', 'Mechanisms have no intermediates.', 'Need data or an elementary-step justification.'),
  ),
  'Dynamic Equilibrium and Kc': pack(
    E('For N2+3H2 ⇌ 2NH3, Kc equals?', '[NH3]²/([N2][H2]³)', '[N2][H2]³/[NH3]²', '[NH3]/[N2][H2]', 'kforward only', 'Products over reactants, coefficients as exponents; solids/liquids omitted in the usual Kc.'),
    E('At equilibrium, what is equal?', 'Forward and reverse rates (net concentrations constant)', 'Kc and Q always, even after a sudden stress before the shift', 'Masses of all species', 'Ea forward and reverse always', 'Dynamic: reactions continue; no net change.'),
    E('A student writes Kc=[N2][H2][NH3] as a sum of concentrations. What failed?', 'Kc is a quotient of concentrations raised to stoichiometric powers, not a sum.', 'Equilibria cannot have gases.', 'Exponents are always 1.', 'Kc is a rate.', 'Use the mass-action expression.'),
  ),
  "Le Chatelier's Principle": pack(
    E('Adding a reactant to a system at equilibrium typically does what?', 'Shifts toward products until Q returns to K', 'Shifts toward reactants', 'Changes K immediately (if T is fixed)', 'Stops all reactions', 'Q drops below K; net forward reaction.'),
    E('Which stress changes the value of K (not just Q)?', 'Temperature', 'Adding a catalyst', 'Adding an inert gas at constant volume (ideal, same T) typically', 'Changing concentration of a product only, at fixed T', 'K is T-dependent; catalysts change rate, not K.'),
    E('A student says a catalyst shifts equilibrium to the products because the reaction “goes faster.” What failed?', 'A catalyst speeds forward and reverse equally; K is unchanged.', 'Le Chatelier forbids catalysts.', 'Faster means larger K.', 'Q becomes K².', 'Rates change; the position of equilibrium does not.'),
  ),
  'Acid-Base Equilibrium and pH': pack(
    E('pH equals?', '−log[H+]', 'log[H+]', '−log[OH−]', '[H+]×14', 'pOH=−log[OH−]; pH+pOH=14 at 25 °C for water.'),
    E('A weak acid’s Ka expression is?', '[H+][A−]/[HA] (approx. after ICE, ignoring water)', '[HA]/[H+][A−]', 'pH/Ka', '14−pH', 'Partial ionization; Ka is small compared with strong acids.'),
    E('A student treats a weak acid as fully ionized when computing pH from the label concentration. What failed?', 'Only strong acids can be taken as [H+]≈formal concentration; weak acids need Ka and ICE.', 'pH cannot be negative.', 'Ka is 1 for all acids.', '−log is illegal.', 'Use the equilibrium [H+], not the bottle molarity as if it all ionized.'),
  ),
  'Buffers and Titration Curves': pack(
    E('A weak acid–strong base titration has equivalence pH that is?', 'Above 7 (the salt is a weak base)', 'Exactly 7 always', 'Below 7 always', '0', 'A− hydrolyzes; equivalence is basic.'),
    E('A buffer resists pH change because it contains what?', 'A weak acid and its conjugate base (or weak base and conjugate acid) in comparable amounts', 'A strong acid only', 'Pure water', 'A catalyst', 'Added H+ is consumed by A−; added OH− is consumed by HA.'),
    E('A student picks methyl orange (changes ~pH 4) for a weak acid–strong base titration. What failed?', 'The equivalence is basic; the indicator range must include that pH.', 'Indicators are independent of equivalence.', 'pH 7 is required for all titrations.', 'Buffers forbid indicators.', 'Match indicator to the steep region of the curve.'),
  ),
  'Oxidation Numbers and Redox': pack(
    E('In Zn → Zn²⁺ + 2e⁻, zinc is?', 'Oxidized (loss of electrons)', 'Reduced', 'The oxidizing agent only', 'Unchanged', 'Oxidation is loss; Zn’s ON goes 0 to +2.'),
    E('Reduction is defined as?', 'Gain of electrons (ON decreases)', 'Gain of oxygen only', 'Loss of electrons', 'Increase in ON', 'OIL RIG: reduction is gain.'),
    E('A student says zinc is reduced because Zn²⁺ is a positive ion. What failed?', 'The half-reaction shows electron loss; the ion is the oxidized form.', 'Positive ions cannot be products of oxidation.', 'Electrons are gained by Zn.', 'ON of Zn stays 0.', 'Follow electrons and oxidation numbers, not the sign of the ion alone.'),
  ),
  'Balancing Redox Reactions': pack(
    E('In acidic solution, after balancing atoms other than H and O, you typically add what for oxygen?', 'H2O for oxygen, then H+ for hydrogen, then e− for charge', 'OH− first always', 'O2 gas only', 'NaCl', 'Standard acidic half-reaction method.'),
    E('Why must electrons cancel between half-reactions?', 'The net reaction cannot show leftover e−; multiply halves to equalize e−', 'Electrons are products in both halves', 'Mass does not include charge', 'Water cancels electrons', 'Charge and atoms both balance in the net equation.'),
    E('A student balances atoms but not charge, leaving a net 4+ on one side. What failed?', 'Acidic/basic methods add e− so charge balances as well as atoms.', 'Charge never balances in redox.', 'H+ cannot be used.', 'Water has charge +1.', 'Check atom count and total charge.'),
  ),
  'Galvanic Cells and Cell Potential': pack(
    E('Ecell = Ecathode − Eanode (standard reduction potentials). Positive Ecell means?', 'The cell reaction as written is spontaneous', 'The reaction is non-spontaneous', 'Electrons flow toward the anode in the external wire', 'K=0', 'ΔG°=−nFE°; E°>0 ⇒ spontaneous in the galvanic direction.'),
    E('In a galvanic cell, oxidation occurs at which electrode?', 'Anode', 'Cathode', 'Both equally in the wire', 'The salt bridge only', 'Anode: oxidation; cathode: reduction. Anode is labelled − in galvanic cells.'),
    E('A student computes Ecell as Eanode − Ecathode using reduction tables and gets the wrong sign. What failed?', 'The usual table method is reduction(cathode) minus reduction(anode).', 'E° values cannot be subtracted.', 'Spontaneity ignores sign.', 'nF is Ecell.', 'Keep the cathode-minus-anode convention from the data booklet.'),
  ),
  "Electrolytic Cells and Faraday's Law": pack(
    E('Charge Q related to current and time is?', 'Q=It', 'Q=I/t', 'Q=t/I', 'Q=nF/I', 'Coulombs = amperes × seconds.'),
    E('Moles of electrons from charge Q is?', 'Q/F  (F≈96485 C mol⁻¹)', 'QF', 'I t F', 'n/F', '1 mol e⁻ carries Faraday’s constant of charge.'),
    E('A student uses Faraday’s electrolysis law to find induced emf in a generator coil. What failed?', 'Electrolytic Faraday relates charge to moles of substance; induced emf is dΦB/dt.', 'Q=It is illegal in electrolysis.', 'F is magnetic flux.', 'Electrolysis forbids time.', 'This lesson is electrolysis, not electromagnetic induction.'),
  ),
};
