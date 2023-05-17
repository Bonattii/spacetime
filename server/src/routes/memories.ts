import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { prisma } from '../lib/prisma';

export async function memoriesRoutes(app: FastifyInstance) {
  // Verify that the jwt was sent when the route was used
  app.addHook('preHandler', async request => {
    await request.jwtVerify();
  });

  app.get('/memories', async request => {
    // Get all the memories in asc order
    const memories = await prisma.memory.findMany({
      where: {
        userId: request.user.sub
      },
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

  app.get('/memories/:id', async (request, reply) => {
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

    // Check if the user is the owner of the memory and its not public
    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return reply.status(401).send();
    }

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
        userId: request.user.sub
      }
    });

    return memory;
  });

  app.put('/memories/:id', async (request, reply) => {
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

    // First get the memory
    let memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id
      }
    });

    // If the user is not the owner of the memory
    if (memory.userId !== request.user.sub) {
      return reply.status(401).send();
    }

    // Will update the content of the memory on the database
    memory = await prisma.memory.update({
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

  app.delete('/memories/:id', async (request, reply) => {
    // Will validate that the id is a uuid and a string
    const paramsSchema = z.object({
      id: z.string().uuid()
    });

    // Will garantee that we have this id
    const { id } = paramsSchema.parse(request.params);

    // First get the memory
    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id
      }
    });

    // If the user is not the owner of the memory
    if (memory.userId !== request.user.sub) {
      return reply.status(401).send();
    }

    // Will search and delete the memory on the database
    await prisma.memory.delete({
      where: {
        id
      }
    });
  });
}
