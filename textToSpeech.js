const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: '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' 
});

// Path to the input text file
const inputFilePath = path.resolve("./input.txt");
// Path to save the speech file
const speechFilePath = path.resolve("./speech.mp3");

async function main() {
  try {
    // Read the input text from the file
    const inputText = await fs.promises.readFile(inputFilePath, 'utf8');
    
    // Split the input text into smaller chunks
    const chunks = splitTextIntoChunks(inputText, 1000); // Adjust chunk size as needed

    let audioBuffers = [];

    // Process each chunk sequentially
    for (const chunk of chunks) {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: chunk,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      audioBuffers.push(buffer);
    }

    // Concatenate all audio buffers into a single buffer
    const finalBuffer = Buffer.concat(audioBuffers);
    
    // Save the final buffer to the specified path
    await fs.promises.writeFile(speechFilePath, finalBuffer);
    
    console.log(`Speech file saved as ${speechFilePath}`);
  } catch (error) {
    console.error(`Error creating speech file: ${error.message}`);
  }
}

function splitTextIntoChunks(text, chunkSize) {
  const chunks = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    chunks.push(text.substring(currentIndex, currentIndex + chunkSize));
    currentIndex += chunkSize;
  }

  return chunks;
}

// Run the main function
main();
