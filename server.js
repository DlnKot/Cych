const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000; // Порт сервера
const SECRET_KEY = "secret";
const usersFile = "./users.json";

app.use(express.json());
function loadUsers() {
  if (!fs.existsSync(usersFile)) {
    console.log("Users file does not exist, returning empty object.");
    return {}; // Если файл не существует, возвращаем пустой объект
  }

  try {
    const data = fs.readFileSync(usersFile, "utf8");
    return JSON.parse(data); // Преобразуем данные из файла в объект
  } catch (error) {
    console.error("Error reading or parsing users file:", error);
    return {}; // В случае ошибки парсинга возвращаем пустой объект
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2)); // Добавляем форматирование
    console.log("Users saved successfully.");
  } catch (error) {
    console.error("Error saving users:", error);
  }
}

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username or password is missing" });
  }
  const users = loadUsers();

  if (users[username]) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users[username] = hashedPassword;
  try {
    saveUsers(users);
  } catch (err) {
    console.log(err);
  }

  res.status(201).json({ message: "User registered successfully" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  const hashedPassword = users[username];
  if (!hashedPassword || !(await bcrypt.compare(password, hashedPassword))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

const onlineUsers = {};

io.on("connection", (socket) => {
  socket.on("set username", (token) => {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      onlineUsers[socket.id] = decoded.username;

      console.log(`${decoded.username} joined the chat.`);
      io.emit("chat message", {
        user: "System",
        text: `${decoded.username} joined the chat.`,
      });
    } catch {
      socket.disconnect(); // Отключаем пользователя без валидного токена
    }
  });

  socket.on("chat message", (msg) => {
    const username = onlineUsers[socket.id];
    if (!username) return; // Если никнейм не задан
    io.emit("chat message", {
      user: username,
      text: msg,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const username = onlineUsers[socket.id];
    if (username) {
      console.log(`${username} disconected.`);
      io.emit("chat message", {
        user: "System",
        text: `${username} left the chat.`,
      });
      delete onlineUsers[socket.id];
    } // Удаляем пользователя из хранилища
  });
});

app.get("/list", authenticateToken, (req, res) => {
  const usernames = Object.values(onlineUsers);
  res.json({ users: usernames });
});

// Запуск сервера
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
