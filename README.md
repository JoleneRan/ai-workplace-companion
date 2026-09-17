# AI Workplace Assistant

An AI-powered workplace productivity assistant designed to help professionals streamline everyday tasks, improve communication, plan their workload, and research information more efficiently.

## Overview

**AI Workplace Companion** is a modern, responsive SaaS-style web application that brings several AI-powered productivity tools into one workspace.

The application allows users to generate professional emails, create intelligent task schedules, research topics and articles, and interact with an AI workplace assistant through a conversational interface.

The application is designed as a **frontend-first project** with no database, authentication, or persistent user data storage.

> **Responsible AI:** AI-generated content may contain errors. Users should review and verify important information before using it.

## Features

### Smart Email Generator

* Generate professional emails using AI.
* Supports multiple communication tones:

  * Formal
  * Friendly
  * Persuasive
* Brief-to-detailed conciseness control.
* Sample data loading.
* Editable AI-generated email output.
* Copy and regenerate functionality.

### AI Task Planner

* Generate AI-powered daily schedules.
* Generate weekly schedules.
* Intelligent task prioritization.
* Preset scenarios:

  * Project Launch
  * Weekly Review
* Editable generated schedules.

### AI Research Assistant

* Research a topic using AI.
* Summarize pasted articles or content.
* Accept user-provided URLs.
* Generate:

  * Summaries
  * Key insights
  * Recommendations
* Editable and copyable AI-generated results.
* Does not invent research results when source content cannot be accessed.

### AI Workplace Chat

* Interactive AI workplace assistant.
* Dynamically generated responses based on user prompts.
* Supports workplace productivity, planning, brainstorming, writing, and research.
* Conversation context within the current session.
* Copy and regenerate responses.
* Clear conversation functionality.

### Modern Dashboard

* Responsive SaaS dashboard design.
* Collapsible sidebar navigation.
* Dashboard overview.
* Cmd+K / Ctrl+K command palette.
* Light and Dark Mode.
* Slate/indigo visual foundation.
* Mint and violet pastel accents.
* Responsive desktop, tablet, and mobile layouts.

## Technologies & Tools

* **React** — User interface development
* **TypeScript** — Type-safe application development
* **Vite** — Development server and build tooling
* **Tailwind CSS** — Responsive styling and UI design
* **AI / LLM API** — Dynamic AI-generated responses
* **Lucide Icons** — Interface icons
* **Git & GitHub** — Version control and repository hosting
* **Lovable** — AI-assisted application development

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/ai-workplace-companion.git
```

### 2. Navigate to the project

```bash
cd ai-workplace-companion
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure the AI API

Create a `.env` file in the project root and add the required AI API configuration.

Example:

```env
VITE_AI_API_KEY=your_api_key_here
```

> Never commit API keys or other secrets to GitHub. Add `.env` to `.gitignore`.

### 5. Start the development server

```bash
npm run dev
```

The application will be available at the local development URL provided by Vite.

### 6. Build for production

```bash
npm run build
```

## Project Architecture

The application is organized around independent productivity tools:

```text
AI Workplace Companion
│
├── Dashboard
├── Smart Email Generator
├── AI Task Planner
├── AI Research Assistant
├── AI Workplace Chat
├── Command Palette
└── Theme Settings
```

## Data & Privacy

This project does not use a database or persistent storage.

* No user accounts
* No authentication
* No database
* No persistent conversation history
* No intentional storage of generated workplace content

AI requests may be processed by the configured third-party AI provider according to that provider's policies.

## Author

**Jolene Rankin**

GitHub: [Add your GitHub profile URL]

---

If you find this project useful, consider giving the repository a star.


