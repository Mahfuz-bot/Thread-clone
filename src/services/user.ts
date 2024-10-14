import jwt from 'jsonwebtoken'
import { createHmac, randomBytes } from 'crypto'
import { prismaClient } from "../lib/db";

export interface GetUserTokenPayload {
  email: string
  password: string
}
const JWT_SECRET = "mahfuz"


export interface CreateUserPayload {
  firstName: string
  lastName: string
  email: string
  password: string
}
class UserService {
  private static genHashedPassword(password: string, salt: string) {
    const hashedPassword = createHmac('sha256', salt).update(password).digest('hex')
    return hashedPassword
  }

  public static async createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString('hex');
    const hashedPassword = UserService.genHashedPassword(password, salt);
    return await prismaClient.user.create({
      data: {
        firstName, lastName, email, password: hashedPassword, salt
      },
    })
  }

  private static async getUserByMail(email: string) {
    return await prismaClient.user.findUnique({ where: { email } })
  }

  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await UserService.getUserByMail(email);
    if (!user)
      throw new Error("User not found")
    const returnPassword = UserService.genHashedPassword(password, user.salt)
    if (user.password !== returnPassword)
      throw new Error("Password did not match")

    //Gen token jwt
    const token = await jwt.sign({ id: user.id, email: user.email }, JWT_SECRET)
    return token
  }

  public static async decodedJWTtoken(token: string) {
    return await jwt.verify(token, JWT_SECRET)
  }

}

export default UserService