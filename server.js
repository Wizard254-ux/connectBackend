const express=require('express')
const http=require('http')
const app=express()

const socketIo=require('socket.io')
const server=http.createServer(app)//create http server to attach socket.io
const io=socketIo(server,{
    cors:{
        origin:['http://localhost:5173','http://127.0.0.1:5500','https://connect-frontend-seven.vercel.app'],
        credentials:true  // Enable cookies in CORS requests
    }
}) // Initialize socket.io with the HTTP server

io.on('connection',(socket)=>{
    console.log('connection established')

    socket.emit("message","hello guys")

    socket.on('join_room',({roomId})=>{
        socket.join(roomId);
        console.log(`User connected to room ${roomId}`);
    })

    socket.on('message',(data)=>{
        console.log(data)
    })

    socket.on('disconnect',()=>{
        console.log('websocket disconnected')
    })

})

module.exports={server,io,app,express}