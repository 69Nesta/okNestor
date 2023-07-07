const { app, Tray } = require('electron')
const path = require('path')

const { io } = require("socket.io-client")
const socket = io('ws://localhost:3000')

const DEBUG = false

const nestorIcon = path.join(__dirname, 'assets', 'nestor.png')
const brainstormingIcon = path.join(__dirname, 'assets', 'brainstorming', '0.png')
const speakingIcon = path.join(__dirname, 'assets', 'speaking', '0.png')

const brainstormListAnim = ['0.png', '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png', '11.png', '12.png', '13.png', '14.png', '15.png', '16.png', '17.png', '18.png', '19.png', '20.png', '21.png', '22.png', '23.png']
const speakListAnim = ['0.png', '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png', '11.png', '12.png', '13.png', '14.png', '15.png', '16.png', '17.png', '18.png', '19.png', '20.png', '21.png']

let currentAnim = { anim: null, frame: 0 }

let tray
app.on('ready', () => {
	tray = new Tray(nestorIcon)

	socket.on('app:update', (data) => {
		switch (data) {
			case 'brainstorming':
				setBrainstorming()
				break
			case 'speaking':
				setSpeaking()
				break
			default:
				setDefault()
				break
		}
	})
})

function setDefault() {
	tray.setImage(nestorIcon)
	currentAnim = { anim: null, frame: 0 }
}

function setBrainstorming() {
	tray.setImage(brainstormingIcon)
	currentAnim = { anim: 'brainstorming', frame: 0 }
	setFrame()
}

function setSpeaking() {
	tray.setImage(speakingIcon)
	currentAnim = { anim: 'speaking', frame: 0 }
	setFrame()
}

function setFrame() {
	if (currentAnim.anim === null) return

	tray.setImage(path.join(
		__dirname,
		'assets',
		currentAnim.anim,
		currentAnim.anim === 'brainstorming' ? brainstormListAnim[currentAnim.frame] : speakListAnim[currentAnim.frame]
	))

	if (currentAnim.frame + 1 < (currentAnim.anim === 'brainstorming' ? brainstormListAnim.length : speakListAnim.length))
		currentAnim.frame++
	else
		currentAnim = { anim: currentAnim.anim, frame: 0 }
	setTimeout(() => {
		setFrame()
	}, 50);
}

function debug(message) {
	if (DEBUG) console.log(message)
}