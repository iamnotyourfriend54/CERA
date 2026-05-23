async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatbox = document.getElementById("chatbox");
  const lang = document.getElementById("language").value;

  const message = input.value;

  chatbox.innerHTML += `<p><b>You:</b> ${message}</p>`;

  const res = await fetch(window.API_URL || "http://localhost:5000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message, lang })
  });

  const data = await res.json();

  chatbox.innerHTML += `<p><b>Bot:</b> ${data.reply}</p>`;

  input.value = "";
}