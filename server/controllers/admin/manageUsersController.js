const mongoose = require('mongoose');
const user = require('../../models/userSchema.js')

// GET request for a list of all users
const getUsers = async (req, res) => {
    try {

        const users = await user.find();
        if (users) {
            res.status(200).json(users);
        }
    } catch (error) {
        res.status(500).json({ message: "internal error" });
    }
}

// GET request for one user (specified by its ID)
const getUser = async (req, res) => {
    
    try {
        const id = req.params.id;
        const filters = {
            _id: id
        }

        const fetchedUser = await user.find(filters);
        if (fetchedUser) {
            res.status(200).json(fetchedUser);
        }
    } catch (error) {
        res.status(500).json({ message: "internal error" });
    }

}

// POST request to add a user
const addUser = async (req, res) => {
    try {
        const addedUser = req.body;
        const result = await user.create(addedUser);

        if (result) {
            res.status(201).json({ message: "added user" });
        } else {
            res.status(409).json({ message: "failed to add user" });
        }
    } catch (error) {
        res.status(500).json({ message: `internal error : ${error.message}` });
    }

}



// PUT request to update a user
const updateUser = async (req, res) => {

    try {
            const updatedUser = req.body;
            const id = req.params.id;
            const result = await user.updateOne(updatedUser);

            if (result) {
                res.status(201).json({ message: "updated user" });
            } else {
                res.status(409).json({ message: "failed to update user" });
            }
        } catch (error) {
            res.status(500).json({ message: "internal error" });
        }


}

// DELETE request to delete a user
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await user.deleteOne({ _id: id })
        user.sub = req.body.user
        if (result['deletedCount']) {
            res.status(200).json({ message: "deleted user" });
        } else {
            res.status(404).json({ message: "user does not exist" });

        }

 
    } catch (error) {
        res.status(500).json({ message: "internal error" });
    }

}

module.exports = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser
}