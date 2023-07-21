# SumTalker
## How it Works
The API receives a ```.txt file``` with the summary text. It converts the text to audio using the TikTok text-to-speech engine and returns an mp3 file with the full audio version of the summary.

## Usage
- Clone this repository
- Configure ```SESSION``` environment variable (file .env) with your [TikTok TTS](https://www.npmjs.com/package/tiktok-tts) session ID
- Create an ```audios``` folder to store generated audios
- Start the server with ```npm start``` (it will run on port 3000 by default)
- Place ```.txt``` file with summary in root folder
- Make POST request to ```http://localhost:3000/audiobook``` with txt **file name** and desired **voice** in body (if no voice is specified, it will use Portuguese by default)
- Listen to generated audio!

## Endpoints
```POST /audiobook```
- Receives the txt file path and desired voice in the request body.
- Returns mp3 audio with the spoken summary.
  ### Request example
  ```
   {
    "file": "my-summary.txt",
    "voice": "en_001"
   }
  ```
  ### Voices
  The project uses TikTok TTS voices to generate the audios. There are various voices available, each with different characteristics. Voices are identified by a code like ```en_001```, ```en_003```. The full list of available voices can be found in the TikTok TTS documentation (if no voice is specified, it will use Portuguese by default).

## Technologies
- Node.js
- Express
- audioconcat
- [TikTok TTS](https://www.npmjs.com/package/tiktok-tts)
