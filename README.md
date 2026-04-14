# FocusFlow Study Planner

FocusFlow is an ADHD-friendly study planning web application built to reduce the friction of getting started. Instead of behaving like a generic to-do list, it helps students capture tasks quickly, narrow attention to a few priorities, and move into a countdown-based focus session with a built-in break flow.

## What The App Does

- Quick task capture with only the essential fields
- Course or project tagging
- A smallest-next-step field to make large work easier to start
- Energy-based task lengths:
  - `5-minute start`
  - `25-minute focus`
  - `45-minute deep focus`
- Today Focus list that keeps only a small number of active priorities visible
- Full-screen focus mode with a large Pomodoro-style countdown
- Break mode after a work round, with optional auto-start
- Lightweight settings for timer durations and break behavior
- Status tracking with `To Do`, `In Progress`, and `Done`
- Deadline awareness with overdue and due-this-week summaries
- Bilingual UI with Chinese and English switching
- Local persistence using browser storage

## Why It Exists

Many students, especially students with ADHD traits or attention regulation difficulties, struggle with:

- starting large tasks
- keeping attention on only one task
- avoiding overwhelming task lists
- maintaining momentum after a focus round ends

FocusFlow responds to that with a lower-friction interaction model:

- fewer always-visible tasks
- a direct transition from task selection to focus mode
- a built-in rest cycle after work
- reduced explanatory copy on the main screen
- supportive language instead of punitive urgency

## Tech Stack

- React
- Create React App
- Custom CSS
- LocalStorage for task and settings persistence
- Browser Notification API for lightweight reminders

## Run Locally

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Test

```bash
npm test -- --watch=false
```

## Build

```bash
npm run build
```

## Coursework Notes

For a more submission-oriented explanation of the problem definition, target user, design rationale, and how the app satisfies the project requirement, see:

- [COURSEWORK_REPORT.md](/Users/eleanorchow/Desktop/todo-app/COURSEWORK_REPORT.md)
