const { app, Menu, Tray } = require('electron');
const path = require('path');

const { io } = require("socket.io-client");
const socket = io('ws://localhost:3000');

const nestorIcon = path.join(__dirname, 'assets', 'nestor.png');
const brainstormingIcon = path.join(__dirname, 'assets', 'brainstorming', 'gif-0.png');
const speakingIcon = path.join(__dirname, 'assets', 'speaking', '0.png');

app.on('ready', () => {
	const tray = new Tray();

	socket.on('connect', () => {
		socket.emit('room:app', {})
	})
	socket.on('app:update', (data) => {
		switch (data) {
			case 'nestor':
				setNestor
				break
			case 'speaking':
				setSpeaking(tray)
				break
			case 'brainstorming':
				setBrainstorming(tray)
				break
		}
	})
})

function setNestor(tray) {
	tray.setImage(nestorIcon)
}

function setSpeaking(tray) {
	tray.setImage(speakingIcon)
}

function setBrainstorming(tray) {
	tray.setImage(brainstormingIcon)
}