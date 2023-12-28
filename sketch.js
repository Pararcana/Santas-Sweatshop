let currentTime = new Date().getTime()
let trailArr = [];
let presentArr = [];
let ldm = false
let mode = 1

let slowMo = 0
let boost = 0
let combo = 0
let comboUI = [0]
let comboCounter = 0
let presentValue = 100

let specialText = ""
let specialTimer = 0
let mouseText = ""
let mouseTimer = 0
let mouseColor = [0, 0, 0]

let charm = 0
let honour = 0
let presentId = 0
let veloArr = [0]
for (let i = 0; i < 1000; i++) {
	veloArr.push(veloArr[veloArr.length - 1] + 1.25 * veloArr.length + Math.floor(i / 3) * 0.25)
}

function choice(arr) {
	let index = Math.floor(Math.random() * arr.length);
	return arr[index];
}

function startSlowMo() {
	specialText = "=> Slow Motion: 50% Speed"
	mouseText = "50% Speed"
	mouseColor = [66, 135, 245]
	sfx["ice"].play()
	slowMo = currentTime + 5000
}

function startCombo() {
	specialText = "=> Combo Doughnut: +5 Combo"
	mouseText = "+5 Combo"
	mouseColor = [245, 161, 66]
	comboCounter += 5
	sfx["rage"].play()
	combo = currentTime + 5000
}

function addTime() {
	specialText = "=> More Time: +5 seconds"
	mouseText = "+5 Seconds"
	mouseColor = [200, 200, 200]
	sfx["time"].play()
}

function explosion() {
	specialText = "=> Bomb Exploded: -1000 Charm"
	mouseText = "-1000 Charm"
	mouseColor = [255, 0, 0]
	sfx["boom"].play()
	charm -= 1000
}

function startBoost() {
	specialText = "=> Gained Melon: 2.5x Charm per Present"
	mouseText = "2.5x Charm"
	mouseColor = [133, 109, 16]
	sfx["squelch"].play()
	presentValue = 250
	boost = currentTime + 5000
}

let yVelo = -50

function randomPresent() {
	let xPos = Math.floor(Math.random() * windowWidth)
	let yPos = windowHeight + 25
	let xVelo = Math.floor(Math.random() * 10) * (xPos < windowWidth/2 && -1 || 1)
	let yVelo = -veloArr.indexOf(choice(veloArr.filter(v => v < windowHeight && v > windowHeight*0.6)))
	let rot = Math.floor(Math.random() * 10) * choice([1, -1])
	let skin = choice([...Object.keys(presents), ...Object.keys(powerUps)]) 
	presentArr.push(new Present(xPos, yPos, xVelo, yVelo, rot, skin))
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

function drawPowerUpBar(x, y, col1, col2, t) {
	push()
	rectMode(CORNER)
	fill(...col1)
	square(x, y, 50, 10)
	rect(x + 50, y + 10, 155, 30, 0, 5, 5, 0)
	fill(...col2)
	rect(x + 50, y + 15, 150 * Math.max(t-currentTime, 0)/5000, 20)
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
	drawPowerUpBar(25, 55, [3, 252, 248], [66, 135, 245], slowMo)
	drawPowerUpBar(25, 125, [152, 219, 44], [17, 143, 44], boost)
	drawPowerUpBar(25, 195, [217, 146, 85], [247, 116, 2], combo)

}

function handleMouseText() {
	if (currentTime <= mouseTimer) {
		push()
		stroke(...mouseColor)
		text(mouseText, mouseX, mouseY)
		pop()
	}
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
	constructor(x, y, velocityX, velocityY, rotSpeed, skin) {
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
			randomPresent()
		}
	}
}

function keyPressed() {
	switch (key) {
		case "l": ldm = !ldm; break;
	}
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
	randomPresent()
	trailArr.push(new Snowflake())
	background(100);
	textFont('Courier New')
	angleMode(DEGREES)
	rectMode(CENTER)
	imageMode(CENTER)
	textAlign(CENTER)
	// songs["xmas"].loop()
}

function draw() {
	currentTime = new Date().getTime()
	createCanvas(windowWidth, windowHeight);
	textSize(25)
	if (specialTimer <= currentTime) {specialText = ""}
	push()
	textAlign(LEFT)
	stroke("pink")
	text(`Charm: ${charm} ${specialText}`, 25, 35)
	pop()

	for (let present of presentArr) {
		push()
		present.draw()
		pop()
	}
	
	trail(mouseX, mouseY, 20);

	comboHandler()
	handleMouseText()
	handlePowerUps()
}
