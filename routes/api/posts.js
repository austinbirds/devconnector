const express = require ('express');
const router = express.Router();
const User = require('../../models/User');

// @route GET api/posts
// @desc -- Test Route
// @access -- public 

router.get('/', async(req, res) =>{
    const users =  await User.find()
    res.send(users);
    // res.send('Posts Route');
});


module.exports = router;