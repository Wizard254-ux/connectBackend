const express=require('express')
const router=express.Router()
const upload=require('../Middleware/upload')
const {addVenueEvent,getClubAdminVenues,updateVenueEvent,deleteVenueEvent}=require('../Controllers/ClubAdmin')

router.post('/event_upload',upload.array('images'),addVenueEvent)
router.put('/event_update',upload.array('images'),updateVenueEvent)
router.delete('/event_delete',deleteVenueEvent)
router.get('/events',getClubAdminVenues)

module.exports=router