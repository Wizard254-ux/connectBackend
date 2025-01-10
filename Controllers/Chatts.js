const express = require('express');
const app = express();
app.use(express.json());
const Chatt = require('../Models/privateChatt.model.js');
const groupMessages = require('../Models/groupChatt.model.js');
const {io}=require('../server')
const Event=require('../Models/event.model')
const UserGroup=require('../Models/UserGroup.model')

const getChatts = async (req, res) => {
  try {
    const { groupId } = req.query;

    // Await the result of the find query
    const chatts = await Chatt.find({ groupId });

    // Respond with the fetched chat data
    res.status(200).json({ message: 'Successful', data: chatts });
  } catch (error) {
    // Handle error with a 500 status
    res.status(500).json({ message: error.message });
  }
};
const getUserChatts = async (req, res) => {
  try {
    const { username } = req.query;
  console.log(username)
    // Await the result of the find query
    const chatts = await Chatt.find({ 
     $or:[
       {sender:username},
       {receiver:username}
     ]

     });

    // Respond with the fetched chat data
    res.status(200).json({ message: 'Successful', data: chatts });
  } catch (error) {
    // Handle error with a 500 status
    res.status(500).json({ message: error.message });
  }
};
const getGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.query;
    
    // Await the result of the find query
    const chatts = await groupMessages.find({ groupId });
    
    // Respond with the fetched chat data
    res.status(200).json({ message: 'Successful', data: chatts });
  } catch (error) {
    // Handle error with a 500 status
    res.status(500).json({ message: error.message });
  }
};
const saveMessage = async (req, res) => {
  try {
    // Await the result of the find query
    if (!req.body.sender || !req.body.receiver || !req.body.groupId || !req.body.content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    
    const chatts = new Chatt(req.body)
    await chatts.save()
    console.log(req.body.groupId)
    try {
      io.to(req.body.groupId).emit('new_message', chatts);
    } catch (socketError) {
      console.error('Socket emission error:', socketError);
      // Message is saved but socket emission failed
    }
    
    res.status(200).json({ message: 'Successful', data: chatts });
  } catch (error) {
    // Handle error with a 500 status
    res.status(500).json({ message: error.message });
  }
};

const saveGroupMessage = async (req, res) => {
  try {
    // Await the result of the find query
    const chatts = new groupMessages(req.body)
    if (!req.body.sender || !req.body.senderId || !req.body.groupId || !req.body.content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const event=await Event.findById(req.body.groupId)
    if (!event) {
      return res.status(404).json({ message: 'group id not found' });
    }

    await chatts.save()
    try {
      io.to(req.body.groupId).emit('new_message', chatts);
    } catch (socketError) {
      console.error('Socket emission error:', socketError);
      // Message is saved but socket emission failed
    }
    
    res.status(200).json({ message: 'Successful', data: chatts });
  } catch (error) {
    // Handle error with a 500 status
    res.status(500).json({ message: error.message });
  }
};
const saveUserGroup = async (req, res) => {
  try {
    // Check for required fields
    if (!req.body.senderId || !req.body.groupId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if the group exists
    const event = await Event.findById(req.body.groupId);
    if (!event) {
      return res.status(400).json({ message: 'Group not found' });
    }

    // Find or create the user group
    let newUserGroup = await UserGroup.findOne({ userId: req.body.senderId });
    if (newUserGroup) {
      newUserGroup.groupIds = [...newUserGroup.groupIds, req.body.groupId];
    } else {
      newUserGroup = new UserGroup({
        userId: req.body.senderId,
        groupIds: [req.body.groupId]
      });
    }

    // Save the user group
    await newUserGroup.save();

    // Return success response
    res.status(200).json({ message: 'Successful', data: newUserGroup });
  } catch (error) {
    // Handle error with a 500 status
    res.status(500).json({ message: error.message });
  }
};

const removeUserFromGroup = async (req, res) => {
  try {
    const { userId, groupId } = req.body;
    
    if (!userId || !groupId) {
      return res.status(400).json({ message: 'Missing userId or groupId' });
    }

    const userGroup = await UserGroup.findOne({ userId });
    
    if (!userGroup) {
      return res.status(404).json({ message: 'User group not found' });
    }

    // Remove the groupId from the groupIds array
    userGroup.groupIds = userGroup.groupIds.filter(id => id !== groupId);
    
    await userGroup.save();
    
    res.status(200).json({ 
      message: 'Successfully removed from group', 
      data: userGroup 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId' });
    }

    const userGroup = await UserGroup.findOne({ userId });
    
    if (!userGroup) {
      return res.status(200).json({ data: [] }); // Return empty array if no groups found
    }

    // Fetch all group details
    const groupDetails = await Event.find({
      _id: { $in: userGroup.groupIds }
    });
    
    res.status(200).json({ 
      message: 'Successfully retrieved user groups',
      data: groupDetails
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {getUserGroups, getChatts,saveMessage,saveGroupMessage,saveUserGroup,getUserChatts,getGroupMessage };
