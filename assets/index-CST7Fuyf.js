(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function o(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(s){if(s.ep)return;s.ep=!0;const r=o(s);fetch(s.href,r)}})();const i=(e,t,o,a,s,r)=>({prompt:e,starterCode:t,expectedOutput:o,hints:[a,s],solution:r}),C=[{id:1,title:"Variables and Data Types",description:"Give values names, then use them in your program.",sections:[{heading:"Storing values",body:"A variable is a name that holds a value. Write name = value to store one."},{heading:"Naming rules",body:"Names can use letters, numbers, and underscores. They cannot have spaces or start with a number."},{heading:"Data types",body:"A data type is the kind of value. int means whole number, float means decimal, str means text, and bool means True or False. Use type() to check."},{heading:"Reading and converting input",body:"input() gives you text. Use int() to turn digit text into a whole number."}],keyPoints:["Use = to store a value in a variable.","Use type() to check a value’s kind.","Convert text to a number with int() or float()."],exampleCode:`name = "Ana"
age = 12
print("My name is", name)
print("Age:", age)
print(type(age))`,inputDemo:`name = input("What is your name? ")
age = int(input("How old are you? "))
print("Hi", name)
print("Next year you will be", age + 1)`,inputDemoNote:"Type your name, press Enter, then type your age as a whole number.",simpler:"A variable is a labeled box. You put a value in the box and give it a name, so you can use the name later instead of the value.",deeper:"Variables can be reassigned. score = 10 then score = 25 makes score hold 25. The old value is replaced.",problems:[i('Store "Ana" in name and print it.',"# write your code here","Ana",'Write name = "Ana" first.',"Then use print(name).",`name = "Ana"
print(name)`),i("Store 12 in age and print it.","# write your code here","12","Numbers do not need quotes.","Use print(age).",`age = 12
print(age)`),i("Print the type of x, where x = 5.","x = 5","<class 'int'>","Use type(x) inside print().","The value 5 is a whole number.",`x = 5
print(type(x))`),i("Print the type of y, where y = 3.5.","y = 3.5","<class 'float'>","Use type(y) inside print().","The decimal point makes this a float.",`y = 3.5
print(type(y))`),i("Store 4 in a and 6 in b, then print both on one line.","# write your code here","4 6","Create both variables first.","print() can take several values separated by commas.",`a = 4
b = 6
print(a, b)`),i("Set score to 10, then change it to 25, then print it.","score = 10","25","Assign a new value to the same name.","The later value replaces the earlier one.",`score = 10
score = 25
print(score)`),i("Store True in is_sunny and print its type.","# write your code here","<class 'bool'>","True and False are bool values.","Do not put True in quotes.",`is_sunny = True
print(type(is_sunny))`),i('Store "Manila" in city and print: I live in Manila.',"# write your code here","I live in Manila","Store the text in city.","print() adds a space between comma-separated values.",`city = "Manila"
print("I live in", city)`),i("Fix the bug so it prints Leo.",`Name = "Leo"
print(name)`,"Leo","Variable names are case-sensitive.","Name and name are different variables.",`name = "Leo"
print(name)`),i('Convert the text "15" to a number and print it.','age_text = "15"',"15","int() turns text into a whole number.","Store the converted value, then print it.",`age_text = "15"
age = int(age_text)
print(age)`)]},{id:2,title:"Computation",description:"Calculate with numbers and compare values.",sections:[{heading:"Arithmetic operators",body:"+ adds, - subtracts, * multiplies, and / divides. Division with / gives a decimal result."},{heading:"Special division",body:"// keeps the whole part, % gives the remainder, and ** raises a number to a power."},{heading:"Order of operations",body:"Multiplication and division happen before addition and subtraction. Parentheses are worked out first."},{heading:"Comparisons",body:"== means equal, != means not equal, and <, >, <=, >= compare size. Comparisons give True or False."}],keyPoints:["/ always gives a decimal result.","// gives the whole part and % gives the remainder.","Comparisons return True or False."],exampleCode:`print(7 + 3)
print(9 / 2)
print(9 // 2)
print(9 % 2)
print(2 + 3 * 4)
print(5 > 3)`,inputDemo:`a = int(input("First number: "))
b = int(input("Second number: "))
print("Sum:", a + b)
print("Average:", (a + b) / 2)
print("Is the sum bigger than 10?", a + b > 10)`,inputDemoNote:"Type two whole numbers, one per line, such as 4 and 9.",simpler:"The computer does math like a calculator. Symbols like + and * are operators. Comparisons like > ask a yes-or-no question and answer True or False.",deeper:"Use parentheses to control order: (2 + 3) * 4 is 20, while 2 + 3 * 4 is 14. Use % to check if a number is even: n % 2 == 0.",problems:[i("Print 7 + 3.","# write your code here","10","Put the sum inside print().","+ means add.","print(7 + 3)"),i("Print 10 - 4.","# write your code here","6","Use print() with the calculation.","The minus sign subtracts.","print(10 - 4)"),i("Print 3 * 5.","# write your code here","15","* means multiply.","Put 3 * 5 inside print().","print(3 * 5)"),i("Print 9 / 2.","# write your code here","4.5","Use the / operator.","/ keeps the decimal part.","print(9 / 2)"),i("Print 9 // 2.","# write your code here","4","Use two slash marks.","// keeps only the whole part.","print(9 // 2)"),i("Print the remainder of 9 divided by 2.","# write your code here","1","Use the % operator.","% gives the remainder.","print(9 % 2)"),i("Print 2 to the power of 3.","# write your code here","8","** means raise to a power.","Put 2 ** 3 inside print().","print(2 ** 3)"),i("Print 2 + 3 * 4.","# write your code here","14","Write the expression as given.","Multiplication happens before addition.","print(2 + 3 * 4)"),i("Set price = 20 and tax = 0.1. Print price plus the tax amount (price * tax) added to price.",`price = 20
tax = 0.1`,"22.0","Work out price * tax first.","Add that amount to price.",`price = 20
tax = 0.1
print(price + price * tax)`),i("Set a = 8 and b = 3. Print True if a % b equals 2, otherwise False.",`a = 8
b = 3`,"True","a % b gives the remainder.","Compare it to 2 with ==.",`a = 8
b = 3
print(a % b == 2)`)]},{id:3,title:"If / Else",description:"Make choices by checking whether conditions are true.",sections:[{heading:"The if statement",body:"if runs a block only when its condition is True."},{heading:"Indentation",body:"Indentation is spaces at the start of a line. Lines inside an if must use the same indentation, usually four spaces."},{heading:"else and elif",body:"else runs when the if condition is False. elif checks another condition when earlier ones were False."},{heading:"Combining conditions",body:"and needs both checks to be True. or needs at least one. not flips True and False. Use in to check whether text contains something."}],keyPoints:["Indent the lines inside an if.","Use elif for more than two choices.","Use and, or, and not to combine conditions."],exampleCode:`age = 10
if age >= 10:
    print("Old enough")
else:
    print("Too young")`,inputDemo:`age = int(input("How old are you? "))
if age >= 18:
    print("Adult")
else:
    print("Minor")`,inputDemoNote:"Type your age as a whole number, such as 15 or 30.",simpler:"An if statement is a decision. If the question is True, Python does the indented lines. If not, it skips them or runs the else part.",deeper:"Chain choices with elif: if score >= 90 gives A, elif score >= 70 gives C, else gives F. Python checks from top to bottom and stops at the first True.",problems:[i('Set age = 10. If age is 10 or more, print "Old enough".',"age = 10","Old enough","Use if age >= 10:.","Indent the print line.",`age = 10
if age >= 10:
    print("Old enough")`),i('Set temp = 30. If temp is over 35 print "Hot", else print "Not hot".',"temp = 30","Not hot","Put else at the same indentation as if.","Indent the print line under else.",`temp = 30
if temp > 35:
    print("Hot")
else:
    print("Not hot")`),i('Set score = 72. Print "A" if score is 90 or more, "C" if 70 or more, otherwise "F".',"score = 72","C","Use elif for the middle check.","Check the highest score first.",`score = 72
if score >= 90:
    print("A")
elif score >= 70:
    print("C")
else:
    print("F")`),i('Set n = -5. Print "negative" if n is below 0, otherwise print "zero or positive".',"n = -5","negative","< means less than.","Use an if/else decision.",`n = -5
if n < 0:
    print("negative")
else:
    print("zero or positive")`),i('Set num = 8. Print "even" if num divided by 2 has no remainder, otherwise "odd".',"num = 8","even","Check num % 2.","No remainder means num % 2 == 0.",`num = 8
if num % 2 == 0:
    print("even")
else:
    print("odd")`),i('Set a = 5. Print "single digit" if a is greater than 0 and less than 10.',"a = 5","single digit","Check both limits.","Use and between the two checks.",`a = 5
if a > 0 and a < 10:
    print("single digit")`),i('Set day = "Sat". Print "Weekend" if day is "Sat" or "Sun", otherwise "Weekday".','day = "Sat"',"Weekend","Compare day with both options.","Use or between the comparisons.",`day = "Sat"
if day == "Sat" or day == "Sun":
    print("Weekend")
else:
    print("Weekday")`),i('Set raining = False. Print "Go outside" if it is not raining.',"raining = False","Go outside","The value is already a bool.","not flips True and False.",`raining = False
if not raining:
    print("Go outside")`),i('Set word = "python". Print "found" if the letter "y" is inside word.','word = "python"',"found","Check the letter against word.",'Use "y" in word as the condition.',`word = "python"
if "y" in word:
    print("found")`),i('Set age = 8. Print "Free" if under 5, "Child" if under 12, otherwise "Adult".',"age = 8","Child","Use elif for the middle range.","Check under 5 before under 12.",`age = 8
if age < 5:
    print("Free")
elif age < 12:
    print("Child")
else:
    print("Adult")`)]},{id:4,title:"Switch-Case (match)",description:"Choose one action from several options with match and case.",sections:[{heading:"Why match?",body:"match is a clear alternative to a long if/elif chain when you compare one value against several options."},{heading:"match and case",body:"match value: starts the block. Each case value: runs when it matches the value."},{heading:"The default case",body:"case _: runs when nothing else matched. Keep it last."},{heading:"Several values in one case",body:"Use | to mean “or” and match more than one value in a case."}],keyPoints:["match checks one value against many cases.","case _ is the default.","Use | to put several values in one case."],exampleCode:`command = "start"
match command:
    case "start":
        print("Starting")
    case "stop":
        print("Stopping")
    case _:
        print("Unknown command")`,inputDemo:`command = input("Type start, stop, or anything else: ")
match command:
    case "start":
        print("Starting")
    case "stop":
        print("Stopping")
    case _:
        print("Unknown command")`,inputDemoNote:"Type start, stop, or any other word, and watch which case runs.",simpler:"match looks at one value and picks the first case that fits. Think of it as a menu: you pick one option, and Python runs that option’s code.",deeper:'A case can match several values: case "Sat" | "Sun": prints weekend for either day. Python 3.10 and newer supports match.',problems:[i('Set command = "start". Use match to print "Starting" for case "start".','command = "start"',"Starting","Put match command: on one line.","Indent the case and its print line.",`command = "start"
match command:
    case "start":
        print("Starting")`),i('Set code = 404. Print "OK" for 200 and "Not found" for 404.',"code = 404","Not found","Add a case for each number.","Use match code: before the cases.",`code = 404
match code:
    case 200:
        print("OK")
    case 404:
        print("Not found")`),i('Set code = 500. Add a default case that prints "Other".',"code = 500","Other","case _ matches any value not matched above.","Put the default case last.",`code = 500
match code:
    case 200:
        print("OK")
    case 404:
        print("Not found")
    case _:
        print("Other")`),i('Set day = "Sat". Print "Weekend" for "Sat" or "Sun", otherwise "Weekday".','day = "Sat"',"Weekend","Put both values in one case.","Separate the values with |.",`day = "Sat"
match day:
    case "Sat" | "Sun":
        print("Weekend")
    case _:
        print("Weekday")`),i('Set level = 2. Print "Beginner" for 1, "Intermediate" for 2, otherwise "Advanced".',"level = 2","Intermediate","Use one case for each number.","Add a default case at the end.",`level = 2
match level:
    case 1:
        print("Beginner")
    case 2:
        print("Intermediate")
    case _:
        print("Advanced")`),i('Set n = 3. Print the word for 1, 2, or 3 ("one", "two", "three"), otherwise "many".',"n = 3","three","Give each number its own case.","Use case _ for the remaining values.",`n = 3
match n:
    case 1:
        print("one")
    case 2:
        print("two")
    case 3:
        print("three")
    case _:
        print("many")`),i('Set choice = "2". "1" prints "Add", "2" prints "Remove", anything else prints "Unknown".','choice = "2"',"Remove","The value is text.","Put quotes around the case values.",`choice = "2"
match choice:
    case "1":
        print("Add")
    case "2":
        print("Remove")
    case _:
        print("Unknown")`),i('Set color = "red". "red" or "pink" prints "warm", "blue" prints "cool", anything else prints "unknown".','color = "red"',"warm","Use one case for warm colors.","Use | between red and pink.",`color = "red"
match color:
    case "red" | "pink":
        print("warm")
    case "blue":
        print("cool")
    case _:
        print("unknown")`),i('Set letter = "e". Print "vowel" for a, e, i, o, or u, otherwise "consonant".','letter = "e"',"vowel","List all five vowels in one case.","Separate each vowel with |.",`letter = "e"
match letter:
    case "a" | "e" | "i" | "o" | "u":
        print("vowel")
    case _:
        print("consonant")`),i('Set light = "yellow". "green" prints "Go", "yellow" prints "Slow down", "red" prints "Stop".','light = "yellow"',"Slow down","Each light color gets its own case.","Match the text values exactly.",`light = "yellow"
match light:
    case "green":
        print("Go")
    case "yellow":
        print("Slow down")
    case "red":
        print("Stop")`)]},{id:5,title:"Loops",description:"Repeat useful code with for and while loops.",sections:[{heading:"The while loop",body:"while repeats code as long as a condition is True. Change a value inside the loop, or it may never end."},{heading:"The for loop",body:"for repeats once for each item. range(start, stop, step) makes numbers; the stop number is not included."},{heading:"Stopping or skipping",body:"break stops the loop early. continue skips to the next repeat."},{heading:"Positions and items",body:"enumerate() gives both the position and item while looping through a list."}],keyPoints:["while repeats while a condition is True.","for repeats once per item in range() or a list.","break exits the loop; continue skips one repeat."],exampleCode:`for i in range(3):
    print(i)
count = 0
while count < 3:
    print("count is", count)
    count = count + 1`,inputDemo:`total = 0
while True:
    text = input("Enter a number, or type done: ")
    if text == "done":
        break
    total = total + int(text)
print("Total:", total)`,inputDemoNote:"Type numbers one at a time. Type done to stop and see the total.",simpler:"A loop repeats code so you do not have to write it many times. A for loop counts through a list of things. A while loop keeps going until a condition becomes False.",deeper:"range(0, 10, 2) gives 0, 2, 4, 6, 8. Use break to stop early when you find what you want, and continue to skip one repeat.",problems:[i("Print the numbers 0 to 2, one per line, using range(3).","# write your code here",`0
1
2`,"range(3) gives 0, 1, 2.","Use for i in range(3): and print i.",`for i in range(3):
    print(i)`),i("Print 1, 2, and 3 on separate lines.","# write your code here",`1
2
3`,"Use range() to make the numbers.","range(1, 4) stops before 4.",`for i in range(1, 4):
    print(i)`),i("Print the even numbers 0, 2, 4, 6, 8 on separate lines.","# write your code here",`0
2
4
6
8`,"The third number in range() is the step.","Start at 0 and step by 2 until 10.",`for i in range(0, 10, 2):
    print(i)`),i("Start count = 0. Use a while loop to print 0, 1, 2.","count = 0",`0
1
2`,"Increase count inside the loop.","The loop condition should stop before 3.",`count = 0
while count < 3:
    print(count)
    count = count + 1`),i("Start total = 0. Add 1 through 4 to total using a for loop, then print total.","total = 0","10","range(1, 5) gives 1, 2, 3, 4.","Add n to total inside the loop.",`total = 0
for n in range(1, 5):
    total = total + n
print(total)`),i("Start n = 3. Use a while loop to print 3, 2, 1, then print Liftoff.","n = 3",`3
2
1
Liftoff`,"Subtract 1 from n inside the loop.","Print Liftoff after the loop.",`n = 3
while n > 0:
    print(n)
    n = n - 1
print("Liftoff")`),i("Use a for loop over range(10). Print each number, but stop the loop when i is 4.","# write your code here",`0
1
2
3`,"break leaves the loop.","Check if i == 4 before printing.",`for i in range(10):
    if i == 4:
        break
    print(i)`),i("Print 0 to 4 but skip 2.","# write your code here",`0
1
3
4`,"continue skips the rest of this repeat.","Check for 2 inside the loop.",`for i in range(5):
    if i == 2:
        continue
    print(i)`),i("Print 2, 4, and 6 (double of 1, 2, 3) on separate lines.","# write your code here",`2
4
6`,"Loop over range(1, 4).","Print i * 2.",`for i in range(1, 4):
    print(i * 2)`),i("Print the numbers from 1 to 10 that are divisible by 5.","# write your code here",`5
10`,"Use a loop from 1 to 10.","Check i % 5 == 0 inside the loop.",`for i in range(1, 11):
    if i % 5 == 0:
        print(i)`)]},{id:6,title:"Lists (Python’s Arrays)",description:"Keep related values together and work through them.",sections:[{heading:"Creating a list",body:"A list stores several values in square brackets, separated by commas. Lists can hold numbers or text."},{heading:"Finding an item",body:"An index is an item’s position in a list. The first index is 0. Negative indexes count from the end, so -1 is the last item."},{heading:"Changing lists",body:"append() adds an item to the end. len() tells you how many items are in a list."},{heading:"Looping and checking",body:"A for loop can visit each item. Use in to check whether an item is in the list."}],keyPoints:["Lists use square brackets.","Index 0 is the first item.","append() adds to the end."],exampleCode:`fruits = ["apple", "banana"]
print(fruits[0])
fruits.append("cherry")
print(len(fruits))
for fruit in fruits:
    print(fruit)`,inputDemo:`items = []
for i in range(2):
    items.append(input("Add an item: "))
print(items)
print("You added", len(items), "items")`,inputDemoNote:"Type two words or numbers, pressing Enter after each one.",simpler:"A list is a row of boxes numbered from 0. Each box holds one item, and you can look up or add items by their position.",deeper:"Use a list to add up values: total = 0, then for n in nums: total = total + n. Use nums[-1] to get the last item without knowing the length.",problems:[i('Start fruits = ["apple", "banana"]. Print the whole list.','fruits = ["apple", "banana"]',"['apple', 'banana']","print() works with a list name.","Use print(fruits).",`fruits = ["apple", "banana"]
print(fruits)`),i("Start nums = [10, 20, 30]. Print the first item.","nums = [10, 20, 30]","10","The first item is at index 0.","Print nums[0].",`nums = [10, 20, 30]
print(nums[0])`),i("Start nums = [10, 20, 30]. Print the last item using a negative index.","nums = [10, 20, 30]","30","-1 means the last item.","Print nums[-1].",`nums = [10, 20, 30]
print(nums[-1])`),i("Start nums = [10, 20, 30]. Add 40 to the end, then print the list.","nums = [10, 20, 30]","[10, 20, 30, 40]","Use nums.append(40).","Print the list after adding the item.",`nums = [10, 20, 30]
nums.append(40)
print(nums)`),i("Start nums = [5, 6, 7, 8]. Print how many items it has.","nums = [5, 6, 7, 8]","4","len() counts the items.","Print len(nums).",`nums = [5, 6, 7, 8]
print(len(nums))`),i('Start pets = ["cat", "dog", "fish"]. Use a for loop to print each pet on its own line.','pets = ["cat", "dog", "fish"]',`cat
dog
fish`,"Use for pet in pets:.","Indent print(pet) inside the loop.",`pets = ["cat", "dog", "fish"]
for pet in pets:
    print(pet)`),i('Start pets = ["cat", "dog"]. Print True if "dog" is in the list.','pets = ["cat", "dog"]',"True","Use in to check the list.",'Print "dog" in pets.',`pets = ["cat", "dog"]
print("dog" in pets)`),i("Start nums = [2, 4, 6]. Add all the numbers using a loop and print the total.","nums = [2, 4, 6]","12","Start total at 0 before the loop.","Add each n to total.",`nums = [2, 4, 6]
total = 0
for n in nums:
    total = total + n
print(total)`),i('Start names = ["Ana", "Ben", "Cy"]. Print "Hi" and each name on its own line.','names = ["Ana", "Ben", "Cy"]',`Hi Ana
Hi Ben
Hi Cy`,"Loop over names.",'Use print("Hi", name) inside the loop.',`names = ["Ana", "Ben", "Cy"]
for name in names:
    print("Hi", name)`),i("Start items = []. Use a loop to add 0, 10, and 20 to items, then print items.","items = []","[0, 10, 20]","Loop over range(3).","Append i * 10 each time.",`items = []
for i in range(3):
    items.append(i * 10)
print(items)`)]},{id:7,title:"Final Challenge: Bank System",description:"Use variables, lists, loops, match, and if/else together to run a small bank.",sections:[{heading:"What you will build",body:"A bank system keeps an account name in a string variable and a balance in an int variable. It reads a list of actions and handles each one."},{heading:"Actions as a list",body:'Each action is a small list with a command and a value, such as ["deposit", 50]. The loop visits each action in order.'},{heading:"Choosing what to do",body:"match checks the command. Each case does one job: create, deposit, withdraw, or logout."},{heading:"Checking money",body:"Before a withdrawal, use if to check that the balance is large enough. If not, print a message and leave the balance unchanged."},{heading:"Logging out",body:"The logout action prints a goodbye message and uses break to stop the loop early."}],keyPoints:["Use a string variable for the account name and an int variable for the balance.","Use a for loop with match to handle each action.","Use if before withdrawing, and break to log out."],exampleCode:`actions = [["create", "Ana"], ["deposit", 50], ["logout", 0]]
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
            break`,inputDemo:`account = ""
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
            print("Unknown command")`,inputDemoNote:"Type create, then a name. Try deposit, withdraw, and logout. Type anything else to see the unknown-command message.",simpler:"The bank keeps two things: who owns the account (a word in quotes) and how much money is in it (a number). Each action changes one of those, and logout stops the program.",deeper:'Ask the bank to check before taking money out. A withdrawal larger than the balance should print "Not enough money" and leave the balance alone.',problems:[i('Build a bank system. Start with the actions list shown in the starter. Process each action in order. "create" stores the name in account. "deposit" adds the value to balance. "withdraw" subtracts the value from balance, or prints "Not enough money" if the balance is too small. "logout" prints "Logged out" and the account name, then stops the loop. After the loop, print the final balance.',`actions = [
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
# write the loop here`,`Account created for Ana
Deposited 50 New balance: 50
Withdrew 20 New balance: 30
Not enough money
Deposited 15 New balance: 45
Logged out Ana
Final balance: 45`,"Use for action in actions:, then set command = action[0] and value = action[1].","Inside match, use an if/else in the withdraw case to compare value with balance before subtracting.",`actions = [["create", "Ana"], ["deposit", 50], ["withdraw", 20], ["withdraw", 100], ["deposit", 15], ["logout", 0], ["deposit", 999]]
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
print("Final balance:", balance)`)]}],_=1e4,H=8192;function te(e){let t,o="loading",a=null,s=0;function r(){o="loading",e({type:"loading"}),t=new Worker("/python-worker.js"),t.onmessage=({data:l})=>{if(l.type==="ready"){o="ready",e({type:"ready"});return}if(l.type==="load-error"){o="failed",e({type:"load-error"});return}a&&(l.type==="output"&&e({...l,requestId:a.id}),l.type==="input-request"&&(f(),e({type:"input-request",requestId:a.id})),(l.type==="done"||l.type==="error")&&u(l))},t.onerror=()=>{a&&u({type:"error",message:"The Python worker stopped unexpectedly."}),o="failed",e({type:"load-error"})}}function d(l=_){a&&(a.remaining=l,a.deadline=Date.now()+l,a.timer=setTimeout(()=>{a&&(a=null,t.terminate(),r(),e({type:"timeout"}))},l))}function f(){!a||!a.timer||(clearTimeout(a.timer),a.timer=null,a.remaining=Math.max(0,a.deadline-Date.now()))}function u(l){if(!a)return;clearTimeout(a.timer);const m=a;a=null,e({...l,requestId:m.id})}function g(l,{interactive:m=!1}={}){if(o!=="ready"||a)return null;const P=++s;let E=null;return m&&window.crossOriginIsolated&&typeof SharedArrayBuffer<"u"&&(E=new SharedArrayBuffer(8+H)),a={id:P,inputBuffer:E,timer:null,deadline:0,remaining:_},d(),t.postMessage({type:"run",code:l,inputBuffer:E}),P}function y(l){if(!(a!=null&&a.inputBuffer))return;const m=new TextEncoder().encode(l).slice(0,H-1),P=new Int32Array(a.inputBuffer,0,2);new Uint8Array(a.inputBuffer,8,m.length).set(m),P[1]=m.length,Atomics.store(P,0,1),Atomics.notify(P,0),d(a.remaining)}function w({restart:l=!1}={}){a&&clearTimeout(a.timer),a=null,l&&(t.terminate(),r())}function $(){a&&(w({restart:!0}),e({type:"stopped"}))}return r(),{run:g,submitInput:y,cancel:w,stop:$,get status(){return o},get running(){return!!a}}}const q=document.querySelector("#app"),R="python-practice-progress-v1",v="/".replace(/\/$/,""),M=()=>({opened:[],read:[],solved:{},attempts:{},failures:{},inputTried:[]});function p(e="/"){let t=e;return v&&t.startsWith(v)&&(t=t.slice(v.length)||"/"),t.startsWith("/")||(t=`/${t}`),`${v}${t}`||"/"}const B=sessionStorage.getItem("python-practice-gh-pages-route");B&&(sessionStorage.removeItem("python-practice-gh-pages-route"),history.replaceState({},"",p(B)));const n={progress:ne(),consoleParts:[],consoleError:null,waitingForInput:!1,pyStatus:"loading",mobilePanel:"lesson",practiceResult:null,activeCheck:null,practiceIndex:0};function ne(){try{return{...M(),...JSON.parse(localStorage.getItem(R)||"{}")}}catch{return M()}}function L(){localStorage.setItem(R,JSON.stringify(n.progress))}function S(e){return C.find(t=>t.id===Number(e))||C[0]}function x(){let e=window.location.pathname;v&&e.startsWith(v)&&(e=e.slice(v.length)||"/");const t=e.replace(/\/+$/,"")||"/";if(t==="/intro")return{page:"intro"};const o=t.match(/^\/lesson\/(\d+)(\/practice)?$/);return o?{page:o[2]?"practice":"lesson",id:Number(o[1])}:{page:"home"}}function c(e=""){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function K(e){document.documentElement.dataset.theme=e;const t=document.querySelector('[data-action="theme"]');t&&(t.textContent=e==="dark"?"Light mode":"Dark mode")}const ae=localStorage.getItem("python-practice-theme");K(ae||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"));function Y(e,t){return Array.isArray(e)&&e.includes(t)}function I(e,t){e.includes(t)||e.push(t)}function oe(e){return(n.progress.solved[e.id]||[]).length}function j(e){const t=(Y(n.progress.read,e.id)?1:0)+oe(e),o=e.id===7?2:11;return{complete:t,total:o,percent:Math.round(t/o*100)}}function ie(e){I(n.progress.opened,e.id),I(n.progress.read,e.id),L()}function re(){return`<header class="site-header">
    <a class="brand" href="${p("/")}" data-nav aria-label="Python Practice home"><span class="brand-mark">Py</span><span>Python Practice</span></a>
    <nav class="header-actions" aria-label="Main navigation">
      <a class="quiet-link" href="${p("/intro")}" data-nav>How to use this site</a>
      <button class="button button-quiet theme-toggle" type="button" data-action="theme">${document.documentElement.dataset.theme==="dark"?"Light mode":"Dark mode"}</button>
    </nav>
  </header>`}function se(){return'<footer class="site-footer"><span>Small steps. Real Python.</span><button class="text-button" type="button" data-action="reset-open">Reset progress</button></footer>'}function le(){return`<button class="help-fab" type="button" data-action="help-open">Help me</button>
    <dialog class="help-drawer" id="help-dialog" aria-labelledby="help-title">
      <div class="drawer-head"><div><p class="eyebrow">A little help</p><h2 id="help-title">Let’s untangle it.</h2></div><button class="icon-button" type="button" data-action="help-close" aria-label="Close help">×</button></div>
      <div class="quick-replies" aria-label="Quick help options">
        <button class="button button-outline" type="button" data-action="help-quick" data-kind="confused">I’m confused</button>
        <button class="button button-outline" type="button" data-action="help-quick" data-kind="simple">Explain simpler</button>
        <button class="button button-outline" type="button" data-action="help-quick" data-kind="deeper">Give a deeper example</button>
      </div>
      <div class="help-answer" id="help-answer" aria-live="polite">Pick a question above, or ask about the lesson you’re viewing.</div>
      <form class="help-form" id="help-form"><label for="help-question">Ask about this lesson</label><textarea id="help-question" rows="3" placeholder="What would you like to understand?"></textarea><button class="button button-primary" type="submit">Ask</button></form>
    </dialog>
    <dialog class="confirm-dialog" id="reset-dialog" aria-labelledby="reset-title">
      <h2 id="reset-title">Reset all progress?</h2><p>Your saved lesson progress, solved problems, and attempts will be cleared.</p>
      <div class="dialog-actions"><button class="button button-outline" type="button" data-action="reset-cancel">Keep progress</button><button class="button button-danger" type="button" data-action="reset-confirm">Reset progress</button></div>
    </dialog>`}function ce(e){const t=j(e);return`<div class="progress-meta"><span>${t.complete} of ${t.total} complete</span><span>${t.percent}%</span></div><div class="progress-track" role="progressbar" aria-label="${c(e.title)} progress" aria-valuemin="0" aria-valuemax="${t.total}" aria-valuenow="${t.complete}"><span style="width:${t.percent}%"></span></div>`}function de(){return`<main class="page-wrap home-page">
    <section class="welcome-row"><div><p class="eyebrow">Your first steps in Python</p><h1>Learn by making<br><span>something work.</span></h1><p class="welcome-copy">A calm, hands-on path from your first variable to a tiny bank system.</p></div><div class="welcome-stamp" aria-hidden="true"><span>01</span><small>learn<br>by doing</small></div></section>
    <a class="intro-card" href="${p("/intro")}" data-nav><span class="intro-icon" aria-hidden="true">↗</span><span><strong>How to use this site</strong><small>A quick guide to the editor, console, and practice.</small></span><span class="card-arrow" aria-hidden="true">→</span></a>
    <div class="section-heading"><div><p class="eyebrow">The learning path</p><h2>Seven lessons, one step at a time</h2></div><span class="path-count">01 — 07</span></div>
    <section class="lesson-list" aria-label="Lessons">${C.map(e=>{const t=j(e),o=Y(n.progress.opened,e.id);return`<article class="lesson-card">
        <div class="lesson-number">${String(e.id).padStart(2,"0")}</div>
        <div class="lesson-summary"><p class="eyebrow">${e.id===7?"Capstone":`Lesson ${e.id}`}</p><h3>${c(e.title)}</h3><p>${c(e.description)}</p></div>
        <div class="lesson-progress">${ce(e)}</div>
        <a class="button ${t.complete?"button-outline":"button-primary"} lesson-start" href="${p(`/lesson/${e.id}`)}" data-nav>${o?"Continue":"Start"} <span aria-hidden="true">→</span></a>
      </article>`}).join("")}</section>
  </main>`}function pe(){const e=[["01","Read the explanation","Each lesson introduces one idea in short sections. Keep the Key points nearby as you work."],["02","Edit and run code","Change the example, then press Run. Ctrl+Enter (or Cmd+Enter) also runs the code."],["03","Read the console","Printed results appear in the console. When Python asks a question, type right there and press Enter."],["04","Try the practice","Solve one problem at a time. Check my answer compares what your code prints with the expected result."],["05","Ask for help","Use Help me for a simpler explanation, a deeper example, or a quick answer about the current lesson."]];return`<main class="page-wrap narrow-page intro-page"><a class="back-link" href="${p("/")}" data-nav>← All lessons</a><p class="eyebrow">Before you begin</p><h1>How to use this site</h1><p class="page-lead">You can learn at your own pace. Try things, read what Python says, and adjust your code.</p>
    <ol class="intro-steps">${e.map(([t,o,a])=>`<li><span class="step-number">${t}</span><div><h2>${o}</h2><p>${a}</p></div></li>`).join("")}</ol>
    <a class="button button-primary intro-start" href="${p("/lesson/1")}" data-nav>Start Lesson 1 <span aria-hidden="true">→</span></a>
  </main>`}function G(e,t,o){const a=Math.max(1,t.split(`
`).length);return`<div class="code-editor"><div class="line-numbers" id="${e}-lines" aria-hidden="true">${Array.from({length:a},(s,r)=>r+1).join("<br>")}</div><label class="sr-only" for="${e}">${o}</label><textarea id="${e}" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off">${c(t)}</textarea></div>`}function D(e){const o=n.consoleParts.length>0?n.consoleParts.map(d=>`<span class="${d.kind==="input"?"terminal-typed":""}">${c(d.text)}</span>`).join(""):`<span class="console-placeholder">${n.pyStatus==="loading"?"Loading Python...":n.pyStatus==="failed"?"Python couldn't load. Check your internet connection and refresh the page.":"Your output will appear here."}</span>`,a=window.crossOriginIsolated?"":`<p class="console-notice">Interactive input isn't available in this browser. Try a different browser or refresh the page.</p>`,s=n.consoleError?`<div class="console-error"><p>${c(n.consoleError.friendly)}</p>${n.consoleError.original?`<small>${c(n.consoleError.original)}</small>`:""}</div>`:"",r=n.waitingForInput?'<input id="terminal-input" class="terminal-input" aria-label="Type your Python input and press Enter" autocomplete="off" autocapitalize="off" spellcheck="false"><span class="cursor-blink" aria-hidden="true"></span>':"";return`<div class="console-shell"><div class="console-topline"><span class="console-label"><i aria-hidden="true"></i> Console</span><button class="console-clear" type="button" data-action="console-clear" aria-label="Clear console">Clear</button></div><div id="${e}" class="console-body" role="log" aria-live="polite" tabindex="0"><div class="console-output">${o}${r}</div>${s}${a}</div></div>`}function ue(e){ie(e);const t=!window.crossOriginIsolated,o=`<div class="mobile-tabs" role="tablist" aria-label="Lesson panels">${[["lesson","Lesson"],["code","Code"],["console","Console"]].map(([a,s])=>`<button type="button" role="tab" aria-selected="${n.mobilePanel===a}" class="mobile-tab ${n.mobilePanel===a?"is-active":""}" data-action="mobile-tab" data-panel="${a}">${s}</button>`).join("")}</div>`;return`<main class="page-wrap lesson-page">
    <a class="back-link" href="${p("/")}" data-nav>← All lessons</a>
    <div class="lesson-title-row"><div><p class="eyebrow">Lesson ${e.id} of 7</p><h1>${c(e.title)}</h1><p class="page-lead">${c(e.description)}</p></div><a class="button button-outline practice-shortcut" href="${p(`/lesson/${e.id}/practice`)}" data-nav>Go to practice <span aria-hidden="true">→</span></a></div>
    ${o}
    <div class="lesson-panels">
      <section class="panel theory-panel ${n.mobilePanel==="lesson"?"mobile-active":""}" data-mobile-panel="lesson" aria-label="Lesson explanation"><div class="panel-heading"><span class="panel-index">01</span><h2>Understand it</h2></div><div class="lesson-sections">${e.sections.map(a=>`<section><h3>${c(a.heading)}</h3><p>${c(a.body)}</p></section>`).join("")}</div><aside class="key-points"><h3>Key points</h3><ul>${e.keyPoints.map(a=>`<li>${c(a)}</li>`).join("")}</ul></aside><a class="button button-primary full-button" href="${p(`/lesson/${e.id}/practice`)}" data-nav>Go to practice <span aria-hidden="true">→</span></a></section>
      <section class="panel editor-panel ${n.mobilePanel==="code"?"mobile-active":""}" data-mobile-panel="code" aria-label="Python code editor"><div class="panel-heading"><span class="panel-index">02</span><h2>Make it yours</h2></div><div class="editor-caption"><span>example.py</span><span>Python 3</span></div>${G("lesson-editor",e.exampleCode,"Python code")}<div class="editor-actions"><button class="button button-primary" type="button" data-action="lesson-run" ${n.pyStatus!=="ready"?"disabled":""}>Run <span aria-hidden="true">▶</span></button><button class="button button-outline" type="button" data-action="lesson-reset">Reset</button><button class="button button-outline input-button" type="button" data-action="lesson-input" ${t||n.pyStatus!=="ready"?"disabled":""}>Try with input</button></div><p class="editor-note">${c(e.inputDemoNote)}</p></section>
      <section class="panel console-panel ${n.mobilePanel==="console"?"mobile-active":""}" data-mobile-panel="console" aria-label="Python console"><div class="panel-heading"><span class="panel-index">03</span><h2>See what happens</h2></div>${D("lesson-console")}</section>
    </div>
    <nav class="lesson-nav" aria-label="Lesson navigation">${e.id>1?`<a class="button button-outline" href="${p(`/lesson/${e.id-1}`)}" data-nav>← Previous lesson</a>`:"<span></span>"}${e.id<7?`<a class="button button-outline" href="${p(`/lesson/${e.id+1}`)}" data-nav>Next lesson →</a>`:`<a class="button button-primary" href="${p("/lesson/7/practice")}" data-nav>Final challenge →</a>`}</nav>
  </main>`}function z(e,t){var o;return((o=n.progress.attempts[e])==null?void 0:o[t])||0}function O(e,t){var o;return((o=n.progress.failures[e])==null?void 0:o[t])||0}function he(e){var w;const t=e.problems.length,o=n.progress.solved[e.id]||[],a=e.problems.findIndex(($,l)=>!o.includes(l)),s=n.practiceIndex||(a<0?t:a);if(n.practiceIndex=s,s>=t)return me(e,o.length,t);const r=e.problems[s],d=z(e.id,s),f=O(e.id,s),u=n.hintIndex||0,g=u?`<aside class="hint-box"><span class="hint-kicker">Hint ${u} of 2</span><p>${c(r.hints[u-1])}</p></aside>`:"",y=((w=n.practiceResult)==null?void 0:w.index)===s?V(n.practiceResult):"";return`<main class="page-wrap practice-page"><a class="back-link" href="${p(`/lesson/${e.id}`)}" data-nav>← Back to lesson</a><div class="practice-heading"><div><p class="eyebrow">${e.id===7?"Course challenge":`Lesson ${e.id} practice`}</p><h1>${c(e.title)}</h1></div><div class="problem-count"><strong>Problem ${s+1} of ${t}</strong><span>${o.length} solved</span></div></div>
    <div class="practice-layout"><section class="panel practice-editor-panel"><div class="panel-heading"><span class="panel-index">${String(s+1).padStart(2,"0")}</span><h2>Try it yourself</h2></div><p class="problem-prompt">${c(r.prompt)}</p><div class="editor-caption"><span>answer.py</span><span>Attempt ${d}</span></div>${G("practice-editor",r.starterCode,"Your Python answer")}<div class="practice-actions"><button class="button button-primary" type="button" data-action="practice-check" ${n.pyStatus!=="ready"?"disabled":""}>Check my answer</button><button class="button button-outline" type="button" data-action="practice-hint" ${u>=2?"disabled":""}>Hint${u?` (${u}/2)`:""}</button><button class="button button-outline" type="button" data-action="practice-solution" ${f<2?"disabled":""}>Show solution</button></div>${g}<div id="practice-feedback" aria-live="polite">${y}</div>${n.showSolution?`<aside class="solution-box"><h3>One solution</h3><pre><code>${c(r.solution)}</code></pre></aside>`:""}</section>
      <section class="panel practice-console-panel"><div class="panel-heading"><span class="panel-index">02</span><h2>Your output</h2></div>${D("practice-console")}<p class="practice-note">Practice problems do not use input().</p></section></div>
    </main>`}function V(e){return e.kind==="correct"?'<div class="feedback-success"><strong>Correct! Well done.</strong><a class="button button-primary" href="#" data-action="practice-next">Next <span aria-hidden="true">→</span></a></div>':e.kind==="empty"?'<div class="feedback-message feedback-wrong"><strong>Your code printed nothing. Use print() to show a result.</strong></div>':e.kind==="error"?`<div class="feedback-message feedback-wrong"><strong>${c(e.friendly)}</strong><small>${c(e.original)}</small></div>`:`<div class="feedback-wrong"><strong>Not quite.</strong><div class="output-comparison"><section><h3>Your output</h3><pre>${c(e.actual||"(nothing)")}</pre></section><section><h3>Expected output</h3><pre>${c(e.expected)}</pre></section></div></div>`}function me(e,t,o){return`<main class="page-wrap narrow-page summary-page"><div class="summary-mark" aria-hidden="true">✓</div><p class="eyebrow">${e.id===7?"Course complete":"Practice complete"}</p><h1>${e.id===7?"You finished the course!":"You did it."}</h1><p class="page-lead">You solved ${t} of ${o} ${o===1?"problem":"problems"} in ${c(e.title)}.</p><a class="button button-primary" href="${p("/")}" data-nav>Back to lesson list <span aria-hidden="true">→</span></a></main>`}function J(e){var o;const t=String(e||"Python reported an error.");return/IndentationError/.test(t)?{friendly:"Lines inside an if, for, or while must be indented the same amount.",original:t}:/SyntaxError/.test(t)?{friendly:"Something in the code is written in a way Python doesn't understand. Check for a missing colon, quote, or bracket.",original:t}:/NameError/.test(t)?{friendly:`Python doesn't know the name '${((o=t.match(/name ['"]([^'"]+)['"] is not defined/i))==null?void 0:o[1])||"that variable"}'. Check the spelling of the variable.`,original:t}:/ZeroDivisionError/.test(t)?{friendly:"You can't divide by zero.",original:t}:/ValueError/.test(t)?{friendly:"Python expected a number here. Type only digits, like 12.",original:t}:/TypeError/.test(t)?{friendly:"Python can't combine these kinds of values. Try converting with int(), str(), or float().",original:t}:{friendly:"Python found a problem in this code.",original:t}}function k(){const e=x();let t;e.page==="intro"?t=pe():e.page==="lesson"?t=ue(S(e.id)):e.page==="practice"?t=he(S(e.id)):t=de(),q.innerHTML=`${re()}${t}${se()}${le()}`,Q(),A()}function Q(){document.querySelectorAll(".code-editor textarea").forEach(e=>{e.addEventListener("input",()=>{const t=document.querySelector(`#${e.id}-lines`);t&&(t.innerHTML=Array.from({length:Math.max(1,e.value.split(`
`).length)},(o,a)=>a+1).join("<br>"))})})}function A(){document.querySelectorAll('[data-action="lesson-run"], [data-action="practice-check"]').forEach(e=>{e.disabled=n.pyStatus!=="ready"||h.running}),document.querySelectorAll('[data-action="lesson-input"]').forEach(e=>{e.disabled=!window.crossOriginIsolated||n.pyStatus!=="ready"||h.running})}function b(){var o;x();const e=document.querySelector("#lesson-console")?"lesson-console":document.querySelector("#practice-console")?"practice-console":null;if(!e)return;const t=(o=document.querySelector(`#${e}`))==null?void 0:o.closest(".console-shell");t&&(t.outerHTML=D(e),n.waitingForInput&&requestAnimationFrame(()=>{var a;return(a=document.querySelector("#terminal-input"))==null?void 0:a.focus()}),A())}function N(e,t="text"){n.consoleParts.push({text:e,kind:t}),b()}function fe(){const e=document.querySelector("#practice-feedback");e&&(e.innerHTML=n.practiceResult?V(n.practiceResult):"");const t=x(),o=S(t.id),a=n.practiceIndex,s=document.querySelector('[data-action="practice-solution"]');s&&(s.disabled=O(o.id,a)<2);const r=document.querySelector(".editor-caption span:nth-child(2)");r&&(r.textContent=`Attempt ${z(o.id,a)}`)}function F(e,t){var o,a;(o=n.progress.attempts)[e]||(o[e]={}),(a=n.progress.failures)[e]||(a[e]={}),n.progress.attempts[e][t]=(n.progress.attempts[e][t]||0)+1,n.progress.failures[e][t]=(n.progress.failures[e][t]||0)+1,L()}function T(e){var r,d,f,u;const t=n.activeCheck;if(!t)return;n.activeCheck=null,n.waitingForInput=!1;const o=S(t.lessonId),a=o.problems[t.index],s=n.consoleParts.map(g=>g.text).join("").trim();if(e.type==="done"&&s===a.expectedOutput.trim())(r=n.progress.attempts)[d=o.id]||(r[d]={}),n.progress.attempts[o.id][t.index]=(n.progress.attempts[o.id][t.index]||0)+1,(f=n.progress.solved)[u=o.id]||(f[u]=[]),I(n.progress.solved[o.id],t.index),L(),n.practiceResult={kind:"correct",index:t.index};else if(e.type==="error"||e.type==="timeout"||e.type==="stopped"){F(o.id,t.index);const g="This code took too long. Check your loop's stopping condition.",y=e.type==="timeout"?{friendly:g,original:g}:J(e.message||"Program stopped.");n.practiceResult={kind:"error",index:t.index,...y},n.consoleError=y}else s?(F(o.id,t.index),n.practiceResult={kind:"wrong",index:t.index,actual:s,expected:a.expectedOutput}):(F(o.id,t.index),n.practiceResult={kind:"empty",index:t.index});b(),fe()}function ge(e){e.type==="loading"&&(n.pyStatus="loading",b()),e.type==="ready"&&(n.pyStatus="ready",b()),e.type==="load-error"&&(n.pyStatus="failed",n.consoleParts=[{text:"Python couldn't load. Check your internet connection and refresh the page.",kind:"text"}],b()),e.type==="output"&&N(e.text,"text"),e.type==="input-request"&&(n.waitingForInput=!0,b()),e.type==="done"&&(n.waitingForInput=!1,b(),n.activeCheck&&T(e)),e.type==="error"&&(n.waitingForInput=!1,n.consoleError=J(e.message),b(),n.activeCheck&&T(e)),e.type==="timeout"&&(n.waitingForInput=!1,N(`This code took too long. Check your loop's stopping condition.
`),n.activeCheck&&T(e)),e.type==="stopped"&&(n.waitingForInput=!1,N(`Program stopped.
`),n.activeCheck&&T(e)),A()}const h=te(ge);function U(){n.consoleParts=[],n.consoleError=null,b()}function be(e){h.running&&h.cancel({restart:!0}),n.waitingForInput=!1,n.activeCheck=null,n.practiceResult=null,n.consoleParts=[],n.consoleError=null,n.mobilePanel="lesson",n.practiceIndex=0,n.hintIndex=0,n.showSolution=!1,history.pushState({},"",p(e)),k(),window.scrollTo(0,0)}function W(e){var t;return((t=document.querySelector(`#${e}`))==null?void 0:t.value)||""}function Z(e,t=!0){if(U(),n.waitingForInput=!1,t&&!window.crossOriginIsolated&&/\binput\s*\(/.test(e)){n.consoleError={friendly:"Interactive input isn't available in this browser. Try a different browser or refresh the page.",original:""},b();return}h.run(e,{interactive:t}),A()}function X(){const e=x(),t=S(e.id),o=W("practice-editor");U(),n.practiceResult=null;const a=h.run(o,{interactive:!1});a!==null&&(n.activeCheck={id:a,lessonId:t.id,index:n.practiceIndex}),A()}function ye(){const e=x();return e.id?S(e.id):C[0]}function we(e,t){const a=e.toLowerCase().replace(/[^a-z0-9_]+/g," ").trim().split(/\s+/).filter(r=>r.length>2),s=t.sections.filter(r=>{const d=`${r.heading} ${r.body}`.toLowerCase();return a.some(f=>new RegExp(`\\b${f}\\b`).test(d))});return s.length?s.map(r=>`${r.heading}: ${r.body}`).join(`

`):"Try the quick buttons above, or re-read the lesson text for now."}function ee(e){const t=document.querySelector("#help-answer");t&&(t.textContent=e)}q.addEventListener("click",e=>{var d,f,u,g,y,w,$;const t=e.target.closest("a[data-nav]");if(t&&t.origin===location.origin){e.preventDefault(),be(t.getAttribute("href"));return}const o=e.target.closest("[data-action]");if(!o)return;const a=o.dataset.action,s=x(),r=s.id?S(s.id):C[0];if(a==="theme"){const l=document.documentElement.dataset.theme==="dark"?"light":"dark";localStorage.setItem("python-practice-theme",l),K(l)}if(a==="help-open"&&((d=document.querySelector("#help-dialog"))==null||d.showModal()),a==="help-close"&&((f=document.querySelector("#help-dialog"))==null||f.close()),a==="help-quick"){const l=o.dataset.kind,m=l==="deeper"?r.deeper:l==="confused"?`${r.simpler}

Try re-reading the Key points in this lesson.`:r.simpler;ee(m)}if(a==="reset-open"&&((u=document.querySelector("#reset-dialog"))==null||u.showModal()),a==="reset-cancel"&&((g=document.querySelector("#reset-dialog"))==null||g.close()),a==="reset-confirm"&&(localStorage.removeItem(R),n.progress=M(),(y=document.querySelector("#reset-dialog"))==null||y.close(),history.replaceState({},"",p("/")),k()),a==="mobile-tab"&&(n.mobilePanel=o.dataset.panel,document.querySelectorAll("[data-mobile-panel]").forEach(l=>l.classList.toggle("mobile-active",l.dataset.mobilePanel===n.mobilePanel)),document.querySelectorAll(".mobile-tab").forEach(l=>{const m=l.dataset.panel===n.mobilePanel;l.classList.toggle("is-active",m),l.setAttribute("aria-selected",String(m))})),a==="lesson-run"&&Z(W("lesson-editor")),a==="lesson-reset"){h.running&&h.cancel({restart:!0});const l=document.querySelector("#lesson-editor");l&&(l.value=r.exampleCode),Q(),U(),n.waitingForInput=!1}if(a==="lesson-input"){const l=document.querySelector("#lesson-editor");l&&(l.value=r.inputDemo),l==null||l.dispatchEvent(new Event("input")),(w=n.progress).inputTried||(w.inputTried=[]),I(n.progress.inputTried,r.id),L(),n.mobilePanel="code",($=document.querySelector('[data-action="mobile-tab"][data-panel="code"]'))==null||$.click()}a==="console-clear"&&U(),a==="practice-check"&&X(),a==="practice-hint"&&(n.hintIndex=Math.min(2,(n.hintIndex||0)+1),k()),a==="practice-solution"&&O(r.id,n.practiceIndex)>=2&&(n.showSolution=!0,k()),a==="practice-next"&&(n.practiceIndex+=1,n.hintIndex=0,n.showSolution=!1,n.practiceResult=null,k(),window.scrollTo(0,0))});q.addEventListener("submit",e=>{var o;if(e.target.id!=="help-form")return;e.preventDefault();const t=(o=document.querySelector("#help-question"))==null?void 0:o.value.trim();t&&ee(we(t,ye()))});q.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.querySelectorAll("dialog[open]").forEach(t=>t.close()),e.target.id==="terminal-input"&&e.key==="Enter"){e.preventDefault();const o=e.target.value;n.consoleParts.push({text:`${o}
`,kind:"input"}),n.waitingForInput=!1,b(),h.submitInput(o)}if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){const t=x();t.page==="practice"&&X(),t.page==="lesson"&&Z(W("lesson-editor"))}(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="c"&&h.running&&(e.preventDefault(),h.stop())});window.addEventListener("popstate",()=>{h.running&&h.cancel({restart:!0}),n.consoleParts=[],n.consoleError=null,n.practiceIndex=0,k()});k();
