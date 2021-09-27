//imports
const express = require('express');
const Users = require('./users/model.js');

//invoking the express function
const server = express();

//Global Middleware - teaches express to parse request bodies as json
server.use(express.json());


//ENDPOINTS
//Creates a user using the information sent inside the `request body`. 
server.post('/api/users', async (req, res) => {
    try{
        const {id, name, bio} = req.body;

        if(!name || !bio){
            res.status(400).json({message: "Please provide name and bio for the user"})
        }
        else{
            const newUser = await Users.insert({id, name, bio})
            res.status(201).json(newUser)
        }
    }
    catch{
        res.status(500).json({message: "There was an error while saving the user to the database"})
    }
})

//Returns an array 
server.get('/api/users', async (req,res) => {
    try{
        const users = await Users.find()
        if(!users){
            res.status(500).json({message: "The users information could not be retrieved"})
        }
        else{
            res.status(201).json(users)
        }
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            customMessage: "uh-oh, something went wrong while trying to retrieve the users"
        })
    }
})

//Returns the user object with the specified `id`. 
server.get('/api/users/:id', async (req,res) => {
    try{
        const {id} = req.params
        const user = await Users.findById(id)

        if(!user){
            res.status(404).json({message: "The user with the specified ID does not exist"})
        }
        else{
            res.status(201).json(user)
        }
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            customMessage: "The user information could not be retrieved"
        })
    }
})

//Removes the user with the specified `id` and returns the deleted user.
server.delete('/api/users/:id', async (req,res) => {
    try{
        const {id} = req.params
        const user = await Users.findById(id)

        if(!user){
            res.status(404).json({message: "The user with the specified ID does not exist"})
        }
        else{
            const deletedUser = await Users.remove(id)

            res.status(201).json(deletedUser)
        }
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            customMessage: "The user information could not be retrieved"
        })
    }
})

//Updates the user with the specified `id` using data from the `request body`. Returns the modified user
server.put('/api/users/:id', async (req,res) => {
    try{
        const {id} = req.params
        const {name, bio} = req.body
        const user = await Users.findById(id)

        if(!user){
            res.status(404).json({message: "The user with the specified ID does not exist"})
        }
        else if(!name || !bio){
            res.status(400).json({message: "Please provide name and bio for the user"})
        }
        else{
            const changes = {name: name, bio: bio}
            const updatedUser = await Users.update(id, changes)

            res.status(201).json(updatedUser)
        }
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            customMessage: "The user information could not be modified"
        })
    }
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
