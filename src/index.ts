import dotenv from "dotenv";
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import createGQLapolloServer from './graphql/index'
import UserService from "./services/user";
import { log } from "console";


(async () => {
  dotenv.config({
    path: "./.env",
  });
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;
  const JWT_SECRET = 'mahfuz'
  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send({ message: "server is up!" });
  });

  app.use('/graphql', expressMiddleware(await createGQLapolloServer(), {
    context: async ({ req }) => {
      // @ts-ignore
      try {
        const token = req.headers["token"]
        const user = await UserService.decodedJWTtoken(token as string)
        return { user }
      } catch (error) {
        return { error }
      }
    },
  }));

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
})();
