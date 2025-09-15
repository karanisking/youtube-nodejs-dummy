const express = require('express');
const authMiddleware = require('../middleware/auth-middleware')
const router = express.Router();


// how middleware work  normally  write as router.get('/home',handler1,handler2, (req,res)=>{}) here firslt go to route /home then check handler 1 then handler2 then req,res goes so it works like that
router.get('/home',authMiddleware, (req,res)=> {
    res.json({
        message: 'Welcome to home page'
    })
})

module.exports = router;