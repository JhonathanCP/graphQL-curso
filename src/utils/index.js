import jsw from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const SECRET = 'jc'

export const getUserId = (request) => {/* validación */
    const header = request.get('authorization')
    if(header) {
        const token = header.replace('Bearer ', '')
        const { userId } = jsw.verify(token, SECRET)
        return  userId
    }
    throw new Error('Authentication required')
}

export const hashPassword = async password =>{/* hash de contraseña */
    if(password.lenght<6){
        throw new Error('Password must be have at least 6 characters')
    }
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

export const validatePassword = async (requestPassword, password) => {/* validación */
    return await bcrypt.compare(requestPassword,password)
}

export const generateToken = (userId) => {
    return jsw.sign({userId},SECRET,{ expiresIn:'3 days'})
}