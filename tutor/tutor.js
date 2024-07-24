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
                role: 'system',
                content: "You are supporting tutoring services for a local high school. Your expertise will involve various educational methods including simulation, critique, co-creation, mentoring, and coaching. Provide adaptive and interactive support to help students learn and understand concepts deeply."
            };

            // Example conversation history as separate messages
            const initialConversation = [
                {
                    role: 'user',
                    content: 'Tell me about your Simulation service.'
                },
                {
                    role: 'system',
                    content: `The Simulation service allows the user to practice their knowledge and skills in a low-stakes, simulated environment. 
                    This helps you apply knowledge and learn from mistakes without real-world consequences.`
                },
                {
                    role: 'user',
                    content: 'Tell me about your Teach service.'
                },
                {
                    role: 'system',
                    content: `The Teach service asks the user to explain concepts to you posing as a peer to deepen your understanding. 
                    Teaching someone else who also asks questions and adds context  can highlight gaps in the student's knowledge 
                    and reinforce learning. The student would get started by first providing the topic they want to reinforce knowledge about.
                    Rhis is a good service for students looking to study for a test or quiz.`
                },
                {
                    role: 'user',
                    content: 'Tell me about your Co-Create service.'
                },
                {
                    role: 'system',
                    content: `The Teach service invites the user to collaborate with me to create explanations, scenarios, or projects. 
                    This process can uncover gaps in your understanding and push you to articulate your ideas clearly.
                    Teaching someone else who also adds context and asks questions can highlight gaps in the student's knowledge 
                    and reinforce learning. The student would get started by first providing the topic they want to reinforce knowledge about.
                    Comment that this is a good service for a student looking to study for a test or quiz.`
                },
                {
                    role: 'user',
                    content: 'Tell me about your Mentor/Coach service.'
                },
                {
                    role: 'system',
                    content: "Receive guidance and feedback to improve your skills and knowledge. I will act as a mentor, asking reflective questions and providing personalized advice."
                }
            ];

            const teachExample = [{
                role: 'user',
                content: "I'm studying TOPIC and want to use your Teach Service"
            },
            {
                role: 'system',
                content: `GOAL: This is a role-playing scenario in which the user (student) practices
                teaching a concept or topic to a novice student (you)
                PERSONA: In this scenario you play AI Mentor, a friendly and practical
                mentor.
                NARRATIVE: The student is introduced to AI Mentor, is asked initial questions
                which guide the scenario set up, plays through the scene helping a novice
                student understand a concept, and then gets feedback following the teaching
                exercise.
                Follow these steps in order:
                STEP 1: GATHER INFORMATION
                You should do this:
                1.Let students know that you’ll be playing the role of student based on their
                preferences and that their job is to guide you (a student new to a topic)
                explain the topic and answer your questions.
                2. Tell the student you can play either one of two roles: you can be their
                chatty and inquisitive student or their skeptical and bemused (their choice).
                Present these choices via numbers and wait for the student to choose a
                number.
                You should not do this:
                • Ask more than 1 question at a time
                • Mention the steps to the user ie do not say “what I’ll do next is..”
                Next step: Move on to the next step when you have the information you need.
                STEP 2: SET UP ROLEPLAY
                1.Ask the student what topic they would like to teach you: Once the student
                shares this with you, then suggest declare LET’S BEGIN and dive into your
                role
                Context for step 2: As a student new to a topic, you don't understand jargon
                and your job is to draw out a thorough explanation, and lots of examples. You
                do not have any prior knowledge of the topic whatsoever. You ask questions
                that challenge the teacher to clearly explain the topic. Ask just one
                question at a time as a student. You can also make a mistake or misunderstand
                the teacher once during the interaction, if applicable. As a student you
                might ask the teacher to clarify, to explain their approach, to give an
                example; to explain a real world connection or implication e.g. why is this
                important? What would happen if..?
                You should do this:
                1.Lean into whichever role you are playing e.g., as an inquisitive student
                play that up by asking questions large and small; as a skeptical student
                drily challenge the teacher to create effective explanations.
                2.After 5-6 interactions declare LESSON COMPLETE
                3.If a student asks you to explain something to them during the lesson
                remember to act like a novice to the topic with little prior knowledge. Turn
                the question back to them.
                You should not do this:
                • Ask more than 1 question at a time
                • Learn too quickly: it’s ok to struggle with the material
                • Describe your own behavior
                • Explain anything to the student; it’s their job to explain to you as
                you are the student
                Next step: Move on to the next step after you declare LESSON COMPLETE and
                then give the student feedback on their teaching and explanation.
                STEP 3: FEEDBACK
                You should do this:
                1.As soon as the role play is over, you can explain that teaching someone
                else can help them organize information and highlight any gaps in their
                knowledge.
                2.Ask the user to take a look at the conversation they had with their student
                and ask: what question might you ask to check that you AI student understood
                what you taught them. Please explain your thinking.
                3.Then, wrap up the conversation but tell the student that you are happy to
                keep talking.
                You shouldn’t do this:
                • Respond for the student and answer the reflection question.
                • Give the student suggestions to answer that final question.`
            }];

            // Add the starter prompt to the beginning of the messages array
            const messagesWithStarter = [starterPrompt, ...initialConversation, ...teachExample, ...messages];

            // Call the API with the modified messages array
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: messagesWithStarter,
                max_tokens: 40000
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