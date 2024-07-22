import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
    openAIApiKey: "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"
});

// const response = await model.batch(["Hello","helpp me learn long division"]);
const response = await model.stream(["Write a 200 word article about potatoes"]);
console.log(response);