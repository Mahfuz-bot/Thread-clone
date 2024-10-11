import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';

(async () => {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(cors());
  app.use(express.json());

  const typeDefs = `
    type Query {
      hello: String
    }
  `;
  const resolvers = {
    Query: {
      hello: () => 'Hello, world!',
    },
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
