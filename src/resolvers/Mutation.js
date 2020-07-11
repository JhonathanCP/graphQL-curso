const Mutations = {
    createUser: (parent,{data},{prisma},info)=>{
        /* const isEmailTaken = db.users.some(user => user.email === data.email)
        if(isEmailTaken){
            throw new Error('Email Taken')
        }
        const user = {
            id: uuidv4(),
            ...data
        }

        db.users.push(user)

        return user */
        return prisma.users.create({
            data,
        })
    },
    updateUser: (parent,{id, data},{prisma},info)=>{
        /* const userExist = db.users.find(user=>user.id === id)
        if(!userExist){
            throw new Error('User not found')
        }
        const isEmailTaken = db.users.some(user => user.email === data.email)
        if(isEmailTaken){
            throw new Error('Email Taken')
        }
            
        db.users = db.users.map(user=>{
            if(user.id === id){
                user={...user, ...data}
                return user
            }
            return user
        })
        return {...userExist, ...data} */
        return prisma.users.update({
            where: {id},
            data,
        })
    },
    createAuthor: async (parent,{data},{prisma, pubsub},info)=>{
        /* const author = {
            id: uuidv4(),
            ...data
        }

        db.authors.push(author) */
        const {register_by, ...rest} = data
        const newAuthor = await prisma.authors.create({
            data: {...rest, users:{
                connect:{
                    id: Number(register_by)
                }
            }}
        })
        /* Subscription agregado */
        pubsub.publish('author',{
            author: {
                mutation: 'CREATED',
                data: newAuthor
            }
        })
        return newAuthor
    },
    updateAuthor: async (parent,{id, data},{prisma, pubsub},info)=>{
        /* const authorExist = db.authors.find(author=>author.id === id)
        if(!authorExist){
            throw new Error('Author not found')
        }
            
        db.authors = db.authors.map(author=>{
            if(author.id === id){
                author={...author, ...data}
                return author
            }
            return author
        })
        
        const authorUpdated = {...authorExist, ...data} */
        const {register_by} = data
        if(register_by){
            data.users={
                connect:{
                    id: Number(register_by)
                }
            }
        }
        const authorUpdated = await prisma.authors.update({
            where: {
                id: Number(id)
            },
            data
        })
        /* Subscription agregado */
        pubsub.publish('author',{
            author: {
                mutation: 'UPDATED',
                data: authorUpdated
            }
        })

        return authorUpdated
    },
    createBook: async (parent,{data},{prisma,pubsub},info)=>{
        /* const authorExists = db.authors.some(author => author.id === data.writted_by)

        if(!authorExists) {
            throw new Error('Author does not exits')
        }

        const book = {
            id: uuidv4(),
            ...data
        }

        db.books.push(book) */
        const {writted_by,register_by,...rest} = data
        const newBook = await prisma.books.create({
            data: {
                ...rest,
                authors: {
                    connect: Number(writted_by)
                },
                users: {
                    connect: Number(register_by)
                },
            }
        })
        /* Subscription agregado */
        pubsub.publish(`book - ${newBook.writted_by}`,{
            book: {
                mutation: 'CREATED',
                data: newBook
            }
        })

        return newBook
    },
    updateBook: async (parent,{id,data},{prisma, pubsub},info)=>{

        /* const authorExists = db.authors.some(author => author.id === data.writted_by)

        if(data.writted_by && !authorExists) {
            throw new Error('Author does not exits')
        }

        const bookExist = db.books.find(book=>book.id === id)
        if(!bookExist){
            throw new Error('Book not found')
        }
            
        db.books = db.books.map(book=>{
            if(book.id === id){
                book={...book, ...data}
                return book
            }
            return book
        })

        const bookUpdated = {...bookExist, ...data} */
        const {writted_by, register_by} = data
        if(writted_by){
            data.authors={
                connect: {
                    id: Number(writted_by)
                }
            }
        }
        if(register_by){
            data.users={
                connect: {
                    id: Number(register_by)
                }
            }
        }
        const bookUpdated = prisma.books.update({
            where: {
                id: Number(id)
            },
            data
        })
        /* Subscription agregado */
        pubsub.publish(`book - ${bookUpdated.writted_by}`,{
            book: {
                mutation: 'UPDATED',
                data: bookUpdated
            }
        })

        return bookUpdated
    },
    deleteBook: async (parent,{id},{prisma, pubsub},info)=>{
        /* const bookExist = db.books.find(book=>book.id === id)
        if(!bookExist){
            throw new Error('Book not found')
        }

        db.books = db.books.reduce((acc, book)=>{
            if(book.id !== id){
                acc.push(book)
            }
            return acc
        }, []) */
        const bookDeleted = prisma.books.delete({
            where: {
                id: Number(id)
            }
        })
        /* Subscription agregado */
        pubsub.publish(`book - ${bookDeleted.writted_by}`,{
            book: {
                mutation: 'DELETED',
                data: bookDeleted
            }
        })

        return bookDeleted
    },
}

export default Mutations