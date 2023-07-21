const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const reader = require("./readerGen");
const path = require("path");

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3000;

// Route to generate and download the audiobook
app.post("/audiobook", async (req, res) => {
  try {
    // Get the file path and selected voice from the request body
    const pathFile = req.body.path;
    const selectedVoice = req.body.voice;

    // Define the path to store temporary audio files
    const pathFolder = "./audios";
    const audiobook = "audiobook.mp3";

    // Check if the provided file has a valid extension (.txt)
    if (!reader.verifyFileExt(pathFile)) {
      return res.status(415).send("Invalid file extension");
    }

    // Generate individual audio files for each segment of text in the file
    await reader.generateAudios(pathFile, selectedVoice);

    // Concatenate the individual audio files into a single audiobook file
    await reader.concatAudiosToOnlyOne(pathFolder, audiobook);

    // Download the audiobook file
    res.download(path.join("./", audiobook), (err) => {
      if (err) {
        res.status(500).send("Error downloading the audiobook");
      } else {
        res.status(200).end();
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
