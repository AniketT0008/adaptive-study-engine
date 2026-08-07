export const EXAMPLE_DECKS = [
  {
    "id": "example-cs-101",
    "title": "Intro to Computer Science",
    "description": "Variables, loops, algorithms, and Big-O notation",
    "emoji": "\ud83d\udcbb",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "binary-numbers",
        "label": "Binary Numbers",
        "sourceSnippet": "Binary (base-2) is the language of computers, using only 0s and 1s to represent all data and instructions.",
        "example": "Mathematical Conversion: 1011\u2082 = (1 \u00d7 2\u00b3) + (0 \u00d7 2\u00b2) + (1 \u00d7 2\u00b9) + (1 \u00d7 2\u2070) = 8 + 0 + 2 + 1 = 11\u2081\u2080.",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-07T12:00:00.000Z",
        "history": []
      },
      {
        "id": "variables",
        "label": "Variables",
        "sourceSnippet": "A variable is a named storage location in memory used to hold data that can be modified during execution.",
        "example": "Code Sample:\nlet score = 10;\nscore = score + 5; // score is now 15",
        "mastery": 0,
        "easinessFactor": 2.5,
        "interval": 1,
        "repetitions": 0,
        "nextReviewDate": "2026-08-07T12:00:00.000Z",
        "history": []
      },
      {
        "id": "big-o",
        "label": "Big-O Notation",
        "sourceSnippet": "Big-O describes how an algorithm runtime or space requirements grow as input size N grows.",
        "example": "Complexity Comparison:\nLinear Search = O(N) (1,000 items \u2192 1,000 steps)\nBinary Search = O(log N) (1,000 items \u2192 10 steps!)",
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
        "options": [
          "Base-10",
          "Base-2",
          "Base-16",
          "Base-8"
        ],
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
        "explanation": "Variables map symbolic names to memory addresses."
      },
      {
        "id": "q-cs-3",
        "conceptId": "big-o",
        "type": "short",
        "difficulty": "hard",
        "prompt": "What is the Big-O time complexity of binary search?",
        "options": null,
        "answer": "O(log N)",
        "explanation": "Binary search halves the search space each step."
      }
    ]
  },
  {
    "id": "example-calc-101",
    "title": "Calculus & University Physics",
    "description": "Derivatives, integrals, kinematics, and Newton laws",
    "emoji": "\ud83d\udcd0",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "derivatives",
        "label": "Power Rule Derivatives",
        "sourceSnippet": "The power rule states that the derivative of x^n with respect to x is n * x^(n-1).",
        "example": "Worked Math Example:\nFind d/dx (3x\u2074 - 5x\u00b2 + 7):\n= 3(4x\u00b3) - 5(2x\u00b9) + 0 = 12x\u00b3 - 10x.",
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
        "sourceSnippet": "Integration computes the net signed area under a curve f(x) over an interval [a, b].",
        "example": "Worked Integral Example:\n\u222b\u2081\u00b3 2x dx = [x\u00b2]\u2081\u00b3 = (3\u00b2) - (1\u00b2) = 9 - 1 = 8 units\u00b2.",
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
        "sourceSnippet": "The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.",
        "example": "Physics Calculation:\nA 5 kg block pushed with 20 N force accelerating on a frictionless surface:\na = F / m = 20 N / 5 kg = 4 m/s\u00b2.",
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
        "prompt": "What is the derivative of x\u00b3 using the power rule?",
        "options": [
          "3x\u00b2",
          "x\u00b2",
          "3x\u00b3",
          "x\u2074/4"
        ],
        "answer": "3x\u00b2",
        "explanation": "d/dx (x\u00b3) = 3 * x^(3-1) = 3x\u00b2."
      },
      {
        "id": "q-calc-2",
        "conceptId": "integration",
        "type": "cloze",
        "difficulty": "medium",
        "prompt": "Integration represents the accumulated ___ under a curve.",
        "options": null,
        "answer": "area",
        "explanation": "The definite integral measures total net area."
      },
      {
        "id": "q-calc-3",
        "conceptId": "kinematics",
        "type": "short",
        "difficulty": "hard",
        "prompt": "What is the formula for Newton second law of motion?",
        "options": null,
        "answer": "F = ma",
        "explanation": "Force equals mass times acceleration."
      }
    ]
  },
  {
    "id": "example-bio-101",
    "title": "Cellular Biology 101",
    "description": "Cell organelles, ATP energy, and DNA replication",
    "emoji": "\ud83e\uddec",
    "createdAt": "2026-08-07T12:00:00.000Z",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": [
      {
        "id": "mitochondria",
        "label": "Mitochondria & ATP",
        "sourceSnippet": "Mitochondria generate energy-rich ATP molecules through oxidative phosphorylation.",
        "example": "Biochemical Balance Sheet:\n1 Glucose molecule + 6 O\u2082 \u2192 6 CO\u2082 + 6 H\u2082O + ~32 ATP energy molecules.",
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
        "conceptId": "mitochondria",
        "type": "mcq",
        "difficulty": "easy",
        "prompt": "What energy currency molecule is produced in mitochondria?",
        "options": [
          "ATP",
          "DNA",
          "RNA",
          "NADH"
        ],
        "answer": "ATP",
        "explanation": "ATP is adenosine triphosphate, the cellular energy currency."
      }
    ]
  }
];