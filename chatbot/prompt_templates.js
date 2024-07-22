import { ChatOpenAI } from "@langchain/openai";

import * as dotenv from "dotenv";
dotenv.config();

const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo" // full options: https://api.python.langchain.com/en/latest/chat_models/langchain_openai.chat_models.base.ChatOpenAI.html
});