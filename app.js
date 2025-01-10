const path=require('path')
const Auth=require('./Routes/Auth')
const Admin=require('./Routes/Admin')
const {server,app,express}=require('./server')
const clubAdmin=require('./Routes/ClubAdmin')
const Anauth=require('./Routes/AnauthorizedRoutes')
const AuthenticatedUser=require('./Routes/UserAuthenticatedRoutes')
require('dotenv').config();  // Load environment variables
const cors=require('cors')


app.use(cors({origin:['http://localhost:5173','http://127.0.0.1:5500'] }))
app.use(express.json())
app.use('/auth',Auth)
app.use('/api/Admin',Admin)
app.use('/api/ ',clubAdmin)
app.use('/api/users',Anauth)
app.use('/api/user/',AuthenticatedUser)
app.use('/api/messages/',AuthenticatedUser)
app.use('/uploads', express.static(path.join(__dirname, 'Middleware','profilePics')));
app.use('/club_uploads', express.static(path.join(__dirname, 'Middleware','uploads')));


server.listen(5000,()=>{
    console.log('Server is running on port 5000')
})

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

