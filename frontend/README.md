# Micron Employee Referral Platform — Frontend

React + Vite frontend for the employee referral and HR portal.

## Run

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to the Spring Boot API base URL.

## Important integration contract

The frontend is now prepared for backend integration through `src/services/apiClients.js`.

### Referral

`POST /referrals`

```json
{
  "employeeId": "EMP001",
  "candidateName": "Candidate Name",
  "candidateEmail": "candidate@example.com",
  "candidatePhone": "+91...",
  "jobTitle": "Java Developer",
  "resumeUrl": "https://...",
  "note": "Candidate summary"
}
```

The API should return a created referral object or `{ "message": "..." }` on failure.

### Authentication

The current login/register screens still use **demo-only local authentication** so the UI can be developed before the Spring Boot auth API is finalized. Passwords are no longer stored as plaintext; the demo account stores a SHA-256 hash.

For production, replace this flow with backend authentication and a short-lived access token (preferably an HttpOnly secure cookie/session). Never store real passwords in browser storage.

Recommended backend endpoints:

- `POST /auth/employee/login`
- `POST /auth/employee/register`
- `POST /auth/hr/login`
- `POST /auth/logout`
- `GET /employees/me`
- `GET /referrals/mine`
- `POST /referrals`
- `GET /referrals/{id}`
- `GET /hr/candidates`
- `PATCH /hr/candidates/{id}/status`

## Important frontend changes

- Added protected employee/HR routes.
- Added `/login` compatibility redirect to employee login.
- Added the missing `/employee/refer` page and referral form.
- Added a real API client with configurable environment URL.
- Removed the broken `/images/image.png` dependency from the landing page.
- Removed plaintext demo passwords from local storage.
- Fixed settings so profile edits do not overwrite the stored password hash.
- Added 404 handling and HR logout.

## Frontend routes
- `/` Landing
- `/login` Portal selection
- `/employee/login` Employee sign in
- `/employee/register` Employee registration
- `/employee/dashboard` Employee dashboard
- `/employee/refer` Submit referral
- `/employee/referrals` My referrals
- `/employee/referrals/:id` Referral details
- `/employee/notifications` Notifications
- `/employee/profile` Employee profile
- `/employee/settings` Account settings
- `/hr/login` HR sign in
- `/hr/register` HR registration
- `/hr/dashboard` HR dashboard

## HR portal
The HR portal now includes protected routes for dashboard, candidates, candidate details, jobs, referrals, AI analysis, shortlisted candidates, profile, notifications and settings. Demo candidate/job data persists in localStorage until the Spring Boot APIs are connected.
