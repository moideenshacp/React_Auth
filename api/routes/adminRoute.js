import express from 'express' 
import { adminSignIn, getAllUsers,updateUser ,deleteUser, signout, addUser} from '../controllers/adminController.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.post('/signin', adminSignIn)
router.get('/allUsers',getAllUsers)
router.put('/updateUser/:id',verifyToken,updateUser)
router.delete('/deleteUser/:id',verifyToken,deleteUser)
router.post('/addUser',verifyToken,addUser)
router.get('/signout',signout)

export default router