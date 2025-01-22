"use client";

import { signIn } from "next-auth/react";
import React, { useState } from "react";
import Image from "next/image";
import config from "@/config";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import logo from "../../logo.png"

function LoginCard() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (formData) => {
        console.log("formData =>", formData.get("email"));
        setIsLoading(true);
        const email = formData.get("email");
        const password = formData.get("password");
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (res?.ok) {
            router.push("/dashboard");
        }

        if (!res?.ok) {
            console.error(res.error);
            toast.error("Une erreur est survenue lors de la connexion");
            setIsLoading(false);
            return;
        }
    };




    return (
        <>
            <div className="flex items-center justify-center min-h-screen absolute inset-0 -z-10 h-full w-full px-5 py-24 bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]  text-black">
                <div className="card w-full max-w-[90%] sm:w-2/3 md:w-1/2 lg:w-1/3 ">
                    <div className="flex flex-row justify-center gap-2 mb-6 mt-3">
                        <div className="flex items-center gap-4 ">
                            <Image
                                src={logo}
                                alt="logo"
                                placeholder="blur"
                                priority
                                // Au lieu de 128x128, par exemple :
                                width={256}
                                height={256}
                                quality={100}       // Pour maximiser la qualité d’encodage
                                className="rounded-md"
                            />

                        </div>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(new FormData(e.target));
                        }}
                    >
                        <div className="form-control mb-4">
                            <label
                                className="input input-bordered flex items-center gap-2 rounded-md"
                                htmlFor="email"
                            >
                                <span className="label-text font-bold">Email</span>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="john.doe@example.com"
                                    className="grow text-black"
                                    required
                                />
                            </label>
                        </div>
                        <div className="form-control mb-4">
                            <label
                                className="input input-bordered flex items-center gap-2 rounded-md"
                                htmlFor="password"
                            >
                                <span className="label-text font-bold">Mot de passe</span>
                                <input
                                    name="password"
                                    type="password"
                                    id="password"
                                    placeholder="********"
                                    className="grow text-black"
                                    required
                                />
                            </label>
                        </div>
                        <button
                            type="submit"
                            className={`btn btn-block btn-primary  rounded-md `}
                            disabled={isLoading}
                        >
                            {isLoading && <span className="loading loading-spinner"></span>}
                            {isLoading ? "Loading..." : "Sign in"}
                        </button>
                    </form>

                </div>
            </div>
        </>
    );
}

export default LoginCard;
