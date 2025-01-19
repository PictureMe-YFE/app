"use server"
import { authOptions } from "@/libs/next-auth";
import { getServerSession } from "next-auth";
import connectMongo from "@/libs/mongoose";
import { redirect } from "next/dist/server/api-utils";


export const auth = async () => {
    const session = await getServerSession(authOptions);
    return session;
}