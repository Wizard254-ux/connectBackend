const express=require('express')
const router=express.Router()
const {supportPost}=require('../Controllers/Support')
const {getProfiles,confirmProfile}=require('../Controllers/UserProfile')
const {getVenues}=require('../Controllers/ClubAdmin')

router.post('/support',supportPost)
router.get('/profile',getProfiles)
router.get('/club',getVenues)
router.get('/profile_exist',confirmProfile)

module.exports=router