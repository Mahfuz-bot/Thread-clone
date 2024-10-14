import { ApolloServer } from '@apollo/server'
import { User } from './user/index';

async function createGQLapolloServer() {
  const gqlServer = new ApolloServer({
    typeDefs: `

      ${User.typeDefs}
      type Query {
        ${User.quries}
      }
      
      type Mutation {
        ${User.mutations}
      }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.quries, // Correct the property name to `queries`
      },
      Mutation: {
        ...User.resolvers.mutations,
      },
    },
  });

  await gqlServer.start()
  return gqlServer;
}
export default createGQLapolloServer