#!/bin/bash
cd /opt/knowledge-starmap
git pull origin main
cd backend
PATH=/root/.nvm/versions/node/v25.6.1/bin:$PATH npm install --production
PATH=/root/.nvm/versions/node/v25.6.1/bin:$PATH pm2 restart knowledge-starmap
