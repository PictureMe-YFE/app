"use server"

import connectMongo from "@/libs/mongoose"
import { v4 as uuidv4 } from 'uuid';
import Shirt from "@/models/Shirt";
import Membre from "@/models/Membre";
import { redirect } from 'next/navigation'
import bcrypt from "bcryptjs";
import { auth } from "@/libs/auths";

export const userExist = async (email) => {
    await connectMongo();
    
    const session = await auth()
    // if (session) {
    //     return {
    //         success: false,
    //         error: 'User already connected',
    //     };
    // }
    try {
        const user = await Membre.findOne({"credentials.email" :email})

        if (!user) {
            return {
                success: false,
                error: 'User not found',
            };
        }

        return {
            success: true,
            user,
        };
    } catch (err) {
        return {
            success: false,
            error: err.message,
        };
    }
}



export const userExistById = async (id) => {
    await connectMongo();
   

    try {
        const user = await Membre.findById(id)

        if (!user) {
            return null;
        }

        return user;
    } catch (err) {
        return null;
    }
}