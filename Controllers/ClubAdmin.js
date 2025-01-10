const express = require('express');
const app = express();
const path=require('path')
app.use(express.json())
const Event = require('../Models/event.model');
const User = require('../Models/user.model');
const fs = require('fs');
const mongoose=require('mongoose')
const addVenueEvent = async(req, res) => {
        // const userId = new mongoose.Types.ObjectId(req.body.user);
    
    try {
        const { 
            venueName,
            normalEntranceFee,
            VIPEntranceFee,  // Fixed typo here
            minimumAge,
            currentEvent, 
            location, 
            description, 
            user, 
            rating,
            openingHours,
            specialities 
        } = req.body;

        // Validate required fields
        if (!venueName || !location || !normalEntranceFee || !VIPEntranceFee || !user) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Find the user by ID
        const existingUser = await User.findById(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (existingUser.role !== 'clubAdmin') {
            return res.status(401).json({ message: 'You are not authorized to perform operation' });
        }

        // Validate that we have images
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one image is required' });
        }

        const imagePaths = req.files.map(file => file.path);

        console.log('Creating new event with user ID:', existingUser._id);

        const newEvent = new Event({
            venueName,
            location,
            normalEntranceFee,
            VIPEntranceFee,  // Fixed typo here
            minimumAge: minimumAge || 18,
            currentEvent: currentEvent || '',
            specialities: specialities || [],
            openingHours: openingHours || '',
            description: description || '',
            images: imagePaths,
            rating: rating || 0,
            user: existingUser._id
        });

        console.log('New event object before save:', newEvent);

        const savedEvent = await newEvent.save();
        console.log('Event saved successfully:', savedEvent);

        res.status(201).json({ 
            message: 'Event created successfully', 
            event: savedEvent 
        });

    } catch (error) {
        console.error('Detailed error:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'Duplicate entry error. This venue might already exist.',
                details: error.keyPattern
            });
        }

        res.status(500).json({ 
            message: 'Error creating event',
            error: error.message 
        });
    }
};

const getVenues=async(req,res)=>{
    try{
     const events=await Event.find().lean()
     const updatedEvents= events.map((event) => {
        return {
          ...event,
          images: event.images.map((imagePath) => {
            // Extract only the file name
            const fileName = path.basename(imagePath);
            return `http://localhost:5000/club_uploads/${fileName}`;
          }),
        };
      });
      res.status(200).json({message:"success",data:updatedEvents})
    }catch(error){
    console.log(error)
    res.status(500).json({message:error.message})
    }
}
const getClubAdminVenues=async(req,res)=>{
    try{

        const {clubAdminId}=req.query
        const existingEvents = await Event.find({user:new mongoose.Types.ObjectId(clubAdminId)}).lean();
        if (!existingEvents) {
            return res.status(200).json({ message: 'No Existing Event Found ',data:[] });
        }
        const Events= existingEvents.map((event) => {
            return {
              ...event,
              images: event.images.map((imagePath) => {
                // Extract only the file name
                const fileName = path.basename(imagePath);
                return `http://localhost:5000/club_uploads/${fileName}`;
              }),
            };
          });

      res.status(200).json({message:"success",data:Events})
    }catch(error){
    console.log(error)
    res.status(500).json({message:error.message})
    }
}
const updateVenueEvent = async (req, res) => {
    try {
      const { venueId } = req.query;
      const existingEvent = await Event.findById(venueId).lean();
      
      if (!existingEvent) {
        return res.status(400).json({ message: 'Event Not Found' });
      }
  
      const retainedImages = JSON.parse(req.body.retainedImages || '[]');
      const newImagePaths = req.files?.map(file => file.path) || [];
      const updatedImages = [...retainedImages, ...newImagePaths];
  
      const body = {
        venueName: req.body.venueName || existingEvent.venueName,
        location: req.body.location || existingEvent.location,
        normalEntranceFee: req.body.normalEntranceFee || existingEvent.normalEntranceFee,
        VIPEntranceFee: req.body.VIPEntranceFee || existingEvent.VIPEntranceFee,
        minimumAge: req.body.minimumAge || existingEvent.minimumAge,
        currentEvent: req.body.currentEvent || existingEvent.currentEvent,
        specialities: req.body.specialities || existingEvent.specialities,
        openingHours: req.body.openingHours || existingEvent.openingHours,
        description: req.body.description || existingEvent.description,
        images: updatedImages,
        rating: req.body.rating || existingEvent.rating,
      };
  
      const updatedEvent = await Event.findByIdAndUpdate(venueId, body, { new: true });
      res.status(200).json({ message: "success", data: updatedEvent });
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  
  const deleteVenueEvent = async (req, res) => {
    try {
        const { venueId } = req.query;
        const event = await Event.findById(venueId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Delete associated images from storage
        if (event.images && event.images.length > 0) {
            for (const imagePath of event.images) {
                fs.unlink(imagePath, (err) => {
                    if (err) console.error('Error deleting image:', err);
                });
            }
        }

        // Delete the event from database
        await Event.findByIdAndDelete(venueId);

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addVenueEvent,deleteVenueEvent ,updateVenueEvent,getVenues,getClubAdminVenues};