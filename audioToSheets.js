const API_KEY = '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';
const TRANSCRIPTIONS_API_URL = 'https://api.openai.com/v1/audio/transcriptions';
const COMPLETIONS_API_URL = 'https://api.openai.com/v1/chat/completions';
const FOLDER_ID = '1kweeXFwclO3dXF5yJATlhLtG1206Ijdf';
const SPREADSHEET_ID = '1YYj8oqUT0dlJrXOC1PeYj06knozwTMD8ASO0EuZ58fs';
const SHEET_NAME = 'Sheet1';
// langchain key: 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

function watchFolder() {
  Logger.log('Starting watchFolder function...');
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType() === 'video/mp4') {
      Logger.log(`Processing audio file: ${file.getName()}`);
      processAudioFile(file, folder);
    } else if (file.getName().endsWith('_transcription.json')) {
      Logger.log(`Processing transcription file: ${file.getName()}`);
      processTranscriptionFile(file, folder);
    } else {
      Logger.log(`Skipping file: ${file.getName()}`);
    }
  }
  Logger.log('Completed watchFolder function.');
}

function processAudioFile(file, folder) {
  Logger.log(`Checking if transcription exists for file: ${file.getName()}`);
  const transcriptionFileName = `${file.getName().replace('.mp4', '')}_transcription.json`;
  if (!transcriptionFileExists(folder, transcriptionFileName)) {
    Logger.log(`Transcription does not exist for file: ${file.getName()}. Proceeding with transcription.`);
    transcribeAudio(file, folder, transcriptionFileName);
  } else {
    Logger.log(`Transcription already exists for file: ${file.getName()}. Skipping transcription.`);
  }
}

function transcriptionFileExists(folder, transcriptionFileName) {
  const files = folder.getFilesByName(transcriptionFileName);
  return files.hasNext();
}

function transcribeAudio(file, folder, transcriptionFileName) {
  Logger.log(`Starting transcribeAudio function for file: ${file.getName()}`);
  const fileBlob = file.getBlob();
  const formData = {
    'method': 'post',
    'headers': {
      'Authorization': `Bearer ${API_KEY}`
    },
    'payload': {
      'model': 'whisper-1',
      'file': fileBlob
    }
  };

  try {
    const response = UrlFetchApp.fetch(TRANSCRIPTIONS_API_URL, formData);
    const jsonResponse = response.getContentText();
    folder.createFile(transcriptionFileName, jsonResponse);
    Logger.log(`Transcription saved as ${transcriptionFileName} for file: ${file.getName()}`);
    processTranscriptionFile(DriveApp.getFilesByName(transcriptionFileName).next(), folder);
  } catch (error) {
    Logger.log(`Error transcribing audio for file: ${file.getName()} - ${error.message}`);
  }
}

function processTranscriptionFile(file, folder) {
  Logger.log(`Checking if parsed transcription exists for file: ${file.getName()}`);
  const parsedFileName = `${file.getName().replace('_transcription.json', '')}_parsedTranscription.json`;
  if (!parsedTranscriptionExists(folder, parsedFileName)) {
    Logger.log(`Parsed transcription does not exist for file: ${file.getName()}. Proceeding with parsing.`);
    parseTranscription(file, folder, parsedFileName);
  } else {
    Logger.log(`Parsed transcription already exists for file: ${file.getName()}. Skipping parsing.`);
  }
}

function parsedTranscriptionExists(folder, parsedFileName) {
  const files = folder.getFilesByName(parsedFileName);
  return files.hasNext();
}

function parseTranscription(file, folder, parsedFileName) {
  try {
    Logger.log(`Starting parseTranscription function for file: ${file.getName()}`);
    const transcriptionData = file.getBlob().getDataAsString();
    Logger.log(`Transcription data: ${transcriptionData}`);
    const transcriptionText = JSON.parse(transcriptionData).text;

    const prompt = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an assistant which takes a transcripted message and outputs the relevant information in key value pairs as a json file to be uploaded to a google sheet. Here are the data points to parse for: State, City, Court, Permanent Lines, Permanent Nets, Paddle Rack, Number of Courts, Ability or Skill Based Courts, Luxury Enhancements, Additional Comments."
        },
        {
          role: "user",
          content: `Can you help me enter this transcripted message as json data? Message: ${transcriptionText}.`
        }
      ]
    };

    Logger.log(`Sending prompt to OpenAI API for file: ${file.getName()}`);
    const formData = {
      method: 'post',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(prompt),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(COMPLETIONS_API_URL, formData);
    const completion = JSON.parse(response.getContentText());
    const parsedContent = completion.choices[0].message.content;
    Logger.log(`Parsed content received: ${parsedContent}`);

    folder.createFile(parsedFileName, parsedContent, MimeType.PLAIN_TEXT);
    Logger.log(`Parsed transcription saved as ${parsedFileName} for file: ${file.getName()}`);

    Logger.log(`Writing parsed content to Google Sheets for file: ${file.getName()}`);
    writeToSheets(parsedContent);
  } catch (error) {
    Logger.log(`Error in parseTranscription function for file: ${file.getName()} - ${error.message}`);
  }
}

function writeToSheets(parsedContent) {
  try {
    Logger.log('Starting writeToSheets function...');
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const nextRow = data.length + 1;

    const parsedObject = JSON.parse(parsedContent);
    const values = [
      [
        parsedObject.State,
        parsedObject.City,
        parsedObject.Court,
        parsedObject["Permanent Lines"],
        parsedObject["Permanent Nets"],
        parsedObject["Paddle Rack"],
        parsedObject["Number of Courts"],
        parsedObject["Ability or Skill Based Courts"],
        parsedObject["Luxury Enhancements"],
        parsedObject["Additional Comments"]
      ]
    ];

    sheet.getRange(nextRow, 1, values.length, values[0].length).setValues(values);
    Logger.log('Data successfully written to Google Sheets.');
  } catch (error) {
    Logger.log(`Error in writeToSheets function: ${error.message}`);
  }
}
