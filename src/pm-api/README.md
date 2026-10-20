# Project Management API

Node.js + Express + MySQL. Layers: `routes -> middlewares -> controllers -> business -> models`.

## Run
```bash
cp .env.example .env      # fill in secrets + DB
npm install
npm run db:init           # creates the database and tables
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
