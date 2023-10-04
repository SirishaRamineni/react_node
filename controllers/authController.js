import { comparePassword, hashPassword } from "../helpers/authhelpers.js"
import userModel from "../models/userModel.js"
import jwt from 'jsonwebtoken'

export const registerController=async(req,res)=>{
    try{
        const {name,email,password,answer}=req.body
        if(!name){
            res.status(400).json({message:"name is required"})
        }
        if(!email){
            res.status(400).json({message:"email is required"})
        }
        if(!password){
            res.status(400).json({message:"password is required"})
        }
        if(!answer){
            res.status(400).json({message:"answer is required"})
        }
        const existingUser=await userModel.findOne({email})
   if(existingUser){
    res.status(400).json({
        success:false,
      
        message:"user already registered"
    })
   }

   const hashedPassword=await hashPassword(password)
  const user=await new userModel({
    name,
    email,
    password:hashedPassword,
    answer
  }).save()
   res.status(201).json({
    success:true,
   message:"user registered successfully",
   user
   })
    }catch(error){
        res.status(404).json({
            success:false,
            message:"error in registration"
        })
    }
}


export const loginController=async(req,res)=>{
    try{
        const{email,password}=req.body
        if(!email || !password){
           res.status(400).json({
                success:false,
                message:"email or password doesnot match"
            })
        }
        
        const user=await userModel.findOne({email})
        if(!user){
            res.status(400).json({
                success:false,
                message:"user not registered"
            })
        }

        const match=await comparePassword(password,user.password)
        if(!match){
            res.status(400).json({
                success:false,
                message:"password does not match"
            })
        }

       const token=await jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})

       res.status(201).json({
        success:true,
        message:"login successfully ",
        user:{
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            
        },
        token,
    })

    }catch(error){
        console.log(error)
        res.status(404).json({
            success:false,
            message:"error in login "
        })
    }
}