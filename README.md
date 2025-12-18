# Library-Management-System
Web application where users can manage their personal library. Users can add, edit, or delete books, organize them by genre, and track their reading status. An admin user will have the authority to manage all books and users.

## ☑️ Setup:
Get repo:
```
git clone https://github.com/Liburn-Krasniqi/Library-Management-System.git
```

### 💻 Setup Client:
In a terminal window run:
```
cd client
npm i
npm run dev
```

### ⚙️ Setup backend:
create a `.env` file inside `server/` by running this inside server:
```
cat <<EOF > .env
PYTHON_API_URL=http://localhost:5001
DATABASE_URL=postgresql://postgres:1234@localhost:5434/nest?schema=public
ACCESS_TOKEN_SECRET=950e9172afab670445756343eb5bafc027b04679d45bcbb561324701723b910d78cd49224d5e8fdcf564fc31079774bf992f85d57681f4dc9e5acc46144a7ab6
EOF
```

Now in a seperate terminal window run:
```
cd server
npm i
docker compose up library -d
npx prisma migrate dev
npx prisma generate
```

then finaly:
```
npm run start:dev
```

### 🧠 ML setup:
Seperate window again
```
cd ML 
python3 python_recommendation_api.py
```

---
### Core:
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

### DB and Vector Store:

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Milvus](https://img.shields.io/badge/Milvus-2C90D0?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDI0QzUuMzczIDI0IDAgMTguNjI3IDAgMTJDMC41MDU3IDQuNjM4IDUuNDc4IDAgMTIgMEMxOC41MjIgMCAyNCA1LjQ3OCAyNCAxMkMyNCAxOC41MjIgMTguNTIyIDI0IDEyIDI0WiIgZmlsbD0iIzJDOTBEMCIvPgo8L3N2Zz4K&logoColor=white)

### Infrastructure:

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

# Architecture overview
```mermaid
flowchart TD
    subgraph "Frontend Layer"
        F[Vite + React + TypeScript]
    end

    subgraph "Backend Services"
        B[NestJS API<br/>+ Prisma ORM]
        ML[Python ML Server<br/>Goodreads 10K embeddings]
        AI[AI Query Agent<br/>Natural Language Processing]
    end

    subgraph "Data Layer"
        DB[(PostgreSQL)]
    end

    F -- "REST/GraphQL" --> B
    F -- "Direct Book Recommendations" --> ML
    B -- "CRUD Operations" --> DB
    AI -- "NL Queries<br/>e.g., 'Who owns most books?'" --> DB
    AI -- "Query Results" --> B
    B -- "User Data" --> ML 
```

---  

## Core Components
Frontend: Modern React application with TypeScript, built with Vite

Backend API: NestJS framework with Prisma ORM for database operations

ML Service: Python-based recommendation engine using Goodreads embeddings

AI Query Agent: Processes natural language admin queries with database verification

Database: PostgreSQL for persistent storage

## Key Features

Personal library management (books, genres, reading status)

Admin management capabilities

Direct ML-powered book recommendations

Natural language querying for admin analytics

Infrastructure
Docker Compose for service orchestration
