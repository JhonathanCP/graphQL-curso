const Author = {
    register_by: (parent, {id}, ctx, info) => {
        const {db}= ctx
        return db.users.find(user => user.id===parent.register_by)
    },
    books: (parent, {id}, ctx, info) => {
        const {db}= ctx
        return db.books.filter(book => book.writted_by===parent.id)
    },
}

export default Author