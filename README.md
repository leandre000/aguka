# HRMS Frontend

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Backend API URL (required for deployment)
VITE_API_BASE_URL=https://your-backend-domain.com/api

# For local development, you can use:
# VITE_API_BASE_URL=http://localhost:5000/api
```

## Development

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```
