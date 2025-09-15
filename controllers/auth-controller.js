
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jswt = require('jsonwebtoken');


// regsiter controller

const registerUser = async(req,res)=> {
    try{

        const {username, email, password, role} = req.body;

        //check if user exist in database or not  exist they will try with secondary username
        // checking if email or username exit then show error
        const checkExistingUSer = await User.findOne({$or : [{username}, {email}]})
        if(checkExistingUSer){
            return res.status(400).json({
                success: false,
                message: 'Username or Email Already exist',
            })
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);

        const newUser = await User.create({
            username,
            email,
            password : hashPassword,
            role : role || 'user'
        });

        return res.status(200).json({
            success: true,
            data: newUser,
            message: 'New User Created Succesfully'
        })



    } catch(err){
        console.log('The error is',err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

const loginUser = async(req,res)=> {
    try{

        const {username, password} = req.body;

        // find to check user exit or not
        const findUser = await User.findOne({username});
        if(!findUser){
            return res.status(400).json({
                success: false,
                message: 'User not registered with us'
            })
        }

        // check the password 
        const isPasswordMatch = await bcrypt.compare(password,findUser.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                message: 'Invalid Credentials'
            });
        }

        // create user token
        const accessToken = jswt.sign({
            userId: findUser._id,
            username: findUser.username,
            role: findUser.role,
        },process.env.JWT_SECRET_KEY, {
            expiresIn: '15m'
        });

        res.status(200).json({
            success: true,
            accessToken: accessToken,
            message: 'User logged in successfully'
        });

    } catch(err){
        console.log('The error is',err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

const changePassword = async(req,res)=>{

   try{
    const userId = req.userInfo.userId;

    const {oldPassword,newPassword} = req.body;

    // find the current logged in user
    const findUser = await User.findById(userId);
    
    if(!findUser){
        return res.status(400).json({
            success: false,
            message: 'User not found'
        });
    }

    // check old Password
    const isPasswordMatch = await bcrypt.compare(oldPassword,findUser.password);

    if(!isPasswordMatch){
        return res.status(400).json({
            success: false,
            message: 'Old password is invalid'
        });
    }

    // hash the new passowrd
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt .hash(newPassword,salt);

    // update user password
    findUser.password = newHashedPassword;
    await findUser.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });

   } catch(err){
    console.log('The error is',err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
   }

}

module.exports = {registerUser,loginUser,changePassword}