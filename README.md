# Reading List

A small web app for searching books and tracking what you read. Search the Open Library catalog, view book details, and organize books into To Read, Reading and Finished shelves.

## Tech stack

- Next.js 16 (App Router) and TypeScript
- Plain CSS
- Open Library API (no API key needed)
- React Context with localStorage for the reading list
- jose for the signed session cookie
- Vitest and React Testing Library for unit tests

## Features

- **Login** with a demo account, protected routes and logout
- **Search** books by title or author, with loading, error and empty states and a "Load more" button
- **Book detail** page with cover, author, year, description and subjects
- **My List** with three tabs (To Read, Reading, Finished). Books can be moved between tabs or removed, and the list is saved in the browser

## Getting started

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Demo login

- Username: `demo`
- Password: `reading123`

### Other scripts

```bash
npm test        # run unit tests
npm run build   # production build
npm start       # run the production build
```

## Project structure

```
app/
  (protected)/        pages behind login (search, list, book/[id])
  api/                login and logout routes
  login/              login page
components/           navbar, bookcard
context/              reading list state
lib/                  auth helpers, Open Library client
proxy.ts              redirects logged-out users to /login
__tests__/            unit tests
```

## Notes

- The session secret falls back to a built-in demo value so the app runs without any setup. Set `AUTH_SECRET` in a `.env.local` file to use your own.
- The reading list is stored in localStorage, so it is per browser and is not shared between users.