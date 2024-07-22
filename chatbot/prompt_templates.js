import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts"

import * as dotenv from "dotenv";
dotenv.config();

const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo" // full options: https://api.python.langchain.com/en/latest/chat_models/langchain_openai.chat_models.base.ChatOpenAI.html
});

const messages = [
    (
        "system",
        "You are supporting tutoring for a local high school. use your best understanding of pedagogy to support the student's education. Don't just simply give answers, help them learn concepts and relate to them using metaphors and examples when appropriate."
    ),
    ("human", "I'm struggling to learn Electricity and Magnetism in my Physics class. Can you help me")
]

// prompt template
const prompt = ChatPromptTemplate.fromMessages("")

// Prompt Templates are to set up possible inputs for each tutoring option: Simulation, Critique, Mentor, etc. 
// not to be done until intial bot set up with all potential options MVP

// const message = SystemMessagePromptTemplate.fromTemplate("{text}");
// const chatPrompt = ChatPromptTemplate.fromMessages([
//   ["ai", "You are a helpful assistant."],
//   message,
// ]);

// use python templates, replace with necessary info, then ask GPT to translate into JS based on previous script
// https://api.python.langchain.com/en/latest/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html
