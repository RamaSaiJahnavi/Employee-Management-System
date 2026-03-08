# Employee Frontend

React + Vite frontend for the Employee Management System.

## Run locally

```bash
npm install
npm run dev
```

## API configuration

Create a `.env` file from `.env.example` and set your backend URL:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

For mobile testing on the same Wi-Fi, use your laptop IP:

```bash
VITE_API_BASE_URL=http://<YOUR_LOCAL_IP>:8080
```

## Build

```bash
npm run build
```

## Deploy on Vercel

1. Import this repo in Vercel.
2. Set **Root Directory** to `employee-frontend`.
3. Add environment variable `VITE_API_BASE_URL` with your backend public URL.
4. Deploy.

`vercel.json` already includes SPA rewrite support.
