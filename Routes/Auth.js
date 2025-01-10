const express=require('express')
const router=express.Router()
router.use(express.json())
const {loginUser,createUser,refreshUser,logoutUser,createAdminUser}=require('../Controllers/Auth')

router.post('/login',loginUser)
router.post('/create',createUser)
router.post('/refresh',refreshUser)
router.post('/logout',logoutUser)
router.post('/createAdmin',createAdminUser)

module.exports=router