const {Router} = require('express')

const router = Router()

const loginController = require('../controller/login.controller')

router.post('/',loginController.login)

router.get('/verify',loginController.verify_login)

router.get('/logout',loginController.logout)

module.exports = router