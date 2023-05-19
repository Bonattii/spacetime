import 'dotenv/config';

import fastify from 'fastify';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import { resolve } from 'node:path';
import multipart from '@fastify/multipart';

import { authRoutes } from './routes/auth';
import { memoriesRoutes } from './routes/memories';
import { uploadRoutes } from './routes/upload';

const app = fastify();

app.register(multipart);

// Make the uploads folder public
app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads'
});

// All urls can access the backend
app.register(cors, {
  origin: true
});

// Register jwt on the application
app.register(jwt, {
  secret: process.env.JWT_SECRET as string
});

app.register(authRoutes);
app.register(uploadRoutes);
app.register(memoriesRoutes);

app
  .listen({
    port: 3333,
    host: '0.0.0.0'
  })
  .then(() => {
    console.log('HTTP server running on http://localhost:3333');
  });
