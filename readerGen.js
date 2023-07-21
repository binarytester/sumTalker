const { config, createAudioFromText } = require("tiktok-tts");
require("dotenv").config();
const fs = require("fs");
const fsExtra = require("fs-extra");
const audioconcat = require("audioconcat");
const path = require("path");

// Set the session ID (private value)
const sessionID = process.env.SESSION;

// Verify if the file extension is valid (.txt)
const verifyFileExt = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return [".txt"].includes(ext);
};

// Generate an audio from the provided text
const generateAudio = async (word, filename, voice) => {
  config(sessionID);

  // Check if the audio file already exists
  if (fs.existsSync(filename + ".mp3")) {
    console.log("Audio already exists:", filename);
    return;
  }

  try {
    await createAudioFromText(word, filename, voice);
    console.log("Audio created:", filename);
  } catch (err) {
    console.error("Error generating audio:", err);
    throw err;
  }
};

// Verify if the file has the .txt extension
const verifyExt = (filepath) => {
  const fileExtension = path.extname(filepath).toLowerCase();
  return fileExtension === ".txt";
};

// Generate audios from a text file, splitting it into phrases using "/"
const generateAudios = async (filepath, voice = "br_005") => {
  try {
    const punctuations = /[.,!?]/g;

    let newText = fs.readFileSync(filepath, "utf-8").trim();

    // Remove extra spaces
    newText = newText.replace(/\s+/g, " ");

    // Replace punctuations with "/"
    newText = newText.replace(punctuations, "/").replace(/[()]/g, "");

    // Remove occurrences of two "//"
    newText = newText.replace(/\/\//g, "/");

    let totalAudio = 0;
    let audioText = "";

    // Generate audio as soon as it finds the "/" character
    for (let i = 0; i < newText.length; i++) {
      const char = newText[i];

      if (char === "/") {
        await generateAudio(
          audioText.trim(),
          `./audios/audio${totalAudio}`,
          voice
        );
        totalAudio++;
        audioText = "";
      } else {
        audioText += char;
      }
    }

    if (audioText) {
      await generateAudio(
        audioText.trim(),
        `./audios/audio${totalAudio}`,
        voice
      );
      totalAudio++;
    }
  } catch (err) {
    console.error(err);
  }
};

// Delete all audio files in the folder
const deleteAudios = async (pathFolder) => {
  fsExtra.emptyDirSync(pathFolder);
  console.log("Contents of the directory removed successfully");
};

// Concatenate the audios into a single file
const concatAudiosToOnlyOne = async (pathAudios, finalFile) => {
  try {
    if (!fs.existsSync(pathAudios)) {
      console.error(`Directory not found: ${pathAudios}`);
      return;
    }

    let data = await fs.promises.readdir(pathAudios);
    data = data.sort((a, b) => {
      a = parseInt(a.split(".")[0]);
      b = parseInt(b.split(".")[0]);
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });

    data = data.map((item) => {
      return `${pathAudios}/${item}`;
    });

    audioconcat(data)
      .concat(finalFile)
      .on("error", (err) => {
        console.error("Error concatenating audios:", err);
        throw err;
      })
      .on("end", function (output) {
        deleteAudios("./audios");
      });
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  generateAudios,
  concatAudiosToOnlyOne,
  verifyFileExt,
};
