import { Router } from "express";
import { createUser ,deleteUser,signIn,editUser,refresh_token,verify_token,profile,logout} from "../controllers/user.controller.js";
import { authonticate } from "../middlewares/authenticate.js";

const userRouter = Router();



userRouter.post('/signup', createUser);

userRouter.post('/signin', signIn);
userRouter.delete('/delete',authonticate, deleteUser);
userRouter.put('/edit',authonticate, editUser);
userRouter.post('/token',refresh_token)
userRouter.post('/verify-token', verify_token);
userRouter.get('/profile',authonticate, profile)
userRouter.get('/sample', (req, res) => {
    console.log('Sample route',req.cookies);
    
    return { message: 'Sample route' ,cookies:req.cookies}
})
userRouter.get('/logout', logout)
export default userRouter;