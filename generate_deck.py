import json
import os
import datetime

# Create data structure
decks = []

cs_concepts = [
    {
        "id": "binary-numbers",
        "label": "Binary Numbers",
        "sourceSnippet": "Binary (base-2) is the language of computers, using only 0s and 1s to represent all data and instructions. Each 0 or 1 is called a bit, and eight bits make a byte. By combining these simple on/off states, computers can encode complex information like numbers, text, and images.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "variables",
        "label": "Variables",
        "sourceSnippet": "A variable is a named storage location in memory used to hold data that can be modified during program execution. Think of it as a container with a label that stores a specific value. When you use the variable name in your code, the computer looks up and uses the stored value.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "data-types",
        "label": "Data Types",
        "sourceSnippet": "Data types classify the kind of value a variable can hold, determining what operations can be performed on it. Common types include integers (whole numbers), floats (decimals), strings (text), and booleans (true/false). Using the correct data type ensures operations like addition or string concatenation behave as expected.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "conditionals",
        "label": "Conditionals",
        "sourceSnippet": "Conditionals are programming constructs that execute different code paths depending on whether a specific condition is true or false. If-else statements are the most common form.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "loops",
        "label": "Loops",
        "sourceSnippet": "Loops repeat a sequence of instructions until a certain condition is met. For loops iterate a specific number of times, while while loops execute as long as a condition remains true.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "functions",
        "label": "Functions",
        "sourceSnippet": "Functions are reusable blocks of code designed to perform a specific task. They take inputs (parameters), perform operations, and often return an output.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "arrays",
        "label": "Arrays",
        "sourceSnippet": "An array is a data structure consisting of a collection of elements, typically of the same data type, stored at contiguous memory locations.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "algorithms",
        "label": "Algorithms",
        "sourceSnippet": "An algorithm is a finite sequence of well-defined, computer-implementable instructions to solve a class of problems or perform a computation.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "big-o",
        "label": "Big-O Notation",
        "sourceSnippet": "Big-O notation characterizes functions according to their growth rates, used to classify algorithms based on how their run time or space requirements grow as input size grows.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "recursion",
        "label": "Recursion",
        "sourceSnippet": "Recursion is a method of solving a computational problem where the solution depends on solutions to smaller instances of the same problem. A recursive function calls itself.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "boolean-logic",
        "label": "Boolean Logic",
        "sourceSnippet": "Boolean logic is a form of algebra in which all values are reduced to either TRUE or FALSE, using operations like AND, OR, and NOT.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "debugging",
        "label": "Debugging",
        "sourceSnippet": "Debugging is the process of finding and resolving bugs (errors or abnormalities) within computer programs or software to prevent incorrect operation.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    }
]

cs_questions = [
    {
        "id": "q-binary-1", "conceptId": "binary-numbers", "type": "mcq", "difficulty": "easy",
        "prompt": "What base is the binary number system?",
        "options": ["Base-10", "Base-2", "Base-16", "Base-8"],
        "answer": "Base-2",
        "explanation": "Binary only uses two digits, 0 and 1, so it is a base-2 system."
    },
    {
        "id": "q-binary-2", "conceptId": "binary-numbers", "type": "cloze", "difficulty": "medium",
        "prompt": "Eight bits make a ___.",
        "options": None,
        "answer": "byte",
        "explanation": "A byte is the standard unit of digital data, consisting of 8 bits."
    },
    {
        "id": "q-binary-3", "conceptId": "binary-numbers", "type": "short", "difficulty": "hard",
        "prompt": "What are the two digits used in binary?",
        "options": None,
        "answer": "0 and 1",
        "explanation": "Binary represents the on/off states of computer hardware using 0 and 1."
    },
    {
        "id": "q-variables-1", "conceptId": "variables", "type": "mcq", "difficulty": "easy",
        "prompt": "What is a variable in programming?",
        "options": ["A static value", "A named storage location in memory", "A type of error", "A function call"],
        "answer": "A named storage location in memory",
        "explanation": "Variables act as containers with names that store data during program execution."
    },
    {
        "id": "q-variables-2", "conceptId": "variables", "type": "cloze", "difficulty": "medium",
        "prompt": "When you use a variable name, the computer looks up its stored ___.",
        "options": None,
        "answer": "value",
        "explanation": "The name refers to the location, which holds the actual value stored there."
    },
    {
        "id": "q-variables-3", "conceptId": "variables", "type": "short", "difficulty": "hard",
        "prompt": "Can a variable's value be modified during program execution?",
        "options": None,
        "answer": "Yes",
        "explanation": "Variables are typically mutable, meaning their stored values can be updated."
    },
    {
        "id": "q-datatypes-1", "conceptId": "data-types", "type": "mcq", "difficulty": "easy",
        "prompt": "Which data type is used for whole numbers?",
        "options": ["Float", "String", "Boolean", "Integer"],
        "answer": "Integer",
        "explanation": "Integers represent whole numbers without fractional parts."
    },
    {
        "id": "q-datatypes-2", "conceptId": "data-types", "type": "cloze", "difficulty": "medium",
        "prompt": "Text is stored using the ___ data type.",
        "options": None,
        "answer": "string",
        "explanation": "Strings are sequences of characters used to represent text."
    },
    {
        "id": "q-datatypes-3", "conceptId": "data-types", "type": "short", "difficulty": "hard",
        "prompt": "What type of value evaluates to true or false?",
        "options": None,
        "answer": "Boolean",
        "explanation": "Booleans represent one of two truth values: true or false."
    },
    # Conditionals
    {
        "id": "q-cond-1", "conceptId": "conditionals", "type": "mcq", "difficulty": "easy",
        "prompt": "Which statement is commonly used for conditionals?",
        "options": ["for", "while", "if-else", "def"],
        "answer": "if-else",
        "explanation": "If-else statements are the most common form of conditionals."
    },
    {
        "id": "q-cond-2", "conceptId": "conditionals", "type": "cloze", "difficulty": "medium",
        "prompt": "Conditionals execute different code paths depending on whether a specific condition is ___ or false.",
        "options": None,
        "answer": "true",
        "explanation": "Conditionals rely on boolean logic evaluation."
    },
    {
        "id": "q-cond-3", "conceptId": "conditionals", "type": "short", "difficulty": "hard",
        "prompt": "What kind of constructs execute different code paths based on a condition?",
        "options": None,
        "answer": "Conditionals",
        "explanation": "Conditionals allow for branching logic."
    },
    # Loops
    {
        "id": "q-loops-1", "conceptId": "loops", "type": "mcq", "difficulty": "easy",
        "prompt": "What do loops do in programming?",
        "options": ["Make decisions", "Repeat instructions", "Store data", "Define classes"],
        "answer": "Repeat instructions",
        "explanation": "Loops execute a block of code multiple times."
    },
    {
        "id": "q-loops-2", "conceptId": "loops", "type": "cloze", "difficulty": "medium",
        "prompt": "___ loops iterate a specific number of times.",
        "options": None,
        "answer": "For",
        "explanation": "For loops are used when the number of iterations is known."
    },
    {
        "id": "q-loops-3", "conceptId": "loops", "type": "short", "difficulty": "hard",
        "prompt": "Which type of loop executes as long as a condition remains true?",
        "options": None,
        "answer": "While loop",
        "explanation": "While loops depend on an ongoing true condition."
    },
    # Functions
    {
        "id": "q-func-1", "conceptId": "functions", "type": "mcq", "difficulty": "easy",
        "prompt": "What is a function in programming?",
        "options": ["A data type", "A reusable block of code", "A conditional statement", "A loop"],
        "answer": "A reusable block of code",
        "explanation": "Functions group code to perform specific tasks so it can be reused."
    },
    {
        "id": "q-func-2", "conceptId": "functions", "type": "cloze", "difficulty": "medium",
        "prompt": "Functions take inputs called ___.",
        "options": None,
        "answer": "parameters",
        "explanation": "Parameters are passed to functions as inputs."
    },
    {
        "id": "q-func-3", "conceptId": "functions", "type": "short", "difficulty": "hard",
        "prompt": "What do functions often do after performing operations?",
        "options": None,
        "answer": "Return an output",
        "explanation": "Functions frequently return a value based on their computations."
    },
    # Arrays
    {
        "id": "q-arr-1", "conceptId": "arrays", "type": "mcq", "difficulty": "easy",
        "prompt": "What is an array?",
        "options": ["A single value", "A loop", "A collection of elements", "A function"],
        "answer": "A collection of elements",
        "explanation": "Arrays store multiple items in a single variable."
    },
    {
        "id": "q-arr-2", "conceptId": "arrays", "type": "cloze", "difficulty": "medium",
        "prompt": "Elements in an array are stored at ___ memory locations.",
        "options": None,
        "answer": "contiguous",
        "explanation": "Arrays are typically stored consecutively in memory."
    },
    {
        "id": "q-arr-3", "conceptId": "arrays", "type": "short", "difficulty": "hard",
        "prompt": "Do arrays usually hold elements of the same or different data types?",
        "options": None,
        "answer": "Same data type",
        "explanation": "Traditional arrays contain elements of the same type."
    },
    # Algorithms
    {
        "id": "q-alg-1", "conceptId": "algorithms", "type": "mcq", "difficulty": "easy",
        "prompt": "What is an algorithm?",
        "options": ["A programming language", "A sequence of instructions", "A hardware component", "A variable"],
        "answer": "A sequence of instructions",
        "explanation": "Algorithms are step-by-step procedures for calculations."
    },
    {
        "id": "q-alg-2", "conceptId": "algorithms", "type": "cloze", "difficulty": "medium",
        "prompt": "Algorithms are designed to ___ a class of problems.",
        "options": None,
        "answer": "solve",
        "explanation": "The purpose of an algorithm is problem solving."
    },
    {
        "id": "q-alg-3", "conceptId": "algorithms", "type": "short", "difficulty": "hard",
        "prompt": "Must an algorithm be a finite or infinite sequence?",
        "options": None,
        "answer": "Finite",
        "explanation": "An algorithm must eventually terminate."
    },
    # Big-O
    {
        "id": "q-bigo-1", "conceptId": "big-o", "type": "mcq", "difficulty": "easy",
        "prompt": "What does Big-O notation characterize?",
        "options": ["Syntax errors", "Function growth rates", "Memory addresses", "Network speed"],
        "answer": "Function growth rates",
        "explanation": "It describes how algorithm performance scales with input size."
    },
    {
        "id": "q-bigo-2", "conceptId": "big-o", "type": "cloze", "difficulty": "medium",
        "prompt": "Big-O is used to classify algorithms based on run time or ___ requirements.",
        "options": None,
        "answer": "space",
        "explanation": "Big-O analyzes both time and space complexity."
    },
    {
        "id": "q-bigo-3", "conceptId": "big-o", "type": "short", "difficulty": "hard",
        "prompt": "What happens to the input size when analyzing Big-O?",
        "options": None,
        "answer": "It grows",
        "explanation": "Big-O looks at asymptotic behavior as input size tends to infinity."
    },
    # Recursion
    {
        "id": "q-rec-1", "conceptId": "recursion", "type": "mcq", "difficulty": "easy",
        "prompt": "What is recursion?",
        "options": ["A loop", "A function calling itself", "An error", "A data type"],
        "answer": "A function calling itself",
        "explanation": "Recursion occurs when a function invokes itself."
    },
    {
        "id": "q-rec-2", "conceptId": "recursion", "type": "cloze", "difficulty": "medium",
        "prompt": "Recursion breaks problems into ___ instances of the same problem.",
        "options": None,
        "answer": "smaller",
        "explanation": "Recursive solutions depend on solving smaller subproblems."
    },
    {
        "id": "q-rec-3", "conceptId": "recursion", "type": "short", "difficulty": "hard",
        "prompt": "What must a recursive function eventually reach to stop calling itself?",
        "options": None,
        "answer": "Base case",
        "explanation": "A base case prevents infinite recursion."
    },
    # Boolean logic
    {
        "id": "q-bool-1", "conceptId": "boolean-logic", "type": "mcq", "difficulty": "easy",
        "prompt": "Boolean logic reduces values to what?",
        "options": ["0 to 9", "TRUE or FALSE", "Positive and negative", "Strings"],
        "answer": "TRUE or FALSE",
        "explanation": "Boolean algebra works with truth values."
    },
    {
        "id": "q-bool-2", "conceptId": "boolean-logic", "type": "cloze", "difficulty": "medium",
        "prompt": "Boolean logic uses operations like AND, OR, and ___.",
        "options": None,
        "answer": "NOT",
        "explanation": "These are the fundamental boolean operators."
    },
    {
        "id": "q-bool-3", "conceptId": "boolean-logic", "type": "short", "difficulty": "hard",
        "prompt": "What type of algebra is Boolean logic a form of?",
        "options": None,
        "answer": "Algebra",
        "explanation": "It is a mathematical framework for logical operations."
    },
    # Debugging
    {
        "id": "q-debug-1", "conceptId": "debugging", "type": "mcq", "difficulty": "easy",
        "prompt": "What is debugging?",
        "options": ["Writing code", "Finding and resolving bugs", "Compiling", "Designing UX"],
        "answer": "Finding and resolving bugs",
        "explanation": "It is the process of fixing software errors."
    },
    {
        "id": "q-debug-2", "conceptId": "debugging", "type": "cloze", "difficulty": "medium",
        "prompt": "Debugging prevents ___ operation of software.",
        "options": None,
        "answer": "incorrect",
        "explanation": "Removing bugs ensures the program works as intended."
    },
    {
        "id": "q-debug-3", "conceptId": "debugging", "type": "short", "difficulty": "hard",
        "prompt": "What is another word for errors or abnormalities in a program?",
        "options": None,
        "answer": "Bugs",
        "explanation": "Software defects are commonly called bugs."
    }
]

cs_deck = {
    "id": "example-cs-101",
    "title": "Intro to Computer Science",
    "description": "Variables, loops, algorithms, and Big-O notation",
    "emoji": "💻",
    "createdAt": "new Date().toISOString()",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": cs_concepts,
    "questions": cs_questions
}

# BIOLOGY
bio_concepts = [
    {
        "id": "cell-membrane",
        "label": "Cell Membrane",
        "sourceSnippet": "The cell membrane (plasma membrane) is a biological membrane that separates and protects the interior of all cells from the outside environment. It is selectively permeable to ions and organic molecules and controls the movement of substances in and out of cells.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "mitochondria",
        "label": "Mitochondria",
        "sourceSnippet": "Mitochondria are often referred to as the powerhouses of the cell. They are organelles that act like a digestive system which takes in nutrients, breaks them down, and creates energy rich molecules for the cell. The biochemical processes of the cell are known as cellular respiration.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "nucleus",
        "label": "Nucleus",
        "sourceSnippet": "The nucleus is a highly specialized organelle that serves as the information processing and administrative center of the cell. This organelle has two major functions: it stores the cell's hereditary material, or DNA, and it coordinates the cell's activities, which include growth, intermediary metabolism, protein synthesis, and reproduction.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "ribosomes",
        "label": "Ribosomes",
        "sourceSnippet": "Ribosomes are the protein builders or the protein synthesizers of the cell. They are like construction guys who connect one amino acid at a time and build long chains. Ribosomes are special because they are found in both prokaryotes and eukaryotes.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "dna-replication",
        "label": "DNA Replication",
        "sourceSnippet": "DNA replication is the biological process of producing two identical replicas of DNA from one original DNA molecule. This process occurs in all living organisms and is the basis for biological inheritance.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "mitosis",
        "label": "Mitosis",
        "sourceSnippet": "Mitosis is a part of the cell cycle in which replicated chromosomes are separated into two new nuclei. Cell division gives rise to genetically identical cells in which the total number of chromosomes is maintained.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    }
]

bio_questions = [
    {
        "id": "q-mem-1", "conceptId": "cell-membrane", "type": "mcq", "difficulty": "easy",
        "prompt": "What separates the interior of the cell from the outside environment?",
        "options": ["Nucleus", "Ribosome", "Cell Membrane", "Mitochondria"],
        "answer": "Cell Membrane",
        "explanation": "The cell membrane acts as a protective barrier."
    },
    {
        "id": "q-mem-2", "conceptId": "cell-membrane", "type": "cloze", "difficulty": "medium",
        "prompt": "The cell membrane is selectively ___ to ions and organic molecules.",
        "options": None,
        "answer": "permeable",
        "explanation": "It controls what enters and exits the cell."
    },
    {
        "id": "q-mem-3", "conceptId": "cell-membrane", "type": "short", "difficulty": "hard",
        "prompt": "What controls the movement of substances in and out of cells?",
        "options": None,
        "answer": "Cell Membrane",
        "explanation": "The cell membrane regulates molecular transport."
    },
    {
        "id": "q-mito-1", "conceptId": "mitochondria", "type": "mcq", "difficulty": "easy",
        "prompt": "Mitochondria are often referred to as the ___ of the cell.",
        "options": ["Brain", "Powerhouse", "Garbage disposal", "Skeleton"],
        "answer": "Powerhouse",
        "explanation": "Mitochondria generate most of the chemical energy needed to power the cell."
    },
    {
        "id": "q-mito-2", "conceptId": "mitochondria", "type": "cloze", "difficulty": "medium",
        "prompt": "The biochemical processes of the cell are known as ___ respiration.",
        "options": None,
        "answer": "cellular",
        "explanation": "Cellular respiration happens in the mitochondria."
    },
    {
        "id": "q-mito-3", "conceptId": "mitochondria", "type": "short", "difficulty": "hard",
        "prompt": "What organelle takes in nutrients, breaks them down, and creates energy rich molecules?",
        "options": None,
        "answer": "Mitochondria",
        "explanation": "This is the primary function of mitochondria."
    },
    {
        "id": "q-nuc-1", "conceptId": "nucleus", "type": "mcq", "difficulty": "easy",
        "prompt": "Which organelle stores the cell's DNA?",
        "options": ["Ribosome", "Mitochondria", "Nucleus", "Golgi apparatus"],
        "answer": "Nucleus",
        "explanation": "The nucleus stores the hereditary material (DNA)."
    },
    {
        "id": "q-nuc-2", "conceptId": "nucleus", "type": "cloze", "difficulty": "medium",
        "prompt": "The nucleus serves as the information processing and ___ center of the cell.",
        "options": None,
        "answer": "administrative",
        "explanation": "It coordinates cell activities."
    },
    {
        "id": "q-nuc-3", "conceptId": "nucleus", "type": "short", "difficulty": "hard",
        "prompt": "Name one of the two major functions of the nucleus.",
        "options": None,
        "answer": "Stores DNA",
        "explanation": "It stores DNA and coordinates cell activities."
    },
    {
        "id": "q-ribo-1", "conceptId": "ribosomes", "type": "mcq", "difficulty": "easy",
        "prompt": "What do ribosomes synthesize?",
        "options": ["Lipids", "Proteins", "Carbohydrates", "DNA"],
        "answer": "Proteins",
        "explanation": "Ribosomes are the protein builders of the cell."
    },
    {
        "id": "q-ribo-2", "conceptId": "ribosomes", "type": "cloze", "difficulty": "medium",
        "prompt": "Ribosomes connect one ___ at a time to build long chains.",
        "options": None,
        "answer": "amino acid",
        "explanation": "Proteins are built from amino acid chains."
    },
    {
        "id": "q-ribo-3", "conceptId": "ribosomes", "type": "short", "difficulty": "hard",
        "prompt": "Are ribosomes found in prokaryotes or eukaryotes?",
        "options": None,
        "answer": "Both",
        "explanation": "Ribosomes are found in both cell types."
    },
    {
        "id": "q-dna-1", "conceptId": "dna-replication", "type": "mcq", "difficulty": "easy",
        "prompt": "What is the process of producing two identical replicas of DNA?",
        "options": ["Translation", "Transcription", "DNA Replication", "Mitosis"],
        "answer": "DNA Replication",
        "explanation": "Replication copies the genetic information."
    },
    {
        "id": "q-dna-2", "conceptId": "dna-replication", "type": "cloze", "difficulty": "medium",
        "prompt": "DNA replication produces two identical ___ of DNA from one original molecule.",
        "options": None,
        "answer": "replicas",
        "explanation": "It duplicates the DNA molecule."
    },
    {
        "id": "q-dna-3", "conceptId": "dna-replication", "type": "short", "difficulty": "hard",
        "prompt": "What process is the basis for biological inheritance?",
        "options": None,
        "answer": "DNA Replication",
        "explanation": "It allows traits to be passed to offspring."
    },
    {
        "id": "q-mitosis-1", "conceptId": "mitosis", "type": "mcq", "difficulty": "easy",
        "prompt": "What does mitosis separate into two new nuclei?",
        "options": ["Ribosomes", "Replicated chromosomes", "Mitochondria", "Cell membranes"],
        "answer": "Replicated chromosomes",
        "explanation": "Mitosis divides the genetic material equally."
    },
    {
        "id": "q-mitosis-2", "conceptId": "mitosis", "type": "cloze", "difficulty": "medium",
        "prompt": "Cell division gives rise to genetically ___ cells.",
        "options": None,
        "answer": "identical",
        "explanation": "Mitosis creates exact copies."
    },
    {
        "id": "q-mitosis-3", "conceptId": "mitosis", "type": "short", "difficulty": "hard",
        "prompt": "Does mitosis change the total number of chromosomes?",
        "options": None,
        "answer": "No",
        "explanation": "The chromosome number is maintained."
    }
]

bio_deck = {
    "id": "example-bio-101",
    "title": "Cellular Biology",
    "description": "Cell organelles, mitosis, and DNA replication",
    "emoji": "🧬",
    "createdAt": "new Date().toISOString()",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": bio_concepts,
    "questions": bio_questions
}

# PSYCHOLOGY
psych_concepts = [
    {
        "id": "classical-conditioning",
        "label": "Classical Conditioning",
        "sourceSnippet": "Classical conditioning is a learning procedure in which a biologically potent stimulus (e.g. food) is paired with a previously neutral stimulus (e.g. a bell). It refers to the learning process that results from this pairing.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "operant-conditioning",
        "label": "Operant Conditioning",
        "sourceSnippet": "Operant conditioning, also known as instrumental conditioning, is a method of learning normally attributed to B.F. Skinner, where the consequences of a response determine the probability of it being repeated.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "short-term-memory",
        "label": "Short-term Memory",
        "sourceSnippet": "Short-term memory is the capacity for holding a small amount of information in an active, readily available state for a short interval. For example, short-term memory holds a phone number that has just been recited.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "long-term-memory",
        "label": "Long-term Memory",
        "sourceSnippet": "Long-term memory is the stage of the Atkinson-Shiffrin memory model where informative knowledge is held indefinitely. It is defined in contrast to short-term and working memory, which persist for only about 18 to 30 seconds.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "cognitive-biases",
        "label": "Cognitive Biases",
        "sourceSnippet": "A cognitive bias is a systematic pattern of deviation from norm or rationality in judgment. Individuals create their own subjective reality from their perception of the input.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    },
    {
        "id": "maslows-hierarchy",
        "label": "Maslow's Hierarchy",
        "sourceSnippet": "Maslow's hierarchy of needs is an idea in psychology proposed by Abraham Maslow in his 1943 paper. It is a motivational theory comprising a five-tier model of human needs, often depicted as hierarchical levels within a pyramid.",
        "mastery": 0, "easinessFactor": 2.5, "interval": 1, "repetitions": 0, "history": []
    }
]

psych_questions = [
    {
        "id": "q-class-1", "conceptId": "classical-conditioning", "type": "mcq", "difficulty": "easy",
        "prompt": "What is paired with a neutral stimulus in classical conditioning?",
        "options": ["A biological potent stimulus", "A neutral response", "Punishment", "A cognitive bias"],
        "answer": "A biological potent stimulus",
        "explanation": "It pairs a natural reflex with a new trigger."
    },
    {
        "id": "q-class-2", "conceptId": "classical-conditioning", "type": "cloze", "difficulty": "medium",
        "prompt": "Classical conditioning is a ___ procedure.",
        "options": None,
        "answer": "learning",
        "explanation": "It's a fundamental type of learning."
    },
    {
        "id": "q-class-3", "conceptId": "classical-conditioning", "type": "short", "difficulty": "hard",
        "prompt": "Give an example of a previously neutral stimulus commonly used to explain this concept.",
        "options": None,
        "answer": "A bell",
        "explanation": "Pavlov famously used a bell (or metronome) in his experiments."
    },
    {
        "id": "q-operant-1", "conceptId": "operant-conditioning", "type": "mcq", "difficulty": "easy",
        "prompt": "Who is normally attributed with operant conditioning?",
        "options": ["Sigmund Freud", "B.F. Skinner", "Ivan Pavlov", "Abraham Maslow"],
        "answer": "B.F. Skinner",
        "explanation": "Skinner is the father of operant conditioning."
    },
    {
        "id": "q-operant-2", "conceptId": "operant-conditioning", "type": "cloze", "difficulty": "medium",
        "prompt": "The consequences of a response determine the ___ of it being repeated.",
        "options": None,
        "answer": "probability",
        "explanation": "Reinforcement increases probability, punishment decreases it."
    },
    {
        "id": "q-operant-3", "conceptId": "operant-conditioning", "type": "short", "difficulty": "hard",
        "prompt": "What is another name for operant conditioning?",
        "options": None,
        "answer": "Instrumental conditioning",
        "explanation": "It is also known as instrumental conditioning."
    },
    {
        "id": "q-stm-1", "conceptId": "short-term-memory", "type": "mcq", "difficulty": "easy",
        "prompt": "How much information can short-term memory hold?",
        "options": ["Unlimited", "A large amount", "A small amount", "None"],
        "answer": "A small amount",
        "explanation": "STM has a very limited capacity."
    },
    {
        "id": "q-stm-2", "conceptId": "short-term-memory", "type": "cloze", "difficulty": "medium",
        "prompt": "Short-term memory holds information in an active, readily ___ state.",
        "options": None,
        "answer": "available",
        "explanation": "The information is immediately accessible."
    },
    {
        "id": "q-stm-3", "conceptId": "short-term-memory", "type": "short", "difficulty": "hard",
        "prompt": "Give an example of something held in short-term memory.",
        "options": None,
        "answer": "A phone number",
        "explanation": "A just-recited phone number is a classic example."
    },
    {
        "id": "q-ltm-1", "conceptId": "long-term-memory", "type": "mcq", "difficulty": "easy",
        "prompt": "How long is knowledge held in long-term memory?",
        "options": ["18 to 30 seconds", "A few hours", "Indefinitely", "A few days"],
        "answer": "Indefinitely",
        "explanation": "LTM has a potentially limitless duration."
    },
    {
        "id": "q-ltm-2", "conceptId": "long-term-memory", "type": "cloze", "difficulty": "medium",
        "prompt": "Long-term memory is defined in contrast to ___ and working memory.",
        "options": None,
        "answer": "short-term",
        "explanation": "It's a different stage in the memory model."
    },
    {
        "id": "q-ltm-3", "conceptId": "long-term-memory", "type": "short", "difficulty": "hard",
        "prompt": "Which memory model includes long-term memory as a stage?",
        "options": None,
        "answer": "Atkinson-Shiffrin",
        "explanation": "This model proposed sensory, short-term, and long-term memory."
    },
    {
        "id": "q-bias-1", "conceptId": "cognitive-biases", "type": "mcq", "difficulty": "easy",
        "prompt": "What is a cognitive bias?",
        "options": ["A mental illness", "A perfect rational judgment", "A systematic deviation from rationality", "A memory technique"],
        "answer": "A systematic deviation from rationality",
        "explanation": "It describes flawed patterns of thinking."
    },
    {
        "id": "q-bias-2", "conceptId": "cognitive-biases", "type": "cloze", "difficulty": "medium",
        "prompt": "Individuals create their own ___ reality from their perception of the input.",
        "options": None,
        "answer": "subjective",
        "explanation": "Biases color how we see the world."
    },
    {
        "id": "q-bias-3", "conceptId": "cognitive-biases", "type": "short", "difficulty": "hard",
        "prompt": "Do cognitive biases represent a deviation from the norm?",
        "options": None,
        "answer": "Yes",
        "explanation": "They are systematic deviations from rational judgment."
    },
    {
        "id": "q-maslow-1", "conceptId": "maslows-hierarchy", "type": "mcq", "difficulty": "easy",
        "prompt": "How many tiers are in Maslow's model of human needs?",
        "options": ["Three", "Five", "Seven", "Ten"],
        "answer": "Five",
        "explanation": "It is a five-tier model."
    },
    {
        "id": "q-maslow-2", "conceptId": "maslows-hierarchy", "type": "cloze", "difficulty": "medium",
        "prompt": "Maslow's hierarchy of needs is often depicted as hierarchical levels within a ___.",
        "options": None,
        "answer": "pyramid",
        "explanation": "The pyramid shape is standard for this model."
    },
    {
        "id": "q-maslow-3", "conceptId": "maslows-hierarchy", "type": "short", "difficulty": "hard",
        "prompt": "In what year did Abraham Maslow propose this idea?",
        "options": None,
        "answer": "1943",
        "explanation": "He proposed it in his 1943 paper."
    }
]

psych_deck = {
    "id": "example-psych-101",
    "title": "Intro to Psychology",
    "description": "Classical conditioning, memory, and cognitive biases",
    "emoji": "🧠",
    "createdAt": "new Date().toISOString()",
    "streak": 0,
    "longestStreak": 0,
    "sessionLogs": [],
    "concepts": psych_concepts,
    "questions": psych_questions
}

decks = [cs_deck, bio_deck, psych_deck]

output = "export const EXAMPLE_DECKS = [\n"
for i, deck in enumerate(decks):
    deck_str = json.dumps(deck, indent=2)
    deck_str = deck_str.replace('"new Date().toISOString()"', "new Date().toISOString()")
    
    # We want to format it nicely with 'new Date().toISOString()'
    # Wait, the history also has nextReviewDate, but I just put nextReviewDate inside the string directly
    # In concepts I didn't add nextReviewDate. Let's add it.
    
    output += deck_str
    if i < len(decks) - 1:
        output += ",\n"

output += "\n];\n"

# add nextReviewDate to concepts
output = output.replace('"repetitions": 0,', '"repetitions": 0, "nextReviewDate": new Date().toISOString(),')

with open("src/data/exampleDeck.js", "w") as f:
    f.write(output)

print("Done")
