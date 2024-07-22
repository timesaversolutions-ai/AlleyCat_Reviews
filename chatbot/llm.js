import { ChatOpenAI } from "@langchain/openai";

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

const response = await model.invoke(messages);
console.log(response); // for model.invoke and model.batch

// for model.stream and streamLog
// for await (const chunk of response) { 
//     console.log(chunk?.content);
// }
