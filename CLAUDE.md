# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application called "にじユニットDB" (Niji Unit DB) - a database for Nijisanji VTuber collaboration units and groups. The app provides unit listings, advanced search functionality, and quiz features about Nijisanji collaborations.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Build for production with Turbopack  
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code with Prettier
npm run format

# Type checking
npm run typecheck
```

The development server runs on http://localhost:3000

## Architecture & Technology Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4
- **Search**: Fuse.js for fuzzy search functionality
- **Icons**: Lucide React
- **Utilities**: clsx and tailwind-merge for conditional styling

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layout
├── components/       # React components
│   ├── ui/          # Basic UI components (buttons, inputs, etc.)
│   └── features/    # Feature-specific components  
├── lib/             # Utility functions and shared logic
├── types/           # TypeScript type definitions
└── data/            # JSON data files (units.json)
```

## Data Model

The core data model revolves around `UnitData` which represents Nijisanji collaboration units:

- **Units**: Groups/collaborations with members, categories, activities
- **Members**: Individual VTubers with branch info, status, roles
- **Activities**: Streams, songs, events associated with units
- **Search**: Advanced filtering by member count, category, status, branch, tags

Key types are defined in `src/types/unit.ts` and include branches (jp/en/id/kr/ex), unit categories (gaming/music/variety/collaboration/other), and member statuses.

## Search Implementation

The search system (`src/lib/search.ts`) uses Fuse.js with weighted keys:
- Unit names (Japanese, reading, English) - highest weight
- Member names - medium weight  
- Tags and descriptions - lower weight

Search supports both text queries and multi-dimensional filtering.

## Data Management

Unit data is stored in `src/data/units.json` following the `UnitData` interface. When adding new units, maintain the existing JSON structure with required fields like id, name, members, category, status, tags, lastUpdated, and sources.

## Path Aliases

TypeScript is configured with `@/*` alias pointing to `./src/*` for clean imports.

## Linting & Formatting

- ESLint with Next.js and TypeScript rules
- Prettier for code formatting
- Always run `npm run typecheck` before committing changes