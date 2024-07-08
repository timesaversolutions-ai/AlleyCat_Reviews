@echo off
set API_URL=https://api.openai.com/v1/chat/completions
set API_KEY=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
set TRANSCRIPTION="response.json"
set OUTPUT="excel_data.json"

@REM Call the Node.js script to read the transcription and create the prompt
node create_prompt.js %TRANSCRIPTION% > prompt.json

curl -X POST %API_URL% ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %API_KEY%" ^
  -d @prompt.json ^
  -o %OUTPUT%