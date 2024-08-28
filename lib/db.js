// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more: 
// https://pris.ly/d/help/next-js-best-practices

import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}


const globalForPrisma = globalThis 

export const db = globalForPrisma.prisma ?? prismaClientSingleton()



if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db