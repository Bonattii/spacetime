import { z } from 'zod';
import axios from 'axios';
import { FastifyInstance } from 'fastify';

import { prisma } from '../lib/prisma';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async request => {
    // Schema to validate that we receive the github code
    const bodySchema = z.object({
      code: z.string()
    });

    // Will validate that the code came with the body
    const { code } = bodySchema.parse(request.body);

    // Will make a post request to github to get the access token
    const accessTokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code
        },
        headers: {
          Accept: 'application/json'
        }
      }
    );

    // Get the access_token from the data of the response
    const { access_token } = accessTokenResponse.data;

    // Now that we have the access_token will get all the user information
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    // Will check if we will receive the correct data from the request
    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url()
    });

    // Take the user data from the response
    const userInfo = userSchema.parse(userResponse.data);

    // Will check if the user already exists on the db
    let user = await prisma.user.findUnique({
      where: {
        githubId: userInfo.id
      }
    });

    // If the user doesn't exists will create one on the db with the data
    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: userInfo.id,
          login: userInfo.login,
          name: userInfo.name,
          avatarUrl: userInfo.avatar_url
        }
      });
    }

    // Create a jwt token
    const token = app.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl
      },
      {
        sub: user.id,
        expiresIn: '30 days'
      }
    );

    return {
      token
    };
  });
}
