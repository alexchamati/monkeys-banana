# Monkey Feeder 🐒

A frontend application to feed your favorite monkeys.

## Prerequisites

- Node.js >= 18
- pnpm

## Installation

```bash
pnpm install
```

## Configuration

Create a `.env` file at the root of the project:

```env
VITE_API_BASE_URL=https://test-backend.avahi.node.monkeypatch.io
VITE_BLOCKED_EMAIL=bongo@monkeypatch.io
```

## Start the project

```bash
pnpm run dev
```

## Pages

- `/login` — Email-based authentication
- `/feed` — Feed your monkeys (3 bananas to distribute)
- `/dashboard` — Ranking of the most fed monkeys

## Tech stack

- React 19 + TypeScript
- Vite
- React Router v7
- CSS Modules
- Sonner (toast notifications)

## Architecture

This project follows a hexagonal architecture pattern:

- `domain/` — Entities and repository interfaces (ports)
- `application/` — Use cases (business logic)
- `infrastructure/` — HTTP adapters implementing the ports
- `pages/` — React pages
- `components/` — Shared components
