let currentTime = new Date().getTime()
let trailArr = [];
let presentArr = [];
let ldm = false
let mode = "main"
let menu = "main"

let slowMo = 0
let boost = 0
let combo = 0
let comboUI = [0]
let comboCounter = 0
let presentValue = 100
let presentList = []

let specialText = ""
let specialTimer = 0
let mouseText = ""
let mouseTimer = 0
let mouseColor = [0, 0, 0]
let timer = 0
let stopwatch = 0
let stopwatchArr = []
let lives = 0

let charm = 0
let honour = 0
let presentId = 0
let veloArr = [0]
for (let i = 0; i < 1000; i++) {
	veloArr.push(veloArr[veloArr.length - 1] + 1.25 * veloArr.length + Math.floor(i / 3) * 0.25)
}

function preload() {
	snowflakes = {
		20: loadImage("Trail/pixil-frame-0.png"),
		19: loadImage("Trail/pixil-frame-0 (1).png"),
		18: loadImage("Trail/pixil-frame-0 (2).png"),
		17: loadImage("Trail/pixil-frame-0 (3).png"),
		16: loadImage("Trail/pixil-frame-0 (4).png"),
		15: loadImage("Trail/pixil-frame-0 (5).png"),
		14: loadImage("Trail/pixil-frame-0 (6).png"),
		13: loadImage("Trail/pixil-frame-0 (7).png"),
		12: loadImage("Trail/pixil-frame-0 (8).png"),
		11: loadImage("Trail/pixil-frame-0 (9).png"),
		10: loadImage("Trail/pixil-frame-0 (10).png"),
		9: loadImage("Trail/pixil-frame-0 (11).png"),
		8: loadImage("Trail/pixil-frame-0 (12).png"),
		7: loadImage("Trail/pixil-frame-0 (13).png"),
		6: loadImage("Trail/pixil-frame-0 (14).png"),
		5: loadImage("Trail/pixil-frame-0 (15).png"),
		4: loadImage("Trail/pixil-frame-0 (16).png"),
		3: loadImage("Trail/pixil-frame-0 (17).png"),
		2: loadImage("Trail/pixil-frame-0 (18).png"),
		1: loadImage("Trail/pixil-frame-0 (19).png")
	}
	presents = {
		"red1": loadImage("Presents/pixil-frame-0.png"),
		"red2": loadImage("Presents/pixil-frame-0 (1).png"),
		"purple1": loadImage("Presents/pixil-frame-0 (2).png"),
		"purple2": loadImage("Presents/pixil-frame-0 (3).png"),
		"green1": loadImage("Presents/pixil-frame-0 (4).png"),
		"green2": loadImage("Presents/pixil-frame-0 (5).png"),
		"blue1": loadImage("Presents/pixil-frame-0 (6).png"),
		"blue2": loadImage("Presents/pixil-frame-0 (7).png"),
		"grey1": loadImage("Presents/pixil-frame-0 (8).png"),
		"grey2": loadImage("Presents/pixil-frame-0 (9).png")
	}
	powerUps = {
		"slowMo": loadImage("PowerUps/iceCream.png"),
		"combo": loadImage("PowerUps/doughnut.png"),
		"duration": loadImage("PowerUps/clock.png"),
		"boost": loadImage("PowerUps/melon.png"),
		"bomb": loadImage("PowerUps/bomb.png")
	}
	buttons = {
		"back": loadImage("Buttons/back.png"),
		"again": loadImage("Buttons/again.png"),
		"menu": loadImage("Buttons/menu.png"),
		"logo": loadImage("Buttons/logo.png"),
		"background": loadImage("Buttons/background.png")
	}
	sfx = {
		"rip": loadSound("SFX/rip.mp3"),
		"rip1": loadSound("SFX/rip1.mp3"),
		"rip2": loadSound("SFX/rip2.mp3"),
		"ice": loadSound("SFX/ice.mp3"),
		"break": loadSound("SFX/break.mp3"),
		"rage": loadSound("SFX/rage.mp3"),
		"time": loadSound("SFX/time.mp3"),
		"boom": loadSound("SFX/boom.mp3"),
		"squelch": loadSound("SFX/squelch.mp3")
	}
	songs = {
		"xmas": loadSound("Songs/It's Christmas!.mp3")
	}
}

function setup() {
	trailArr.push(new Snowflake())
	textFont("Courier New")
	angleMode(DEGREES)
	rectMode(CENTER)
	imageMode(CENTER)
	textAlign(CENTER)

	//initiateMenu()
	resetSurvival()
	//resetScore()
	//resetTimed()

	//resetZen()
	//resetChaos()
	//songs["xmas"].loop()
}

function choice(arr) {
	let index = Math.floor(Math.random() * arr.length);
	return arr[index];
}

function mouseHalfBounds(xLB, xUB, yLB, yUB) {
	let xBounds = windowWidth/2 + xLB <= mouseX && mouseX <= windowWidth/2 + xUB
	let yBounds = windowHeight/2 + yLB <= mouseY && mouseY <= windowHeight/2 + yUB
	return xBounds && yBounds
}

function mouseFullBounds(xLB, xUB, yLB, yUB) {
	let xBounds = windowWidth + xLB <= mouseX && mouseX <= windowWidth + xUB
	let yBounds = yLB <= mouseY && mouseY <= yUB
	return xBounds && yBounds
}

function slicingCollision(x, y) {
	let smallX = Math.min(mouseX, trailArr[trailArr.length - 1].x) - 50
	let bigX = Math.max(mouseX, trailArr[trailArr.length - 1].x) + 50

	if (smallX <= x  && x <= bigX) {
		let smallY = Math.min(mouseY, trailArr[trailArr.length - 1].y)
		let bigY = Math.max(mouseY, trailArr[trailArr.length - 1].y)
		let lerpedY = lerp(smallY, bigY, (bigX-x)/(bigX-smallX))
		
		if (lerpedY - 50 <= y && y <= lerpedY + 50) {
			return true;
		}
	}
	return false;
}

class Snowflake {
	constructor(x, y, velocityX, velocityY, rotSpeed, state) {
		this.x = mouseX
		this.y = mouseY
		this.velocityX = Math.random() * choice([1, -1])
		this.velocityY = Math.random() * 7.5
		this.rotSpeed = Math.random() * 5 * choice([1, -1])
		this.state = 20
		this.orientation = 0
	}

	draw() {
		image(snowflakes[this.state], this.x, this.y)
		if (!ldm) {
			this.x += this.velocityX
			this.y += this.velocityY
			this.velocityY += 0.25
			this.orientation += this.rotSpeed
			translate(this.x, this.y)
			rotate(this.orientation)
			translate(-this.x, -this.y)
		}
		this.state--
	}
}

class Present {
	constructor(x, y, velocityX, velocityY, rotSpeed, skin, cycle) {
		this.Id = presentId
		this.x = x
		this.y = y
		this.skin = skin
		this.orientation = 0
		this.alive = true
		this.velocityX = velocityX
		this.velocityY = velocityY
		this.rotSpeed = rotSpeed
		this.gravity = 0.75
		this.isPowerUp = Object.keys(powerUps).includes(skin)
		this.cycle = cycle
		presentId++
	}
	
	draw() {
		if (currentTime <= slowMo) {
			this.x -= this.velocityX / 2
			this.y += this.velocityY / 2
			this.velocityY += this.gravity / 2
			this.orientation += this.rotSpeed / 2
		} else {
			this.x -= this.velocityX
			this.y += this.velocityY
			this.velocityY += this.gravity
			this.orientation += this.rotSpeed
		}
		
		if (slicingCollision(this.x, this.y)) {
			charm += presentValue
			this.alive = false
			if (this.isPowerUp) {
				specialTimer = currentTime + 1500
				mouseTimer = currentTime + 1000
				switch (this.skin) {
					case "slowMo": startSlowMo(); break;
					case "combo": startCombo(); break;
					case "duration": addTime(); break;
					case "bomb": explosion(); break;
					case "boost": startBoost(); break;
				}
			} else {
				sfx[choice(["rip", "rip1", "rip2"])].play()
			}
			comboCheck()
		} else if (this.y >= windowHeight + 50) {
			this.alive = false
		}
		
		if (this.alive) {
			if (!ldm) {
				translate(this.x, this.y)
				rotate(this.orientation)
				translate(-this.x, -this.y)
			}
			if (this.isPowerUp) {
				image(powerUps[this.skin], this.x, this.y)
			} else {
				image(presents[this.skin], this.x, this.y)
			}
		} else {
			presentArr = presentArr.filter(v => v.Id !== this.Id)
			if (this.cycle) {randomPresent(this.cycle)}
		}
	}
}

function drawBackground() {
	push()
	noSmooth()
	image(buttons["background"], windowWidth/2, windowHeight/2, windowWidth, buttons["background"].height * windowWidth/buttons["background"].width)
	pop()
}

function initiateMenu() {
	mode = "main"
	menu = "main"
	presentArr = []
	presentList = [...Object.keys(presents)]
	charm = 0
	comboCounter = 0
	slowMo = 0
	boost = 0
	combo = 0
	presentValue = 100
	randomPresent(true)
	randomPresent(true)
	randomPresent(true)
}

function mainMenu() {
	image(buttons["logo"], windowWidth/2, windowHeight/2 - 150)
	rect(windowWidth/2, windowHeight/2, 400, 100)
	rect(windowWidth/2, windowHeight/2 + 110, 400, 60)
	handlePresents()
}

function initiateModes() {
	mode = "modes"
	menu = "modes"
	presentArr = []
	presentList = [...Object.keys(presents)]
	charm = 0
	comboCounter = 0
	slowMo = 0
	boost = 0
	combo = 0
	presentValue = 100
	randomPresent(true)
	randomPresent(true)
	randomPresent(true)
}

function modesMenu() {
	image(buttons["back"], windowWidth - 75, 35)
	rect(windowWidth/2, windowHeight/2 - 200, 400, 60)
	rect(windowWidth/2, windowHeight/2 - 100, 400, 60)
	rect(windowWidth/2, windowHeight/2, 400, 60)
	rect(windowWidth/2, windowHeight/2 + 100, 400, 60)
	rect(windowWidth/2, windowHeight/2 + 200, 400, 60)
	handlePresents()
}

function resetTimed() {
	mode = "timed"
	menu = "game"
	presentArr = []
	presentList = [...Object.keys(presents), ...Object.keys(powerUps)]
	timer = new Date().getTime() + 60000
	charm = 0
	comboCounter = 0
	slowMo = 0
	boost = 0
	combo = 0
	presentValue = 100
	randomPresent(true)
}

function handleTimer() {
	push()
	textSize(50)
	strokeWeight(3)
	stroke(((timer - currentTime)/1000 >= 6) && "grey" || "red")
	text(Math.floor((timer - currentTime)/1000), windowWidth/2, 100)
	pop()
}

function timedMode() {
	if (currentTime <= timer) {
		if (!Math.floor(Math.random() * 100)) {randomPresent(false)}
		image(buttons["back"], windowWidth - 75, 35)
		handleTimer()
		handlePowerUps()
		handlePresents()
		comboHandler()
		handleMouseText()
	} else {
		menu = "gOver"
		handleGOverUI(`Charm: ${charm}`, "pink")
	}
}

function addTime() {
	if (mode === "timed") {
		specialText = "=> More Time: +3 seconds"
		mouseText = "+3 Seconds"
		timer += 3000
	} else if (mode === "score") {
		specialText = "=> Save Time: -3 seconds"
		mouseText = "-3 Seconds"
		stopwatch += 3000
	}

	mouseColor = [200, 200, 200]
	sfx["time"].play()
}

function resetScore() {
	presentList = [...Object.keys(presents), ...Object.keys(powerUps)]
	stopwatch = new Date().getTime()
	mode = "score"
	menu = "game"
	presentArr = []
	stopwatchArr = []
	charm = 0
	comboCounter = 0
	slowMo = 0
	boost = 0
	combo = 0
	presentValue = 100
	randomPresent(true)
}

function handleStopwatch() {
	push()
	textSize(50)
	strokeWeight(3)
	stroke("grey")
	text(Math.floor((currentTime - stopwatch)/1000), windowWidth/2, 100)
	pop()
}

function scoreMode() {
	if (charm < 25000) {
		if (!Math.floor(Math.random() * 100)) {randomPresent(false)}
		image(buttons["back"], windowWidth - 75, 35)
		handleStopwatch()
		handlePowerUps()
		handlePresents()
		comboHandler()
		handleMouseText()
	} else {
		menu = "gOver"
		stopwatchArr.push(Math.floor((currentTime - stopwatch)/1000))
		handleGOverUI(`Time: ${stopwatchArr[0]}`, "grey")
	}
}

function resetSurvival() {
	presentList = [...Object.keys(presents), "slowMo", "combo", "boost", "bomb", "bomb", "bomb"]
	lives = 3
	mode = "survival"
	menu = "game"
	presentArr = []
	stopwatchArr = []
	charm = 0
	comboCounter = 0
	slowMo = 0
	boost = 0
	combo = 0
	presentValue = 100
	randomPresent(true)
}

function handleLives() {
	push()
	textSize(50)
	strokeWeight(3)
	stroke("red")
	text(`Lives: ${lives}`, windowWidth/2, 100)
	pop()
}

function survivalMode() {
	if (lives !== 0) {
		if (!Math.floor(Math.random() * 100)) {randomPresent(false)}
		image(buttons["back"], windowWidth - 75, 35)
		handleLives()
		handlePowerUps()
		handlePresents()
		comboHandler()
		handleMouseText()
	} else {
		menu = "gOver"
		handleGOverUI(`Charm: ${charm}`, "pink")
	}
}

function resetZen() {
	presentList = [...Object.keys(presents), "slowMo", "combo", "boost"]
	mode = "zen"
	menu = "game"
	presentArr = []
	charm = 0
	comboCounter = 0
	slowMo = 0
	boost = 0
	combo = 0
	presentValue = 100
	randomPresent(true)
}

function zenMode() {
	if (!Math.floor(Math.random() * 100)) {randomPresent(false)}
	rect(windowWidth - 75, 35, 130, 50)
	handlePowerUps()
	handlePresents()
	comboHandler()
	handleMouseText()
}

function resetChaos() {
	presentList = [...Object.keys(presents), "slowMo", "combo", "boost", "bomb"]
	mode = "chaos"
	menu = "game"
	presentArr = []
	charm = 0
	comboCounter = 0
	slowMo = 0
	boost = 0
	combo = 0
	presentValue = 100
	randomPresent(true)
}

function chaosMode() {
	if (!Math.floor(Math.random() * 100)) {randomPresent(true)}
	rect(windowWidth - 75, 35, 130, 50)
	handlePowerUps()
	handlePresents()
	comboHandler()
	handleMouseText()
}

function comboHandler() {
	if (currentTime <= comboUI[0]) {
		let comboText = ""
		let comboColor = []
		if (comboUI[1] >= 50) {
			comboText = ": IMPOSSIBLE COMBO!!!!!"
			comboColor = [255, 0, 0]
		} else if (comboUI[1] >= 25) {
			comboText = ": LEGENDARY COMBO!!!"
			comboColor = [168, 66, 50]
		} else if (comboUI[1] >= 10) {
			comboText = ": Insane Combo!"
			comboColor = [255, 77, 0]
		} else if (comboUI[1] >= 5) {
			comboText = ": Nice Combo!"
			comboColor = [245, 126, 7]
		} else {
			comboText = ": Combo!"
			comboColor = [245, 173, 5]
		}
		if (comboUI[1] >= 3) {
			mouseTimer = currentTime + 1000
			mouseText = comboUI[1] + comboText
			mouseColor = [...comboColor]
		}
	}
}

function comboCheck() {
	if (currentTime <= combo) {
		comboCounter++
		combo = Math.max(currentTime + 500, combo)
	} else {
		if (comboCounter >= 3) {
			sfx["break"].play()
			charm += comboCounter * 100
			specialText = `=> Combo: +${comboCounter*100} Charm`
			specialTimer = currentTime + 1500
		}
		comboUI = [currentTime + 1500, comboCounter]
		combo = currentTime + 500
		comboCounter = 1
	}
}

function startCombo() {
	specialText = "=> Combo Doughnut: +5 Combo"
	mouseText = "+5 Combo"
	mouseColor = [245, 161, 66]
	comboCounter += 5
	sfx["rage"].play()
	combo = currentTime + 5000
}

function startSlowMo() {
	specialText = "=> Slow Motion: 50% Speed"
	mouseText = "50% Speed"
	mouseColor = [66, 135, 245]
	sfx["ice"].play()
	slowMo = currentTime + 5000
}

function explosion() {
	if (mode === "survival") {
		lives--
		specialText = "=> Bomb Exploded: -1 Life"
		mouseText = "-1 Life"
	} else {
		charm -= 2500
		specialText = "=> Bomb Exploded: -2500 Charm"
		mouseText = "-2500 Charm"
	}
	mouseColor = [255, 0, 0]
	sfx["boom"].play()
}

function startBoost() {
	specialText = "=> Gained Melon: 2.5x Charm per Present"
	mouseText = "2.5x Charm"
	mouseColor = [133, 109, 16]
	sfx["squelch"].play()
	presentValue = 250
	boost = currentTime + 5000
}

function randomPresent(cycle) {
	let xPos = Math.floor(Math.random() * windowWidth)
	let yPos = windowHeight + 25
	let xVelo = Math.floor(Math.random() * 10) * (xPos < windowWidth/2 && -1 || 1)
	let yVelo = -veloArr.indexOf(choice(veloArr.filter(v => v < windowHeight && v > windowHeight*0.6)))
	let rot = Math.floor(Math.random() * 10) * choice([1, -1])
	let skin = choice(presentList) 
	presentArr.push(new Present(xPos, yPos, xVelo, yVelo, rot, skin, cycle))
}

function handlePresents() {
	for (let present of presentArr) {
		push()
		present.draw()
		pop()
	}
}

function trail(x, y, size) {
	trailArr.push(new Snowflake())
	for (let trail of trailArr) {
		push()
		trail.draw()
		pop()
	}
	trailArr = trailArr.filter(v => v.state !== 0)
}

function drawPowerUpBar(x, y, col1, col2, t, name) {
	push()
	rectMode(CORNER)
	fill(...col1)
	square(x, y, 60, 10)
	rect(x + 60, y + 15, 155, 30, 0, 5, 5, 0)
	fill(...col2)
	rect(x + 60, y + 20, 150 * Math.max(t-currentTime, 0)/5000, 20)
	image(powerUps[name], x + 30, y + 30)
	pop()
}

function handlePowerUps() {
	if (boost <= currentTime) {presentValue = 100}
	if (currentTime <= slowMo) {
		push()
		fill(3, 252, 248, 50)
		rect(windowWidth/2, windowHeight/2, windowWidth, windowHeight)
		pop()
	}
	drawPowerUpBar(25, 55, [3, 252, 248], [66, 135, 245], slowMo, "slowMo")
	drawPowerUpBar(25, 125, [152, 219, 44], [17, 143, 44], boost, "boost")
	drawPowerUpBar(25, 195, [217, 146, 85], [247, 116, 2], combo, "combo")

}

function handleMouseText() {
	if (specialTimer <= currentTime) {specialText = ""}
	push()
	textAlign(LEFT)
	stroke("pink")
	text(`Charm: ${charm} ${specialText}`, 25, 35)
	pop()
	if (currentTime <= mouseTimer) {
		push()
		stroke(...mouseColor)
		text(mouseText, mouseX, mouseY)
		pop()
	}
}

function handleGOverUI(txt, col) {
	push()
	textSize(50)
	strokeWeight(3)
	stroke(col)
	text(txt, windowWidth/2, windowHeight/2 - 75)
	pop()
	image(buttons["again"], windowWidth/2, windowHeight/2)
	image(buttons["menu"], windowWidth/2, windowHeight/2 + 75)
}

function keyPressed() {
	if (key === "l") {ldm = !ldm}
	else if (keyCode === ESCAPE && menu === "game") {initiateMenu()}
}

function mousePressed() {
	switch (menu) {
		case "main":
			if (mouseHalfBounds(-200, 200, -50, 50)) {sfx["boom"].play()}
			else if (mouseHalfBounds(-200, 200, 80, 140)) {initiateModes()}
			break;
		case "modes":
			if (mouseFullBounds(-140, -10, 10, 60)) {initiateMenu()}
			else if (mouseHalfBounds(-200, 200, -230, -170)) {resetZen()}
			else if (mouseHalfBounds(-200, 200, -130, -70)) {resetScore()}
			else if (mouseHalfBounds(-200, 200, -30, 30)) {resetTimed()}
			else if (mouseHalfBounds(-200, 200, 70, 130)) {resetSurvival()}
			else if (mouseHalfBounds(-200, 200, 170, 230)) {resetChaos()}
			break;
		case "game":
			if (mouseFullBounds(-140, -10, 10, 60)) {initiateMenu()}
			break;
		case "gOver":
			if (mouseHalfBounds(-125, 125, -25, 25)) {
				switch (mode) {
					case "timed": resetTimed(); break;
					case "score": resetScore(); break;
					case "survival": resetSurvival(); break;
					default: initiateMenu(); break;
				}
			} else if (mouseHalfBounds(-125, 125, 50, 100)) {initiateMenu()}
			break;
	}
}

function draw() {
	currentTime = new Date().getTime()
	createCanvas(windowWidth, windowHeight);
	drawBackground()
	textSize(25)

	switch (mode) {
		case "timed": timedMode(); break;
		case "zen" : zenMode(); break;
		case "chaos": chaosMode(); break;
		case "score": scoreMode(); break;
		case "survival": survivalMode(); break;
		case "main": mainMenu(); break;
		case "modes": modesMenu(); break;
	} trail(mouseX, mouseY, 20);
}
