@echo off
set API_URL=https://api.openai.com/v1/audio/transcriptions
set API_KEY=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
set AUDIO_FILE_PATH=C:\Users\18043\Documents\TSS\review1_audio.mp4
set RESPONSE_FILE="response.json"

curl -X POST %API_URL% ^
    -H "Authorization: Bearer %API_KEY%" ^
    -H "Content-Type: multipart/form-data" ^
    -F model="whisper-1" ^
    -F "file=@%AUDIO_FILE_PATH%" ^
    -o %RESPONSE_FILE%

pause

echo Transcription response saved to %RESPONSE_FILE%
pause
