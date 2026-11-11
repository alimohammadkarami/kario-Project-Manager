# Project Management API

Node.js + Express + MySQL. Layers: `routes -> middlewares -> controllers -> business -> models`.

## Run
```bash
cp .env.example .env      # fill in secrets + DB
npm install
npm run db:init           # FRESH install: creates the database and all tables
npm run db:migrate        # EXISTING database: adds users.role + tickets (safe to re-run)
npm run dev
```
Without `BREVO_API_KEY` (development only) verification emails are printed to the console.

## Auth endpoints (`/api/v1/auth`)
| Method | Path | Auth | Body |
|---|---|---|---|
| POST | /register | - | fullName, email, password, confirmPassword |
| POST | /login | - | email, password |
| POST | /verification-code | - | email |
| POST | /verify | - | email, code -> returns `resetToken` |
| POST | /forgot-password | - | resetToken, password, confirmPassword |
| PATCH | /modify-info | Bearer | fullName |
| GET | /me | Bearer | - |

Response envelope: `{ success, error, data, message }`.

## Roles
| Role | Value | How it is assigned |
|---|---|---|
| مشترک / عضو | `subscriber` | automatically on public `/auth/register` |
| پرسنل پشتیبانی | `support` | `POST /users/support-staff` (admin only) |
| مدیر پلتفرم | `admin` | manually in the database, no route: `UPDATE users SET role='admin' WHERE email='you@example.com';` |

## Ticketing (`/api/v1`, all routes need `Authorization: Bearer <token>`)
| Method | Path | Who | Notes |
|---|---|---|---|
| POST | /tickets | any logged-in user | body: title, description. Rate limited per user |
| GET | /tickets/mine | any logged-in user | own tickets, newest first. Query: page, limit, status |
| GET | /tickets | support | all tickets with owner info. Query: page, limit, status |
| POST | /tickets/:id/answer | support | body: answer. One answer per ticket, then status = `answered` |
| POST | /users/support-staff | admin | body: email |

Tracking code format: `<Jalali date YYYYMMDD>-<row id, 4 digits>` e.g. `14050412-0027`.

## Projects & tasks (`/api/v1`, all routes need `Authorization: Bearer <token>`)
Dates are sent and returned in Jalali (`1405/4/12`). The creator of a project is its manager (`owner`); everyone added later is a `member`.
Authorization lives in `src/business/projectAccess.js` (member / manager checks). Non-members get 404. Archived projects are read-only.

| Method | Path | Who | Notes |
|---|---|---|---|
| POST | /projects | any user | title, description?, dueDate? |
| GET | /projects | any user | projects I belong to, full details. Query: page, limit, archived |
| GET | /projects/:projectId | member | preview: progress, members, task breakdown, overdue tasks |
| PATCH | /projects/:projectId | manager | title / description / dueDate |
| DELETE | /projects/:projectId | manager | physical delete (members + tasks included) |
| PATCH | /projects/:projectId/archive | manager | body: isArchived (default true) |
| GET | /projects/:projectId/members | member | name, role, join date |
| POST | /projects/:projectId/members | manager | body: email ("کاربر یافت نشد" if unknown) |
| DELETE | /projects/:projectId/members/:userId | manager | member's tasks become unassigned |
| POST | /projects/:projectId/tasks | manager | title, description?, dueDate?, assigneeId? |
| GET | /projects/:projectId/tasks | member | Query: page, limit, status |
| GET | /tasks/mine | any user | tasks assigned to me across projects. Query: page, limit, status |
| PATCH | /tasks/:taskId/status | the task's assignee | body: status (todo / in_progress / done). Unassigned tasks can't change status |
| PATCH | /tasks/:taskId | manager | title / description / dueDate / assigneeId (null = unassign) |
| DELETE | /tasks/:taskId | manager | |

