// working Google APPs Script 7/15

const API_URL = 'https://api.openai.com/v1/audio/transcriptions';
const API_KEY = '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';
const FOLDER_ID = '1kweeXFwclO3dXF5yJATlhLtG1206Ijdf';

function watchFolder() {
  Logger.log('Starting watchFolder function...');
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    Logger.log(`Processing file: ${file.getName()}`);
    if (file.getMimeType() === 'video/mp4') {
      const transcriptionFileName = `${file.getName().replace('.mp4', '')}_transcription.json`;
      if (!transcriptionFileExists(folder, transcriptionFileName)) {
        Logger.log('File is an MP4 and transcription does not exist. Proceeding with transcription.');
        transcribeAudio(file, folder);
        // file.setTrashed(true);
      } else {
        Logger.log(`Transcription file ${transcriptionFileName} already exists. Skipping transcription.`);
      }
    } else {
      Logger.log('File is not an MP4. Skipping file.');
    }
  }
  Logger.log('Completed watchFolder function.');
}

function transcriptionFileExists(folder, transcriptionFileName) {
  const files = folder.getFilesByName(transcriptionFileName);
  return files.hasNext();
}

function transcribeAudio(file, folder) {
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
    const response = UrlFetchApp.fetch(API_URL, formData);
    const jsonResponse = response.getContentText();
    const responseFileName = `${file.getName().replace('.mp4', '')}_transcription.json`;
    const responseFile = folder.createFile(responseFileName, jsonResponse);
    
    Logger.log(`Transcription response saved to ${responseFile.getName()}`);
  } catch (error) {
    Logger.log(`Error transcribing audio: ${error.message}`);
  }
  Logger.log(`Completed transcribeAudio function for file: ${file.getName()}`);
}

function createTrigger() {
  Logger.log('Creating time-based trigger...');
  ScriptApp.newTrigger('watchFolder')
    .timeBased()
    .everyMinutes(1)
    .create();
  Logger.log('Trigger created successfully.');
}