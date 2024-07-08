const fs = require('fs');
const retryLimit = 5; // Maximum number of retries
const retryInterval = 1000; // Interval between retries in milliseconds

// Function to read the transcription file with retry logic
function readFileWithRetry(filePath, retries = 0) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'EBUSY' && retries < retryLimit) {
      console.log(`File is busy, retrying in ${retryInterval / 1000} seconds...`);
      setTimeout(() => readFileWithRetry(filePath, retries + 1), retryInterval);
    } else {
      throw err;
    }
  }
}

// Function to write the prompt to a file with retry logic
function writeFileWithRetry(filePath, content, retries = 0) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log('File written successfully.');
  } catch (err) {
    if (err.code === 'EBUSY' && retries < retryLimit) {
      console.log(`File is busy, retrying in ${retryInterval / 1000} seconds...`);
      setTimeout(() => writeFileWithRetry(filePath, content, retries + 1), retryInterval);
    } else {
      throw err;
    }
  }
}

// Read the transcription file
const transcriptionFile = process.argv[2];
const transcriptionData = readFileWithRetry(transcriptionFile);
const transcriptionText = transcriptionData.text;

// Create the prompt
const prompt = {
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: "You are an assistant which takes a transcripted message and outputs the relevant information in key value pairs as a json file to be uploaded to a google sheet. here are the data points to parse for: State, City, Court, Permanent Lines, Permanent Nets, Paddle Rack, Number of Courts, Ability or Skill Based Courts, Luxury Enhancements, Additional Comments."
    },
    {
      role: "user",
      content: `Can you help me enter this transcripted message as data for my excel sheet? Message: ${transcriptionText}`
    }
  ]
};

// Write the prompt to a file with retry log
