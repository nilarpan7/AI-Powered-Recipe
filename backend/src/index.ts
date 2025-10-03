import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { json } from 'express';
import { recipesRouter } from './routes/recipes.js';

const app = express();

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: frontendOrigin, credentials: true }));
app.use(json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api', recipesRouter);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});


