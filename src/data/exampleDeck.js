export const EXAMPLE_DECK = {
  id: 'example-cs-101',
  title: 'Intro to Computer Science',
  createdAt: new Date().toISOString(),
  streak: 0,
  longestStreak: 0,
  sessionLogs: [],
  concepts: [
    {
      id: 'binary-numbers',
      label: 'Binary Numbers',
      sourceSnippet: 'Binary (base-2) is the language of computers, using only 0s and 1s to represent all data and instructions. Each 0 or 1 is called a bit, and eight bits make a byte. By combining these simple on/off states, computers can encode complex information like numbers, text, and images.',
      mastery: 0, easinessFactor: 2.5, interval: 1, repetitions: 0, nextReviewDate: new Date().toISOString(), history: []
    },
    {
      id: 'variables',
      label: 'Variables',
      sourceSnippet: 'A variable is a named storage location in memory used to hold data that can be modified during program execution. Think of it as a container with a label that stores a specific value. When you use the variable name in your code, the computer looks up and uses the stored value.',
      mastery: 0, easinessFactor: 2.5, interval: 1, repetitions: 0, nextReviewDate: new Date().toISOString(), history: []
    },
    {
      id: 'data-types',
      label: 'Data Types',
      sourceSnippet: 'Data types classify the kind of value a variable can hold, determining what operations can be performed on it. Common types include integers (whole numbers), floats (decimals), strings (text), and booleans (true/false). Using the correct data type ensures operations like addition or string concatenation behave as expected.',
      mastery: 0, easinessFactor: 2.5, interval: 1, repetitions: 0, nextReviewDate: new Date().toISOString(), history: []
    },
    {
      id: 'conditionals',
      label: 'Conditionals',
      sourceSnippet: 'Conditional statements (if/else) let programs make decisions based on conditions. They evaluate boolean expressions to true or false, executing different blocks of code depending on the result. This allows programs to adapt their behavior based on user input or program state.',
      mastery: 0, easinessFactor: 2.5, interval: 1, repetitions: 0, nextReviewDate: new Date().toISOString(), history: []
    },
    {
      id: 'loops',
      label: 'Loops',
      sourceSnippet: 'Loops (for, while) repeat a block of code multiple times as long as a specified condition is met. A "for" loop is typically used when the number of iterations is known, while a "while" loop continues until its condition evaluates to false. They are essential for processing collections of data or automating repetitive tasks.',
      mastery: 0, easinessFactor: 2.5, interval: 1, repetitions: 0, nextReviewDate: new Date().toISOString(), history: []
    },
    {
      id: 'functions',
      label: 'Functions',
      sourceSnippet: 'A function is a reusable block of code that performs a specific task. It can take input parameters, execute operations, and return a result. Functions help organize code into logical, manageable pieces, promoting code reuse and reducing redundancy.',
      mastery: 0, easinessFactor: 2.5, interval: 1, repetitions: 0, nextReviewDate: new Date().toISOString(), history: []
    },
    {
      id: 'arrays',
      label: 'Arrays',
      sourceSnippet: 'An array is an ordered collection of elements accessed by index, typically starting at zero. They store multiple values in a single variable, making it easy to group related data. Because elements are stored contiguously in memory, arrays offer fast access to elements at a known index.',
      mastery: 0, easinessFactor: 2.5, interval: 1, repetitions: 0, nextReviewDate: new Date().toISOString(), history: []
    },
    {
      id: 'algorithms',
      label: 'Algorithms',
      sourceSnippet: 'An algorithm is a step-by-step procedure for solving a problem or performing a computation. It provides a clear, unambiguous set of instructions that transform an input into a desired output. Well-designed algorithms are essential for writing efficient and reliable software.',
      mastery: 0, easinessFactor: 2.5, interval: 1, repetitions: 0, nextReviewDate: new Date().toISOString(), history: []
    },
    {
      id: 'big-o',
      label: 'Big-O Notation',
      sourceSnippet: 'Big-O notation describes how an algorithm\'s time or space grows with input size. It focuses on the worst-case scenario and ignores constant factors to provide a high-level understanding of an algorithm\'s efficiency. For example, O(n) means time increases linearly, while O(1) means time is constant.',
      mastery: 0, easinessFactor: 2.5, interval: 1, repetitions: 0, nextReviewDate: new Date().toISOString(), history: []
    },
    {
      id: 'recursion',
      label: 'Recursion',
      sourceSnippet: 'Recursion is when a function calls itself to solve smaller instances of the same problem. A recursive function must have a base case to terminate the calls and prevent infinite loops. It is particularly useful for tasks that can naturally be divided into similar subproblems, like traversing trees or sorting arrays.',
      mastery: 0, easinessFactor: 2.5, interval: 1, repetitions: 0, nextReviewDate: new Date().toISOString(), history: []
    },
    {
      id: 'boolean-logic',
      label: 'Boolean Logic',
      sourceSnippet: 'Boolean logic uses AND, OR, and NOT operators to combine or invert true/false values. AND requires both conditions to be true, OR requires at least one to be true, and NOT reverses the value. These fundamental logic gates form the foundation of digital circuits and decision-making in software.',
      mastery: 0, easinessFactor: 2.5, interval: 1, repetitions: 0, nextReviewDate: new Date().toISOString(), history: []
    },
    {
      id: 'debugging',
      label: 'Debugging',
      sourceSnippet: 'Debugging is the process of finding and fixing errors (bugs) in code. It involves identifying the symptom, isolating the cause, and implementing a solution. Techniques include printing variable values, using a debugger tool to step through code, and writing automated tests to catch regressions.',
      mastery: 0, easinessFactor: 2.5, interval: 1, repetitions: 0, nextReviewDate: new Date().toISOString(), history: []
    }
  ],
  questions: [
    {
      id: 'q-binary-1', conceptId: 'binary-numbers', type: 'mcq', difficulty: 'easy',
      prompt: 'What base is the binary number system?',
      options: ['Base-10', 'Base-2', 'Base-16', 'Base-8'],
      answer: 'Base-2',
      explanation: 'Binary only uses two digits, 0 and 1, so it is a base-2 system.'
    },
    {
      id: 'q-binary-2', conceptId: 'binary-numbers', type: 'cloze', difficulty: 'medium',
      prompt: 'Eight bits make a ___.',
      options: null,
      answer: 'byte',
      explanation: 'A byte is the standard unit of digital data, consisting of 8 bits.'
    },
    {
      id: 'q-binary-3', conceptId: 'binary-numbers', type: 'short', difficulty: 'hard',
      prompt: 'What are the two digits used in binary?',
      options: null,
      answer: '0 and 1',
      explanation: 'Binary represents the on/off states of computer hardware using 0 and 1.'
    },
    {
      id: 'q-variables-1', conceptId: 'variables', type: 'mcq', difficulty: 'easy',
      prompt: 'What is a variable in programming?',
      options: ['A static value', 'A named storage location in memory', 'A type of error', 'A function call'],
      answer: 'A named storage location in memory',
      explanation: 'Variables act as containers with names that store data during program execution.'
    },
    {
      id: 'q-variables-2', conceptId: 'variables', type: 'cloze', difficulty: 'medium',
      prompt: 'When you use a variable name, the computer looks up its stored ___.',
      options: null,
      answer: 'value',
      explanation: 'The name refers to the location, which holds the actual value stored there.'
    },
    {
      id: 'q-variables-3', conceptId: 'variables', type: 'short', difficulty: 'medium',
      prompt: 'Can a variable\'s value be modified during program execution?',
      options: null,
      answer: 'Yes',
      explanation: 'Variables are typically mutable, meaning their stored values can be updated.'
    },
    {
      id: 'q-datatypes-1', conceptId: 'data-types', type: 'mcq', difficulty: 'easy',
      prompt: 'Which data type is used for whole numbers?',
      options: ['Float', 'String', 'Boolean', 'Integer'],
      answer: 'Integer',
      explanation: 'Integers represent whole numbers without fractional parts.'
    },
    {
      id: 'q-datatypes-2', conceptId: 'data-types', type: 'cloze', difficulty: 'medium',
      prompt: 'Text is stored using the ___ data type.',
      options: null,
      answer: 'string',
      explanation: 'Strings are sequences of characters used to represent text.'
    },
    {
      id: 'q-datatypes-3', conceptId: 'data-types', type: 'short', difficulty: 'hard',
      prompt: 'What type of value evaluates to true or false?',
      options: null,
      answer: 'Boolean',
      explanation: 'Booleans represent one of two truth values: true or false.'
    },
    {
      id: 'q-conditionals-1', conceptId: 'conditionals', type: 'mcq', difficulty: 'easy',
      prompt: 'What kind of statements let programs make decisions?',
      options: ['Loops', 'Conditionals', 'Variables', 'Arrays'],
      answer: 'Conditionals',
      explanation: 'Conditionals (like if/else) branch the execution based on true/false conditions.'
    },
    {
      id: 'q-conditionals-2', conceptId: 'conditionals', type: 'cloze', difficulty: 'medium',
      prompt: 'Conditionals evaluate ___ expressions to determine which code block to execute.',
      options: null,
      answer: 'boolean',
      explanation: 'The condition in an if statement must evaluate to a boolean (true or false).'
    },
    {
      id: 'q-conditionals-3', conceptId: 'conditionals', type: 'short', difficulty: 'medium',
      prompt: 'What keyword often follows an "if" statement to handle the false condition?',
      options: null,
      answer: 'else',
      explanation: 'The "else" block executes when the "if" condition evaluates to false.'
    },
    {
      id: 'q-loops-1', conceptId: 'loops', type: 'mcq', difficulty: 'easy',
      prompt: 'What is the primary purpose of a loop?',
      options: ['To store data', 'To make decisions', 'To repeat a block of code', 'To define a function'],
      answer: 'To repeat a block of code',
      explanation: 'Loops automate repetitive tasks by executing code multiple times.'
    },
    {
      id: 'q-loops-2', conceptId: 'loops', type: 'cloze', difficulty: 'medium',
      prompt: 'A ___ loop continues until its condition evaluates to false.',
      options: null,
      answer: 'while',
      explanation: 'While loops check their condition before each iteration and stop when it is false.'
    },
    {
      id: 'q-loops-3', conceptId: 'loops', type: 'short', difficulty: 'hard',
      prompt: 'Which loop is typically used when the number of iterations is known?',
      options: null,
      answer: 'for',
      explanation: 'A "for" loop often initializes a counter and runs a specific number of times.'
    },
    {
      id: 'q-functions-1', conceptId: 'functions', type: 'mcq', difficulty: 'easy',
      prompt: 'What is a function?',
      options: ['A reusable block of code', 'A single variable', 'A true/false value', 'An infinite loop'],
      answer: 'A reusable block of code',
      explanation: 'Functions encapsulate logic so it can be invoked multiple times without rewriting code.'
    },
    {
      id: 'q-functions-2', conceptId: 'functions', type: 'cloze', difficulty: 'medium',
      prompt: 'Functions can take input variables called ___.',
      options: null,
      answer: 'parameters',
      explanation: 'Parameters allow you to pass specific data into the function when you call it.'
    },
    {
      id: 'q-functions-3', conceptId: 'functions', type: 'short', difficulty: 'medium',
      prompt: 'What does a function use to send a result back to the caller?',
      options: null,
      answer: 'return',
      explanation: 'The return statement exits the function and provides a final output value.'
    },
    {
      id: 'q-arrays-1', conceptId: 'arrays', type: 'mcq', difficulty: 'easy',
      prompt: 'How are elements accessed in an array?',
      options: ['By name', 'By index', 'By value', 'By size'],
      answer: 'By index',
      explanation: 'Arrays use numerical indices to reference specific elements in the collection.'
    },
    {
      id: 'q-arrays-2', conceptId: 'arrays', type: 'cloze', difficulty: 'medium',
      prompt: 'In most programming languages, array indices start at ___.',
      options: null,
      answer: 'zero',
      explanation: 'Zero-based indexing is standard; the first element is at index 0.'
    },
    {
      id: 'q-arrays-3', conceptId: 'arrays', type: 'short', difficulty: 'hard',
      prompt: 'Are array elements typically stored contiguously or non-contiguously in memory?',
      options: null,
      answer: 'contiguously',
      explanation: 'Arrays allocate a single block of memory, allowing fast index-based access.'
    },
    {
      id: 'q-algorithms-1', conceptId: 'algorithms', type: 'mcq', difficulty: 'easy',
      prompt: 'What is an algorithm?',
      options: ['A type of variable', 'A hardware component', 'A step-by-step procedure', 'A syntax error'],
      answer: 'A step-by-step procedure',
      explanation: 'Algorithms are a sequence of instructions used to solve a specific problem.'
    },
    {
      id: 'q-algorithms-2', conceptId: 'algorithms', type: 'cloze', difficulty: 'medium',
      prompt: 'Algorithms transform an ___ into a desired output.',
      options: null,
      answer: 'input',
      explanation: 'An algorithm takes initial data (input) and processes it to produce a result.'
    },
    {
      id: 'q-algorithms-3', conceptId: 'algorithms', type: 'short', difficulty: 'medium',
      prompt: 'Why must algorithm instructions be unambiguous?',
      options: null,
      answer: 'So the computer executes them predictably',
      explanation: 'Computers cannot interpret intent; they need clear, precise steps.'
    },
    {
      id: 'q-bigo-1', conceptId: 'big-o', type: 'mcq', difficulty: 'medium',
      prompt: 'What does Big-O notation describe?',
      options: ['Exact runtime in seconds', 'How efficiency scales with input size', 'The amount of memory installed', 'The number of lines of code'],
      answer: 'How efficiency scales with input size',
      explanation: 'Big-O focuses on asymptotic growth rate, ignoring hardware and constant factors.'
    },
    {
      id: 'q-bigo-2', conceptId: 'big-o', type: 'cloze', difficulty: 'hard',
      prompt: 'O(1) means the time required is ___, regardless of input size.',
      options: null,
      answer: 'constant',
      explanation: 'Constant time algorithms take the same amount of time no matter how large the input is.'
    },
    {
      id: 'q-bigo-3', conceptId: 'big-o', type: 'short', difficulty: 'hard',
      prompt: 'Which scenario does Big-O primarily focus on?',
      options: null,
      answer: 'The worst-case scenario',
      explanation: 'Big-O represents the upper bound of complexity to guarantee performance limits.'
    },
    {
      id: 'q-recursion-1', conceptId: 'recursion', type: 'mcq', difficulty: 'medium',
      prompt: 'What defines a recursive function?',
      options: ['It never returns', 'It calls another function', 'It calls itself', 'It loops infinitely'],
      answer: 'It calls itself',
      explanation: 'Recursion happens when a function includes a call to its own definition.'
    },
    {
      id: 'q-recursion-2', conceptId: 'recursion', type: 'cloze', difficulty: 'hard',
      prompt: 'A recursive function must have a ___ case to terminate.',
      options: null,
      answer: 'base',
      explanation: 'The base case provides an exit condition so the function stops calling itself.'
    },
    {
      id: 'q-recursion-3', conceptId: 'recursion', type: 'short', difficulty: 'medium',
      prompt: 'What kind of problems are good candidates for recursion?',
      options: null,
      answer: 'Problems that can be divided into similar subproblems',
      explanation: 'Recursion solves the main problem by solving smaller instances of the same problem.'
    },
    {
      id: 'q-booleanlogic-1', conceptId: 'boolean-logic', type: 'mcq', difficulty: 'medium',
      prompt: 'Which operator requires BOTH conditions to be true?',
      options: ['OR', 'NOT', 'XOR', 'AND'],
      answer: 'AND',
      explanation: 'The AND operator only evaluates to true if every operand is true.'
    },
    {
      id: 'q-booleanlogic-2', conceptId: 'boolean-logic', type: 'cloze', difficulty: 'medium',
      prompt: 'The ___ operator reverses a boolean value.',
      options: null,
      answer: 'NOT',
      explanation: 'NOT turns true to false, and false to true.'
    },
    {
      id: 'q-booleanlogic-3', conceptId: 'boolean-logic', type: 'short', difficulty: 'hard',
      prompt: 'What does the OR operator require to evaluate to true?',
      options: null,
      answer: 'At least one condition to be true',
      explanation: 'OR evaluates to true if any single operand is true.'
    },
    {
      id: 'q-debugging-1', conceptId: 'debugging', type: 'mcq', difficulty: 'easy',
      prompt: 'What is the goal of debugging?',
      options: ['To add new features', 'To find and fix errors', 'To rewrite code', 'To compile the program'],
      answer: 'To find and fix errors',
      explanation: 'Debugging is the process of resolving bugs that cause incorrect behavior.'
    },
    {
      id: 'q-debugging-2', conceptId: 'debugging', type: 'cloze', difficulty: 'medium',
      prompt: 'Using a ___ tool allows you to step through code execution line by line.',
      options: null,
      answer: 'debugger',
      explanation: 'Debuggers pause execution so you can inspect program state at specific moments.'
    },
    {
      id: 'q-debugging-3', conceptId: 'debugging', type: 'short', difficulty: 'medium',
      prompt: 'What kind of tests can catch bugs when old code is modified?',
      options: null,
      answer: 'Automated tests',
      explanation: 'Automated tests ensure that changes do not break existing, working features (regressions).'
    }
  ]
};
