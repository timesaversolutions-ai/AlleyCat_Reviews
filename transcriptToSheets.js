// const completions_API_URL = 'https://api.openai.com/v1/chat/completions';
// const API_KEY = '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';
// const FOLDER_ID = '1kweeXFwclO3dXF5yJATlhLtG1206Ijdf'; 
// const SPREADSHEET_ID = '1YYj8oqUT0dlJrXOC1PeYj06knozwTMD8ASO0EuZ58fs';

function writeToSheets(parsedContent) {
  Logger.log('Defining sheet');
  const sheetName = 'Sheet1'; // Replace with your desired sheet name

  try {
    // Fetch the existing data in the sheet to determine the next blank row
    Logger.log('Fetching existing data from Google Sheet...');
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
    const data = sheet.getDataRange().getValues();
    Logger.log(`Existing data fetched. Rows count: ${data.length}`);

    // Determine the next blank row
    const nextRow = data.length + 1; // Adjusted to add new data after existing rows
    Logger.log(`Next blank row determined: ${nextRow}`);

    // Parse the content and prepare the data
    Logger.log('Parsing content and preparing data for Google Sheet...');
    const parsedObject = JSON.parse(parsedContent);
    const values = [
      [
        parsedObject.Court,
        parsedObject.City,
        parsedObject.State,
        parsedObject["Permanent Lines"], 
        parsedObject["Permanent Nets"], 
        parsedObject["Paddle Rack"], 
        parsedObject["Number of Courts"], 
        parsedObject["Ability or Skill Based Courts"], 
        parsedObject["Luxury Enhancements"], 
        parsedObject["Additional Comments"]
      ]
    ];

    // Write new data to the sheet
    Logger.log('Updating Google Sheet with parsed data...');
    sheet.getRange(nextRow, 1, values.length, values[0].length).setValues(values);

    Logger.log(`Data successfully written to Google Sheet.`);
  } catch (error) {
    Logger.log(`Error in writeToSheets function: ${error}`);
  }
}

function watchFolder() {
  Logger.log('Starting watchFolder function...');
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    Logger.log(`Processing file: ${file.getName()}`);
    if (file.getName().endsWith('_transcription.json')) {
      const parsedFileName = `${file.getName().replace('_transcription.json', '')}_parsedTranscription.json`;
      if (!parsedTranscriptionExists(folder, parsedFileName)) {
        Logger.log(`Transcription file ${file.getName()} does not have a parsed transcription. Proceeding with parsing.`);
        parse(file, folder);
      } else {
        Logger.log(`Parsed transcription file ${parsedFileName} already exists. Skipping parsing.`);
      }
    } else {
      Logger.log('File does not end with _transcription.json. Skipping file.');
    }
  }
  Logger.log('Completed watchFolder function.');
}

function parsedTranscriptionExists(folder, parsedFileName) {
  Logger.log(`Checking if parsed transcription file ${parsedFileName} exists...`);
  const files = folder.getFilesByName(parsedFileName);
  const exists = files.hasNext();
  Logger.log(`Parsed transcription file ${parsedFileName} exists: ${exists}`);
  return exists;
}

function parse(file, folder) {
  try {
    Logger.log(`Starting parse function for file: ${file.getName()}`);
    const transcriptionData = file.getBlob().getDataAsString();
    Logger.log(`Transcription data: ${transcriptionData}`);
    
    const transcriptionText = JSON.parse(transcriptionData).text;
    Logger.log(`Transcription text: ${transcriptionText}`);

    const prompt = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an assistant which takes a transcripted message and outputs the relevant information in key value pairs as a json file to be uploaded to a google sheet. Here are the data points to parse for: Court, City, State, Permanent Lines, Permanent Nets, Paddle Rack, Number of Courts, Ability or Skill Based Courts, Luxury Enhancements, Additional Comments."
        },
        {
          role: "user",
          content: `Can you help me enter this transcripted message as json data? Message: ${transcriptionText}.`
        }
      ]
    };

    Logger.log(`Sending prompt to OpenAI API: ${JSON.stringify(prompt)}`);
    const formData = {
      method: 'post',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(prompt),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(completions_API_URL, formData);
    const completion = JSON.parse(response.getContentText());
    const parsedContent = completion.choices[0].message.content;
    Logger.log(`parsed content - ${parsedContent}`);
    Logger.log(`API response: ${JSON.stringify(completion)}`);

    const outputFileName = `${file.getName().replace('_transcription.json', '')}_parsedTranscription.json`;
    folder.createFile(outputFileName, parsedContent, MimeType.PLAIN_TEXT);

    Logger.log(`Parsed transcription saved as ${outputFileName}.`);
    // Trigger writing to Sheets -- fix this: not running
    Logger.log('Calling writeToSheets function...');
    writeToSheets(parsedContent);
    Logger.log('writeToSheets function called successfully.');

  } catch (error) {
    Logger.log(`Error in parse function: ${error}`);
  }
}