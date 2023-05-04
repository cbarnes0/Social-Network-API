const router = require('express').Router();
const userController = require('../../controllers/userController');
const { getUsers, getSingleUser, createUser, updateUser, deleteUser, addFriend, deleteFriend } = require('../../controllers/userController');

// Get ALL USERS ROUTE
// This routes / endpoint --> '/api/users/   GET method
//router.get('/', userController.getUsers);

router.get('/', getUsers);
router.get('/:userId', getSingleUser);
router.post('/', createUser);

//router.route('/').get(getUsers).post(createUser)

module.exports = router;