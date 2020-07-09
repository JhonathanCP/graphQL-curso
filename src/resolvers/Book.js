const Book = {
    writted_by: (parent, {id}, ctx, info) => {
        const {db}= ctx
        return db.authors.find(author => author.id===parent.writted_by)
    },
    register_by: (parent, {id}, ctx, info) => {
        const {db}= ctx
        return db.users.find(user => user.id===parent.register_by)
    },
}

export default Book