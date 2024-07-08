@echo off
set API_URL=https://api.openai.com/v1/chat/completions
set API_KEY=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
set TRANSCRIPTION="response.json"
set OUTPUT="excel_data.json"

curl -X POST %API_URL% ^
    -H "Authorization: Bearer %API_KEY%" ^
    -H "Content-Type: multipart/form-data" ^
    -F model="whisper-1" ^
    -F "file=@%AUDIO_FILE_PATH%" ^
    -o %RESPONSE_FILE%

pausea

echo Transcription response saved to %RESPONSE_FILE%
pause


curl -X POST %API_URL% \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "instructions": "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
    "name": "Math Tutor",
    "tools": [{"type": "function"}],
    "model": "gpt-4-turbo"
  }'


@echo off
set API_URL=https://api.openai.com/v1/chat/completions
set API_KEY=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
set TRANSCRIPTION="response.json"
set OUTPUT="excel_data.json"

@REM need to read the file in separate js file so it can be used in prompt
curl -X POST %API_URL% \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "model": "gpt-4",
    "messages": [
      {
        "role": "system",
        "content": "You are an assistant which takes a transcripted message and outputs the relevant information in key value pairs as a json file to be uploaded to a google sheet. here are the data points to parse for: State, City, Court, Permanent Lines, Permanent Nets, Paddle Rack, Number of Courts, Ability or Skill Based Courts, Luxury Enhancements, Additional Comments. "
      }
      @REM ,
      @REM {
      @REM   "role": "user",
      @REM   "content": "Can you help me enter this transcripted message as data for my excel sheet? Message: Hey Justin here we are at Centennial Sports Plex. This is a three-star actually a three-star facility because they have eight courts. It is permanent nets and permanent lines. Unfortunately the center was actually built to accommodate junior tennis players so you see these white lines but there are permanent blue lines for pickleball and the nets are properly spaced. The facility is great they have paddle racks which is nice but they do not offer skill differentiated play which is the reason why they are not a four-star facility even though they have eight permanent courts. The courts as you see are numbered I got to get this thing right 1 2 3 4 5 6 7 8. There is a utility building over here this big green building you see behind the grandstand that has bathrooms showers water fountains to you know it's a full service facility actually servicing in a number of tennis courts also and I'm not doing the review properly because I don't have the sheet but these are the eight courts they also have 12 higher-end courts I mean four more courts with permanent nets even though they are the roll away kinds but they're permanent and it's painted beautifully this is four additional courts that they have and that's the big green building that is has the bathrooms restrooms etc. Okay I have to probably do another one tomorrow."
      @REM },
      @REM {
      @REM   "role": "assistant",
      @REM   "content": "Sure! {
      @REM     \"State\": \"N/A\",
      @REM     \"City\": \"N/A\",
      @REM     \"Court\": \"Centennial Sports Plex\",
      @REM     \"Permanent Lines\": \"Yes\",
      @REM     \"Permanent Nets\": \"Yes\",
      @REM     \"Paddle Rack/Queue\": \"Yes\",
      @REM     \"num_courts\": \"8\",
      @REM     \"Ability Based Courts\": \"No\",
      @REM     \"Luxury Enhancements\": \"Bathrooms, Showers, Water Fountains\",
      @REM     \"Additional Comments\": \"Unfortunately the center was actually built to accommodate junior tennis players so you see these white lines but there are permanent blue lines for pickleball and the nets are properly spaced\"
      @REM   },
    ]
  }'
  -F "file=@%TRANSCIPTION%" \ 
  -o %OUTPUT%