import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { prisma } from '../lib/prisma';

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    // Get all the memories in asc order
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Will return just 115 char of the content of the memory
    return memories.map(memory => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...')
      };
    });
  });

  app.get('/memories/:id', async request => {
    // Will validate that the id is a uuid and a string
    const paramsSchema = z.object({
      id: z.string().uuid()
    });

    // Will garantee that we have this id
    const { id } = paramsSchema.parse(request.params);

    // Will search for the memory on the database
    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id
      }
    });

    return memory;
  });

  app.post('/memories', async request => {
    // Will validate the data
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    });

    // Will garantee that we have all the information needed
    const { content, isPublic, coverUrl } = bodySchema.parse(request.body);

    // Will create the memory on the database
    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: '74d1fd6a-4c3b-4b56-8e64-7f7cbb98a2ee'
      }
    });

    return memory;
  });

  app.put('/memories/:id', async request => {
    // Will validate that the id is a uuid and a string
    const paramsSchema = z.object({
      id: z.string().uuid()
    });

    // Will garantee that we have this id
    const { id } = paramsSchema.parse(request.params);

    // Will validate the data
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    });

    // Will garantee that we have all the information needed
    const { content, isPublic, coverUrl } = bodySchema.parse(request.body);

    // Will update the content of the memory on the database
    const memory = await prisma.memory.update({
      where: {
        id
      },
      data: {
        content,
        coverUrl,
        isPublic
      }
    });

    return memory;
  });

  app.delete('/memories/:id', async request => {
    // Will validate that the id is a uuid and a string
    const paramsSchema = z.object({
      id: z.string().uuid()
    });

    // Will garantee that we have this id
    const { id } = paramsSchema.parse(request.params);

    // Will search and delete the memory on the database
    await prisma.memory.delete({
      where: {
        id
      }
    });
  });
}
