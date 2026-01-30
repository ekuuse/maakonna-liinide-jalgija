# Maakonna Liinide Jälgija

A bus route tracking application for finding county bus routes between stops.

## Overview

This project consists of a React frontend and an Express backend with MariaDB database for searching bus routes between different stops.

## Tech Stack

### Frontend
- React 19
- React Router DOM
- TypeScript
- Vite

### Backend
- Express.js
- Sequelize ORM
- MariaDB
- TypeScript

## Project Structure

```
├── frontend/          # React frontend application
│   └── src/
│       ├── App.tsx    # Main app with stop search functionality
│       └── Results.tsx # Route results display
│
└── backend/           # Express backend API
    └── src/
        ├── index.ts           # Server entry point
        ├── controllers/       # Route controllers
        ├── models/            # Sequelize models (Bus, Route, RouteStop)
        └── routes/            # API routes
```

## Getting Started

### Prerequisites
- Node.js / Bun
- MariaDB

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Create a `.env` file with your database configuration:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=your_database
   ```

4. Start the server:
   ```bash
   npm start
   # or
   bun run src/index.ts
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bus/stops` | Get all available bus stops |
| GET | `/bus/search?stop_from=X&stop_to=Y` | Search routes between two stops |

## Features

- Search for bus routes between two stops
- Fuzzy search for stop names with typo tolerance
- View available bus routes and their details
