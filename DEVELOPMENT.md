# Local Development Setup

## Prerequisites
- Node.js 20+
- pnpm
- PostgreSQL database (or a Neon account for a free cloud database)
- Google Gemini API Key (from https://aistudio.google.com/app/apikey)

## Step 1: Set Up Environment Variables
1. Copy `.env.example` to `.env` in the project root:
   ```bash
   cp .env.example .env
   ```
2. Set your environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string (from Neon or local Postgres)
   - `VITE_GEMINI_API_KEY`: Your Google Gemini API key (create one at https://aistudio.google.com/app/apikey)

   Also, if running frontend locally, you can create a `artifacts/synapse/.env.local` file (copy from .env.local.example)

## Step 2: Install Dependencies
```bash
pnpm install
```

## Step 3: Push Database Schema
```bash
pnpm --filter @workspace/db push
```

## Step 4: Seed Initial Data
```bash
pnpm --filter @workspace/scripts seed
```

## Step 5: Run the API Server
```bash
cd artifacts/api-server
pnpm dev
```

## Step 6: Run the Frontend
```bash
cd artifacts/synapse
pnpm dev
```
