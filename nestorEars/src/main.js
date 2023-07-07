const vosk = require('../vosk')
const fs = require("fs");
const mic = require("mic");

const { io } = require("socket.io-client");
const socket = io('ws://localhost:3000');




// const { ChatGPTAPI } = require('chatgpt');


MODEL_PATH = "model"
SAMPLE_RATE = 16000

// OPENAI_API_KEY = "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"
// OPENAI_ORGANIZATION_KEY = "org-B7ncN1GMv0mSctnstRLwiTp3"

// const configuration = new Configuration({
//     organization: OPENAI_ORGANIZATION_KEY,
//     apiKey: OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

let debug = false;

const BOT_NAME = 'Nestor';
const BOT_CALL = 'ok nestor';

async function start() {

    // const api = new ChatGPTAPI({
    //     apiKey: OPENAI_API_KEY
    // })


    if (!fs.existsSync(MODEL_PATH)) {
        console.log("Modèle non téléchargé")
        process.exit()
    }

    vosk.setLogLevel(0);
    const model = new vosk.Model(MODEL_PATH);
    const rec = new vosk.Recognizer({ model: model, sampleRate: SAMPLE_RATE });

    const micInstance = mic({
        rate: String(SAMPLE_RATE),
        channels: '1',
        debug: false,
        device: 'default',
    });

    const micInputStream = micInstance.getAudioStream();

    micInputStream.on('data', async data => {
        if (debug) {
            if (rec.acceptWaveform(data))
                console.log(rec.result());
            else
                console.log(rec.partialResult());
        } else {
            if (rec.acceptWaveform(data)) {
                let result = rec.result()
                if (result.text.includes("ok nestor")) {
                    console.log({user: 'me', text: result.text})
                    
                    let splitted = result.text.split('ok nestor ')
                    let text = splitted[1]

                    socket.emit("asknestor", text);


<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 172 172" style=" fill:#26e07f;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#1fb141"><path d="M21.5,21.5v129h64.5v-32.25v-64.5v-32.25zM86,53.75c0,17.7805 14.4695,32.25 32.25,32.25c17.7805,0 32.25,-14.4695 32.25,-32.25c0,-17.7805 -14.4695,-32.25 -32.25,-32.25c-17.7805,0 -32.25,14.4695 -32.25,32.25zM118.25,86c-17.7805,0 -32.25,14.4695 -32.25,32.25c0,17.7805 14.4695,32.25 32.25,32.25c17.7805,0 32.25,-14.4695 32.25,-32.25c0,-17.7805 -14.4695,-32.25 -32.25,-32.25z"></path></g></g></svg>


                }
            }
        }
    });






    micInputStream.on('audioProcessExitComplete', function () {
        // console.log("Cleaning up");
        // console.log(rec.finalResult());
        rec.free();
        model.free();
    });

    process.on('SIGINT', function () {
        // console.log("\nStopping");
        micInstance.stop();
        process.exit()
    });

    micInstance.start();
}

start()