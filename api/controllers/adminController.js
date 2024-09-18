import User from "../models/UserModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const adminSignIn = async(req,res,next)=>{
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email})
        
        if(!user || !user.isAdmin){
            return next(errorHandler(403,'Access denied..only admin are approved..'))
        }

        const validPassword = bcryptjs.compareSync(password,user.password)
        if(!validPassword) return next(errorHandler(401,'wrong crediantials'))

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)    
        const {password:hashedPassword,...rest} = user._doc
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);

    } catch (error) {
        next(error)
        
    }
    
}

export const getAllUsers = async (req,res,next)=>{
    try {
        const users = await User.find({isAdmin:false})        
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

export const updateUser = async(req,res,next)=>{
    try {
        const {id} = req.params;
        const{email,username}=req.body

        const updatedUser = await User.findByIdAndUpdate(id,{username,email},{new:true})
        if(!updateUser){
            return next(errorHandler(404,"user not found"))
        }
        
        res.status(200).json(updatedUser)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async(req,res,next)=>{
    try {
        
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted")

    } catch (error) {
        next(error)
    }
}

export const addUser =async (req,res,next)=>{
    const {username,email,password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10)
    const newUser = new User({username,email,password:hashedPassword})
    try {
        await newUser.save()
        res.status(201).json({message:'user added successfully'})
        
    } catch (error) {
        next(error)
        
    }
}

export const signout = async(req,res)=>{
    res.clearCookie('access_token').status(200).json('Signout Success..')
}
