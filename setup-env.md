# Environment Setup Instructions

## Frontend Environment Variables
Create a file called `.env` in the `frontend` folder with:
```
VITE_API_BASE_URL=http://localhost:4000
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Backend Environment Variables
Create a file called `.env` in the `backend` folder with:
```
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## How to Run

1. **Start the backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Open your browser to:** http://localhost:5173

## Connection Status
The frontend now shows connection status indicators:
- ✅ Green: Connected to backend
- ❌ Red: Backend disconnected
- 🔄 Gray: Checking connection

If you see a red status, make sure the backend is running on port 4000.
