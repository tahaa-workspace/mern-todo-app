# MERN Stack To-Do Application

A full-stack task management application built with **MongoDB Atlas, Express.js, React (Vite), and Node.js**.

## Features
- Create, read, update (toggle completion), and delete tasks with persistent MongoDB storage.
- RESTful Express API with Mongoose schema validation and centralized error handling.
- Modular React frontend using functional components, `useState`, and `useEffect`.

## Project Structure
- `backend/` — Node.js + Express REST API and Mongoose models
- `frontend/` — React + Vite single-page application

## Local Setup

### 1. Backend
```bash
cd backend
npm install
# Create a .env file with PORT=5000 and MONGO_URI=your_mongodb_connection_string
npm run dev