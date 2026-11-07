#!/bin/bash
cd /app/pipc-app/backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
cd /app/pipc-app/frontend
npm run dev -- --host 0.0.0.0 --port 3000 &
wait
