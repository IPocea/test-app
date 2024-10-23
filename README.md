# test-app

## Server Setup
- Add an .env file in backend folder with the below details (replace POSTGRES_PASSWORD with the real password):
```bash
PORT=8080
NODE_ENV=dev
DATABASE_URL=postgres:POSTGRES_PASSWORD@localhost:5432/persons
RUN_CRON=true
POOL_MIN=0
POOL_MAX=5
AQUIRE=30000
IDLE=10000
```
- Run scripts:
  - npm run install:api
  - npm run isntall:web

## Run app:
- npm run start:api
- npm run start:web
