// backend/routes/api/index.js
const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js');
const sessionRouter = require('./session.js')
const usersRouter = require('./users.js')
const groupsRouter = require('./groups.js')

router.use(restoreUser);

router.use('/session', sessionRouter)

router.use('/users', usersRouter)

router.use('/groups', groupsRouter)

router.post('/test', (req, res) =>{
    res.json({user: {
        id,
        firstName,
        lastName,
        email,
        userName
    }})})

module.exports = router;