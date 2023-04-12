var gameData = {
    taskData: {},
    itemData: {},

    coins: 0,
    days: 365 * 18,
    evil: 0,
    paused: false,
    timeWarpingEnabled: true,

    rebirthOneCount: 0,
    rebirthTwoCount: 0,

    currentJob: null,
    currentSkill: null,
    currentProperty: null,
    currentMisc: null,
}

var tempData = {}

var skillWithLowestMaxXp = null

const autoPromoteElement = document.getElementById("autoPromote")
const autoLearnElement = document.getElementById("autoLearn")

const updateSpeed = 60

const baseLifespan = 365 * 70

const baseGameSpeed = 1/2

const permanentUnlocks = ["Scheduling", "Shop", "Automation", "Quick task display"]

const jobBaseData = {
    "Beggar": {name: "Beggar", maxXp: 25, income: 0.5*100},
    "Street entertainer": {name: "Street entertainer", maxXp: 50, income: 0.85*100},
    "Newspaper vendor": {name: "Newspaper vendor", maxXp: 100, income: 3*100},
    "Janitor": {name: "Janitor", maxXp: 200, income: 12*100},
    "Construction worker": {name: "Construction worker", maxXp: 400, income: 22*100},
    "Shop clerk": {name: "Shop clerk", maxXp: 800, income: 45*100},

    "Recruit": {name: "Recruit", maxXp: 50, income: 5*100},
    "Private": {name: "Private", maxXp: 500, income: 50*100},
    "Corporal": {name: "Corporal", maxXp: 5000, income: 120*100},
    "Sergeant": {name: "Sergeant", maxXp: 50000, income: 300*100},
    "Lieutenant": {name: "Lieutenant", maxXp: 500000, income: 1000*100},
    "Major": {name: "Major", maxXp: 375000, income: 3000*100},
    "Lieutenant General": {name: "Lieutenant General", maxXp: 20000000, income: 15000*100},
    "Secretary of Defense": {name: "Secretary of Defense", maxXp: 75000000, income: 50000*100},

    "Student": {name: "Student", maxXp: 100000, income: 100},
    "Apprentice mage": {name: "Apprentice mage", maxXp: 1000000, income: 1000},
    "Mage": {name: "Mage", maxXp: 10000000, income: 7500},
    "Wizard": {name: "Wizard", maxXp: 100000000, income: 50000},
    "Master wizard": {name: "Master wizard", maxXp: 10000000000, income: 250000},
    "Chairman": {name: "Chairman", maxXp: 1000000000000, income: 1000000},
}

const skillBaseData = {
    "Concentration": {name: "Concentration", maxXp: 100, effect: 0.01, description: "Skill xp"},
    "Productivity": {name: "Productivity", maxXp: 100, effect: 0.01, description: "Job xp"},
    "Bargaining": {name: "Bargaining", maxXp: 100, effect: -0.01, description: "Expenses"},
    "Intelligence": {name: "Intelligence", maxXp: 100, effect: 0.01, description: "Job pay"},
    "Meditation": {name: "Meditation", maxXp: 100, effect: 0.01, description: "Happiness"},

    "Strength": {name: "Strength", maxXp: 100, effect: 0.01, description: "Military pay"},
    "Battle tactics": {name: "Battle tactics", maxXp: 100, effect: 0.01, description: "Military xp"},
    "Muscle memory": {name: "Muscle memory", maxXp: 100, effect: 0.01, description: "Strength xp"},

    "Mind capacity": {name: "Mind capacity", maxXp: 100, effect: 0.01, description: "T.A.A. xp"},
    "Immortality": {name: "Immortality", maxXp: 100, effect: 0.01, description: "Longer lifespan"},
    "Time warping": {name: "Time warping", maxXp: 100, effect: 0.01, description: "Gamespeed"},
    "Super immortality": {name: "Super immortality", maxXp: 100, effect: 0.01, description: "Longer lifespan"},

    "Dark influence": {name: "Dark influence", maxXp: 100, effect: 0.01, description: "All xp"},
    "Evil control": {name: "Evil control", maxXp: 100, effect: 0.01, description: "Evil gain"},
    "Intimidation": {name: "Intimidation", maxXp: 100, effect: -0.01, description: "Expenses"},
    "Demon training": {name: "Demon training", maxXp: 100, effect: 0.01, description: "All xp"},
    "Blood meditation": {name: "Blood meditation", maxXp: 100, effect: 0.01, description: "Evil gain"},
    "Demon's wealth": {name: "Demon's wealth", maxXp: 100, effect: 0.002, description: "Job pay"},
    
}

const itemBaseData = {
    "Homeless": {name: "Homeless", expense: 0, effect: 1},
    "Shared room": {name: "Shared room", expense: 3*100, effect: 1.4},
    "Rented room": {name: "Rented room", expense: 10*100, effect: 2},
    "Small apartment": {name: "Small apartment", expense: 50*100, effect: 3.5},
    "House": {name: "House", expense: 300*100, effect: 6},
    "Large house": {name: "Large house", expense: 1000*100, effect: 12},
    "Small manor": {name: "Small manor", expense: 20000*100, effect: 25},
    "Manor": {name: "Manor", expense: 5000000*100, effect: 60},

    "Book": {name: "Book", expense: 10, effect: 1.5, description: "Skill xp"},
    "Dumbbells": {name: "Dumbbells", expense: 50, effect: 1.5, description: "Strength xp"},
    "Training assistant": {name: "Training assistant", expense: 200, effect: 2, description: "Job xp"},
    "XM7": {name: "XM7", expense: 1000, effect: 2, description: "Military xp"},
    "Personal assistant": {name: "Personal assistant", expense: 7500, effect: 1.5, description: "Happiness"},
    "High-tech PC": {name: "High-tech PC", expense: 50000, effect: 3, description: "Tech xp"},
    "Study desk": {name: "Study desk", expense: 1000000, effect: 2, description: "Skill xp"},
    "Library": {name: "Library", expense: 10000000, effect: 1.5, description: "Skill xp"},
}

const jobCategories = {
    "Common work": ["Beggar", "Street entertainer", "Newspaper vendor", "Construction worker", "Janitor", "Shop clerk"],
    "Military" : ["Recruit", "Private", "Corporal", "Sergeant", "Lieutenant", "Major", "Lieutenant General", "Secretary of Defense"],
    "The Arcane Association" : ["Student", "Apprentice mage", "Mage", "Wizard", "Master wizard", "Chairman"]
}

const skillCategories = {
    "Fundamentals": ["Concentration", "Productivity", "Bargaining", "Intelligence", "Meditation"],
    "Combat": ["Strength", "Battle tactics", "Muscle memory"],
    "Tech": ["Mind capacity", "Immortality", "Time warping", "Super immortality"],
    "Dark magic": ["Dark influence", "Evil control", "Intimidation", "Demon training", "Blood meditation", "Demon's wealth"]
}

const itemCategories = {
    "Properties": ["Homeless", "Shared room", "Rented room", "Small apartment", "House", "Large house", "Small manor", "Manor"],
    "Misc": ["Book", "Dumbbells", "Training assistant", "XM7", "Personal assistant", "High-tech PC", "Study desk", "Library"]
}

const headerRowColors = {
    "Common work": "#55a630",
    "Military": "#e63946",
    "The Arcane Association": "#C71585",
    "Fundamentals": "#4a4e69",
    "Combat": "#ff704d",
    "Tech": "#875F9A",
    "Dark magic": "#73000f",
    "Properties": "#219ebc",
    "Misc": "#b56576",
}

const tooltips = {
    "Beggar": "Struggle day and night for a couple of dimes. It feels like you are at the brink of death each day.",
    "Street entertainer": "Use what talent you have left to earn a couple bucks on the streets. It's not much but it's entertaining work.",
    "Newspaper vendor": "Go around town selling newspapers. A lot of effort for such a low pay.",
    "Janitor": "Mop floors and empty trash cans around town. The pay is bad and the smell is worse.",
    "Construction worker": "Carry construction material and occassionally hammer a nail or two. The pay is alright but comes with a lot heavy physical work.",
    "Shop clerk": "Sit behind a cash register and occasionally restock shelves. The job pays decently well and is a lot less manually-intensive.",

    "Recruit": "A newbie in the army. Training hard every day to becomea real soldier. The pay is meager but the effort will be worth it.",
    "Private": "Protect your nation, fight for honor! A good paying and respectable job, though nothing to boast about.",
    "Corporal": "Traversing the ranks, increasing your pay. Your effort and hard work will not be for nothing.",
    "Sergeant": "You are feared by your subordinates, respected by your superiors. Your high pay is deserved.",
    "Lieutenant": "You went above and beyond and finally achieved the position of officer in the army. Such a high rank comes with its benefits.",
    "Major": "Becoming an officer wasn't enough, you wanted more. Though reaching the position of General is a tough task, you believe in yourself.",
    "Lieutenant General": "At the top of the army, you earn tons of money and you're respected by thousands of soldiers. Will you go further?",
    "Secretary of Defense": "Reaching for the stars, you administrate the whole army and work directly under the president! You may boast about your wealth.",

    "Student": "Study the theory of mana and practice basic spells. There is minor pay to cover living costs, however, this is a necessary stage in becoming a mage.",
    "Apprentice mage": "Under the supervision of a mage, perform basic spells against enemies in battle. Generous pay will be provided to cover living costs.",
    "Mage": "Turn the tides of battle through casting intermediate spells and mentor other apprentices. The pay for this particular job is extremely high.",
    "Wizard": "Utilise advanced spells to ravage and destroy entire legions of enemy soldiers. Only a small percentage of mages deserve to attain this role and are rewarded with an insanely high pay.",
    "Master wizard": "Blessed with unparalleled talent, perform unbelievable feats with magic at will. It is said that a master wizard has enough destructive power to wipe an empire off the map.",
    "Chairman": "Spend your days administrating The Arcane Association and investigate the concepts of true immortality. The chairman receives ludicrous amounts of pay daily.",

    "Concentration": "Improve your learning speed through practising intense concentration activities.",
    "Productivity": "Learn to procrastinate less at work and receive more job experience per day.",
    "Bargaining": "Study the tricks of the trade and persuasive skills to lower any type of expense.",
    "Meditation": "Fill your mind with peace and tranquility to tap into greater happiness from within.",
    "Intelligence": "Improve your intellect through studying and reading. More intelligent workers are paid more.",

    "Strength": "Condition your body and strength through harsh training. Stronger individuals are paid more in the military.",
    "Battle tactics": "Create and revise battle strategies, improving experience gained in the military.",
    "Muscle memory": "Strengthen your neurons through habit and repetition, improving strength gains throughout the body.",

    "Mind capacity": "Broaden your mind, increase your intellect, and achieve a deeper understanding of the universe.",
    "Immortality": "Lengthen your lifespan with highly advanced technology. Is this the end...?",
    "Time warping": "Use nano technology to increase how fast you experience the world, resulting in a faster gamespeed.",
    "Super immortality": "Through harnessing ancient, forbidden techniques, lengthen your lifespan drastically beyond comprehension.",

    "Dark influence": "Encompass yourself with formidable power bestowed upon you by evil, allowing you to pick up and absorb any job or skill with ease.",
    "Evil control": "Tame the raging and growing evil within you, improving evil gain in-between rebirths.",
    "Intimidation": "Learn to emit a devilish aura which strikes extreme fear into other merchants, forcing them to give you heavy discounts.",
    "Demon training": "A mere human body is too feeble and weak to withstand evil. Train with forbidden methods to slowly manifest into a demon, capable of absorbing knowledge rapidly.",
    "Blood meditation": "Grow and culture the evil within you through the sacrifise of other living beings, drastically increasing evil gain.",
    "Demon's wealth": "Through the means of dark magic, multiply the raw matter of the coins you receive from your job.",

    "Homeless": "Sleep on the uncomfortable, filthy streets while almost freezing to death every night. It cannot get any worse than this.",
    "Shared room": "A smelly and dirty room bunk-bed room which you share with a stranger. At least you have a roof over your head.",
    "Rented room": "Though the room is quite small, it comes with a small fridge and a toilet. Now you can enjoy some alone time.",
    "Small apartment": "A small quaint little apartment with multiple rooms and a city view. Comes with a lot of benefits but also a price.",
    "House": "A good sized house fit for a small family, or just yourself. These luxuries come at a price.",
    "Large house": "Much larger than a regular house, which boasts even more rooms and multiple floors. The building is quite spacious but comes with a hefty price tag.",
    "Small manor": "A very rich and meticulously built structure rimmed with fine metals such as silver. Extremely high expenses to maintain for a lavish lifestyle.",
    "Manor": "A grand residence with an enormous garden. Provides the utmost luxurious and comfortable living conditions possible for a ludicrous price.",

    "Book": "A place to write down all your thoughts and discoveries, allowing you to learn a lot more quickly.",
    "Dumbbells": "Heavy tools used in strenuous exercise to toughen up and accumulate strength even faster than before. ",
    "Training assistant": "Assists you with training giving you an easier time at work.",
    "XM7": "An advanced assault rifle making it easier to perform warfare duties thus earning you more experience.",
    "Personal assistant": "Prepares your meals and cleans your house, leaving you in a happier, stress-free mood.",
    "High-tech PC": "With the latest advanced technologies, this PC makes it easier to improve your IT skills and mind capacity.",
    "Study desk": "A dedicated area which provides many fine stationary and equipment designed for furthering your progress in research.",
    "Library": "Stores a collection of books, each containing vast amounts of information from basic life skills to complex algorithms.",
}

const units = ["", "k", "M", "B", "T", "q", "Q", "Sx", "Sp", "Oc"];

const jobTabButton = document.getElementById("jobTabButton")

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}
  
function getBindedTaskEffect(taskName) {
    var task = gameData.taskData[taskName]
    return task.getEffect.bind(task)
}

function getBindedItemEffect(itemName) {
    var item = gameData.itemData[itemName]
    return item.getEffect.bind(item)
}

function addMultipliers() {
    for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName]

        task.xpMultipliers = []
        if (task instanceof Job) task.incomeMultipliers = []

        task.xpMultipliers.push(task.getMaxLevelMultiplier.bind(task))
        task.xpMultipliers.push(getHappiness)
        task.xpMultipliers.push(getBindedTaskEffect("Dark influence"))
        task.xpMultipliers.push(getBindedTaskEffect("Demon training"))

        if (task instanceof Job) {
            task.incomeMultipliers.push(task.getLevelMultiplier.bind(task))
            task.incomeMultipliers.push(getBindedTaskEffect("Intelligence"))
            task.incomeMultipliers.push(getBindedTaskEffect("Demon's wealth"))
            task.xpMultipliers.push(getBindedTaskEffect("Productivity"))
            task.xpMultipliers.push(getBindedItemEffect("Training assistant"))    
        } else if (task instanceof Skill) {
            task.xpMultipliers.push(getBindedTaskEffect("Concentration"))
            task.xpMultipliers.push(getBindedItemEffect("Book"))
            task.xpMultipliers.push(getBindedItemEffect("Study desk"))
            task.xpMultipliers.push(getBindedItemEffect("Library"))
        }

        if (jobCategories["Military"].includes(task.name)) {
            task.incomeMultipliers.push(getBindedTaskEffect("Strength"))
            task.xpMultipliers.push(getBindedTaskEffect("Battle tactics"))
            task.xpMultipliers.push(getBindedItemEffect("XM7"))
        } else if (task.name == "Strength") {
            task.xpMultipliers.push(getBindedTaskEffect("Muscle memory"))
            task.xpMultipliers.push(getBindedItemEffect("Dumbbells"))
        } else if (skillCategories["Tech"].includes(task.name)) {
            task.xpMultipliers.push(getBindedItemEffect("High-tech PC"))
        } else if (jobCategories["The Arcane Association"].includes(task.name)) {
            task.xpMultipliers.push(getBindedTaskEffect("Mind capacity"))
        } else if (skillCategories["Dark magic"].includes(task.name)) {
            task.xpMultipliers.push(getEvil)
        }
    }

    for (itemName in gameData.itemData) {
        var item = gameData.itemData[itemName]
        item.expenseMultipliers = []
        item.expenseMultipliers.push(getBindedTaskEffect("Bargaining"))
        item.expenseMultipliers.push(getBindedTaskEffect("Intimidation"))
    }
}

function setCustomEffects() {
    var bargaining = gameData.taskData["Bargaining"]
    bargaining.getEffect = function() {
        var multiplier = 1 - getBaseLog(7, bargaining.level + 1) / 10
        if (multiplier < 0.1) {multiplier = 0.1}
        return multiplier
    }

    var intimidation = gameData.taskData["Intimidation"]
    intimidation.getEffect = function() {
        var multiplier = 1 - getBaseLog(7, intimidation.level + 1) / 10
        if (multiplier < 0.1) {multiplier = 0.1}
        return multiplier
    }

    var timeWarping = gameData.taskData["Time warping"]
    timeWarping.getEffect = function() {
        var multiplier = 1 + getBaseLog(13, timeWarping.level + 1) 
        return multiplier
    }

    var immortality = gameData.taskData["Immortality"]
    immortality.getEffect = function() {
        var multiplier = 1 + getBaseLog(33, immortality.level + 1) 
        return multiplier
    }
}

function getHappiness() {
    var meditationEffect = getBindedTaskEffect("Meditation")
    var butlerEffect = getBindedItemEffect("Personal assistant")
    var happiness = meditationEffect() * butlerEffect() * gameData.currentProperty.getEffect()
    return happiness
}

function getEvil() {
    return gameData.evil
}

function applyMultipliers(value, multipliers) {
    var finalMultiplier = 1
    multipliers.forEach(function(multiplierFunction) {
        var multiplier = multiplierFunction()
        finalMultiplier *= multiplier
    })
    var finalValue = Math.round(value * finalMultiplier)
    return finalValue
}

function applySpeed(value) {
    finalValue = value * getGameSpeed() / updateSpeed
    return finalValue
}

function getEvilGain() {
    var evilControl = gameData.taskData["Evil control"]
    var bloodMeditation = gameData.taskData["Blood meditation"]
    var evil = evilControl.getEffect() * bloodMeditation.getEffect()
    return evil
}

function getGameSpeed() {
    var timeWarping = gameData.taskData["Time warping"]
    var timeWarpingSpeed = gameData.timeWarpingEnabled ? timeWarping.getEffect() : 1
    var gameSpeed = baseGameSpeed * +!gameData.paused * +isAlive() * timeWarpingSpeed
    return gameSpeed
}

function applyExpenses() {
    var coins = applySpeed(getExpense())
    gameData.coins -= coins
    if (gameData.coins < 0) {    
        goBankrupt()
    }
}

function getExpense() {
    var expense = 0
    expense += gameData.currentProperty.getExpense()
    for (misc of gameData.currentMisc) {
        expense += misc.getExpense()
    }
    return expense
}

function goBankrupt() {
    gameData.coins = 0
    gameData.currentProperty = gameData.itemData["Homeless"]
    gameData.currentMisc = []
}

function setTab(element, selectedTab) {

    var tabs = Array.prototype.slice.call(document.getElementsByClassName("tab"))
    tabs.forEach(function(tab) {
        tab.style.display = "none"
    })
    document.getElementById(selectedTab).style.display = "block"

    var tabButtons = document.getElementsByClassName("tabButton")
    for (tabButton of tabButtons) {
        tabButton.classList.remove("w3-blue-gray")
    }
    element.classList.add("w3-blue-gray")
}

function setPause() {
    gameData.paused = !gameData.paused
}

function setTimeWarping() {
    gameData.timeWarpingEnabled = !gameData.timeWarpingEnabled
}

function setTask(taskName) {
    var task = gameData.taskData[taskName]
    task instanceof Job ? gameData.currentJob = task : gameData.currentSkill = task
}

function setProperty(propertyName) {
    var property = gameData.itemData[propertyName]
    gameData.currentProperty = property
}

function setMisc(miscName) {
    var misc = gameData.itemData[miscName]
    if (gameData.currentMisc.includes(misc)) {
        for (i = 0; i < gameData.currentMisc.length; i++) {
            if (gameData.currentMisc[i] == misc) {
                gameData.currentMisc.splice(i, 1)
            }
        }
    } else {
        gameData.currentMisc.push(misc)
    }
}

function createData(data, baseData) {
    for (key in baseData) {
        var entity = baseData[key]
        createEntity(data, entity)
    }
}

function createEntity(data, entity) {
    if ("income" in entity) {data[entity.name] = new Job(entity)}
    else if ("maxXp" in entity) {data[entity.name] = new Skill(entity)}
    else {data[entity.name] = new Item(entity)}
    data[entity.name].id = "row " + entity.name
}

function createRequiredRow(categoryName) {
    var requiredRow = document.getElementsByClassName("requiredRowTemplate")[0].content.firstElementChild.cloneNode(true)
    requiredRow.classList.add("requiredRow")
    requiredRow.classList.add(removeSpaces(categoryName))
    requiredRow.id = categoryName
    return requiredRow
}

function createHeaderRow(templates, categoryType, categoryName) {
    var headerRow = templates.headerRow.content.firstElementChild.cloneNode(true)
    headerRow.getElementsByClassName("category")[0].textContent = categoryName
    if (categoryType != itemCategories) {
        headerRow.getElementsByClassName("valueType")[0].textContent = categoryType == jobCategories ? "Income/day" : "Effect"
    }

    headerRow.style.backgroundColor = headerRowColors[categoryName]
    headerRow.style.color = "#ffffff"
    headerRow.classList.add(removeSpaces(categoryName))
    headerRow.classList.add("headerRow")
    
    return headerRow
}

function createRow(templates, name, categoryName, categoryType) {
    var row = templates.row.content.firstElementChild.cloneNode(true)
    row.getElementsByClassName("name")[0].textContent = name
    row.getElementsByClassName("tooltipText")[0].textContent = tooltips[name]
    row.id = "row " + name
    if (categoryType != itemCategories) {
        row.getElementsByClassName("progressBar")[0].onclick = function() {setTask(name)}
    } else {
        row.getElementsByClassName("button")[0].onclick = categoryName == "Properties" ? function() {setProperty(name)} : function() {setMisc(name)}
    }

    return row
}

function createAllRows(categoryType, tableId) {
    var templates = {
        headerRow: document.getElementsByClassName(categoryType == itemCategories ? "headerRowItemTemplate" : "headerRowTaskTemplate")[0],
        row: document.getElementsByClassName(categoryType == itemCategories ? "rowItemTemplate" : "rowTaskTemplate")[0],
    }

    var table = document.getElementById(tableId)

    for (categoryName in categoryType) {
        var headerRow = createHeaderRow(templates, categoryType, categoryName)
        table.appendChild(headerRow)
        
        var category = categoryType[categoryName]
        category.forEach(function(name) {
            var row = createRow(templates, name, categoryName, categoryType)
            table.appendChild(row)       
        })

        var requiredRow = createRequiredRow(categoryName)
        table.append(requiredRow)
    }
}

function updateQuickTaskDisplay(taskType) {
    var currentTask = taskType == "job" ? gameData.currentJob : gameData.currentSkill
    var quickTaskDisplayElement = document.getElementById("quickTaskDisplay")
    var progressBar = quickTaskDisplayElement.getElementsByClassName(taskType)[0]
    progressBar.getElementsByClassName("name")[0].textContent = currentTask.name + " lvl " + currentTask.level
    progressBar.getElementsByClassName("progressFill")[0].style.width = currentTask.xp / currentTask.getMaxXp() * 100 + "%"
}

function updateRequiredRows(data, categoryType) {
    var requiredRows = document.getElementsByClassName("requiredRow")
    for (requiredRow of requiredRows) {
        var nextEntity = null
        var category = categoryType[requiredRow.id] 
        if (category == null) {continue}
        for (i = 0; i < category.length; i++) {
            var entityName = category[i]
            if (i >= category.length - 1) break
            var requirements = gameData.requirements[entityName]
            if (requirements && i == 0) {
                if (!requirements.isCompleted()) {
                    nextEntity = data[entityName]
                    break
                }
            }

            var nextIndex = i + 1
            if (nextIndex >= category.length) {break}
            var nextEntityName = category[nextIndex]
            nextEntityRequirements = gameData.requirements[nextEntityName]

            if (!nextEntityRequirements.isCompleted()) {
                nextEntity = data[nextEntityName]
                break
            }       
        }

        if (nextEntity == null) {
            requiredRow.classList.add("hiddenTask")           
        } else {
            requiredRow.classList.remove("hiddenTask")
            var requirementObject = gameData.requirements[nextEntity.name]
            var requirements = requirementObject.requirements

            var coinElement = requiredRow.getElementsByClassName("coins")[0]
            var levelElement = requiredRow.getElementsByClassName("levels")[0]
            var evilElement = requiredRow.getElementsByClassName("evil")[0]

            coinElement.classList.add("hiddenTask")
            levelElement.classList.add("hiddenTask")
            evilElement.classList.add("hiddenTask")

            var finalText = ""
            if (data == gameData.taskData) {
                if (requirementObject instanceof EvilRequirement) {
                    evilElement.classList.remove("hiddenTask")
                    evilElement.textContent = format(requirements[0].requirement) + " evil"
                } else {
                    levelElement.classList.remove("hiddenTask")
                    for (requirement of requirements) {
                        var task = gameData.taskData[requirement.task]
                        if (task.level >= requirement.requirement) continue
                        var text = " " + requirement.task + " level " + format(task.level) + "/" + format(requirement.requirement) + ","
                        finalText += text
                    }
                    finalText = finalText.substring(0, finalText.length - 1)
                    levelElement.textContent = finalText
                }
            } else if (data == gameData.itemData) {
                coinElement.classList.remove("hiddenTask")
                formatCoins(requirements[0].requirement, coinElement)
            }
        }   
    }
}

function updateTaskRows() {
    for (key in gameData.taskData) {
        var task = gameData.taskData[key]
        var row = document.getElementById("row " + task.name)
        if (row) {
            row.getElementsByClassName("level")[0].textContent = task.level
            row.getElementsByClassName("xpGain")[0].textContent = format(task.getXpGain())
            row.getElementsByClassName("xpLeft")[0].textContent = format(task.getXpLeft())

            var maxLevel = row.getElementsByClassName("maxLevel")[0]
            maxLevel.textContent = task.maxLevel
            gameData.rebirthOneCount > 0 ? maxLevel.classList.remove("hidden") : maxLevel.classList.add("hidden")

            var progressFill = row.getElementsByClassName("progressFill")[0]
            progressFill.style.width = task.xp / task.getMaxXp() * 100 + "%"
            task == gameData.currentJob || task == gameData.currentSkill ? progressFill.classList.add("current") : progressFill.classList.remove("current")

            var valueElement = row.getElementsByClassName("value")[0]
            valueElement.getElementsByClassName("income")[0].style.display = task instanceof Job
            valueElement.getElementsByClassName("effect")[0].style.display = task instanceof Skill

            var skipSkillElement = row.getElementsByClassName("skipSkill")[0]
            skipSkillElement.style.display = task instanceof Skill && autoLearnElement.checked ? "block" : "none"

            if (task instanceof Job) {
                formatCoins(task.getIncome(), valueElement.getElementsByClassName("income")[0])
            } else {
                valueElement.getElementsByClassName("effect")[0].textContent = task.getEffectDescription()
            }
          } else {
            console.log(key);
          }
    }
}

function updateItemRows() {
    for (key in gameData.itemData) {
        var item = gameData.itemData[key]
        var row = document.getElementById("row " + item.name)
        var button = row.getElementsByClassName("button")[0]
        button.disabled = gameData.coins < item.getExpense()
        var active = row.getElementsByClassName("active")[0]
        var color = itemCategories["Properties"].includes(item.name) ? headerRowColors["Properties"] : headerRowColors["Misc"]
        active.style.backgroundColor = gameData.currentMisc.includes(item) || item == gameData.currentProperty ? color : "white"
        row.getElementsByClassName("effect")[0].textContent = item.getEffectDescription()
        formatCoins(item.getExpense(), row.getElementsByClassName("expense")[0])
    }
}

function updateHeaderRows(categories) {
    for (categoryName in categories) {
        var className = removeSpaces(categoryName)
        var headerRow = document.getElementsByClassName(className)[0]
        var maxLevelElement = headerRow.getElementsByClassName("maxLevel")[0]
        gameData.rebirthOneCount > 0 ? maxLevelElement.classList.remove("hidden") : maxLevelElement.classList.add("hidden")
        var skipSkillElement = headerRow.getElementsByClassName("skipSkill")[0]
        skipSkillElement.style.display = categories == skillCategories && autoLearnElement.checked ? "block" : "none"
    }
}

function updateText() {
    //Sidebar
    document.getElementById("ageDisplay").textContent = daysToYears(gameData.days)
    document.getElementById("dayDisplay").textContent = getDay()
    document.getElementById("lifespanDisplay").textContent = daysToYears(getLifespan())
    document.getElementById("pauseButton").textContent = gameData.paused ? "Play" : "Pause"

    formatCoins(gameData.coins, document.getElementById("coinDisplay"))
    setSignDisplay()
    formatCoins(getNet(), document.getElementById("netDisplay"))
    formatCoins(getIncome(), document.getElementById("incomeDisplay"))
    formatCoins(getExpense(), document.getElementById("expenseDisplay"))

    document.getElementById("happinessDisplay").textContent = getHappiness().toFixed(1)

    document.getElementById("evilDisplay").textContent = gameData.evil.toFixed(1)
    document.getElementById("evilGainDisplay").textContent = getEvilGain().toFixed(1)

    document.getElementById("timeWarpingDisplay").textContent = "x" + gameData.taskData["Time warping"].getEffect().toFixed(2)
    document.getElementById("timeWarpingButton").textContent = gameData.timeWarpingEnabled ? "Disable warp" : "Enable warp"
}

function setSignDisplay() {
    var signDisplay = document.getElementById("signDisplay")
    if (getIncome() > getExpense()) {
        signDisplay.textContent = "+"
        signDisplay.style.color = "green"
    } else if (getExpense() > getIncome()) {
        signDisplay.textContent = "-"
        signDisplay.style.color = "red"
    } else {
        signDisplay.textContent = ""
        signDisplay.style.color = "gray"
    }
}

function getNet() {
    var net = Math.abs(getIncome() - getExpense())
    return net
}

function hideEntities() {
    for (key in gameData.requirements) {
        var requirement = gameData.requirements[key]
        var completed = requirement.isCompleted()
        for (element of requirement.elements) {
            if (completed) {
                element.classList.remove("hidden")
            } else {
                element.classList.add("hidden")
            }
        }
    }
}

function createItemData(baseData) {
    for (var item of baseData) {
        gameData.itemData[item.name] = "happiness" in item ? new Property(task) : new Misc(task)
        gameData.itemData[item.name].id = "item " + item.name
    }
}

function doCurrentTask(task) {
    task.increaseXp()
    if (task instanceof Job) {
        increaseCoins()
    }
}

function getIncome() {
    var income = 0
    income += gameData.currentJob.getIncome()
    return income
}

function increaseCoins() {
    var coins = applySpeed(getIncome())
    gameData.coins += coins
}

function daysToYears(days) {
    var years = Math.floor(days / 365)
    return years
}

function getCategoryFromEntityName(categoryType, entityName) {
    for (categoryName in categoryType) {
        var category = categoryType[categoryName]
        if (category.includes(entityName)) {
            return category
        }
    }
}

function getNextEntity(data, categoryType, entityName) {
    var category = getCategoryFromEntityName(categoryType, entityName)
    var nextIndex = category.indexOf(entityName) + 1
    if (nextIndex > category.length - 1) return null
    var nextEntityName = category[nextIndex]
    var nextEntity = data[nextEntityName]
    return nextEntity
}

function autoPromote() {
    if (!autoPromoteElement.checked) return
    var nextEntity = getNextEntity(gameData.taskData, jobCategories, gameData.currentJob.name)
    if (nextEntity == null) return
    var requirement = gameData.requirements[nextEntity.name]
    if (requirement.isCompleted()) gameData.currentJob = nextEntity
}

function checkSkillSkipped(skill) {
    var row = document.getElementById("row " + skill.name)
    var isSkillSkipped = row.getElementsByClassName("checkbox")[0].checked
    return isSkillSkipped
}

function setSkillWithLowestMaxXp() {
    var xpDict = {}

    for (skillName in gameData.taskData) {
        var skill = gameData.taskData[skillName]
        var requirement = gameData.requirements[skillName]
        if (skill instanceof Skill && requirement.isCompleted() && !checkSkillSkipped(skill)) {
            xpDict[skill.name] = skill.level //skill.getMaxXp() / skill.getXpGain()
        }
    }

    if (xpDict == {}) {
        skillWithLowestMaxXp = gameData.taskData["Concentration"]
        return
    }

    var skillName = getKeyOfLowestValueFromDict(xpDict)
    skillWithLowestMaxXp = gameData.taskData[skillName]
}

function getKeyOfLowestValueFromDict(dict) {
    var values = []
    for (key in dict) {
        var value = dict[key]
        values.push(value)
    }

    values.sort(function(a, b){return a - b})

    for (key in dict) {
        var value = dict[key]
        if (value == values[0]) {
            return key
        }
    }
}

function autoLearn() {
    if (!autoLearnElement.checked || !skillWithLowestMaxXp) return
    gameData.currentSkill = skillWithLowestMaxXp
}

function yearsToDays(years) {
    var days = years * 365
    return days
}
 
function getDay() {
    var day = Math.floor(gameData.days - daysToYears(gameData.days) * 365)
    return day
}

function increaseDays() {
    var increase = applySpeed(1)
    gameData.days += increase
}

function format(number) {

    // what tier? (determines SI symbol)
    var tier = Math.log10(number) / 3 | 0;

    // if zero, we don't need a suffix
    if(tier == 0) return number;

    // get suffix and determine scale
    var suffix = units[tier];
    var scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(1) + suffix;
}

function formatCoins(coins, element) {
    var tiers = ["$"]
    var colors = {
        "$": "#2b994a",
        "¢": "#a8a8a8"
    }
    var leftOver = coins
    var i = 0
    for (tier of tiers) {
        var x = Math.floor(leftOver / Math.pow(10, (tiers.length - i) * 2))
        var leftOver = Math.floor(leftOver - x * Math.pow(10, (tiers.length - i) * 2))
        var text =  tier + format(String(x)) + " "
        element.children[i].textContent = x > 0 ? text : ""
        element.children[i].style.color = colors[tier]
        i += 1
    }
    if (leftOver == 0 && coins > 0) {element.children[3].textContent = ""; return}
    var text = String(Math.floor(leftOver)) + "¢"
    element.children[3].textContent = text
    element.children[3].style.color = colors["¢"]
}

function getTaskElement(taskName) {
    var task = gameData.taskData[taskName]
    var element = document.getElementById(task.id)
    return element
}

function getItemElement(itemName) {
    var item = gameData.itemData[itemName]
    var element = document.getElementById(item.id)
    return element
}

function getElementsByClass(className) {
    var elements = document.getElementsByClassName(removeSpaces(className))
    return elements
}

function setLightDarkMode() {
    var body = document.getElementById("body")
    body.classList.contains("dark") ? body.classList.remove("dark") : body.classList.add("dark")
}

function removeSpaces(string) {
    var string = string.replace(/ /g, "")
    return string
}

function rebirthOne() {
    gameData.rebirthOneCount += 1

    rebirthReset()
}

function rebirthTwo() {
    gameData.rebirthTwoCount += 1
    gameData.evil += getEvilGain()

    rebirthReset()

    for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName]
        task.maxLevel = 0
    }    
}

function rebirthReset() {
    setTab(jobTabButton, "jobs")

    gameData.coins = 0
    gameData.days = 365 * 18
    gameData.currentJob = gameData.taskData["Beggar"]
    gameData.currentSkill = gameData.taskData["Concentration"]
    gameData.currentProperty = gameData.itemData["Homeless"]
    gameData.currentMisc = []

    for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName]
        if (task.level > task.maxLevel) task.maxLevel = task.level
        task.level = 0
        task.xp = 0
    }

    for (key in gameData.requirements) {
        var requirement = gameData.requirements[key]
        if (requirement.completed && permanentUnlocks.includes(key)) continue
        requirement.completed = false
    }
}

function getLifespan() {
    var immortality = gameData.taskData["Immortality"]
    var superImmortality = gameData.taskData["Super immortality"]
    var lifespan = baseLifespan * immortality.getEffect() * superImmortality.getEffect()
    return lifespan
}

function isAlive() {
    var condition = gameData.days < getLifespan()
    var deathText = document.getElementById("deathText")
    if (!condition) {
        gameData.days = getLifespan()
        deathText.classList.remove("hidden")
    }
    else {
        deathText.classList.add("hidden")
    }
    return condition
}

function assignMethods() {

    for (key in gameData.taskData) {
        var task = gameData.taskData[key]
        if (task.baseData.income) {
            task.baseData = jobBaseData[task.name]
            task = Object.assign(new Job(jobBaseData[task.name]), task)
            
        } else {
            task.baseData = skillBaseData[task.name]
            task = Object.assign(new Skill(skillBaseData[task.name]), task)
        } 
        gameData.taskData[key] = task
    }

    for (key in gameData.itemData) {
        var item = gameData.itemData[key]
        item.baseData = itemBaseData[item.name]
        item = Object.assign(new Item(itemBaseData[item.name]), item)
        gameData.itemData[key] = item
    }

    for (key in gameData.requirements) {
        var requirement = gameData.requirements[key]
        if (requirement.type == "task") {
            requirement = Object.assign(new TaskRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "coins") {
            requirement = Object.assign(new CoinRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "age") {
            requirement = Object.assign(new AgeRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "evil") {
            requirement = Object.assign(new EvilRequirement(requirement.elements, requirement.requirements), requirement)
        }

        var tempRequirement = tempData["requirements"][key]
        requirement.elements = tempRequirement.elements
        requirement.requirements = tempRequirement.requirements
        gameData.requirements[key] = requirement
    }

    gameData.currentJob = gameData.taskData[gameData.currentJob.name]
    gameData.currentSkill = gameData.taskData[gameData.currentSkill.name]
    gameData.currentProperty = gameData.itemData[gameData.currentProperty.name]
    var newArray = []
    for (misc of gameData.currentMisc) {
        newArray.push(gameData.itemData[misc.name])
    }
    gameData.currentMisc = newArray
}

function replaceSaveDict(dict, saveDict) {
    for (key in dict) {
        if (!(key in saveDict)) {
            saveDict[key] = dict[key]
        } else if (dict == gameData.requirements) {
            if (saveDict[key].type != tempData["requirements"][key].type) {
                saveDict[key] = tempData["requirements"][key]
            }
        }
    }

    for (key in saveDict) {
        if (!(key in dict)) {
            delete saveDict[key]
        }
    }
}

function saveGameData() {
    localStorage.setItem("gameDataSave", JSON.stringify(gameData))
}

function loadGameData() {
    var gameDataSave = JSON.parse(localStorage.getItem("gameDataSave"))

    if (gameDataSave !== null) {
        replaceSaveDict(gameData, gameDataSave)
        replaceSaveDict(gameData.requirements, gameDataSave.requirements)
        replaceSaveDict(gameData.taskData, gameDataSave.taskData)
        replaceSaveDict(gameData.itemData, gameDataSave.itemData)

        gameData = gameDataSave
    }

    assignMethods()
}

function updateUI() {
    updateTaskRows()
    updateItemRows()
    updateRequiredRows(gameData.taskData, jobCategories)
    updateRequiredRows(gameData.taskData, skillCategories)
    updateRequiredRows(gameData.itemData, itemCategories)
    updateHeaderRows(jobCategories)
    updateHeaderRows(skillCategories)
    updateQuickTaskDisplay("job")
    updateQuickTaskDisplay("skill")
    hideEntities()
    updateText()  
}

function update() {
    increaseDays()
    autoPromote()
    autoLearn()
    doCurrentTask(gameData.currentJob)
    doCurrentTask(gameData.currentSkill)
    applyExpenses()
    updateUI()
}

function resetGameData() {
    localStorage.clear()
    location.reload()
}

function importGameData() {
    var importExportBox = document.getElementById("importExportBox")
    var data = JSON.parse(window.atob(importExportBox.value))
    gameData = data
    saveGameData()
    location.reload()
}

function exportGameData() {
    var importExportBox = document.getElementById("importExportBox")
    importExportBox.value = window.btoa(JSON.stringify(gameData))
}

//Init

createAllRows(jobCategories, "jobTable")
createAllRows(skillCategories, "skillTable")
createAllRows(itemCategories, "itemTable") 

createData(gameData.taskData, jobBaseData)
createData(gameData.taskData, skillBaseData)
createData(gameData.itemData, itemBaseData) 

gameData.currentJob = gameData.taskData["Beggar"]
gameData.currentSkill = gameData.taskData["Concentration"]
gameData.currentProperty = gameData.itemData["Homeless"]
gameData.currentMisc = []

gameData.requirements = {
    //Other
    "The Arcane Association": new TaskRequirement(getElementsByClass("The Arcane Association"), [{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
    "Dark magic": new EvilRequirement(getElementsByClass("Dark magic"), [{requirement: 1}]),
    "Shop": new CoinRequirement([document.getElementById("shopTabButton")], [{requirement: gameData.itemData["Shared room"].getExpense() * 50}]),
    "Rebirth tab": new AgeRequirement([document.getElementById("rebirthTabButton")], [{requirement: 25}]),
    "Rebirth note 1": new AgeRequirement([document.getElementById("rebirthNote1")], [{requirement: 45}]),
    "Rebirth note 2": new AgeRequirement([document.getElementById("rebirthNote2")], [{requirement: 65}]),
    "Rebirth note 3": new AgeRequirement([document.getElementById("rebirthNote3")], [{requirement: 200}]),
    "Evil info": new EvilRequirement([document.getElementById("evilInfo")], [{requirement: 1}]),
    "Time warping info": new TaskRequirement([document.getElementById("timeWarping")], [{task: "Mage", requirement: 10}]),
    "Automation": new AgeRequirement([document.getElementById("automation")], [{requirement: 20}]),
    "Quick task display": new AgeRequirement([document.getElementById("quickTaskDisplay")], [{requirement: 20}]),

    //Common work
    "Beggar": new TaskRequirement([getTaskElement("Beggar")], []),
    "Street entertainer": new TaskRequirement([getTaskElement("Street entertainer")], [{task: "Beggar", requirement: 10}]),
    "Newspaper vendor": new TaskRequirement([getTaskElement("Newspaper vendor")], [{task: "Street entertainer", requirement: 10}]),
    "Janitor": new TaskRequirement([getTaskElement("Janitor")], [{task: "Newspaper vendor", requirement: 10}]),
    "Construction worker": new TaskRequirement([getTaskElement("Construction worker")], [{task: "Strength", requirement: 25}, {task: "Janitor", requirement: 10}]),
    "Shop clerk": new TaskRequirement([getTaskElement("Shop clerk")], [{task: "Bargaining", requirement: 50}, {task: "Intelligence", requirement: 30}, {task: "Construction worker", requirement: 10}]),

    //Military
    "Recruit": new TaskRequirement([getTaskElement("Recruit")], [{task: "Strength", requirement: 5}]),
    "Private": new TaskRequirement([getTaskElement("Private")], [{task: "Strength", requirement: 20}, {task: "Recruit", requirement: 10}]),
    "Corporal": new TaskRequirement([getTaskElement("Corporal")], [{task: "Battle tactics", requirement: 40}, {task: "Private", requirement: 10}]),
    "Sergeant": new TaskRequirement([getTaskElement("Sergeant")], [{task: "Strength", requirement: 100}, {task: "Corporal", requirement: 10}]),
    "Lieutenant": new TaskRequirement([getTaskElement("Lieutenant")], [{task: "Intelligence", requirement: 100}, {task: "Battle tactics", requirement: 150}, {task: "Sergeant", requirement: 10}]),
    "Major": new TaskRequirement([getTaskElement("Major")], [{task: "Intelligence", requirement: 200}, {task: "Strength", requirement: 300}, {task: "Lieutenant", requirement: 10}]),
    "Lieutenant General": new TaskRequirement([getTaskElement("Lieutenant General")], [{task: "Intelligence", requirement: 500}, {task: "Major", requirement: 10}]),
    "Secretary of Defense": new TaskRequirement([getTaskElement("Secretary of Defense")], [{task: "Intelligence", requirement: 1000}, {task: "Battle tactics", requirement: 1000}, {task: "Lieutenant General", requirement: 10}]),

    //The Arcane Association
    "Student": new TaskRequirement([getTaskElement("Student")], [{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
    "Apprentice mage": new TaskRequirement([getTaskElement("Apprentice mage")], [{task: "Mind capacity", requirement: 400}, {task: "Student", requirement: 10}]),
    "Mage": new TaskRequirement([getTaskElement("Mage")], [{task: "Mind capacity", requirement: 700}, {task: "Apprentice mage", requirement: 10}]),
    "Wizard": new TaskRequirement([getTaskElement("Wizard")], [{task: "Mind capacity", requirement: 1000}, {task: "Mage", requirement: 10}]),
    "Master wizard": new TaskRequirement([getTaskElement("Master wizard")], [{task: "Mind capacity", requirement: 1500}, {task: "Wizard", requirement: 10}]),
    "Chairman": new TaskRequirement([getTaskElement("Chairman")], [{task: "Mind capacity", requirement: 2000}, {task: "Master wizard", requirement: 10}]),

    //Fundamentals
    "Concentration": new TaskRequirement([getTaskElement("Concentration")], []),
    "Productivity": new TaskRequirement([getTaskElement("Productivity")], [{task: "Concentration", requirement: 5}]),
    "Bargaining": new TaskRequirement([getTaskElement("Bargaining")], [{task: "Concentration", requirement: 20}]),
    "Intelligence": new TaskRequirement([getTaskElement("Intelligence")], [{task: "Concentration", requirement: 25}, {task: "Productivity", requirement: 15}]),
    "Meditation": new TaskRequirement([getTaskElement("Meditation")], [{task: "Concentration", requirement: 30}, {task: "Productivity", requirement: 20}]),

    //Combat
    "Strength": new TaskRequirement([getTaskElement("Strength")], []),
    "Battle tactics": new TaskRequirement([getTaskElement("Battle tactics")], [{task: "Concentration", requirement: 20}]),
    "Muscle memory": new TaskRequirement([getTaskElement("Muscle memory")], [{task: "Concentration", requirement: 30}, {task: "Strength", requirement: 30}]),

    //Magic
    "Mind capacity": new TaskRequirement([getTaskElement("Mind capacity")], [{task: "Concentration", requirement: 200}, {task: "Intelligence", requirement: 200}]),
    "Immortality": new TaskRequirement([getTaskElement("Immortality")], [{task: "Apprentice mage", requirement: 10}]),
    "Time warping": new TaskRequirement([getTaskElement("Time warping")], [{task: "Mage", requirement: 10}]),
    "Super immortality": new TaskRequirement([getTaskElement("Super immortality")], [{task: "Chairman", requirement: 1000}]),

    //Dark magic
    "Dark influence": new EvilRequirement([getTaskElement("Dark influence")], [{requirement: 1}]),
    "Evil control": new EvilRequirement([getTaskElement("Evil control")], [{requirement: 1}]),
    "Intimidation": new EvilRequirement([getTaskElement("Intimidation")], [{requirement: 1}]),
    "Demon training": new EvilRequirement([getTaskElement("Demon training")], [{requirement: 25}]),
    "Blood meditation": new EvilRequirement([getTaskElement("Blood meditation")], [{requirement: 75}]),
    "Demon's wealth": new EvilRequirement([getTaskElement("Demon's wealth")], [{requirement: 500}]),

    //Properties
    "Homeless": new CoinRequirement([getItemElement("Homeless")], [{requirement: 0}]),
    "Shared room": new CoinRequirement([getItemElement("Shared room")], [{requirement: 0}]),
    "Rented room": new CoinRequirement([getItemElement("Rented room")], [{requirement: gameData.itemData["Rented room"].getExpense() * 100}]),
    "Small apartment": new CoinRequirement([getItemElement("Small apartment")], [{requirement: gameData.itemData["Small apartment"].getExpense() * 100}]),
    "House": new CoinRequirement([getItemElement("House")], [{requirement: gameData.itemData["House"].getExpense() * 100}]),
    "Large house": new CoinRequirement([getItemElement("Large house")], [{requirement: gameData.itemData["Large house"].getExpense() * 100}]),
    "Small manor": new CoinRequirement([getItemElement("Small manor")], [{requirement: gameData.itemData["Small manor"].getExpense() * 100}]),
    "Manor": new CoinRequirement([getItemElement("Manor")], [{requirement: gameData.itemData["Manor"].getExpense() * 100}]),

    //Misc
    "Book": new CoinRequirement([getItemElement("Book")], [{requirement: 0}]),
    "Dumbbells": new CoinRequirement([getItemElement("Dumbbells")], [{requirement: gameData.itemData["Dumbbells"].getExpense() * 100}]),
    "Training assistant": new CoinRequirement([getItemElement("Training assistant")], [{requirement: gameData.itemData["Training assistant"].getExpense() * 100}]),
    "XM7": new CoinRequirement([getItemElement("XM7")], [{requirement: gameData.itemData["XM7"].getExpense() * 100}]),
    "Personal assistant": new CoinRequirement([getItemElement("Personal assistant")], [{requirement: gameData.itemData["Personal assistant"].getExpense() * 100}]),
    "High-tech PC": new CoinRequirement([getItemElement("High-tech PC")], [{requirement: gameData.itemData["High-tech PC"].getExpense() * 100}]),
    "Study desk": new CoinRequirement([getItemElement("Study desk")], [{requirement: gameData.itemData["Study desk"].getExpense() * 100}]),
    "Library": new CoinRequirement([getItemElement("Library")], [{requirement: gameData.itemData["Library"].getExpense() * 100}]), 
}

tempData["requirements"] = {}
for (key in gameData.requirements) {
    var requirement = gameData.requirements[key]
    tempData["requirements"][key] = requirement
}

loadGameData()

setCustomEffects()
addMultipliers()

setTab(jobTabButton, "jobs")

update()
setInterval(update, 1000 / updateSpeed)
setInterval(saveGameData, 3000)
setInterval(setSkillWithLowestMaxXp, 1000)
