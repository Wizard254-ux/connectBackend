const express=require('express')
const router=express.Router()
const Authenticate=require('../Middleware/UserAuthentication')
const {Profile,updateProfile}=require('../Controllers/UserProfile')
const {getChatts,saveMessage,getUserGroups,getUserChatts,saveGroupMessage,saveUserGroup,getGroupMessage}=require('../Controllers/Chatts')
const upload=require('../Middleware/userProfile')

router.use('/profile',[Authenticate,upload.array('images',3)])

router.post('/profile',Profile)
router.put('/profile/existingProfile',updateProfile)
router.get('/chatts',getChatts)
router.get('/user_chatts',getUserChatts)
router.post('/chatts',saveMessage)
router.post('/groupChatts',saveGroupMessage)
router.get('/groupChatts',getGroupMessage)
router.post('/UserGroups/save',saveUserGroup)
router.get('/UserGroups/:userId',getUserGroups)

module.exports=router