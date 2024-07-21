const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI({
  apiKey: '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', // Replace with your actual API key
});

function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log('File written successfully.');
  } catch (err) {
    throw err;
  }
}

async function main() {
    try {
    const outputFile = 'socials.json'; // Output file
// Create the prompt
    const prompt = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a social media strategy manager for a pickleball app to help traveling and/or solo pickup players be part of a community to learn about courts they can visit when they're in the area. Help the user craft 1st drafts for various social media posts"
        },
        {
          role: "user",
          content: `Can you outline everything I'd need for a FaceBook post given these points: This style is for Alley Cat approved court highlights: envision a court has been chosen, with several photos detailing it. include personal narrative about the court. come up with appropriate captioning, description, headline.`
        }
      ]
    };

    // Send the prompt to the OpenAI API
    const completion = await openai.chat.completions.create(prompt);

    // Write the response to the output file
    writeFile(outputFile, completion.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
