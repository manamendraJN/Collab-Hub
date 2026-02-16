# CollabHub – Remote Work Collaboration Platform

![MERN](https://img.shields.io/badge/Stack-MERN-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-brightgreen)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen)
![License](https://img.shields.io/badge/License-Academic-orange)

---

## Overview

**CollabHub** is a full-stack remote work collaboration platform built to streamline **project management, task tracking, and team productivity** for distributed teams.

Developed using the **MERN stack (MongoDB, Express.js, React, Node.js)**, the application delivers a modern, responsive, and user-friendly experience while maintaining strong security practices.

The system introduces a **Smart Workload Balancer** that intelligently distributes tasks to ensure fair workload allocation among team members.

**Academic Project:** Sri Lanka Institute of Information Technology (SLIIT)  
**Duration:** March 10, 2025 – April 30, 2025  

---

## Key Features

### User Management
- Secure user registration with encrypted passwords (**bcrypt**)
- Email-based account verification  
- JWT authentication  
- Role-based access control (Project Manager / Team Member)

---

### Task Management
- Full **CRUD operations** for tasks  
- Set priority levels, descriptions, and due dates  
- Real-time task updates for better collaboration  
- Manual task assignment via team member selection  

---

### Smart Workload Balancer
Automatically assigns tasks using the formula:

```
Workload Score = (Tasks × 2) + (Urgent Tasks × 3) + (Complex Tasks × 5)
```

✔ Uses average task completion time as a tiebreaker  
✔ Allows managers to manually override assignments  

---

## Tech Stack

| Category | Technology |
|--------|-------------|
| **Frontend** | React, Tailwind CSS, Material-UI |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | JWT, bcrypt |
| **Real-Time** | Socket.IO |
| **Version Control** | Git, GitHub |

---

## Repository Structure

```
collabhub/
│
├── client/      # React frontend
├── server/      # Node.js & Express backend
├── docs/        # Documentation
└── README.md
```

---

## Prerequisites

Make sure you have installed:

- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (Local or Atlas)
- Git

---

## Installation

```bash
# Clone the repository
git clone https://github.com/manamendraJN/Collab-Hub.git

# Navigate into the project
cd collabhub

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

---

## Running the Application

```bash
# Start backend
cd server
npm start

# Start frontend
cd client
npm start
```

---

## Project Objectives

- Build a scalable full-stack collaboration platform  
- Implement secure authentication and authorization  
- Design an intelligent workload distribution system  
- Deliver a responsive, production-style UI  

---


