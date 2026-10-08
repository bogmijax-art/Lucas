# NexusFlow Client

A story-first React + TypeScript + Vite client for Infinity Labs Technologies LLC and its NexusFlow product.

## Experience structure

- `/` — Infinity Labs company introduction and NexusFlow product story
- `/login` — workspace sign-in
- `/register` — workspace creation
- `/workspace` — authenticated NexusFlow workspace
- `/workspace/customers`
- `/workspace/projects`
- `/workspace/tasks`
- `/workspace/appointments`
- `/workspace/notifications`
- `/workspace/activity`

## Run

```bash
npm install
npm run dev
```

Create `.env` from `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

The public company experience is intentionally presentation-oriented: strong opening, company purpose, capabilities, mission, vision, and product reveal. The authenticated area remains operational and data-focused.
