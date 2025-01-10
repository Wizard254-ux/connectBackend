const express=require('express')
const app=express()
const User=require('../Models/user.model')
const jwt=require('jsonwebtoken')
app.use(express.json())
const bcrypt=require('bcrypt')
// process.env.JWT_SECRET //Acces the scret key from enviroment variables


const loginUser=async(req,res)=>{
    const {username, password}=req.body
    const {clubAdmin}=req.query

    try{
  const existingUser=await User.findOne({username})
  if(!existingUser){
      return res.status(404).json({message:'User not found'})
  }
  const isMatch=await bcrypt.compare(password,existingUser.password)
  if(!isMatch){
      return res.status(400).json({message:'Invalid credentials'})
  }
  if(parseInt(clubAdmin)==1 && existingUser.role!='clubAdmin'){
    return res.status(403).json({message:'You are not a club admin'})
  }

  const access=jwt.sign({id:existingUser.id},process.env.JWT_SECRET,{expiresIn:'1h'})
  const refresh=jwt.sign({id:existingUser.id},process.env.JWT_SECRET_REFRESH,{expiresIn:'7d'})
  existingUser.refreshTokens.push(refresh)
  await existingUser.save()
  const data={
    username:existingUser.username,
    id:existingUser.id,
    role:existingUser.role,
 }
  res.status(200).json({user:data,access,refresh})
    }catch(error){
       res.status(500).json({message:error.message})
    }
}
const createUser=async(req,res)=>{
    const {username,email, password}=req.body
    try{
        const existingUser=await User.findOne({username})
        const existingemail=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:'User with username already exists'})
        }
        if(existingemail){
            return res.status(400).json({message:'User with email already exists'})
        }
     const hashedPassword= await bcrypt.hash(password,10)
     const newUser=new User({
         username,
         email,
         password:hashedPassword,
     })
     await newUser.save()

     const access=jwt.sign({id:newUser.id},process.env.JWT_SECRET,{expiresIn:'1h'})
     const refresh=jwt.sign({id:newUser.id},process.env.JWT_SECRET_REFRESH,{expiresIn:'7d'})
     newUser.refreshTokens.push(refresh)
     await newUser.save()
     
     const data={
        username:newUser.username,
        id:newUser.id,
        role:newUser.role,
     }
     res.status(201).json({user:data,refresh,access})
    }catch(error){
      res.status(500).json({message:error.message})
    }
 
}
const createAdminUser=async(req,res)=>{
    const {username,email, password,role}=req.body
    try{
        const existingUser=await User.findOne({username})
        const existingemail=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:'User with username already exists'})
        }
        if(existingemail){
            return res.status(400).json({message:'User with email already exists'})
        }
     const hashedPassword= await bcrypt.hash(password,10)
     const newUser=new User({
         username,
         email,
         password:hashedPassword,
         role
     })
     await newUser.save()

     const access=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:'1h'})
     const refresh=jwt.sign({id:newUser._id},process.env.JWT_SECRET_REFRESH,{expiresIn:'7d'})
     newUser.refreshTokens.push(refresh)
     await newUser.save()
   
     res.status(201).json({message:newUser,refresh,access})
    }catch(error){
      res.status(500).json({message:error.message})
    }
 
}

const refreshUser=async(req,res)=>{
    const {refreshToken}=req.body
    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token required' });
    }
    try{
        
        const decoded=jwt.verify(refreshToken,process.env.JWT_SECRET_REFRESH)
        if(!decoded){
            return res.status(400).json({ message: 'Invalid refresh token' });
        }
        const user=await User.findById(decoded.id)
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        if(!user.refreshTokens.includes(refreshToken)){
            return res.status(400).json({ message: 'Refresh token is not valid' });
        }
        const newAcess=jwt.sign(
            {id:user.id},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        )

    res.status(200).json({accessToken:newAcess})
    }catch(error){
        return res.status(401).json({message:'Invalid or expired refresh Token'})

    }
}

const logoutUser=async(req,res)=>{
    try{
        const {refreshToken}=req.body
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token required' });
        }
        const decoded=jwt.verify(refreshToken,process.env.JWT_SECRET_REFRESH)
        if(!decoded){
            return res.status(400).json({ message: 'Invalid refresh token' });
        }
        const user=await User.findById(decoded.id)
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const refreshTokens=user.refreshTokens.filter((token)=>token!==refreshToken)
        user.refreshTokens=refreshTokens
        await user.save()
        res.status(200).json({message:'Logged out successfully'})

    }catch(error){

    }
}



module.exports={
    loginUser,
    createUser,
    logoutUser,
    refreshUser,
    createAdminUser
}