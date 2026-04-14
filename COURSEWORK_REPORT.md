# FocusFlow Study Planner
## Coursework Report Notes

## 1. Project Overview

FocusFlow Study Planner is a web application designed for students who experience difficulty starting, organizing, and sustaining academic work, especially students with ADHD traits or attention regulation challenges. The application is not intended to be a generic task list. Instead, it focuses on reducing friction, simplifying decisions, and helping users move from intention to action.

The project idea comes from a common real-world problem in higher education: students often know what they should do, but still struggle to begin. Traditional planning tools can become overwhelming because they show too many tasks, require too much setup, or do not support the transition from planning to concentrated work.

## 2. Problem Definition

The app addresses four related problems:

1. Large academic tasks are difficult to start when the first action is unclear.
2. Long task lists increase cognitive overload and reduce the likelihood of action.
3. Time management tools often separate planning from actual focused work.
4. After one work session ends, users lose momentum because there is no structured transition into rest or the next session.

These issues are especially relevant for students balancing coursework, project deadlines, and independent study.

## 3. Target Users

The main target users are:

- university and postgraduate students
- students with ADHD traits or executive function difficulties
- students who need a low-pressure planning workflow

The design can also support any user who prefers a simpler, quieter productivity tool.

## 4. Proposed Solution

FocusFlow solves the problem by combining lightweight planning with a built-in focus session workflow.

Key design ideas:

- quick task capture
- explicit smallest-next-step input
- limited visible priorities through Today Focus
- large full-screen countdown mode for focused work
- a break mode after work to preserve energy and support the Pomodoro rhythm
- user-adjustable timer settings
- bilingual Chinese/English interface for accessibility and presentation

## 5. Main Features

### 5.1 Task Capture

Users can create tasks with:

- title
- course or project
- due date
- smallest next step
- energy level
- Today Focus toggle

This supports low-friction entry while still preserving useful context.

### 5.2 Today Focus

Instead of showing every task equally, the app surfaces only a small number of active priorities. This reduces visual overload and helps users focus on starting rather than browsing.

### 5.3 Focus Mode

When the user presses `Start now`, the interface moves into a full-screen focus session. The page becomes a large countdown timer, similar to a Pomodoro tool, with the current task and its next step kept visible.

### 5.4 Break Mode

After a work round ends, the app can automatically transition into a break round. This creates a better productivity loop and supports a healthier work rhythm.

### 5.5 Settings

Users can adjust:

- quick-start duration
- standard focus duration
- deep-focus duration
- break duration
- whether breaks should auto-start

This adds flexibility without turning the application into a complex system.

### 5.6 Bilingual Interface

The user can switch between Chinese and English. This improves usability for bilingual users and makes the app easier to present in an academic setting.

## 6. Design Rationale

The app follows a low-cognitive-load design approach.

Important design choices:

- unnecessary explanatory text was removed from the main interface
- the visual structure was simplified to emphasize action over reading
- task cards avoid excessive density
- the focus session uses one dominant visual element: the countdown
- the language is supportive rather than punitive

This is consistent with ADHD-friendly design principles: reduce noise, shorten decision paths, and make the next action obvious.

## 7. Technical Implementation

The project is implemented as a React single-page application.

Technical details:

- React functional components and hooks
- LocalStorage persistence for tasks, language, and timer settings
- custom CSS for responsive layout and focus-mode styling
- browser Notification API for lightweight reminders
- unit tests for key UI behavior

The system currently works as a front-end prototype. It does not yet include:

- user authentication
- cloud synchronization
- backend database integration
- analytics or reporting

## 8. How It Meets The Coursework Requirement

This project satisfies the coursework requirement in the following ways:

1. It is a genuine web application rather than a static prototype.
2. It solves a real-world problem in an information technology and education context.
3. It has a clear target user group and a focused use case.
4. It demonstrates application development techniques including state management, persistence, responsive UI design, bilingual interaction, and user-centered workflow design.
5. It is broad enough to support discussion in the written report about design decisions, technical choices, user needs, and future enhancement.

## 9. Limitations

Current limitations include:

- data is stored only in the browser
- the app is single-user
- there is no account system or cross-device sync
- reminders depend on browser capabilities

These are acceptable for a capstone prototype, but they also define a clear path for future development.

## 10. Future Improvements

Potential future enhancements:

- backend database and authentication
- cloud sync across devices
- optional sound notifications
- usage analytics and productivity trends
- break history and session logs
- adaptive focus suggestions based on user behavior

## 11. Conclusion

FocusFlow Study Planner is not just a task manager. It is a focused solution for students who struggle with task initiation and sustained attention. By combining low-friction task capture, a narrowed task view, full-screen countdown sessions, and break-mode support, the app demonstrates how a web application can be designed around a specific user need and a real-world problem.
