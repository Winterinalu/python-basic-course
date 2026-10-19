Build a beginner-friendly Python learning website as a static HTML, CSS, and JavaScript single-page app with Tailwind CSS and no backend. Serve it directly from Vercel without a frontend build step. All progress is stored in localStorage.

LEARNING OUTCOME
By the end, a learner can write and run small programs that use variables, if/else decisions, match, loops, and lists, can use input() to get answers from the user, and can read the error messages that help them fix mistakes.

GOAL
Teach complete beginners Python through seven lessons. Lessons 1 to 6 each have a plain-English explanation, a runnable code editor with an example, an interactive input demo, and a practice set of 10 problems. Lesson 7 is a final challenge with one problem. A "How to use this site" intro page comes first. A floating "Help me" button is available on every page.

PAGES AND ROUTES
1. / Home: a welcome header, a "How to use this site" card (links to /intro), and seven lesson cards in order. Each card shows the lesson number, title, a one-line description, a progress bar, and a "Start" or "Continue" button. Lessons 1 to 6 have 11 progress items (lesson read = 1, plus 10 problems). Lesson 7 has 2 progress items (lesson read = 1, plus 1 problem).
2. /intro How to use this site: short numbered sections with simple icons explaining (a) reading the explanation, (b) editing and running code with the Run button or Ctrl/Cmd+Enter, (c) reading the console and typing answers when a program asks for input, (d) doing practice problems and the "Check my answer" button, (e) using "Help me". End with a "Start Lesson 1" button.
3. /lesson/:id Lesson page (id 1 to 7), three panels on desktop:
   - Left: lesson title, 3 to 5 explanation sections with short headings, a "Key points" box with 3 bullets, and a "Go to practice" button at the bottom.
   - Center: code editor (textarea with monospace font and line numbers, or CodeMirror if easy), pre-filled with the lesson's exampleCode. Has Run, Reset, and a "Try with input" button that loads inputDemo into the editor.
   - Right: console. Shows print() output as plain text. Shows input prompts and the learner's typed answers. Errors show a friendly sentence first, then the original Python error in smaller text. Has a Clear button.
   On mobile (under 768px), stack the panels as tabs: Lesson / Code / Console.
   Below the panels: "Previous lesson" and "Next lesson" buttons.
4. /lesson/:id/practice Practice page. Lessons 1 to 6 have 10 problems, one at a time. Lesson 7 has 1 problem. Show a progress indicator ("Problem 3 of 10", or "Problem 1 of 1" for Lesson 7), the problem text, a code editor pre-filled with starterCode, a console, and buttons: "Check my answer", "Hint" (reveals one hint at a time), and "Show solution" (enabled after 2 failed Checks). When correct, show a green success message and a "Next" button. After the last problem, show a summary with the score and a "Back to lesson list" button. For Lesson 7, the summary shows "You finished the course!" along with the score.
5. Help me: a floating button bottom-right opens a side drawer. It has three quick-reply buttons: "I'm confused", "Explain simpler", "Give a deeper example". "Explain simpler" shows the lesson's simpler text; "Give a deeper example" shows the lesson's deeper text; "I'm confused" shows the simpler text followed by a suggestion to re-read the Key points. Add a text box labeled "Ask about this lesson". If the question cannot be matched to the lesson, reply: "Try the quick buttons above, or re-read the lesson text for now." Implement answers as a local function now, but structure the code so a real AI call can replace it later without changing the UI.

RUNNING PYTHON (firm requirements)
- Run all Python inside a Web Worker. Load Pyodide in the worker from https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js (pinned version). Load it once and reuse it for every run.
- Enforce a 10-second timeout on every Run and every Check. If the time runs out, terminate the worker, start a fresh one, and show in the console: "This code took too long. Check your loop's stopping condition." The page must stay usable during and after the timeout.
- The timeout pauses while the program is waiting for the learner to type an input. It resumes when the learner presses Enter.
- If Pyodide fails to load, show in the console: "Python couldn't load. Check your internet connection and refresh the page." Disable Run and Check until it loads.
- While loading, show "Loading Python..." in the console.
- Capture stdout and stderr from the worker and send them to the console panel.

REAL CONSOLE INPUT (firm requirement)
input() must behave like a terminal prompt, not a custom form:
- When the program calls input("prompt"), the console prints the prompt text on its own line, then shows a single blinking text cursor on the same line, like a terminal.
- The learner types the answer directly into the console and presses Enter. The typed text stays in the console history, and the program continues from that exact value.
- input() always returns a string, exactly as in real Python. Lessons convert with int() when they need numbers.
- When SharedArrayBuffer is available, the worker and the main thread may share one and use Atomics.wait/Atomics.notify for synchronous input. Otherwise, the worker transforms top-level input() calls into awaited input requests and pauses asynchronously until the console answer arrives.
- Interactive input works on static hosts that do not provide Cross-Origin-Opener-Policy or Cross-Origin-Embedder-Policy headers.
- If the learner closes the lesson or resets while input is waiting, terminate the worker cleanly.
- Ctrl/Cmd+C in the console stops a running program (same as the timeout behavior: terminate the worker and restart it).

Translate common errors into a friendly sentence, keeping the original message below it:
  NameError: "Python doesn't know the name 'nmae'. Check the spelling of the variable."
  SyntaxError: "Something in the code is written in a way Python doesn't understand. Check for a missing colon, quote, or bracket."
  IndentationError: "Lines inside an if, for, or while must be indented the same amount."
  TypeError: "Python can't combine these kinds of values. Try converting with int(), str(), or float()."
  ZeroDivisionError: "You can't divide by zero."
  ValueError (from int() on text that isn't a number): "Python expected a number here. Type only digits, like 12."

PRACTICE FEEDBACK (exact behavior)
- Correct output (after trimming whitespace at the ends): show "Correct! Well done." and enable Next.
- Wrong output: show "Not quite." Then show two boxes side by side: "Your output" and "Expected output", so the learner can compare line by line.
- No output: show "Your code printed nothing. Use print() to show a result."
- Error: show the friendly error sentence and the original Python error. Count only Check attempts as attempts, not edits.
- Count attempts per problem. "Show solution" unlocks after 2 failed Checks.
- Practice problems never use input(). The input demo on the lesson page is the only place for input.

DATA STRUCTURE
Store all content in /src/data/lessons.ts as typed objects:
{
  id: number,
  title: string,
  description: string,
  sections: [{ heading: string, body: string }],  // 3 to 5 sections, plain language
  keyPoints: string[],                             // exactly 3
  exampleCode: string,
  inputDemo: string,                               // a program that calls input(), loaded by "Try with input"
  inputDemoNote: string,                           // one sentence telling the learner what to type
  simpler: string,
  deeper: string,
  problems: [{
    prompt: string,
    starterCode: string,
    expectedOutput: string,   // compared to printed output after trimming
    hints: string[],          // exactly 2 (Lesson 7 has 2 hints)
    solution: string
  }]                          // exactly 10 for Lessons 1 to 6, exactly 1 for Lesson 7
}
Use short sentences and define any term in one plain sentence the first time it appears. Keep the code for each problem short.

PROBLEM RULES
- Expected output must match exactly what the solution prints.
- Problems go from easy to harder across the 10 items.
- Each problem prints one to three lines (Lesson 7 prints one line per action).

PROGRESS
Save to localStorage: lessons opened, lessons read, problems solved, attempts per problem, and whether the input demo was tried. Progress must survive a page refresh. Add a "Reset progress" button in the footer. It must open a confirmation dialog before clearing anything.

DESIGN
Clean and calm. White or very light background, one accent color (teal #0F766E), rounded cards, 18px base text, buttons at least 44px tall, high contrast, a clear visual hierarchy, and a monospace font for code and the console. The console looks like a terminal: monospace text, the typed input in a slightly different color, and a blinking cursor while waiting for input. Add a dark mode toggle that respects the system preference. No extra animations.

ACCESSIBILITY
Every button has a visible label. Use semantic HTML. Everything works with the keyboard (Tab, Enter, Escape closes the drawer and the dialog). The console input is focusable and gets focus automatically when a program asks for input. Show clear empty states. The layout works on phones from 320px wide.

LESSON CONTENT

LESSON 1: Variables and Data Types
Sections: (1) Storing values: a variable is a name that holds a value, written as name = value. (2) Naming rules: letters, numbers, and underscores, no spaces, cannot start with a number. (3) Data types: int (whole numbers), float (decimals), str (text in quotes), bool (True or False). Use type() to check. (4) Reading and converting input: input() gives text, so int() converts it to a number.
Key points: Use = to store a value in a variable. Use type() to check a value's kind. Convert text to a number with int() or float().
exampleCode:
name = "Ana"
age = 12
print("My name is", name)
print("Age:", age)
print(type(age))
inputDemo:
name = input("What is your name? ")
age = int(input("How old are you? "))
print("Hi", name)
print("Next year you will be", age + 1)
inputDemoNote: Type your name, press Enter, then type your age as a whole number.
simpler: A variable is a labeled box. You put a value in the box and give it a name, so you can use the name later instead of the value.
deeper: Variables can be reassigned. score = 10 then score = 25 makes score hold 25. The old value is replaced.

Problems:
P1 Store "Ana" in name and print it. Expected: Ana
  Starter: (empty line with a comment: # write your code here)
  Hints: Write name = "Ana" first. Then use print(name).
  Solution: name = "Ana"
print(name)

P2 Store 12 in age and print it. Expected: 12
  Hints: Numbers do not need quotes. Use print(age).
  Solution: age = 12
print(age)

P3 Print the type of x, where x = 5. Expected: <class 'int'>
  Starter: x = 5
  Hints: Use type(x) inside print().
  Solution: x = 5
print(type(x))

P4 Print the type of y, where y = 3.5. Expected: <class 'float'>
  Starter: y = 3.5
  Hints: The number has a decimal point, so it is a float.
  Solution: y = 3.5
print(type(y))

P5 Store 4 in a and 6 in b, then print both on one line. Expected: 4 6
  Hints: print() can take several values separated by commas.
  Solution: a = 4
b = 6
print(a, b)

P6 Set score to 10, then change it to 25, then print it. Expected: 25
  Starter: score = 10
  Hints: Assign a new value to the same name.
  Solution: score = 10
score = 25
print(score)

P7 Store True in is_sunny and print its type. Expected: <class 'bool'>
  Hints: True and False are the bool values. Do not put them in quotes.
  Solution: is_sunny = True
print(type(is_sunny))

P8 Store "Manila" in city and print: I live in Manila. Expected: I live in Manila
  Starter: city = "Manila"
  Hints: print() adds a space between values separated by commas.
  Solution: city = "Manila"
print("I live in", city)

P9 Fix the bug so it prints Leo. Expected: Leo
  Starter: Name = "Leo"
print(name)
  Hints: Variable names are case-sensitive, so Name and name are different.
  Solution: name = "Leo"
print(name)

P10 Convert the text "15" to a number and print it. Expected: 15
  Starter: age_text = "15"
  Hints: int() turns text into a whole number.
  Solution: age_text = "15"
age = int(age_text)
print(age)

LESSON 2: Computation
Sections: (1) Arithmetic operators: + add, - subtract, * multiply, / divide (always gives a decimal result). (2) Special division: // keeps the whole part only, % gives the remainder, ** raises to a power. (3) Order of operations: multiplication and division happen before addition and subtraction; parentheses come first. (4) Comparisons: == equal, != not equal, < > <= >= give True or False.
Key points: / always gives a decimal result. // gives the whole part and % gives the remainder. Comparisons return True or False.
exampleCode:
print(7 + 3)
print(9 / 2)
print(9 // 2)
print(9 % 2)
print(2 + 3 * 4)
print(5 > 3)
inputDemo:
a = int(input("First number: "))
b = int(input("Second number: "))
print("Sum:", a + b)
print("Average:", (a + b) / 2)
print("Is the sum bigger than 10?", a + b > 10)
inputDemoNote: Type two whole numbers, one per line, such as 4 and 9.
simpler: The computer does math like a calculator. Symbols like + and * are operators. Comparisons like > ask a yes-or-no question and answer True or False.
deeper: Use parentheses to control order: (2 + 3) * 4 is 20, while 2 + 3 * 4 is 14. Use % to check if a number is even: n % 2 == 0.

Problems:
P1 Print 7 + 3. Expected: 10
  Hints: Use print() with the sum inside.
  Solution: print(7 + 3)

P2 Print 10 - 4. Expected: 6
  Hints: The minus sign subtracts.
  Solution: print(10 - 4)

P3 Print 3 * 5. Expected: 15
  Hints: * means multiply.
  Solution: print(3 * 5)

P4 Print 9 / 2. Expected: 4.5
  Hints: / keeps the decimal part.
  Solution: print(9 / 2)

P5 Print 9 // 2. Expected: 4
  Hints: // keeps only the whole part of the division.
  Solution: print(9 // 2)

P6 Print the remainder of 9 divided by 2. Expected: 1
  Hints: The % symbol gives the remainder.
  Solution: print(9 % 2)

P7 Print 2 to the power of 3. Expected: 8
  Hints: ** means raise to a power.
  Solution: print(2 ** 3)

P8 Print 2 + 3 * 4. Expected: 14
  Hints: Multiplication happens before addition.
  Solution: print(2 + 3 * 4)

P9 Starter: price = 20 and tax = 0.1. Print price plus the tax amount (price * tax) added to price. Expected: 22.0
  Starter: price = 20
tax = 0.1
  Hints: Work out price * tax first, then add it to price.
  Solution: price = 20
tax = 0.1
print(price + price * tax)

P10 Starter: a = 8 and b = 3. Print True if a % b equals 2, otherwise False. Expected: True
  Starter: a = 8
b = 3
  Hints: a % b gives the remainder. Compare it to 2 with ==.
  Solution: a = 8
b = 3
print(a % b == 2)

LESSON 3: If / Else
Sections: (1) The if statement: if runs a block only when a condition is True. (2) Indentation: the lines inside an if must be indented the same amount, usually four spaces. (3) else and elif: else runs when the if is False; elif checks another condition. (4) Combining conditions: and needs both True, or needs at least one True, not flips True and False. (5) in checks whether something is inside a string.
Key points: Indent the lines inside an if. Use elif for more than two choices. Use and, or, and not to combine conditions.
exampleCode:
age = 10
if age >= 10:
    print("Old enough")
else:
    print("Too young")
inputDemo:
age = int(input("How old are you? "))
if age >= 18:
    print("Adult")
else:
    print("Minor")
inputDemoNote: Type your age as a whole number, such as 15 or 30.
simpler: An if statement is a decision. If the question is True, Python does the indented lines. If not, it skips them or runs the else part.
deeper: Chain choices with elif: if score >= 90 gives A, elif score >= 70 gives C, else gives F. Python checks from top to bottom and stops at the first True.

Problems:
P1 Starter: age = 10. If age is 10 or more, print "Old enough". Expected: Old enough
  Starter: age = 10
  Hints: Use if age >= 10: and indent the print line.
  Solution: age = 10
if age >= 10:
    print("Old enough")

P2 Starter: temp = 30. If temp is over 35 print "Hot", else print "Not hot". Expected: Not hot
  Starter: temp = 30
  Hints: Put else at the same indentation as if.
  Solution: temp = 30
if temp > 35:
    print("Hot")
else:
    print("Not hot")

P3 Starter: score = 72. Print "A" if score is 90 or more, "C" if 70 or more, otherwise "F". Expected: C
  Starter: score = 72
  Hints: Use elif for the middle check.
  Solution: score = 72
if score >= 90:
    print("A")
elif score >= 70:
    print("C")
else:
    print("F")

P4 Starter: n = -5. Print "negative" if n is below 0, otherwise print "zero or positive". Expected: negative
  Starter: n = -5
  Hints: < means less than.
  Solution: n = -5
if n < 0:
    print("negative")
else:
    print("zero or positive")

P5 Starter: num = 8. Print "even" if num divided by 2 has no remainder, otherwise "odd". Expected: even
  Starter: num = 8
  Hints: Use num % 2 == 0.
  Solution: num = 8
if num % 2 == 0:
    print("even")
else:
    print("odd")

P6 Starter: a = 5. Print "single digit" if a is greater than 0 and less than 10. Expected: single digit
  Starter: a = 5
  Hints: Use and between the two checks.
  Solution: a = 5
if a > 0 and a < 10:
    print("single digit")

P7 Starter: day = "Sat". Print "Weekend" if day is "Sat" or "Sun", otherwise "Weekday". Expected: Weekend
  Starter: day = "Sat"
  Hints: Use or between the two comparisons.
  Solution: day = "Sat"
if day == "Sat" or day == "Sun":
    print("Weekend")
else:
    print("Weekday")

P8 Starter: raining = False. Print "Go outside" if it is not raining. Expected: Go outside
  Starter: raining = False
  Hints: not flips True and False.
  Solution: raining = False
if not raining:
    print("Go outside")

P9 Starter: word = "python". Print "found" if the letter "y" is inside word. Expected: found
  Starter: word = "python"
  Hints: Use "y" in word as the condition.
  Solution: word = "python"
if "y" in word:
    print("found")

P10 Starter: age = 8. Print "Free" if under 5, "Child" if under 12, otherwise "Adult". Expected: Child
  Starter: age = 8
  Hints: Use elif for the middle range.
  Solution: age = 8
if age < 5:
    print("Free")
elif age < 12:
    print("Child")
else:
    print("Adult")

LESSON 4: Switch-Case (match)
Sections: (1) Why match: a cleaner alternative to a long if/elif chain when you compare one value against several options. (2) match and case: match value: starts the block, and each case value: runs when it equals the value. (3) The default case: case _: runs when nothing else matched. It must be last. (4) Several values in one case: use | to mean "or".
Key points: match checks one value against many cases. case _ is the default. Use | to put several values in one case.
exampleCode:
command = "start"
match command:
    case "start":
        print("Starting")
    case "stop":
        print("Stopping")
    case _:
        print("Unknown command")
inputDemo:
command = input("Type start, stop, or anything else: ")
match command:
    case "start":
        print("Starting")
    case "stop":
        print("Stopping")
    case _:
        print("Unknown command")
inputDemoNote: Type start, stop, or any other word, and watch which case runs.
simpler: match looks at one value and picks the first case that fits. Think of it as a menu: you pick one option, and Python runs that option's code.
deeper: A case can match several values: case "Sat" | "Sun": prints weekend for either day. Python 3.10 and newer supports match.

Problems:
P1 Starter: command = "start". Use match to print "Starting" for case "start". Expected: Starting
  Starter: command = "start"
  Hints: Put match command: on one line and indent each case below it.
  Solution: command = "start"
match command:
    case "start":
        print("Starting")

P2 Starter: code = 404. Print "OK" for 200 and "Not found" for 404. Expected: Not found
  Starter: code = 404
  Hints: Add a case for each number.
  Solution: code = 404
match code:
    case 200:
        print("OK")
    case 404:
        print("Not found")

P3 Starter: code = 500. Add a default case that prints "Other". Expected: Other
  Starter: code = 500
  Hints: case _ matches anything not matched above.
  Solution: code = 500
match code:
    case 200:
        print("OK")
    case 404:
        print("Not found")
    case _:
        print("Other")

P4 Starter: day = "Sat". Print "Weekend" for "Sat" or "Sun", otherwise "Weekday". Expected: Weekend
  Starter: day = "Sat"
  Hints: Put both values in one case with |.
  Solution: day = "Sat"
match day:
    case "Sat" | "Sun":
        print("Weekend")
    case _:
        print("Weekday")

P5 Starter: level = 2. Print "Beginner" for 1, "Intermediate" for 2, otherwise "Advanced". Expected: Intermediate
  Starter: level = 2
  Hints: Use one case for each number and a default at the end.
  Solution: level = 2
match level:
    case 1:
        print("Beginner")
    case 2:
        print("Intermediate")
    case _:
        print("Advanced")

P6 Starter: n = 3. Print the word for 1, 2, or 3 ("one", "two", "three"), otherwise "many". Expected: three
  Starter: n = 3
  Hints: Give each number its own case.
  Solution: n = 3
match n:
    case 1:
        print("one")
    case 2:
        print("two")
    case 3:
        print("three")
    case _:
        print("many")

P7 Starter: choice = "2". "1" prints "Add", "2" prints "Remove", anything else prints "Unknown". Expected: Remove
  Starter: choice = "2"
  Hints: The value is text, so the cases need quotes.
  Solution: choice = "2"
match choice:
    case "1":
        print("Add")
    case "2":
        print("Remove")
    case _:
        print("Unknown")

P8 Starter: color = "red". "red" or "pink" prints "warm", "blue" prints "cool", anything else prints "unknown". Expected: warm
  Starter: color = "red"
  Hints: Use | for the two warm colors.
  Solution: color = "red"
match color:
    case "red" | "pink":
        print("warm")
    case "blue":
        print("cool")
    case _:
        print("unknown")

P9 Starter: letter = "e". Print "vowel" for a, e, i, o, or u, otherwise "consonant". Expected: vowel
  Starter: letter = "e"
  Hints: List all five vowels with | in one case.
  Solution: letter = "e"
match letter:
    case "a" | "e" | "i" | "o" | "u":
        print("vowel")
    case _:
        print("consonant")

P10 Starter: light = "yellow". "green" prints "Go", "yellow" prints "Slow down", "red" prints "Stop". Expected: Slow down
  Starter: light = "yellow"
  Hints: Each light color gets its own case.
  Solution: light = "yellow"
match light:
    case "green":
        print("Go")
    case "yellow":
        print("Slow down")
    case "red":
        print("Stop")

LESSON 5: Loops
Sections: (1) The while loop: repeats while a condition is True. Change the variable inside, or the loop never ends. (2) The for loop: repeats once for each item. range(start, stop, step) makes numbers; stop is not included. (3) break stops the loop early. continue skips to the next repeat. (4) enumerate() gives both the position and the item when you loop over a list. Mention only briefly.
Key points: while repeats while a condition is True. for repeats once per item in range() or a list. break exits the loop; continue skips one repeat.
exampleCode:
for i in range(3):
    print(i)
count = 0
while count < 3:
    print("count is", count)
    count = count + 1
inputDemo:
total = 0
while True:
    text = input("Enter a number, or type done: ")
    if text == "done":
        break
    total = total + int(text)
print("Total:", total)
inputDemoNote: Type numbers one at a time. Type done to stop and see the total.
simpler: A loop repeats code so you don't have to write it many times. A for loop counts through a list of things. A while loop keeps going until a condition becomes False.
deeper: range(0, 10, 2) gives 0, 2, 4, 6, 8. Use break to stop early when you find what you want, and continue to skip one repeat.

Problems:
P1 Print the numbers 0 to 2, one per line, using range(3). Expected: 0 1 2 on separate lines
  Hints: range(3) gives 0, 1, 2. Use for i in range(3):
  Solution: for i in range(3):
    print(i)

P2 Print 1, 2, and 3 on separate lines. Expected: 1 2 3 on separate lines
  Hints: range(1, 4) starts at 1 and stops before 4.
  Solution: for i in range(1, 4):
    print(i)

P3 Print the even numbers 0, 2, 4, 6, 8 on separate lines. Expected: 0 2 4 6 8 on separate lines
  Hints: The third number in range() is the step.
  Solution: for i in range(0, 10, 2):
    print(i)

P4 Starter: count = 0. Use a while loop to print 0, 1, 2. Expected: 0 1 2 on separate lines
  Starter: count = 0
  Hints: Increase count inside the loop, or it never stops.
  Solution: count = 0
while count < 3:
    print(count)
    count = count + 1

P5 Starter: total = 0. Add 1 through 4 to total using a for loop, then print total. Expected: 10
  Starter: total = 0
  Hints: range(1, 5) gives 1, 2, 3, 4.
  Solution: total = 0
for n in range(1, 5):
    total = total + n
print(total)

P6 Starter: n = 3. Use a while loop to print 3, 2, 1, then print Liftoff. Expected: 3, 2, 1, Liftoff on separate lines
  Starter: n = 3
  Hints: Subtract 1 from n inside the loop.
  Solution: n = 3
while n > 0:
    print(n)
    n = n - 1
print("Liftoff")

P7 Use a for loop over range(10). Print each number, but stop the loop when i is 4. Expected: 0 1 2 3 on separate lines
  Hints: break leaves the loop. Check if i == 4 first.
  Solution: for i in range(10):
    if i == 4:
        break
    print(i)

P8 Print 0 to 4 but skip 2. Expected: 0 1 3 4 on separate lines
  Hints: continue skips the rest of this repeat.
  Solution: for i in range(5):
    if i == 2:
        continue
    print(i)

P9 Print 2, 4, and 6 (double of 1, 2, 3). Expected: 2 4 6 on separate lines
  Hints: Loop over range(1, 4) and print i * 2.
  Solution: for i in range(1, 4):
    print(i * 2)

P10 Print the numbers from 1 to 10 that are divisible by 5. Expected: 5 and 10 on separate lines
  Hints: Use if i % 5 == 0 inside the loop.
  Solution: for i in range(1, 11):
    if i % 5 == 0:
        print(i)

LESSON 6: Lists (Python's Arrays)
Sections: (1) Creating a list: square brackets hold items separated by commas. Lists can hold numbers or text. (2) Indexing: the first item is at index 0. Negative indexes count from the end: -1 is the last item. (3) Changing lists: append() adds an item to the end. len() gives how many items. (4) Looping and checking: a for loop visits each item. in checks whether an item is in the list.
Key points: Lists use square brackets. Index 0 is the first item. append() adds to the end.
exampleCode:
fruits = ["apple", "banana"]
print(fruits[0])
fruits.append("cherry")
print(len(fruits))
for fruit in fruits:
    print(fruit)
inputDemo:
items = []
for i in range(2):
    items.append(input("Add an item: "))
print(items)
print("You added", len(items), "items")
inputDemoNote: Type two words or numbers, pressing Enter after each one.
simpler: A list is a row of boxes numbered from 0. Each box holds one item, and you can look up or add items by their position.
deeper: Use a list to add up values: total = 0, then for n in nums: total = total + n. Use nums[-1] to get the last item without knowing the length.

Problems:
P1 Starter: fruits = ["apple", "banana"]. Print the whole list. Expected: ['apple', 'banana']
  Starter: fruits = ["apple", "banana"]
  Hints: print() works with a list name.
  Solution: fruits = ["apple", "banana"]
print(fruits)

P2 Starter: nums = [10, 20, 30]. Print the first item. Expected: 10
  Starter: nums = [10, 20, 30]
  Hints: The first item is at index 0.
  Solution: nums = [10, 20, 30]
print(nums[0])

P3 Starter: nums = [10, 20, 30]. Print the last item using a negative index. Expected: 30
  Starter: nums = [10, 20, 30]
  Hints: -1 means the last item.
  Solution: nums = [10, 20, 30]
print(nums[-1])

P4 Starter: nums = [10, 20, 30]. Add 40 to the end, then print the list. Expected: [10, 20, 30, 40]
  Starter: nums = [10, 20, 30]
  Hints: Use nums.append(40).
  Solution: nums = [10, 20, 30]
nums.append(40)
print(nums)

P5 Starter: nums = [5, 6, 7, 8]. Print how many items it has. Expected: 4
  Starter: nums = [5, 6, 7, 8]
  Hints: len() counts the items.
  Solution: nums = [5, 6, 7, 8]
print(len(nums))

P6 Starter: pets = ["cat", "dog", "fish"]. Use a for loop to print each pet on its own line. Expected: cat, dog, fish on separate lines
  Starter: pets = ["cat", "dog", "fish"]
  Hints: for pet in pets: then indent the print.
  Solution: pets = ["cat", "dog", "fish"]
for pet in pets:
    print(pet)

P7 Starter: pets = ["cat", "dog"]. Print True if "dog" is in the list. Expected: True
  Starter: pets = ["cat", "dog"]
  Hints: Use "dog" in pets.
  Solution: pets = ["cat", "dog"]
print("dog" in pets)

P8 Starter: nums = [2, 4, 6]. Add all the numbers using a loop and print the total. Expected: 12
  Starter: nums = [2, 4, 6]
  Hints: Start total at 0 before the loop.
  Solution: nums = [2, 4, 6]
total = 0
for n in nums:
    total = total + n
print(total)

P9 Starter: names = ["Ana", "Ben", "Cy"]. Print "Hi" and each name on its own line. Expected: Hi Ana, Hi Ben, Hi Cy on separate lines
  Starter: names = ["Ana", "Ben", "Cy"]
  Hints: Use print("Hi", name) inside the loop.
  Solution: names = ["Ana", "Ben", "Cy"]
for name in names:
    print("Hi", name)

P10 Starter: items = []. Use a loop to add 0, 10, and 20 to items, then print items. Expected: [0, 10, 20]
  Starter: items = []
  Hints: Loop over range(3) and append i * 10.
  Solution: items = []
for i in range(3):
    items.append(i * 10)
print(items)

LESSON 7: Final Challenge: Bank System
Add a seventh lesson called "Final Challenge: Bank System". It appears last in the lesson list and on the home page. It is an exception to the 10-problem rule: it has exactly 1 problem.

title: "Final Challenge: Bank System"
description: "Use variables, lists, loops, match, and if/else together to run a small bank."
sections:
  1. Heading "What you will build": A bank system keeps an account name in a string variable and a balance in an int variable. It reads a list of actions and handles each one.
  2. Heading "Actions as a list": Each action is a small list with a command and a value, such as ["deposit", 50]. The loop visits each action in order.
  3. Heading "Choosing what to do": match checks the command. Each case does one job: create, deposit, withdraw, or logout.
  4. Heading "Checking money": Before a withdrawal, use if to check that the balance is large enough. If not, print a message and leave the balance unchanged.
  5. Heading "Logging out": The logout action prints a goodbye message and uses break to stop the loop early.
keyPoints:
  - Use a string variable for the account name and an int variable for the balance.
  - Use a for loop with match to handle each action.
  - Use if before withdrawing, and break to log out.
exampleCode:
actions = [["create", "Ana"], ["deposit", 50], ["logout", 0]]
account = ""
balance = 0
for action in actions:
    command = action[0]
    value = action[1]
    match command:
        case "create":
            account = value
            print("Account created for", account)
        case "deposit":
            balance = balance + value
            print("Deposited", value, "New balance:", balance)
        case "logout":
            print("Logged out", account)
            break
inputDemo:
account = ""
balance = 0
while True:
    command = input("Command (create, deposit, withdraw, logout): ")
    match command:
        case "create":
            account = input("Account name: ")
            print("Account created for", account)
        case "deposit":
            balance = balance + int(input("Amount: "))
            print("New balance:", balance)
        case "withdraw":
            amount = int(input("Amount: "))
            if amount > balance:
                print("Not enough money")
            else:
                balance = balance - amount
                print("Withdrew", amount, "New balance:", balance)
        case "logout":
            print("Logged out", account)
            break
        case _:
            print("Unknown command")
inputDemoNote: Type create, then a name. Try deposit, withdraw, and logout. Type anything else to see the unknown-command message.
simpler: The bank keeps two things: who owns the account (a word in quotes) and how much money is in it (a number). Each action changes one of those, and logout stops the program.
deeper: Ask the bank to check before taking money out. A withdrawal larger than the balance should print "Not enough money" and leave the balance alone.

Problem (exactly 1):
prompt: "Build a bank system. Start with the actions list shown in the starter. Process each action in order. 'create' stores the name in account. 'deposit' adds the value to balance. 'withdraw' subtracts the value from balance, or prints 'Not enough money' if the balance is too small. 'logout' prints 'Logged out' and the account name, then stops the loop. After the loop, print the final balance."
starterCode:
actions = [
    ["create", "Ana"],
    ["deposit", 50],
    ["withdraw", 20],
    ["withdraw", 100],
    ["deposit", 15],
    ["logout", 0],
    ["deposit", 999],
]
account = ""
balance = 0
# write the loop here
expectedOutput:
Account created for Ana
Deposited 50 New balance: 50
Withdrew 20 New balance: 30
Not enough money
Deposited 15 New balance: 45
Logged out Ana
Final balance: 45
hints:
  1. Use for action in actions:, then set command = action[0] and value = action[1].
  2. Inside match, use an if/else in the withdraw case to compare value with balance before subtracting.
solution:
actions = [
    ["create", "Ana"],
    ["deposit", 50],
    ["withdraw", 20],
    ["withdraw", 100],
    ["deposit", 15],
    ["logout", 0],
    ["deposit", 999],
]
account = ""
balance = 0
for action in actions:
    command = action[0]
    value = action[1]
    match command:
        case "create":
            account = value
            print("Account created for", account)
        case "deposit":
            balance = balance + value
            print("Deposited", value, "New balance:", balance)
        case "withdraw":
            if value > balance:
                print("Not enough money")
            else:
                balance = balance - value
                print("Withdrew", value, "New balance:", balance)
        case "logout":
            print("Logged out", account)
            break
print("Final balance:", balance)

LESSON CONTENT NOTE
Every lesson must have exactly 10 problems except Lesson 7, which has exactly 1. Every problem has 2 hints (Lesson 7's problem has 2 hints). Every lesson has an inputDemo and inputDemoNote.

BUILD ORDER (deliver all seven lessons in this one build)
Step 1: Routing, layout, home page, intro page, and the three-panel lesson page. Load Lesson 1 content from lessons.ts.
Step 2: Web Worker with Pyodide, running code, console output, real console input(), friendly errors, the 10-second timeout (paused during input), and the load-failure message.
Step 3: Practice page with checking, the feedback rules above, hints, solutions, and progress saving.
Step 4: Help me drawer.
Step 5: Load Lessons 2 to 7 into lessons.ts, then test all seven lessons end to end. Test every inputDemo by typing answers into the console. Confirm that Lesson 7's expected output matches its solution exactly when run in Pyodide.
Do not change finished parts when adding later steps. Confirm each step works before moving on.

ACCEPTANCE CHECKLIST (the build is finished only when all of these pass)
- Progress survives a page refresh (lessons read, problems solved, attempts).
- Reset progress asks for confirmation and clears everything only after the learner confirms.
- Run and Check work with the keyboard (Tab to the button, Enter to press, Ctrl/Cmd+Enter in the editor).
- Escape closes the Help drawer and any dialog.
- An infinite loop shows the timeout message, and the page stays usable afterward.
- A program that calls input() shows the prompt in the console with a blinking cursor, accepts typed text with Enter, and continues with that value.
- Each lesson's "Try with input" demo works end to end in the console.
- If Pyodide is blocked from loading, the load-failure message appears and Run is disabled.
- If cross-origin isolation is unavailable, the input-unavailable message appears and only the "Try with input" button is disabled.
- All seven lessons open, lessons 1 to 6 each have 10 practice problems, Lesson 7 has 1, and every expected output matches its solution.
- The site fits a 320px-wide phone with no horizontal scrolling.
- Wrong, empty, and error results show the right feedback message in each case.