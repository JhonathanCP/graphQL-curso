import { v4 as uuidv4} from 'uuid'
const Mutations = {
    createUser: (parent,{data},{db},info)=>{
        const isEmailTaken = db.users.some(user => user.email === data.email)
        if(isEmailTaken){
            throw new Error('Email Taken')
        }
        const user = {
            id: uuidv4(),
            ...data
        }

        db.users.push(user)

        return user
    },
    updateUser: (parent,{id, data},{db},info)=>{
        const userExist = db.users.find(user=>user.id === id)
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
        return {...userExist, ...data}
    },
    createAuthor: (parent,{data},{db, pubsub},info)=>{
        const author = {
            id: uuidv4(),
            ...data
        }

        db.authors.push(author)

        /* Subscription agregado */
        pubsub.publish('author',{
            author: {
                mutation: 'CREATED',
                data: author
            }
        })
        return author
    },
    updateAuthor: (parent,{id, data},{db, pubsub},info)=>{
        const authorExist = db.authors.find(author=>author.id === id)
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
        
        const authorUpdated = {...authorExist, ...data}

        /* Subscription agregado */
        pubsub.publish('author',{
            author: {
                mutation: 'UPDATED',
                data: authorUpdated
            }
        })

        return authorUpdated
    },
    createBook: (parent,{data},{db,pubsub},info)=>{
        const authorExists = db.authors.some(author => author.id === data.writted_by)

        if(!authorExists) {
            throw new Error('Author does not exits')
        }

        const book = {
            id: uuidv4(),
            ...data
        }

        db.books.push(book)

        /* Subscription agregado */
        pubsub.publish(`book - ${book.writted_by}`,{
            book: {
                mutation: 'CREATED',
                data: book
            }
        })

        return book
    },
    updateBook: (parent,{id,data},{db, pubsub},info)=>{

        const authorExists = db.authors.some(author => author.id === data.writted_by)

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

        const bookUpdated = {...bookExist, ...data}

        /* Subscription agregado */
        pubsub.publish(`book - ${bookUpdated.writted_by}`,{
            book: {
                mutation: 'UPDATED',
                data: bookUpdated
            }
        })

        return bookUpdated
    },
    deleteBook: (parent,{id},{db, pubsub},info)=>{
        const bookExist = db.books.find(book=>book.id === id)
        if(!bookExist){
            throw new Error('Book not found')
        }

        db.books = db.books.reduce((acc, book)=>{
            if(book.id !== id){
                acc.push(book)
            }
            return acc
        }, [])

        /* Subscription agregado */
        pubsub.publish(`book - ${bookExist.writted_by}`,{
            book: {
                mutation: 'DELETED',
                data: bookExist
            }
        })

        return bookExist
    },
}

export default Mutations