const express = require ('express');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult } = require('express-validator/check');
const request = require('request');
const config = require('config');

// @route GET api/profile/me
// @desc -- Get current user's profile
// @access -- private

router.get('/me', auth, async(req, res) =>{
    try{
        const profile = await Profile.findOne({user :req.user.id}).populate('user',['name','avatar']);
        if(!profile){
            res.status(400).json({msg:"No profile found", user_id:req.user.id});
        }
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route POST api/profile/
// @desc -- Create or Update user profile
// @access -- private

router.post('/', 
    [
        auth, 
        [   
            check('status', 'Status is required').not().isEmpty(),
            check('skills', 'Skills are required').not().isEmpty()
        ]
    ], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername, 
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;
    try{
    // Build profile object

    const profileFields = {};

    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills){
        if(!Array.isArray(skills)) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }else skills
    }

    const linkFormat = str => (str.substr(0,4)!=='http' ? 'http://'+str : str)

    // Build social object
    profileFields.social = {}
    if(youtube) profileFields.social.youtube  = linkFormat(youtube);
    if(twitter) profileFields.social.twitter  = linkFormat(twitter);
    if(facebook) profileFields.social.facebook  = linkFormat(facebook);
    if(instagram) profileFields.social.instagram  = linkFormat(instagram);
    if(linkedin) profileFields.social.linkedin  = linkFormat(linkedin);
        let profile = await Profile.findOne({user: req.user.id});
        if(profile){
            //update the profile
            // profile = await Profile.findOneAndUpdate({user:req.user.id}, {$set: profileFields}, {new: true});
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true}
            )
            
            return res.json(profile);
        }

        // If profile not found, then create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
        
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route GET api/profile/
// @desc -- Get all profiles
// @access -- public

router.get('/', async(req,res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route GET api/profile/user/:user_id
// @desc -- Get profile by User ID
// @access -- public

router.get('/user/:user_id', async(req,res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar'])
        if(!profile){
            return res.status(400).json({msg: "No profile found"})
        }
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(400).json({msg: "No profile found"})
        }
        res.status(500).send('Server Error');
    }
});

// @route DELETE api/profile
// @desc -- Delete profile user and posts
// @access -- private

router.delete('/', auth, async(req,res) => {
    try {
        // Remove user posts
        await Post.deleteMany({ user:req.user.id});

        //Remove profile
        await Profile.findOneAndRemove({user: req.user.id})
        //Remove user
        await User.findOneAndRemove({_id: req.user.id})
        res.json({"msg":"User deleted"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route PUT api/profile/experience
// @desc -- add profile experience details
// @access -- private

router.put('/experience', [auth,[
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async(req,res)=>{
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
        return res.status(400).json({errors: validationErrors.array()})
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({user:req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error occurred');
    }

});

// @route DELETE api/profile/experience
// @desc -- Delete experience from profile
// @access -- Private

router.delete('/experience/:exp_id', auth, async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id});

        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// @route PUT api/profile/education
// @desc -- add profile education details
// @access -- private

router.put('/education', [auth,[
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldOfStudy', 'Field of Study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async(req,res)=>{
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
        return res.status(400).json({errors: validationErrors.array()})
    }
    const {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({user:req.user.id});
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error occurred');
    }

});

// @route DELETE api/profile/education
// @desc -- Delete education from profile
// @access -- Private

router.delete('/education/:edu_id', auth, async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id});

        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route GET api/profile/github/:username
// @desc -- Get user repos from Github
// @access -- Public

router.get('/github/:username', (req,res)=>{
    try {
        const options = {
            uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method:'GET',
            headers:{ 'user-agent':'node.js'}
        };
        request(options, (error, response, body) => {
            if(error) {console.error(error)};

            if(response.statusCode !==200){
                res.sendStatus(404).json({msg: "No Github profile found"});
            }
            res.json(JSON.parse(body));
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");        
    }

})




module.exports = router;