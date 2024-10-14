// export const typeDefs = `
//   type Mutation {
//     createUser(firstName: String!, lastName: String!, email: String!, password: String!): String
//   }
// `;
export const typeDefs = `
  type User{
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    profilePicURL: String
  }
`;