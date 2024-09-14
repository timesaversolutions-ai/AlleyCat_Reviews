import { gdrive_API_KEY } from '@env';
import { API_KEY_OPENAI } from '@env';
import axios from 'axios';
import FormData from 'form-data';
import { getAccessToken } from './googleAuth';

const TRANSCRIPTIONS_API_URL = 'https://api.openai.com/v1/audio/transcriptions';
const COMPLETIONS_API_URL = 'https://api.openai.com/v1/chat/completions';
const FOLDER_ID = '1kweeXFwclO3dXF5yJATlhLtG1206Ijdf';
const SPREADSHEET_ID = '1YYj8oqUT0dlJrXOC1PeYj06knozwTMD8ASO0EuZ58fs';
const SHEET_NAME = 'Sheet1';

export async function watchFolder() {
    console.log('Starting watchFolder function...');
    try {
        const response = await axios.get(
            `https://www.googleapis.com/drive/v3/files`,
            {
                params: {
                    q: `'${FOLDER_ID}' in parents`,
                    fields: 'files(id, name, mimeType)',
                    key: gdrive_API_KEY,
                },
            }
        );

        const files = response.data.files;

        for (const file of files) {
            if (file.mimeType.includes('audio/') || file.mimeType.includes('video/')) {
                console.log(`Processing audio file: ${file.name}`);
                await processAudioFile(file.id, file.name);
            } else if (file.name.endsWith('_transcription.json')) {
                console.log(`Processing transcription file: ${file.name}`);
                await processTranscriptionFile(file.id, file.name);
            } else {
                console.log(`Skipping file: ${file.name}`);
            }
        }
      
        console.log('Completed watchFolder function.');
    } catch (error) {
        console.error('Error in watchFolder:', error.response ? error.response.data : error.message);
    }
}

async function processAudioFile(fileId, fileName) {
    console.log(`Checking if transcription exists for file: ${fileName}`);
    const transcriptionFileName = `${fileName}_transcription.json`;
    console.log(`Transcription file name: ${transcriptionFileName}`);
    if (!await transcriptionFileExists(transcriptionFileName)) {
        console.log(`Transcription does not exist for file: ${fileName}. Proceeding with transcription.`);
        await transcribeAudio(fileId, fileName, transcriptionFileName);
    } else {
        console.log(`Transcription already exists for file: ${fileName}. Skipping transcription.`);
    }
}

async function processTranscriptionFile(fileId, fileName) {
    console.log(`Checking if parsed transcription exists for file: ${fileName}`);
    const parsedFileName = fileName.replace('_transcription.json', '_parsedTranscription.json');
    
    if (!await parsedTranscriptionExists(parsedFileName)) {
        console.log(`Parsed transcription does not exist for file: ${fileName}. Proceeding with parsing.`);
        await parseTranscription(fileId, fileName, parsedFileName);
    } else {
        console.log(`Parsed transcription already exists for file: ${fileName}. Skipping parsing.`);
    }
}

async function parsedTranscriptionExists(fileName) {
    try {
        const response = await axios.get(
            'https://www.googleapis.com/drive/v3/files',
            {
                params: {
                    q: `'${FOLDER_ID}' in parents and name = '${fileName}'`,
                    fields: 'files(id, name)',
                    key: gdrive_API_KEY,
                },
            }
        );
        return response.data.files.length > 0;
    } catch (error) {
        console.error('Error checking parsed transcription file:', error.response ? error.response.data : error.message);
        return false;
    }
}

async function transcriptionFileExists(fileName) {
    try {
        const response = await axios.get(
            'https://www.googleapis.com/drive/v3/files',
            {
                params: {
                    q: `'${FOLDER_ID}' in parents and name = '${fileName}' and name contains 'transcription'`,
                    fields: 'files(id, name)',
                    key: gdrive_API_KEY,
                },
            }
        );
        return response.data.files.length > 0;
    } catch (error) {
        console.error('Error checking parsed transcription file:', error.response ? error.response.data : error.message);
        return false;
    }
}

async function transcribeAudio(fileId, fileName, transcriptionFileName) {
    console.log(`Starting transcription for file: ${fileName}`);
    try {
        // Download the audio file from Google Drive
        console.log(`Downloading file: ${fileName}`);
        const audioResponse = await axios.get(
            `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
            {
                responseType: 'arraybuffer',
                headers: {
                    'Authorization': `Bearer ${gdrive_API_KEY}`,
                },
            }
        );
        console.log(`File downloaded successfully: ${fileName}`);

        // Prepare form data for OpenAI API
        const formData = new FormData();
        formData.append('file', new Blob([audioResponse.data], { type: 'audio/mpeg' }), fileName);
        formData.append('model', 'whisper-1');

        // Send the audio to OpenAI for transcription
        console.log(`Sending file to OpenAI for transcription: ${fileName}`);
        const transcriptionResponse = await axios.post(TRANSCRIPTIONS_API_URL, formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Bearer ${API_KEY_OPENAI}`,
            },
        });
        console.log(`Transcription received from OpenAI for file: ${fileName}`);

        const transcriptionText = transcriptionResponse.data.text;

        // Save the transcription back to Google Drive
        console.log(`Saving transcription to Google Drive: ${transcriptionFileName}`);
        await axios.post(
            'https://www.googleapis.com/upload/drive/v3/files',
            JSON.stringify({ transcription: transcriptionText }),
            {
                params: {
                    uploadType: 'media',
                    name: transcriptionFileName,
                    parents: [FOLDER_ID],
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${gdrive_API_KEY}`,
                },
            }
        );

        console.log(`Transcription saved as ${transcriptionFileName} for file: ${fileName}`);
    } catch (error) {
        console.error(`Error transcribing audio for file: ${fileName}`);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);
    }
}