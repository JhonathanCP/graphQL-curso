import {generateToken, hashPassword, validatePassword, getUserId} from '../utils/'

const Mutations = {
    signUp: async (parent,{data},{prisma},info)=>{/* authentication added */
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
        const password = await hashPassword(data.password)
        const user = await prisma.users.create({
            data: {
                ...data,
                password
            }
        })
        return {
            user,
            token: generateToken(user.id)
        }
    },
    login: async(parent,{data},{prisma},info)=>{
        const user = await prisma.users.findOne({
            where: {
                email: data.email,

            }
        })
        const isValid = await validatePassword(data.password,user.password)
        if(!isValid) {
            throw new Error('Password incorrect')
        }
        return {
            user,
            token: generateToken(user.id)
        }
    },
    updateUser: async (parent,{id, data},{request,prisma},info)=>{
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
        const userId = getUserId(request)
        const { password } = data 
        if(password){
            data.password = await hashPassword(data.password)
        }
        return prisma.users.update({
            where: {id: Number(id)},
            data
        })
    },
    createAuthor: async (parent,{data},{request,prisma, pubsub},info)=>{
        /* const author = {
            id: uuidv4(),
            ...data
        }

        db.authors.push(author) */
        const userId = getUserId(request)
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
    updateAuthor: async (parent,{id, data},{request,prisma, pubsub},info)=>{
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
        const userId = getUserId(request)
        const {register_by, ...rest} = data
        if(register_by){
            rest.users={
                connect:{
                    id: Number(register_by)
                }
            }
        }
        const authorUpdated = await prisma.authors.update({
            where: {
                id: Number(id)
            },
            data: {
                ...rest
            }
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
    createBook: async (parent,{data},{request,prisma,pubsub},info)=>{
        /* const authorExists = db.authors.some(author => author.id === data.writted_by)

        if(!authorExists) {
            throw new Error('Author does not exits')
        }

        const book = {
            id: uuidv4(),
            ...data
        }

        db.books.push(book) */
        const userId = getUserId(request)
        const {writted_by,register_by,...rest} = data
        const newBook = await prisma.books.create({
            data: {
                ...rest,
                authors: {
                    connect: {
                        id: Number(writted_by)
                    } ,
                },
                users: {
                    connect: {
                        id: Number(writted_by)
                    } ,
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
    updateBook: async (parent,{id,data},{request,prisma, pubsub},info)=>{

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
        const userId = getUserId(request)
        const {writted_by, register_by, ...rest} = data
        if(writted_by){
            rest.authors={
                connect: {
                    id: Number(writted_by)
                }
            }
        }
        if(register_by){
            rest.users={
                connect: {
                    id: Number(register_by)
                }
            }
        }
        const bookUpdated = prisma.books.update({
            where: {
                id: Number(id)
            },
            data: {
                ...rest
            }
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
    deleteBook: async (parent,{id},{request,prisma, pubsub},info)=>{
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
        const userId = getUserId(request)
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