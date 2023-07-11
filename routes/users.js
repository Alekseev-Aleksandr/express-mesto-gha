const router = require('express').Router()
const { getAllUser, getUserById, createNewUser, updateProfile, updateAvatar } = require('../controllers/users')

router.get('/users', getAllUser)

router.get('/users/:userId', getUserById)

router.post('/users', createNewUser)

router.patch('/users/me', updateProfile)

router.patch('/users/me/avatar', updateAvatar)

module.exports = router