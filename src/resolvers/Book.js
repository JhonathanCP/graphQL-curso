import { getUserId} from '../utils'
const Book = {
    writted_by: (parent, {id}, {request, prisma}, info) => {
        /* return db.authors.find(author => author.id===parent.writted_by) */
        const userId = getUserId(request)
        return prisma.books.findOne({
            where:{
                id: parent.id
            }
        }).authors()
    },
    register_by: (parent, {id}, {request, prisma}, info) => {
        /* return db.users.find(user => user.id===parent.register_by) */
        const userId = getUserId(request)
        return prisma.books.findOne({
            where:{
                id: parent.id
            }
        }).users()
    },
}

export default Book