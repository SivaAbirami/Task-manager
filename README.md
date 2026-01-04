# Task Management Application

MERN stack application with PostgreSQL database.

## Features
- User authentication (JWT)
- Task CRUD operations
- Dashboard with Chart.js statistics
- PostgreSQL database with Sequelize ORM

## Application Flows

### Authentication Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    %% Registration
    User->>Frontend: Fills Registration Form
    Frontend->>Backend: POST /auth/register
    Backend->>Database: Check if user exists
    alt User exists
        Database-->>Backend: User found
        Backend-->>Frontend: Error: User already exists
    else User does not exist
        Backend->>Database: Create new user
        Database-->>Backend: User created
        Backend->>Backend: Generate JWT
        Backend-->>Frontend: Return User + Token
    end

    %% Login
    User->>Frontend: Fills Login Form
    Frontend->>Backend: POST /auth/login
    Backend->>Database: Find user by email
    alt User not found
        Database-->>Backend: null
        Backend-->>Frontend: Error: Invalid credentials
    else User found
        Backend->>Backend: Verify Password
        alt Password valid
            Backend->>Backend: Generate JWT
            Backend-->>Frontend: Return User + Token
        else Password invalid
            Backend-->>Frontend: Error: Invalid credentials
        end
    end
```

### Task Management Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    opt Create Task
        User->>Frontend: Click "Add Task"
        Frontend->>Backend: POST /api/tasks (Auth Header)
        Backend->>Backend: Verify Token
        Backend->>Database: Insert Task
        Database-->>Backend: Task Created
        Backend-->>Frontend: Return Task
    end

    opt Get Tasks
        User->>Frontend: Opens Dashboard
        Frontend->>Backend: GET /api/tasks (Auth Header)
        Backend->>Backend: Verify Token
        Backend->>Database: Select Tasks where userId = user.id
        Database-->>Backend: List of Tasks
        Backend-->>Frontend: Display Tasks
    end

    opt Update Task
        User->>Frontend: Edit Task
        Frontend->>Backend: PUT /api/tasks/:id (Auth Header)
        Backend->>Backend: Verify Token
        Backend->>Database: Find Task and Update
        Database-->>Backend: Updated Task
        Backend-->>Frontend: Update UI
    end

    opt Delete Task
        User->>Frontend: Delete Task
        Frontend->>Backend: DELETE /api/tasks/:id (Auth Header)
        Backend->>Backend: Verify Token
        Backend->>Database: Delete Task
        Database-->>Backend: Confirm Deletion
        Backend-->>Frontend: Remove from UI
    end
```

## Live Demo
- Frontend: 
![Login](login.png)
![Home](home.png)
![Task](task.png)

- Backend API: 

The backend is built with Node.js and Express, providing a RESTful API for secure user authentication and task management. It utilizes Sequelize ORM to interact with the PostgreSQL database.

## Local Development
[Your local setup instructions]
add env 
    PORT=5000
    NODE_ENV=development
    JWT_SECRET=your_jwt_secret
    DB_NAME=your_db_name
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_HOST=localhost
    DB_PORT=5432
    SUPABASE_URL=your_supabase_connection_string



    deployed url : https://task-ntgu.onrender.com

