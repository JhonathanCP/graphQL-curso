import { GraphQLServer, PubSub } from 'graphql-yoga'
import { PrismaClient } from '@prisma/client'/* Agregando prisma */

import Query from './resolvers/Query'
import Author from './resolvers/Author'
import Book from './resolvers/Book'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import db from './db'

const pubsub = new PubSub()
const prisma = new PrismaClient()/* Instanciando prisma */

const resolvers = {
    Query,
    Author,
    Book,
    Mutation,
    Subscription
}

const context = {
    db,
    pubsub,/* Subscription */
    prisma,/* Conexión a db */
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: request => {/* authentication */
        return {
            ...request,
            ...context,
        }
    }
})

server.start({port: 8000},({port})=>console.log('Server is running on localhost:' + port))