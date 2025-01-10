const express=require('express')
const app=express()
const User=require('../Models/user.model')
app.use(express.json())
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const loginAdmin=async(req,res)=>{
    try{
        const {username, password}=req.body
        const user=await User.findOne({username})
        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:'Invalid credentials'})
        }
        if(user.role !='superUser'){
            return res.status(400).json({message:"You are not alowed to acess the content"})
            
        }
        const access=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'1h'})
        const refresh=jwt.sign({id:user.id},process.env.JWT_SECRET_REFRESH,{expiresIn:'7d'})

        user.refreshTokens.push(refresh)
        await user.save()
        return res.status(200).json({message:"sucsess",refresh,access})
    }catch(error){

        res.status(500).json({message:error.message})
    }
}

const deleteClubAdmin=async(req,res)=>{
    try{
        const {userId}=req.query
        await User.findByIdAndDelete(userId) 
        return res.status(200).json({message:"User Deleted Succesfully"})
    }catch(error){
        res.status(500).json({message:error.message})
    }
}
const createClubAdmin=async(req,res)=>{
    try{
        const {username, password,email,role}=req.body
        const existingUser=await User.findOne({username})
        const existingemail=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:'User with username already exists'})
        }
        if(existingemail){
            return res.status(400).json({message:'User with email already exists'})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const user=new User({
            username,
            email,
            password:hashedPassword,
            role
        })
        const access=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'1h'})
        const refresh=jwt.sign({id:user.id},process.env.JWT_SECRET_REFRESH,{expiresIn:'7d'})

        user.refreshTokens.push(refresh)
        await user.save()
        return res.status(200).json({message:"sucsess",refresh,access})
    }catch(error){

        res.status(500).json({message:error.message})
    }
}

module.exports={loginAdmin,createClubAdmin,deleteClubAdmin}


