import dotenv from "dotenv";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import { prismaClient } from './lib/db';

(async () => {
  dotenv.config({
    path: "./.env",
  });
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(cors());
  app.use(express.json());

  const typeDefs = `
    type Query {
      hello: String
    }
    type Mutation {
      createUser(firstName: String!,lastName:String!,email:String!,password: String!):Boolean
    }
  `;
  const resolvers = {
    Query: {
      hello: () => 'Hello, world!',
    },
    Mutation: {
      createUser: async (any: { any: any }, { firstName, lastName, email, password }: { firstName: string, lastName: string, email: string, password: string }) => {
        await prismaClient.user.create({
          data: {
            email,
            firstName,
            lastName,
            password,
            salt: 'random_salt',
          }
        })
        return true
      }
    }
  };

  const gqlServer = new ApolloServer({ typeDefs, resolvers });
  await gqlServer.start();

  app.get('/', (req, res) => {
    res.send({ message: "server is up!" });
  });

  app.use('/graphql', expressMiddleware(gqlServer));

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
})();
