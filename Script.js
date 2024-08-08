function hideChat() {
    var chat = document.getElementById("chat");
    var button = document.getElementById("hide")
    if (chat.style.display === "none") {
      chat.style.display = "block";
      button.textContent = "hide";
    } else {
      chat.style.display = "none";
      button.textContent = "show";
    }
}

function submitChat() {
    var chat = document.getElementById("chat-text");
    var submit = chat.textContent;
    chat.textContent = "Type your instructions here..."
    //whatever you want to do with chat text, it's in the
    //submit variable (probably)
}

function showCode() {
    //to be written
}
