import OpenAI from "openai";

let key;

await fetch("key.txt")
  .then((res) => res.text())
  .then((text) => {
    key = text.trim();
    updateStatus("API Key loaded", key ? "ok" : "error");
  })
  .catch((e) => {
    console.error("Error loading API key:", e);
    updateStatus("API Key Error", "error");
  });

if (!key) {
  console.error("No API key found. Please check key.txt file.");
  updateStatus("No API Key", "error");
}

const openai = new OpenAI({
  apiKey: key,
  dangerouslyAllowBrowser: true,
});

function updateStatus(message, type) {
  const statusEl = document.getElementById("status");
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.className = `status-indicator status-${type}`;
  }
}

async function pipeline(prompt) {
  try {
    updateStatus("Sending to OpenAI...", "ok");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert web developer. When given a prompt, respond ONLY with the HTML code for the requested element. If the prompt requests a datagrid, table, or spreadsheet, ALWAYS return a <table> tag with appropriate <thead> and <tbody> elements. Do not include explanations or markdown, just the HTML code.",
        },
        {
          role: "user",
          content: `Write only the HTML code for: ${prompt}`,
        },
      ],
      max_tokens: 256,
      temperature: 0.2,
    });

    const content = response.choices[0].message.content.trim();
    updateStatus("API: Response received", "ok");
    insertHtml(content);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    if (error.message && error.message.includes("429")) {
      if (error.message.includes("quota")) {
        updateStatus("Quota Exceeded", "error");
        alert(
          "OpenAI API quota exceeded. Please check your billing and add credits to your account."
        );
      } else {
        updateStatus("Rate Limit Exceeded", "error");
        alert("Rate limit exceeded. Please wait a moment and try again.");
      }
    } else if (error.message && error.message.includes("401")) {
      updateStatus("Invalid API Key", "error");
      alert(
        "Invalid API key. Please check your OpenAI API key in the key.txt file."
      );
    } else {
      updateStatus("API Error", "error");
      alert("OpenAI API Error: " + error.message);
    }
  }
}

function insertHtml(html) {
  // Insert the HTML into the body (or a specific container if you want)
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);

  // If the inserted HTML contains a <table>, apply default styling
  const table = container.querySelector("table");
  if (table) {
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.margin = "16px 0";
    table.querySelectorAll("th, td").forEach((cell) => {
      cell.style.border = "1px solid #ccc";
      cell.style.padding = "8px";
      cell.style.textAlign = "left";
    });
    table.querySelectorAll("th").forEach((th) => {
      th.style.background = "#f5f5f5";
      th.style.fontWeight = "bold";
    });
  }
}

function submitHandler(e) {
  e.preventDefault();
  const prompt = document.getElementById("main").value;
  pipeline(prompt);
}

document.getElementById("container").addEventListener("submit", submitHandler);

document.getElementById("code-button").addEventListener("click", () => {
  alert(
    "Code preview is not available in this mode. Please check the page for the inserted element."
  );
});
document.getElementById("copy-button").addEventListener("click", () => {
  alert("Copy code is not available in this mode.");
});
document.getElementById("undo-button").addEventListener("click", () => {
  alert("Undo is not available in this mode.");
});
