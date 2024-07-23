import { OpenAI } from 'openai';
import readlineSync from 'readline-sync';
import colors from 'colors';

import * as dotenv from "dotenv";
dotenv.config();

// Initialize the OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY 
  });

async function main() {
  console.log(colors.bold.green("Hello! Welcome to our educational support service. I'm designed to help you learn in a way suited to you."));
  console.log(colors.bold.green("I offer these educational services: Simulation, Critique/Teach, Co-Create, and Mentor/Coach. Ask me if you want to know more."));
  console.log(colors.bold.green("You could also start by sharing the topic and context on what you want to learn more about."));
  const chatHistory = []; // Store conversation history

  while (true) {
    const userInput = readlineSync.question(colors.yellow('You: '));

    try {
      // Construct messages by iterating over the history
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      // Add latest user input
      messages.push({ role: 'user', content: userInput });

      // Define your starter prompt
      const starterPrompt = {
        role: 'system', // You can use 'system' to set the behavior of the assistant or 'user' to set the initial user message
        content: "You are supporting tutoring services for a local high school. Your expertise will involve various educational methods including simulation, critique, co-creation, mentoring, and coaching. Provide adaptive and interactive support to help students learn and understand concepts deeply."
      };
        
      // Add the starter prompt to the beginning of the messages array
      const messagesWithStarter = [starterPrompt, ...messages];
        
      // Call the API with the modified messages array
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messagesWithStarter,
      });

    //   // Call the API with user input & history
    //   const completion = await openai.chat.completions.create({
    //     model: 'gpt-3.5-turbo',
    //     messages: messages,
    //   });

      // Get completion text/content
      const completionText = completion.choices[0].message.content;

      if (userInput.toLowerCase() === 'exit') {
        console.log(colors.green('Bot: ') + completionText);
        return;
      }

      console.log(colors.green('Bot: ') + completionText);

      // Update history with user input and assistant response
      chatHistory.push(['user', userInput]);
      chatHistory.push(['assistant', completionText]);
    } catch (error) {
      if (error.response) {
        console.error(colors.red(error.response.data.error.code));
        console.error(colors.red(error.response.data.error.message));
        return;
      }
      console.error(colors.red(error));
      return;
    }
  }
}

main();