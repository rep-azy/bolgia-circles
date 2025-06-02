# ⚫ Bolgia

**Bolgia** is a web-based task management app built with **Next.js 13**, featuring full **CRUD functionality** and a visually distinct layout inspired by the nine circles of Dante’s *Inferno*. Tasks can be categorized into customizable “circles,” allowing users to prioritize based on severity or importance.

---

## 🔧 Features

- ✅ Create, edit, and delete tasks
- 🔄 Persistent task state via `json-server`
- 🎯 Organize tasks into 9 customizable "circles"
- 💨 Built with Next.js 13 App Router & Tailwind CSS

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/rep-azy/bolgia-circles.git
cd bolgia-circles
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Mock API Server

```bash
npm run json-server
```

This starts a temporary JSON API using `json-server`.

### 4. Launch the Development Server

In a new terminal tab or window:

```bash
npm run dev
```

Visit the local or network URL printed in the terminal (usually `http://localhost:3000`) to view Bolgia in your browser.

---

## 📂 Project Structure

- `/app` — Next.js app directory (App Router)
- `/app/components` — UI components
- `/data/todos.json` — Mock data used by `json-server`

---

## 📦 Dependencies

- [Next.js 13](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [json-server](https://github.com/typicode/json-server)
- [React Icons](https://react-icons.github.io/react-icons/)

---

## 🧪 CRUD Functionality

- **Create:** Add new tasks into any of the 9 circles
- **Read:** View existing tasks in a circle-based layout
- **Update:** Edit task title or details
- **Delete:** Remove completed or irrelevant tasks

---

## 🎥 Based On

YouTube Tutorial:  
[Create a To-Do App with Next.js 13: Learn CRUD Operations and Tailwind CSS UI](https://www.youtube.com/watch?v=wi2xdrpmJNk)

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🔥 Inspiration

> “Here sighs and lamentations and loud cries were echoing across the starless air.”  
> — *Dante Alighieri, Inferno*
