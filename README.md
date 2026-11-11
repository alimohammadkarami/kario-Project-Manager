# Kario — Project Management Platform

<div align="center">

  <h1> KARIO </h1>

  **A Smarter Way to Manage Projects & Teams.**

  A modern project management platform designed to help teams organize projects, manage tasks, and collaborate more efficiently.

  <br />

  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
  ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)


</div>

---

## Overview

**Kario** is a project management platform built to simplify how teams plan, organize, and manage their work.

It provides a centralized environment where teams can manage projects, organize tasks, collaborate with members, and maintain better control over their workflow.

Kario aims to make project management more intuitive, efficient, and accessible through a clean and modern user experience.

## Features ( MVP )

- **Project Management** — Create, organize, and manage projects in one centralized workspace.
- **Task Management** — Organize project tasks and keep track of work progress.
- **Team Collaboration** — Work together with team members in a shared environment.
- **Authentication** — Secure user authentication and account management.
- **Role Management** — Manage user roles and access permissions.
- **Modern UI** — A clean, responsive, and user-friendly interface.
- **Centralized Workflow** — Keep project-related activities organized and accessible.

> Note: Features are subject to change as development progresses.

## Tech Stack

The project uses modern web technologies to provide a maintainable and scalable development environment.

| Technology | Purpose |
|---|---|
| TypeScript | Type-safe development |
| JavaScript (react) | Frontend development |
| Node.js | Backend runtime |
| Express.js | Backend framework |
| MVC Architecture | Backend project structure |
| REST API | Client-server communication |

## Project Architecture

Kario follows a modular architecture to keep the frontend and backend separated and maintainable.

### Frontend

The frontend is responsible for the user interface, user interactions, and communication with the backend API.

### Backend (`api/`)

**Important:** The `api/` directory contains the backend application.

It is a separate application and must be started independently in its own terminal. Running the frontend does not automatically start the backend.

The backend follows the MVC (Model-View-Controller) architectural pattern.

Its main responsibilities include:

- Handling HTTP requests and responses.
- Managing authentication and authorization.
- Processing business logic.
- Interacting with the database.
- Providing REST API endpoints.

### Architecture Overview

```text
KARIO/
│
├── api/                # Backend application
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── src/                # Frontend application
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── ...
│
├── package.json
└── README.md
```

*The directory structure above is illustrative and may differ from the actual implementation.*

## Getting Started

Follow these instructions to set up and run Kario locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
```

Navigate to the project directory:

```bash
cd Kario
```

### 2. Install Frontend Dependencies

From the project root directory:

```bash
npm install
```

### 3. Install Backend Dependencies

Open a terminal and navigate to the `api` directory:

```bash
cd api
npm install
```

### 4. Configure Environment Variables

Create the required `.env` files based on the environment configuration of each application.

### 5. Run the Applications

**Important:** The frontend and backend must run separately in two different terminals.

**Terminal 1 — Backend**

```bash
cd api
npm run dev
```

**Terminal 2 — Frontend**

From the project root:

```bash
npm run dev
```
Once both applications are running, open the frontend development URL displayed in your terminal.

## API Modules

The backend is organized into independent modules to improve maintainability and separation of concerns.

| Module | Responsibility |
|---|---|
| Auth | Authentication and user access |
| Projects | Project creation and management |
| Tasks | Task management and organization |

Each module follows a modular MVC structure, separating database operations, request handling, and routing responsibilities.

## Development Workflow

When working on Kario, keep the following guidelines in mind:

1. Keep frontend and backend responsibilities separated.
2. Follow the existing MVC architecture in the backend.
3. Write reusable and maintainable code.
4. Keep API responses consistent.
5. Validate incoming data and handle errors properly.
6. Use environment variables for sensitive configuration.
7. Test changes before submitting them.

## Contributing

Contributions, suggestions, and improvements are welcome.

If you want to contribute:

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "feat: add your feature"
   ```

4. Push your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a Pull Request.

Please keep your contributions consistent with the existing project architecture and coding conventions.

## License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for more information.

---

<div align="center">

  **Kario — Plan Better. Work Smarter. Build Together.**

  Made with ❤️ for better teamwork.

</div>
