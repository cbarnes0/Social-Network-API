const { User, Thought } = require('../models');

module.exports = {
// Get to get all thoughts
getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
},
// Get to get a single thought by its '_id'
getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
            ? res.status(404).json({ message: 'No thought with that ID' })
            : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
},
// `POST` to create a new thought (don't 
// forget to push the created thought's `_id` 
// to the associated user's `thoughts` array field)
createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
            { _id: req.body.userId },
            { $addToSet: { thoughts: thought._id } },
            { new: true }
        );
      })
      .then((user) =>
        !user
          ? res.status(404).json({
              message: 'Thought created, but found no user with that ID',
          })
          : res.json('Created the thought! 🎉')
          )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);  
      });
},

// put to update a thought by its '_id'
updateThought(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
    )
        .then((thought) =>
          !thought
            ? res.status(404).json({ message: 'No thought with this id!' })
            : res.json(thought) 
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);  
        });
},

// delete to remove a thought by its '_id'
deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ?res.status(404).json({ message: 'No thought with this ID!'})
          : User.findByIdAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId }},
            { new: true }
          )
    )
    .then((user) =>
      !user
       ? res.status(404).json({
        message: 'Thought deleted but no user with this ID!',
       })
       : res.json({ message: 'Application successfully deleted! 🎉'})
       )
       .catch((err) => res.status(500).json(err));
},

// post to create a reaction stored in a single thoughts 'reactions'
// array field
addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
// delete to pull and remove a reaction by the reactions
// 'reactionId' value
removeReaction(req, res) {
    Thought.findByIdAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { tags: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};
