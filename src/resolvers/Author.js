const Author = {
    register_by: (parent, {id}, {prisma}, info) => {
        /* return db.users.find(user => user.id===parent.register_by) */
        return prisma.authors.findOne({
            where:{
                id: parent.id
            }
        }).users()
    },
    books: (parent, {id}, {prisma}, info) => {
        /* return db.books.filter(book => book.writted_by===parent.id) */
        return prisma.authors.findOne({
            where:{
                id: parent.id
            }
        }).books()
    },
}

export default Author