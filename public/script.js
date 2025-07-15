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

    // Check if this is an AG-Data Grid request
    if (
      prompt.toLowerCase().includes("ag-data grid") ||
      prompt.toLowerCase().includes("ag-grid")
    ) {
      await generateAGGrid(prompt);
      return;
    }

    // Check if this is a button creation request
    if (
      prompt.toLowerCase().includes("button") ||
      prompt.toLowerCase().includes("save") ||
      prompt.toLowerCase().includes("submit") ||
      prompt.toLowerCase().includes("click")
    ) {
      await generateButton(prompt);
      return;
    }

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

async function generateAGGrid(prompt) {
  try {
    updateStatus("Generating AG-Grid...", "ok");

    // Extract JSON data from the prompt
    const jsonMatch = prompt.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      updateStatus("No JSON data found", "error");
      alert("Please include JSON data in your AG-Data Grid request.");
      return;
    }

    let jsonData;
    try {
      jsonData = JSON.parse(jsonMatch[0]);
    } catch (e) {
      updateStatus("Invalid JSON format", "error");
      alert("The JSON data provided is not valid. Please check the format.");
      return;
    }

    // Generate AG-Grid HTML
    const gridHtml = createAGGridHTML(jsonData);
    insertHtml(gridHtml);

    // Initialize AG-Grid after insertion
    setTimeout(() => {
      initializeAGGrid(jsonData);
    }, 100);

    updateStatus("AG-Grid generated successfully", "ok");
  } catch (error) {
    console.error("AG-Grid generation error:", error);
    updateStatus("AG-Grid generation failed", "error");
    alert("Failed to generate AG-Grid: " + error.message);
  }
}

async function generateButton(prompt) {
  try {
    updateStatus("Generating button...", "ok");

    // Extract button text from the prompt
    let buttonText = "Button";
    let buttonType = "primary";

    // Look for common button text patterns
    if (prompt.toLowerCase().includes("save")) {
      buttonText = "Save";
      buttonType = "success";
    } else if (prompt.toLowerCase().includes("submit")) {
      buttonText = "Submit";
      buttonType = "primary";
    } else if (prompt.toLowerCase().includes("cancel")) {
      buttonText = "Cancel";
      buttonType = "secondary";
    } else if (prompt.toLowerCase().includes("delete")) {
      buttonText = "Delete";
      buttonType = "danger";
    } else if (prompt.toLowerCase().includes("edit")) {
      buttonText = "Edit";
      buttonType = "warning";
    } else if (prompt.toLowerCase().includes("add")) {
      buttonText = "Add";
      buttonType = "success";
    } else if (prompt.toLowerCase().includes("update")) {
      buttonText = "Update";
      buttonType = "primary";
    } else if (prompt.toLowerCase().includes("download")) {
      buttonText = "Download";
      buttonType = "info";
    } else if (prompt.toLowerCase().includes("upload")) {
      buttonText = "Upload";
      buttonType = "info";
    } else {
      // Try to extract custom text from quotes or specific patterns
      const textMatch = prompt.match(/"([^"]+)"/) || prompt.match(/'([^']+)'/);
      if (textMatch) {
        buttonText = textMatch[1];
      } else {
        // Look for text after "button" or similar keywords
        const buttonMatch = prompt.match(/(?:button|create|add)\s+(.+)/i);
        if (buttonMatch) {
          buttonText = buttonMatch[1].trim();
        }
      }
    }

    // Generate button HTML with consistent styling
    const buttonHtml = createButtonHTML(buttonText, buttonType);
    insertHtml(buttonHtml);

    updateStatus("Button generated successfully", "ok");
  } catch (error) {
    console.error("Button generation error:", error);
    updateStatus("Button generation failed", "error");
    alert("Failed to generate button: " + error.message);
  }
}

function createButtonHTML(text, type) {
  const buttonStyles = {
    primary: {
      background: "#007bff",
      color: "white",
      border: "1px solid #007bff",
    },
    success: {
      background: "#28a745",
      color: "white",
      border: "1px solid #28a745",
    },
    danger: {
      background: "#dc3545",
      color: "white",
      border: "1px solid #dc3545",
    },
    warning: {
      background: "#ffc107",
      color: "#212529",
      border: "1px solid #ffc107",
    },
    secondary: {
      background: "#6c757d",
      color: "white",
      border: "1px solid #6c757d",
    },
    info: {
      background: "#17a2b8",
      color: "white",
      border: "1px solid #17a2b8",
    },
  };

  const style = buttonStyles[type] || buttonStyles.primary;

  return `
    <div style="margin: 20px 0; text-align: center;">
      <button 
        type="button" 
        class="custom-button"
        style="
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: ${style.background};
          color: ${style.color};
          border: ${style.border};
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        "
        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)'"
        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"
        onclick="console.log('${text} button clicked')"
      >
        ${text}
      </button>
    </div>
  `;
}

function createAGGridHTML(data) {
  // Determine the data structure and create appropriate columns
  let columns = [];
  let rowData = [];

  if (data.PLANNING_LINE && Array.isArray(data.PLANNING_LINE)) {
    // Handle the specific structure from your example
    columns = [
      {
        field: "product",
        headerName: "Product",
        editable: true,
        sortable: true,
        filter: true,
      },
      {
        field: "partNumber",
        headerName: "Part Number",
        editable: true,
        sortable: true,
        filter: true,
      },
      {
        field: "location",
        headerName: "Location",
        editable: true,
        sortable: true,
        filter: true,
      },
      {
        field: "planType",
        headerName: "Plan Type",
        editable: true,
        sortable: true,
        filter: true,
      },
      {
        field: "category",
        headerName: "Category",
        editable: true,
        sortable: true,
        filter: true,
      },
      {
        field: "uom",
        headerName: "UOM",
        editable: true,
        sortable: true,
        filter: true,
      },
    ];

    // Add weekly plan columns
    if (data.weeks && Array.isArray(data.weeks)) {
      data.weeks.forEach((week) => {
        columns.push({
          field: `weeklyPlan.${week}`,
          headerName: week,
          editable: true,
          sortable: true,
          filter: true,
          type: "numericColumn",
        });
      });
    }

    rowData = data.PLANNING_LINE;
  } else if (Array.isArray(data)) {
    // Handle array of objects
    if (data.length > 0) {
      const firstItem = data[0];
      columns = Object.keys(firstItem).map((key) => ({
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        editable: true,
        sortable: true,
        filter: true,
      }));
    }
    rowData = data;
  } else {
    // Handle object with nested data
    columns = Object.keys(data).map((key) => ({
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1),
      editable: true,
      sortable: true,
      filter: true,
    }));
    rowData = [data];
  }

  const columnDefs = JSON.stringify(columns);
  const rowDataStr = JSON.stringify(rowData);

  return `
    <div style="margin: 20px 0;">
      <h3>AG-Grid Data Table</h3>
      <div id="ag-grid-container" class="ag-theme-alpine" style="height: 500px; width: 100%;"></div>
      <script>
        window.agGridData = {
          columnDefs: ${columnDefs},
          rowData: ${rowDataStr}
        };
      </script>
    </div>
  `;
}

function initializeAGGrid(data) {
  const gridContainer = document.getElementById("ag-grid-container");
  if (!gridContainer) return;

  let columnDefs = [];
  let rowData = [];

  if (data.PLANNING_LINE && Array.isArray(data.PLANNING_LINE)) {
    columnDefs = [
      {
        field: "product",
        headerName: "Product",
        editable: true,
        sortable: true,
        filter: true,
      },
      {
        field: "partNumber",
        headerName: "Part Number",
        editable: true,
        sortable: true,
        filter: true,
      },
      {
        field: "location",
        headerName: "Location",
        editable: true,
        sortable: true,
        filter: true,
      },
      {
        field: "planType",
        headerName: "Plan Type",
        editable: true,
        sortable: true,
        filter: true,
      },
      {
        field: "category",
        headerName: "Category",
        editable: true,
        sortable: true,
        filter: true,
      },
      {
        field: "uom",
        headerName: "UOM",
        editable: true,
        sortable: true,
        filter: true,
      },
    ];

    if (data.weeks && Array.isArray(data.weeks)) {
      data.weeks.forEach((week) => {
        columnDefs.push({
          field: `weeklyPlan.${week}`,
          headerName: week,
          editable: true,
          sortable: true,
          filter: true,
          type: "numericColumn",
          valueGetter: (params) => {
            return params.data.weeklyPlan ? params.data.weeklyPlan[week] : null;
          },
          valueSetter: (params) => {
            if (!params.data.weeklyPlan) params.data.weeklyPlan = {};
            params.data.weeklyPlan[week] = params.newValue;
            return true;
          },
        });
      });
    }

    rowData = data.PLANNING_LINE;
  } else if (Array.isArray(data)) {
    if (data.length > 0) {
      const firstItem = data[0];
      columnDefs = Object.keys(firstItem).map((key) => ({
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        editable: true,
        sortable: true,
        filter: true,
      }));
    }
    rowData = data;
  } else {
    columnDefs = Object.keys(data).map((key) => ({
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1),
      editable: true,
      sortable: true,
      filter: true,
    }));
    rowData = [data];
  }

  const gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      resizable: true,
    },
    pagination: true,
    paginationPageSize: 10,
    domLayout: "autoHeight",
    onCellValueChanged: function (params) {
      console.log("Cell value changed:", params);
    },
  };

  new agGrid.Grid(gridContainer, gridOptions);
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

  // Clear the input text box after submission
  document.getElementById("main").value = "";
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
