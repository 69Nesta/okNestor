
# Ok Nestor

Ok nestor, the voice assistant of the future.

## Authors

- [@69Nesta](https://www.github.com/69Nesta)
- [@Liammmmmmmm](https://www.github.com/Liammmmmmmm)

## Installation

In order to install ok Nestor, rename .env.example to .env and fill it with your api keys   

- [ElevenLabs](https://beta.elevenlabs.io)
- [OpenAI](https://platform.openai.com/account/api-keys)

```env
ELEVENLABS_API_KEY = "xxx"
OPENAI_API_KEY = "xxx"
```
then run in to differents terminals
```bash
cd nestorEars
npm install || pnpm install
npm start
```
```bash
cd nestorHead
npm install || pnpm install
npm start
```
    
## Change language

Ok nestor currently only understands french. If you want to change the model for the language detection, [download the model for the language you want](https://alphacephei.com/vosk/models) and extract it in nestorEars replacing the `model` folder. 
Then, remove `"You always answer in French unless you are asked something else."` in the const `systemMessage` in `nestorHead/index.js`

## Usage

There is talk detection with `nestorEars`, in order to detect "Ok Nestor". Then the sentence you say is sent to chatgpt then to ElevenLabs to then be said out loud

## Contributing

Contributions are always welcome!

## License

[MIT](./LICENSE.txt)

