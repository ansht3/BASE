import Main from "./main.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

# config parser 
config = configparser.ConfigParser()
config.read('.config') # Make sure you have config file with the API key
const genAI = config['API']['key']

""" This is how the .config file should be
[API]
key = new GoogleGenerativeAI(process.env.API_KEY)
"""
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  tools: { functionDeclarations: Main.functionDeclarations },
  toolConfig: {
    functionCallingConfig: {
      mode: "ANY"
    }
  }
});

async function pipeline(prompt) {
  const chat = model.startChat();
  const result = await chat.sendMessage(prompt);
  const calls = result.response.functionCalls();
  console.log(calls);

  if (calls.length > 0) {
    for (const call of calls) {
      Main.functionMap[call.name](call.args);
    }
  }
  else {
    Main.noFunction();
  }
}

document.getElementById("main").addEventListener('submit', (e) => {
  e.target.value.preventDefault(); 
  pipeline(document.getElementbyId('main').value); 
})
