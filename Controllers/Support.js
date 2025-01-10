const express=require('express')
const app=express()
app.use(express.json())
const Support=require('../Models/support.model.js')

const supportPost=async(req,res)=>{
try{

  const support=new Support(req.body)
  await support.save()
  res.status(201).json({message:"succesfull",data:support})
 

}catch(error){
  res.status(500).json({message:error.message})
}
}

module.exports={supportPost}
