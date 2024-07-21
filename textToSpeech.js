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
    
    // Create the speech file using the OpenAI API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: inputText,
    });

    console.log(speechFilePath);

    // Convert the response to a Buffer and save it to the specified path
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFilePath, buffer);
    
    console.log(`Speech file saved as ${speechFilePath}`);
  } catch (error) {
    console.error(`Error creating speech file: ${error.message}`);
  }
}

// Run the main function
main();
