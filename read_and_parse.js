const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI({
  apiKey: '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', // Replace with your actual API key
});

function readFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw err;
  }
}

function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log('File written successfully.');
  } catch (err) {
    throw err;
  }
}

async function main() {
  try {
    const transcriptionFile = 'response.json'; // Input file
    const outputFile = 'excel_data.json'; // Output file

    // Read the transcription file
    const transcriptionData = readFile(transcriptionFile);
    const transcriptionText = transcriptionData.text;

    // Create the prompt
    const prompt = {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an assistant which takes a transcripted message and outputs the relevant information in key value pairs as a json file to be uploaded to a google sheet. Here are the data points to parse for: State, City, Court, Permanent Lines, Permanent Nets, Paddle Rack, Number of Courts, Ability or Skill Based Courts, Luxury Enhancements, Additional Comments."
        },
        {
          role: "user",
          content: `Can you help me enter this transcripted message as data for my excel sheet? Message: ${transcriptionText}`
        }
      ]
    };

    // Send the prompt to the OpenAI API
    const completion = await openai.chat.completions.create(prompt);

    // Write the response to the output file
    writeFile(outputFile, completion.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
