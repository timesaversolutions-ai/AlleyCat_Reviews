// MVP goal: Bot is prepped to deliver each of the categories from Instructors as Innovators
// Simulation, Critique, Teach, Co-Create, Mentor and Coach, Tutor
// Users first interaction with the bot will lead with  intention to assist as a tutor in formats ^
// Will also prompt user for basic information about why it's using the service
// Starter info from Bot
// 
// 2 gates for the user: 
// 1 - Providing context about why they're using service
// 2 - Choosing which type of help they want

// how to add chat history: https://python.langchain.com/v0.1/docs/use_cases/question_answering/chat_history/

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts"

import * as dotenv from "dotenv";
dotenv.config();
// full options: https://api.python.langchain.com/en/latest/chat_models/langchain_openai.chat_models.base.ChatOpenAI.html
const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo" 
});

const messages = [
    (
        "system",
        "You are supporting tutoring for a local high school. use your best understanding of pedagogy to support the student's education. Don't just simply give answers, help them learn concepts and relate to them using metaphors and examples when appropriate."
    ),
    ("human", "I'm struggling to learn Electricity and Magnetism in my Physics class. Can you help me")
]

const response = await model.invoke(messages);
console.log(response); // for model.invoke and model.batch

// for model.stream and streamLog
// for await (const chunk of response) { 
//     console.log(chunk?.content);
// }