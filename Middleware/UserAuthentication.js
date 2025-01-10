const express=require('express')
const app=express()
app.use(express.json())
const jwt=require('jsonwebtoken')
const User=require('../Models/user.model')


const Authentication = async(req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        req.token = authHeader.split(' ')[1];
    } else if (req.headers['x-access-token']) {
        req.token = req.headers['x-access-token'];
    } else if (req.query.access_token) {
        req.token = req.query.access_token;
    } else if (req.body && req.body.access_token) {
        req.token = req.body.access_token;
    } else {
        req.token = null;
    }
    if(!req.token){
        return res.status(401).json({ message: 'Token Not Provided.' });

    }

    try{

        const decoded=jwt.verify(req.token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(400).json({ message: 'Invalid token' });
        }
        const user=await User.findById(decoded.id)
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
    
        req.user=user
        next()

    }catch(error){
        return res.status(401).json({ message: error.message });
    }



};

module.exports=Authentication