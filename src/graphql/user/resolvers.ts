import { log } from "console";
import UserService, { CreateUserPayload, GetUserTokenPayload } from "../../services/user"
import { prismaClient } from "../../lib/db";

const quries = {
  getUserToken: async (any: { any: any }, payload: GetUserTokenPayload) => {
    const { email, password } = payload;
    const token = await UserService.getUserToken({ email, password })
    return token
  },
  getCurrentLoggedInUser: async (any: any, parameters: any, context: any) => {
    if (context && context.user) {
      const user = await prismaClient.user.findUnique({ where: { id: context.user.id } })
      return user
    }
    throw new Error("Authintication not recognized")
  },
}

const mutations = {
  createUser: async (any: { any: any }, payload: CreateUserPayload) => {
    const res = await UserService.createUser(payload);
    return res.id
  }
}

export const resolvers = { quries, mutations }