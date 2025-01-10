const express=require('express')
const mongoose=require('mongoose')
const path=require('path')
const fs=require('fs')
const app=express()
app.use(express.json())
const UserProfile=require('../Models/userProfile.model')

const Profile=async(req,res)=>{
try{
    const userId = new mongoose.Types.ObjectId(req.body.user);
    const existingProfile = await UserProfile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ error: 'Profile already exists for this user' });
    }
    const profileData = {
      user: userId, // Use the converted ObjectId
        ...req.body,
        interests: JSON.parse(req.body.interests),
        socialProfile: JSON.parse(req.body.socialProfile),
        images: req.files.map(file => file.path) // Store file paths in database
      };  
      const profile = await UserProfile.create(profileData)
  res.status(201).json({message:"succesfull",data:profile})
 

}catch(error){
  res.status(500).json({message:error.message})
}
}

const updateProfile=async(req,res)=>{
try{
  const {profileId}=req.query
  const updates = req.body;
  const existingImages = JSON.parse(updates.existingImages || '[]');
  const newImages = req.files ? req.files.map(file => `/profilePics/${file.filename}`) : [];
    
    // Combine existing and new images
    const allImages = [...existingImages, ...newImages];
    const updateData = {
      name: updates.name,
      age: updates.age,
      gender: updates.gender,
      location: updates.location,
      bio: updates.bio,
      interests: JSON.parse(updates.interests),
      socialProfile: JSON.parse(updates.socialProfile),
      images: allImages
    };
    const profile = await UserProfile.findById(profileId);
    if (profile && profile.images) {
      const imagesToDelete = profile.images.filter(img => !existingImages.includes(img));
      imagesToDelete.forEach(img => {
        const imagePath = path.join(__dirname, '..', img);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }
    const updatedProfile = await UserProfile.findByIdAndUpdate(
      profileId,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      data: updatedProfile
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getProfiles=async(req,res)=>{
  try{
    const profiles=await UserProfile.find({}).populate('user','username id')
    console.log(profiles)
    const updatedProfiles = profiles.map((profile) => {
      return {
        ...profile._doc,
        images: profile.images.map((imagePath) => {
          // Extract only the file name
          const fileName = path.basename(imagePath);
          return `https://connectbackend-ba4y.onrender.com/uploads/${fileName}`;
        }),
      };
    });

    res.status(200).json({message:"succesfull",data:updatedProfiles})

  }catch(error){
    res.status(500).json({message:error.message})
  }
}
const confirmProfile=async(req,res)=>{
  try{
    const {userId}=req.query
    if(!mongoose.Types.ObjectId.isValid(userId)){
      return res.status(400).json({message:"Invalid user ID"})
    }
    const profiles=await UserProfile.find({user:new mongoose.Types.ObjectId(userId)})
    if(!profiles){
      return res.status(404).json({message:"No profiles found for this user"})
    }

    const updatedProfiles = profiles.map((profile) => {
      return {
        ...profile._doc,
        images: profile.images.map((imagePath) => {
          // Extract only the file name
          const fileName = path.basename(imagePath);
          return `https://connectbackend-ba4y.onrender.com/uploads/${fileName}`;
        }),
      };
    });

    res.status(200).json({message:"succesfull",data:updatedProfiles})

  }catch(error){
    res.status(500).json({message:error.message})
  }
}
module.exports={Profile,getProfiles,confirmProfile,updateProfile}
