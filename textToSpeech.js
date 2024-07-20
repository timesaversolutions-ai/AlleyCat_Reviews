// docs: https://platform.openai.com/docs/guides/text-to-speech/quickstart?lang=node

// download example transcription (a bit at a time to avoid getting charged too much) and save as file in Gdrive. 
// Use same functionality from audio transcription code

import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI();

const speechFile = path.resolve("./speech.mp3");

async function main() {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: "Today is a wonderful day to build something people love!",
  });
  console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
}
main();