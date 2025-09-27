# Gemini Code Assistant Context

## Project Overview

This is a Next.js 14 (App Router) web application that serves as a database for Nijisanji collaboration units. It's built with TypeScript and styled with Tailwind CSS. The main features include a comprehensive list of units, advanced search functionality powered by Fuse.js, and a quiz feature. The application is designed to be responsive and is deployed on Vercel.

The data for the units is stored in a JSON file at `src/data/units.json`. The structure of this data is defined by the `UnitData` type in `src/types/unit.ts`.

## Building and Running

### Prerequisites

- Node.js
- npm

### Key Commands

- **Install dependencies:**
  ```bash
  npm install
  ```

- **Run the development server:**
  ```bash
  npm run dev
  ```
  The site will be available at [http://localhost:3000](http://localhost:3000).

- **Build for production:**
  ```bash
  npm run build
  ```

- **Run the production server:**
  ```bash
  npm run start
  ```

- **Lint the code:**
  ```bash
  npm run lint
  ```

- **Run type checking:**
  ```bash
  npm run typecheck
  ```

## Development Conventions

### Project Structure

The project follows a standard Next.js App Router structure:

```
src/
├── app/              # Next.js App Router pages
├── components/       # UI and feature components
│   ├── ui/           # Basic UI components
│   └── features/     # Feature-specific components
├── lib/              # Utility functions
├── types/            # TypeScript type definitions
└── data/             # JSON data files
```

### Coding Style

- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Formatting:** Prettier (run with `npm run format`)
- **Linting:** ESLint (run with `npm run lint`)

### Data Management

Unit data is managed in `src/data/units.json`. When adding or updating units, ensure the data conforms to the `UnitData` interface defined in `src/types/unit.ts`.
