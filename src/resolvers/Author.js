import { getUserId } from '../utils' 
const Author = {
    register_by: (parent, {id}, {request,prisma}, info) => {
        /* return db.users.find(user => user.id===parent.register_by) */
        const userId = getUserId(request)
        return prisma.authors.findOne({
            where:{
                id: parent.id
            }
        }).users()
    },
    books: (parent, {id}, {request,prisma}, info) => {
        /* return db.books.filter(book => book.writted_by===parent.id) */
        const userId = getUserId(request)
        return prisma.authors.findOne({
            where:{
                id: parent.id
            }
        }).books()
    },
}

export default Author