@echo off
set API_KEY=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

curl https://api.openai.com/v1/models ^
  -H "Authorization: Bearer %API_KEY%"
