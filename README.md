# SumTalker
## How it Works
The API receives a .txt file containing the summary text. It splits the text into smaller sentences and generates a separate audio file for each sentence using the TikTok text-to-speech engine.

Finally, all generated audio files are concatenated into a single mp3 file, returning the full audio version of the summary.

## Endpoints
```POST /audioresume```
- Receives the txt file path and desired voice in the request body.
- Returns mp3 audio with the spoken summary.

## Usage
- Clone this repository
- Configure ```SESSION``` environment variable (file .env) with your [TikTok TTS](https://www.npmjs.com/package/tiktok-tts) session ID
- Create an audios folder to store generated audios
- Place ```.txt``` file with summary in root folder
- Make POST request to ```/audiobook``` with txt **file name** and desired **voice** in body
- Listen to generated audio!

## Example
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
