import { promisify } from 'node:util';
import { pipeline } from 'node:stream';
import { randomUUID } from 'node:crypto';
import { FastifyInstance } from 'fastify';
import { createWriteStream } from 'node:fs';
import { extname, resolve } from 'node:path';

const pump = promisify(pipeline);

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    // Get the file from the request
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880 // 5mb in bytes
      }
    });

    // If the user call the route but don't send any file
    if (!upload) {
      return reply.status(400).send();
    }

    // Checks if the file is an image or a video
    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/;
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype);

    // If the file is not an image or video
    if (!isValidFileFormat) {
      return reply.status(400).send();
    }

    // Change the name of the file to id.extension
    const fileId = randomUUID();
    const extension = extname(upload.filename);
    const fileName = fileId.concat(extension);

    // Save the file inside the uploads folder
    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads/', fileName)
    );

    // Will wait for the file to upload completely
    await pump(upload.file, writeStream);

    // Get the full url of the backend like http://localhost:3333
    const fullUrl = request.protocol.concat('://').concat(request.hostname);
    // Create one url for the file
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString();

    return { fileUrl };
  });
}
