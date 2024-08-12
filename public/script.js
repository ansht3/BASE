import Main from "./main.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

let key;

await fetch("key.txt")
  .then((res) => res.text())
  .then((text) => {
    key = text;
   })
  .catch((e) => console.error(e));

const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  system_instruction: "You will help develop Web components using HTML, CSS, and Javascript. Only respond in function calls",
  tools: { functionDeclarations: Main.functionDeclarations },
  toolConfig: {
    functionCallingConfig: {
      mode: "AUTO"
    }
  }
});

async function pipeline(prompt) {
  const chat = model.startChat();
  const result = await chat.sendMessage(prompt);
  const calls = result.response.functionCalls();
  console.log(calls);

  if (calls) {
    for (const call of calls) {
      Main.functionMap[call.name](call.args);
    }
  }
  else {
    Main.noFunction();
  }
}
function submitHandler(e) {
  e.preventDefault();
  pipeline(document.getElementById('main').value);
}

function copyCode() {
  var code = document.getElementById("raw-code");
  var copy = document.getElementById("copy-button");
  copy.textContent = "Copied!";
  code.select();
  navigator.clipboard.writeText(code.value);
}
function showFile() {
  fetch(window.location.href)
    .then(response => {
      return response.text();
    })
    .then(text => {
      const cut1 = text.indexOf("  <!-- Code injected by live-server -->");
      const end = "// ]]>\n</script>\n";
      const cut2 = text.indexOf(end);
      const result = text.substring(0, cut1) + text.substring(cut2 + end.length);
      document.getElementById("raw-code").value = result;
    })
}
function showCode() {
  var code = document.getElementById("raw-code");
  var button = document.getElementById("code-button");
  var copy = document.getElementById("copy-button");
  var undo = document.getElementById("undo-button");
  showFile();
  if (code.hidden) {
    code.hidden = false;
    copy.hidden = false;
    undo.hidden = true;
    button.textContent = "Hide Code";
  }
  else {
    code.hidden = true;
    copy.hidden = true;
    undo.hidden = false;
    copy.textContent = "Copy Code";
    button.textContent = "Show Code";
  }
  console.log("pressed");
}

function undo() {
  Main.functionMap["deleteTag"]("." + Main.counter.toString());
  console.log(Main.counter);
  if (Main.counter > 0) {
    console.log("standard");
    Main.counter--;
  }
  else {
    console.log("AT ZERO");
  }
  console.log("RAN");
}

document.getElementById("code-button").addEventListener('click', showCode);
document.getElementById("copy-button").addEventListener('click', copyCode);
document.getElementById("container").addEventListener('submit', submitHandler);
document.getElementById("undo-button").addEventListener('click', undo);

