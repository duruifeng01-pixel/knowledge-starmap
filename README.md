# 知识星图 (Knowledge Starmap)

A knowledge graph application for interconnected concepts and learning paths.

## Architecture

- **mini-program/**: WeChat mini-program frontend
- **backend/**: Node.js Express API server
- **content-fetcher/**: Python content extraction service
- **docs/**: Design specifications and implementation plans

## Prerequisites

- Docker & Docker Compose
- Node.js 18+
- Python 3.10+

## Quick Start

### 1. Start Infrastructure

```bash
cd knowledge-starmap
docker-compose up -d
```

### 2. Setup Backend

```bash
cd knowledge-starmap/backend
cp ../.env.example .env
npm install
npm run dev
```

### 3. Setup Content Fetcher

```bash
cd knowledge-starmap/content-fetcher
pip install -r requirements.txt
python -m fetcher
```

## Environment Variables

See `.env.example` for required configuration.

## Development

- Backend runs on http://localhost:3000
- Content Fetcher runs on http://localhost:3001
- PostgreSQL on port 5432
- Redis on port 6379
