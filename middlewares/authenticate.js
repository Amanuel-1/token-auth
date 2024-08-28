 
import jwt from 'jsonwebtoken';

 const authonticate = (req , res , next) => {
    try{
        const token = req.headers.authorization.split(" ")[1] // Bearer <token>
        console.log('this is the token',token)
        const user = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET) 
        console.log('this is the user',user) 
        req.user = user
        next()
    }
    catch(error){
        console.log(error)
        return res.status(401).json({message:"Unauthorized",error})
    }
}

export {authonticate}