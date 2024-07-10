const fs = require('fs');
const { google } = require('googleapis');

// Load client secrets from a local file
const CREDENTIALS_PATH = 'D:\TimeSaver Solutions\CS work\TSS\AlleyCat_Reviews\credentials.json'; // Replace with the path to your credentials file
const TOKEN_PATH = 'token.json';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function authorize() {
  const content = fs.readFileSync(CREDENTIALS_PATH);
  const { client_secret, client_id, redirect_uris } = JSON.parse(content).installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
  } else {
    return getNewToken(oAuth2Client);
  }
  return oAuth2Client;
}

function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      console.log('Token stored to', TOKEN_PATH);
    });
  });
  return oAuth2Client;
}

async function writeToSheets(auth, data) {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = 'your-spreadsheet-id'; // Replace with your Google Sheet ID
  const range = 'Sheet1!A1'; // Replace with your desired sheet name and range

  const values = [
    ["State", "City", "Court", "Permanent Lines", "Permanent Nets", "Paddle Rack", "Number of Courts", "Ability or Skill Based Courts", "Luxury Enhancements", "Additional Comments"], // Headers
    ...data // Data from JSON
  ];

  const resource = {
    values,
  };
  const result = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    resource,
  });
  console.log(`${result.data.updatedCells} cells updated.`);
}

async function main() {
  const auth = await authorize();

  const dataPath = 'excel_data.json'; // Replace with your JSON file path
  const jsonData = fs.readFileSync(dataPath);
  const parsedData = JSON.parse(jsonData);

  // Transform data if necessary to fit into Google Sheets format
  const sheetData = parsedData.map(item => [
    item.State, item.City, item.Court, item.PermanentLines, item.PermanentNets, item.PaddleRack, item.NumberOfCourts, item.AbilityOrSkillBasedCourts, item.LuxuryEnhancements, item.AdditionalComments
  ]);

  await writeToSheets(auth, sheetData);
}

main().catch(console.error);
