# we-regret-to-present

[![Next.js](https://img.shields.io/badge/next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/GHCR-ghcr.io%2Fsim--pez%2Fwe--regret--to--present-blue?logo=docker)](https://github.com/sim-pez/we-regret-to-present/pkgs/container/we-regret-to-present)

A Next.js dashboard that visualizes your job rejection statistics — because your suffering deserves a beautiful UI.

**Live:** https://rejectlytics.simpez.uk/

## Overview

This service reads from the `rejectlytics` PostgreSQL database and renders an interactive, dark-themed dashboard with a word cloud of rejection email vocabulary and a grid of humiliating metrics: rejection rate, ghosting rate, pain index, rejection streaks, fastest rejection, and more.

## We regret stack

This is a service in the "We regret" stack, a collection of services that process recruiter emails and maintain a comprehensive job application history.

The stack is as follows:
- **n8n** — monitors your email inbox, extracts relevant emails, and produces them to the `emails` Kafka topic
- **we-regret-to-persist** — processes application confirmations and rejections, maintains the source of truth in Postgres
- **postgres** — serves as the single source of truth for all application statuses and statistics
- **we-regret-to-present** (this service) — visualizes your application history as a dashboard

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS (dark theme) |
| Database | PostgreSQL (`pg`) |
| Visualization | d3-cloud, d3-scale, d3-scale-chromatic |
| Fonts | Playfair Display + JetBrains Mono |
| CI/CD | GitHub Actions → GHCR |

## Prerequisites

- Node.js 18+
- Docker & Docker Compose (or a running PostgreSQL instance with the `rejectlytics` database)

## Getting started

**1. Configure environment**

```bash
cp .env.example .env
# Fill in your Postgres credentials
```

**2. Install dependencies**

```bash
npm install
```

**3. Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## CI/CD

GitHub Actions runs lint and build checks on every push. On version tags (`v*`), it builds and pushes a Docker image to GitHub Container Registry.

```bash
docker build -t we-regret-to-present:latest .
```
