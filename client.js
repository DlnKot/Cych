const readline = require("readline");
const io = require("socket.io-client");
const fetch = require("node-fetch");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let token; // Токен пользователя
let socket; // Подключение к сокету

// Функция авторизации
async function loginOrRegister() {
  rl.question("Do you want to (login/register)? ", async (action) => {
    const username = await new Promise((resolve) =>
      rl.question("Enter your username: ", resolve)
    );
    const password = await new Promise((resolve) =>
      rl.question("Enter your password: ", resolve)
    );

    try {
      const response = await fetch(`http://localhost:3000/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        token = data.token;
        console.log("\nLogin successful!");
        startChat();
      } else {
        console.log(`\n${data.message}`);
        loginOrRegister();
      }
    } catch (error) {
      console.log("\nError:", error.message);
      loginOrRegister();
    }
  });
}

// Начало чата
function startChat() {
  socket = io("http://localhost:3000");

  socket.on("connect", () => {
    socket.emit("set username", token); // Передаем токен на сервер

    rl.on("line", (line) => {
      if (line === "/list") {
        fetch("http://localhost:3000/list", {
          headers: { Authorization: token },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("\nOnline users:");
            data.users.forEach((user) => console.log(`- ${user}`));
          })
          .catch((err) =>
            console.log("\nError fetching user list:", err.message)
          );
      } else {
        socket.emit("chat message", line);
      }
    });
  });

  socket.on("chat message", (msg) => {
    if (msg.id === socket.id) {
      return;
    }
    console.log(`> ${msg.user}: ${msg.text}`);
  });

  socket.on("disconnect", () => {
    console.log("\nDisconnected from server.");
    process.exit(0);
  });
}

// Запуск
loginOrRegister();
