import 'dotenv/config';

import fastify from 'fastify';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';

import { authRoutes } from './routes/auth';
import { memoriesRoutes } from './routes/memories';

const app = fastify();

// All urls can access the backend
app.register(cors, {
  origin: true
});

// Register jwt on the application
app.register(jwt, {
  secret: process.env.JWT_SECRET as string
});

app.register(memoriesRoutes);
app.register(authRoutes);

app
  .listen({
    port: 3333
  })
  .then(() => {
    console.log('HTTP server running on http://localhost:3333');
  });
