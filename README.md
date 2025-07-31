# 🧠 AlgoByte - A Full-Stack Coding Platform

A powerful **Coding Platform** built with modern technologies that offers features like problem solving, contests, AI-powered code suggestions, real-time collaborative coding, and more. Designed for developers who want to learn, practice, compete, and collaborate.

## 🌐 Live Demo
[> _(https://algo-byte-eight.vercel.app/)_]

---

## 🚀 Tech Stack

**Frontend:**
- React.js + Vite
- Tailwind CSS + DaisyUI
- Socket.IO (Client)

**Backend:**
- Node.js + Express.js
- MongoDB (Mongoose)
- Redis
- Socket.IO (Server)
- Cloudinary (for video/image storage)
- Gemini API (Google AI for code suggestions)

---

## 🔥 Features

### 👨‍💻 Coding Platform
- A rich **code editor** with language support, input/output, fullscreen mode, and auto-complete.
- **Run** and **Submit** code via Judge0 integration.
- **AI Suggestions** using Gemini API to help write better code.

### 📚 Problem Management
- Admin can **create, update, and delete problems**.
- Users can **solve problems** with real-time submissions and feedback.
- Track your **problem-solving history** and **progress**.

### 📅 Problem of the Day (POTD)
- A unique daily challenge selected by the admin.
- Dedicated endpoint to fetch and solve the POTD.

### 🧠 Contests
- Admin can create contests with a start time and duration.
- Users can participate, submit problems, and view real-time **leaderboards**.

### 🗣️ Discussion Forum
- Users can create **posts**, **comment**, and **reply** to discuss coding topics.
- Like, edit, and delete operations supported.

### ⚔️ Battle Arena
- Users can **challenge friends** to a real-time coding battle.
- Live **leaderboard** with status updates using Socket.IO.

### 👥 Collaborative Coding
- **Real-time code collaboration** via socket rooms.
- Multiple users can jointly edit and view code in the same editor.

### 📽️ Video Solutions
- Admins can **upload video solutions** to problems.
- Stored and streamed via **Cloudinary**.

### 🔖 Bookmark System
- Users can **bookmark problems** into custom lists.
- Add/remove problems from lists, and manage them easily.

### 📈 Activity Tracker
- Daily **activity heatmap** and **streak system** to motivate consistent practice.

### 🔐 Authentication & Authorization
- JWT-based login, register, logout.
- Admin-only routes are protected.
- Google login supported.

---


---

## 📦 API Endpoints

Here's a breakdown of the core API route files:

| Feature             | Path                        | Method(s)         |
|---------------------|-----------------------------|-------------------|
| Auth                | `/api/auth`                 | POST, GET         |
| Problems            | `/api/problem`              | POST, GET, PUT, DELETE |
| Submissions         | `/api/submission`           | POST, GET         |
| Contests            | `/api/contest`              | POST, GET         |
| Bookmarking         | `/api/bookmark`             | POST, GET, DELETE |
| Video Solutions     | `/api/video`                | GET, POST, DELETE |
| Image Uploads       | `/api/image`                | GET, POST, DELETE |
| Battle Arena        | `/api/battle`               | POST, GET         |
| Collaboration (AI)  | `/api/ai`                   | POST              |
| Discussions         | `/api/discussion`           | POST, GET, DELETE |
| Activity Tracker    | `/api/activity`             | GET               |
| POTD                | `/api/potd`                 | POST              |

_(See full route files for more detail)_

---


### 1. 🖥️ Setup Backend

```bash
cd Backend
npm install
```
👉 Create a `.env` file inside the `Backend` directory with the required keys.

```bash
nodemon src/index.js
```
The backend will run on: `http://localhost:3000`

---

### 2. 💻 Setup Frontend

```bash
cd Frontend
npm install
```



```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`
Also change the axiosClient url according to backend url
---

## 🧭 How to Use the Platform

Follow these simple instructions to explore all the powerful features of this LeetCode clone:

---

### 🤝 Collaborative Coding

1. Navigate to **any problem page**.
2. In the **top-right corner**, click the **"Collaboration"** button.
3. A **collaboration link** will be generated.
4. **Share the link** with your friend(s) — anyone who opens it can join and **code in real time** with you.

---

### ⚔️ Battle Arena (Code Battle)

1. Go to the **CodeBattle** section from the main menu.
2. Click on **"Create Room"** to generate a new battle room.
3. You’ll get a **Room ID** — **share this ID** with your friend.
4. Your friend can **join the room** by pasting this ID into the **"Join Room"** field.
5. You’ll both solve the same problem, and a **real-time leaderboard** will show who finishes first!

---

### 📚 Solving Problems

- Visit the **"Problems"** page to view all coding problems.
- Click any problem to open the **code editor**.
- You can **Run** your code or **Submit** it to check against test cases.
- View your **previous submissions**, **status**, and **pass/fail results**.

---

### 🎯 Problem of the Day (POTD)

- Each day a unique challenge is selected.
- Visit the **Home page** or **POTD section** to access it.

---

### 🏁 Participate in Contests

- Go to the **Contests** section.
- Register for upcoming contests and participate at the scheduled time.
- Submit problems within the contest time and track your rank on the **live leaderboard**.

---

### 🧠 AI Suggestions

- In the code editor, AI will suggest code completions.
- Based on your current code, the **Gemini API** will provide smart auto-suggestions.

---

### 🎬 Video Solutions

- Some problems have admin-uploaded **video explanations**.
- Scroll to the **bottom of a problem page** to watch these if available.

---

### 📌 Bookmarks

- Bookmark problems you want to revisit later.
- Organize them into **custom lists** and access them via the **Bookmarks** section.

---

### 🗣️ Discussion Forum

- Head over to the **Discuss** section.
- Ask questions, answer others, like posts, and reply to comments.

---

### 🔥 Activity & Streaks

- Your coding activity is tracked via a **heatmap**.
- Stay consistent and maintain your **streak**!

---

### 👨‍🏫 Admin Features (only for admins)

- Create/update/delete problems.
- Set **Problem of the Day**.
- Create and manage **contests**.
- Upload **video solutions** to problems.

---

💡 **Pro Tip:** Make sure you're logged in to access all user features. Some pages and routes are protected and require authentication.



