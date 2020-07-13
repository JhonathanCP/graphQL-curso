import { getUserId } from '../utils'
const Query = {
    /* hello (parent, args, ctx, info) {
        return 'Hello world'
    }, */
    hello: (parent, args, ctx, info) => {
        const {name} = args

        return `Hello ${name||'world'}`
    },
    quantity: () => 1,
    user: (parent, {id}, {request,prisma}, info) => {/* prisma agregado */
        const userId = getUserId(request)
        if(!id){
            return prisma.users.findMany()
        }

        return prisma.users.findOne({
            where: {
                id,
            }
        })
    },
    author: (parent, {id, take, skip, orderBy}, {request,prisma}, info) => {/* prisma agregado */
        const userId = getUserId(request)
        if(!id){
            return prisma.authors.findMany({/* pagination and sorting */
                take,
                skip,
                orderBy,
            })
        }

        return prisma.authors.findOne({
            where:{
                id,
            }
        })
    },
    book: (parent, {id, take, skip, orderBy}, {request,prisma}, info) => {/* prisma agregado */
        const userId = getUserId(request)
        if(!id){
            return prisma.books.findMany({
                take,
                skip,
                orderBy,
            })
        }

        return prisma.books.findOne({
            where: {
                id
            }
        })
    },
}

export default Query