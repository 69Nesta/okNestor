import { Server } from 'socket.io';
import { ChatGPTAPI } from 'chatgpt';
import fs from 'fs';
import axios from 'axios'
import * as path from 'path';
import sound from 'sound-play';
import 'dotenv/config'

const voiceID = 'TxGEqnHWrfWFTfGW9XjX';

async function getvoice(text, date) {
    let data = {
        "text": text,
        "model_id": "eleven_multilingual_v1",
        "voice_settings": {
            "stability": 0,
            "similarity_boost": 0,
            "style": 0.5,
            "use_speaker_boost": false
        }
    }

    let resp = await axios.post('https://api.elevenlabs.io/v1/text-to-speech/' + voiceID + '?optimize_streaming_latency=1', data, {
        responseType: 'stream',
        headers: {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": process.env.ELEVENLABS_API_KEY
        }
    }).catch(err => {
        console.log(err)
    })

    if (resp) resp.data.pipe(fs.createWriteStream(`./audio/${date}.mp3`));
}

const DEBUG = true;

const io = new Server({});
const systemMessage = `You are Nestor, a very capable voice assistant. You are enthusiastic and experience emotions. You do not hesitate to restart the user after one of his questions. You always answer in French unless you are asked something else. All your answers must be in an oral form, and should not be too long. all numbers you write in letters. The answer must not exceed 1000 characters. `

const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY
})
debug(`\n################## ✅ Ready ✅ ##################\n\n`)
io.emit('app:update', 'nestor')

io.on('connection', (socket) => {

    socket.on('asknestor', async (data) => {
        debug({ role: 'me', message: data })
        io.emit('app:update', 'brainstorming')
        const sentences = []

        let old_answer_stream;
        let already_say

        let res = await api.sendMessage(data, {
            systemMessage: `${systemMessage} Current date: ${new Date().toISOString()}\n\n`,
            onProgress: async (partialResponse) => {
                const phrase = partialResponse.text.replace(old_answer_stream, '')
                if (['.', '?', '!', '\\n'].includes(phrase.replaceAll(' ', '')) && partialResponse.text != already_say) {
                    const tmp_new_phrase = partialResponse.text.replace(already_say, '')
                    const new_phrase = tmp_new_phrase.split('')[0] === ' ' ? tmp_new_phrase.replace(' ', '') : tmp_new_phrase

                    debug({ role: 'nestor', message: new_phrase })

                    already_say = partialResponse.text

                    const sentenceid = Date.now()
                    await getvoice(new_phrase.replaceAll('\n', ''), sentenceid)
                    io.emit('app:update', 'speaking')
                    addFileQueue(sentenceid)
                }
                old_answer_stream = partialResponse.text
            }
        })
        debug('[Info]: Answer ended successfully!')
        debug('[Info]: Cache Clear!')
        debug('')

    });

});

io.listen(3000);

function debug(text) {
    if (DEBUG)
        console.log(text)
}

const filesQueues = []
let reading = false;

async function addFileQueue(fileId) {
    filesQueues.push(fileId)
    readFile()
}

async function readFile() {
    if (!reading && filesQueues.length != 0) {
        reading = true
        await sound.play(path.join(`./audio`, `${filesQueues[0]}.mp3`)).catch(err => {})
        fs.unlink(`./audio/${filesQueues[0]}.mp3`, (err => {}))
        await filesQueues.remove(filesQueues[0])
        reading = false

        // add delay here
        readFile()
    } else if (filesQueues.length === 0) {
        io.emit('app:update', 'nestor')
    }
}


Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};