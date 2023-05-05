const router = require('express').Router();
const { 
    getUsers, 
    getSingleUser, 
    createUser, 
    updateUser, 
    deleteUser, 
    addFriend, 
    deleteFriend 
} = require('../../controllers/userController');

router.get('/', getUsers);
router.get('/:userId', getSingleUser);
router.post('/', createUser);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

router.post('/:userId/friends/:friendId', addFriend);
router.delete('/:userId/friends/:friendId', deleteFriend);

module.exports = router;