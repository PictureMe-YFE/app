"use server"

import connectMongo from "@/libs/mongoose"
import { v4 as uuidv4 } from 'uuid';
import Shirt from "@/models/Shirt";
import Membre from "@/models/Membre";
import { redirect } from 'next/navigation'
import bcrypt from "bcryptjs";


export const getQrCode = async (uuid) => {
  await connectMongo();

  try {
    // Only get the fields we need:
    const shirt = await Shirt.findOne(
      { uuid },
      '_id assignedTo' // projection for a minimal query
    ).lean();

    console.log(shirt);

    if (!shirt) {
      return {
        success: false,
        error: 'Shirt not found',
        notAssigned: false,
      };
    }

    // If the shirt is unassigned, redirect to /verify
    if (!shirt.assignedTo) {
      console.log("NOT ASSIGNED")
      return {
        success: false,
        error: 'Shirt not assigned',
        notAssigned: true,
      };
    }

    // If the shirt is assigned, return success
    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};

export const verificationCodeStep = async (uuid, code) => {
  await connectMongo();

  try {
    const shirt = await Shirt.findOne({ uuid }).lean();

    if (!shirt) {
      return {
        success: false,
        error: 'Shirt not found',
      };
    }

    if (shirt.assignedTo) {
      return {
        success: false,
        error: 'Shirt already assigned',
      };
    }

    if (shirt.verificationCode !== code) {
      return {
        success: false,
        error: 'Invalid code',
      };
    }

    return {
      success: true,
    };

  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}

export const assignShirt = async (data) => {
  await connectMongo();

  try {
    console.log(data)
    const shirt = await Shirt.findOne({ uuid: data.uuid }).lean();

    if (!shirt) {
      return {
        success: false,
        error: 'Shirt not found',
      };
    }

    if (shirt.assignedTo) {
      return {
        success: false,
        error: 'Shirt already assigned',
      };
    }

    if (shirt.verificationCode !== data.code) {
      return {
        success: false,
        error: 'Invalid code',
      };
    }

    // Check if the email is already used
    const member = await Membre.findOne({ email: data.email }).lean();
    if (member) {
      return {
        success: false,
        error: 'Email already in use',
      };
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(data.password, 10);

    // Create a new member
    const newMember = new Membre({
      credentials: {
        email: data.email,
        password: hashPassword,
      },
      username: data.username,
      firstShirt: shirt.id,
    });

    // Save member
    const memberSaved = await newMember.save();

    // Update the Shirt document to assign it
    await Shirt.updateOne(
      { uuid: data.uuid },
      {
        assignedTo: memberSaved._id,
        assignedAt: new Date(),
        status: 'claimed',
      }
    );

    return {
      success: true,
      member: memberSaved,
    };

  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};
