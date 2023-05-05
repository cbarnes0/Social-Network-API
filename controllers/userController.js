const { User, Thought } = require('../models');



module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate('thoughts')
      .populate('friends')
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new user (POST)
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // update a user (PUT)
  updateUser(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
    )
        .then((user) =>
          !user
            ? res.status(404).json({ message: "No user found with this ID!" })
            : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
  },

  // Delete a user and associated thoughts when deleted

  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Application.deleteMany({ _id: { $in: user.applications } })
      )
      .then(() => res.json({ message: 'User and associated apps deleted!' }))
      .catch((err) => res.status(500).json(err));
  },


  // Add a friend

  addFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId }}, { new: true })
       .then(data => {
           if(!data) {
               res.status(404).json({ meswage: "No user found with given ID"})
           }
           res.staus(200).json(data);
       })
       .catch(error => {
          console.log(error);
          res.status(500).json(error);
       })
    },
    
    // Delete a friend
    deleteFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId }}, { new: true })
        .then(data => {
            if(!data) {
                res.status(404).json({ meswage: "No user found with given ID"})
            }
            res.staus(200).json(data);
        })
        .catch(error => {
           console.log(error);
           res.status(500).json(error);
        })
    }

};