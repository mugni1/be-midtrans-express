import { prisma } from "../libs/prisma.js";
import { RegisterPayload } from "../validations/auth.validation.js";

export const registerService = (payload: RegisterPayload) => {
  return prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password
    }
  })
}

export const countUserWithEmailService = (email: string) => {
  return prisma.user.count({
    where: {
      email
    }
  })
}

export const countUserWithPhoneService = (phone: string) => {
  return prisma.user.count({
    where: {
      phone
    }
  })
}

export const getUserByEmailService = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email
    }
  })
}

export const getUserByPhoneService = async (phone: string) => {
  return await prisma.user.findUnique({
    where: {
      phone
    }
  })
}

export const getUserByIdService = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id: id
    }
  })
}
