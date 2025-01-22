"use server";

import { auth } from "@/libs/auths";
import { redirect } from "next/navigation";
import connectMongo from "@/libs/mongoose";



export const middlewareAuthPages = async () => {
    const session = await auth();

    if (session) {

        redirect("/dashboard");
    }
}
