"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { assignShirt, verificationCodeStep } from "@/actions/qrCode.actions";
import { User, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";


export default function TShirtFlow({ uuid }) {
    // Which step are we on?
    const [step, setStep] = useState(1);
    const router = useRouter(); // from "next/navigation"



    // -----------------------------
    // STEP 1: Code Verification
    // -----------------------------
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [finalCode, setFinalCode] = useState("");
    const [acceptTos, setAcceptTos] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const inputRefs = useRef([]);

    const handleChange = (index, value) => {
        if (/^\d$/.test(value) || value === "") {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            setHasError(false);
            setErrorMsg("");

            if (value !== "" && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && code[index] === "" && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmitVerificationCodeStep = async () => {
        // If not all 6 digits, show error highlight
        const finalCode = code.join("");
        setFinalCode(finalCode);
        if (finalCode.length < 6 || code.some((digit) => digit === "")) {
            setHasError(true);
            return;
        }

        // Show button loading
        setLoading(true);
        setErrorMsg("");

        // Call your server action
        const result = await verificationCodeStep(uuid, finalCode);
        setLoading(false);

        if (!result.success) {
            // Show an error if code is invalid or shirt is already assigned, etc.
            setErrorMsg(result.error || "An error occurred");
            setHasError(true);
            return;
        }

        // If success, go to the next step
        setStep(2);
    };



    // Motion variants for a simple left->right step transition
    const stepVariants = {
        hidden: { x: "50vw", opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 },
        },
        exit: { x: "-50vw", opacity: 0 },
    };

    // -----------------------------
    // STEP 2: User Info / Register
    // -----------------------------
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [registerLoading, setRegisterLoading] = useState(false);
    const [registerError, setRegisterError] = useState("");

    const handleRegister = async () => {
        if (!email || !username || !password) {
            setRegisterError("Veuillez remplir tous les champs");
            return;
        }

        setRegisterLoading(true);
        setRegisterError("");

        // TODO: Call your server action to "claim" the T-shirt with this user info.
        // Example: const result = await assignTshirtToUser({ uuid, email, username, password });
        // if (result.success) { ... } else { setRegisterError(result.error); }
        const data = { code: finalCode, uuid, email, username, password };
        const result = await assignShirt(data);



        if (!result.success) {
            setRegisterLoading(false);

            // Vérifie l’erreur précise
            if (
                result.error ===
                "Email déja utilisé, connectez-vous avec ce compte et associez le shirt"
            ) {
                // On utilise un toast custom avec un bouton pour rediriger
                toast.custom((t) => (
                    <div className="alert alert-error shadow-lg p-4 flex flex-col gap-2 text-white w-96">
                        <span>{result.error}</span>
                        <div className="flex justify-center w-full">
                            <button
                                className="btn btn-sm btn-outline text-white"
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    router.push("/auth/login");
                                }}
                            >
                                Se connecter
                            </button>
                        </div>
                    </div>
                ));

            } else {
                // Erreur générique
                toast.error(result.error || "An error occurred");
            }

            // Si tu veux aussi afficher l’erreur dans un state local
            setRegisterError(result.error || "An error occurred");
            return;
        }

        // const res = await signIn("credentials", {
        //     email,
        //     password,
        //     redirect: false,
        // })

        // if (res?.ok) {
        //     router.push("/dashboard");
        // }

        // if (!res?.ok) {
        //     console.error(res.error);
        //     toast.error("Une erreur est survenue lors de la connexion");
        //     setRegisterLoading(false);
        //     return;
        // }

        router.push("/auth/login");
        // If success, you can redirect to a "success" page or do something else.
        toast.success("T-shirt associé avec succès !");
    };



    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] text-black p-4">
            {step === 1 && (
                <motion.section
                    key="step1"
                    variants={stepVariants}
                    exit="exit"
                    className="flex flex-col items-center gap-6 max-w-sm w-full"
                >
                    <h1 className="text-xl font-bold">Associer votre T-shirt</h1>
                    <p className="text-center text-sm text-gray-700">
                        Veuillez saisir le code à 6 chiffres inscrit sur votre T-shirt
                        afin de l’associer à votre compte.
                    </p>

                    {/* 6 separate inputs */}
                    <div className="flex gap-2 text-black">
                        {code.map((digit, index) => {
                            const showInputError = hasError && digit === "";
                            return (
                                <input
                                    key={index}
                                    type="tel"
                                    maxLength={1}
                                    className={`input input-bordered w-12 text-center text-lg ${showInputError ? "input-error border-2" : ""
                                        }`}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    ref={(el) => {
                                        if (el) inputRefs.current[index] = el;
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* "Se souvenir de l'appareil" checkbox */}
                    <div className="flex gap-2">
                        <input
                            type="checkbox"
                            className="checkbox"
                            id="rememberDevice"
                            checked={acceptTos}
                            onChange={() => setAcceptTos(!acceptTos)}
                        />
                        <label htmlFor="rememberDevice" className="text-sm">
                            J&apos;accepte les conditions d&apos;utilisation
                        </label>
                    </div>

                    {/* Display an error if needed */}
                    {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}

                    {/* Submit / Continue button with loading */}
                    <button
                        className="btn btn-outline-primary w-full"
                        onClick={handleSubmitVerificationCodeStep}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner text-white"></span>
                                &nbsp;Validation...
                            </>
                        ) : (
                            "Continuer"
                        )}
                    </button>

                    {/* Return to login link */}
                    <a href="/auth/login" className="text-blue-600 text-sm">
                        <button className="btn btn-link text-blue-600 text-sm">
                            J&apos;ai déjà un compte ? Me connecter
                        </button>
                    </a>
                </motion.section>
            )}

            {step === 2 && (
                <motion.section
                    key="step2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex flex-col items-center gap-6 max-w-sm w-full"
                >
                    <h2 className="text-xl font-bold">Étape 2 : Votre Profil</h2>
                    <p className="text-center text-sm text-gray-700">
                        Comment voulez-vous qu’on vous appelle ?
                    </p>

                    {/* USERNAME Field */}
                    <label className="input input-bordered flex items-center gap-2 w-full bg-white text-black px-2 py-1">
                        <User className="w-5 h-5 text-black" />
                        <input
                            type="text"
                            className="grow bg-transparent focus:outline-none"
                            placeholder="Votre pseudo"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                    <p className="text-center text-sm text-gray-700">
                        Choisissez un email et un mot de passe pour votre compte.
                    </p>


                    {/* EMAIL Field */}
                    <label className="input input-bordered flex items-center gap-2 w-full bg-white text-black px-2 py-1">
                        <Mail className="w-5 h-5 text-black" />
                        <input
                            type="email"
                            className="grow bg-transparent focus:outline-none"
                            placeholder="Adresse email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>

                    {/* PASSWORD Field */}
                    <label className="input input-bordered flex items-center gap-2 w-full bg-white text-black px-2 py-1">
                        <Lock className="w-5 h-5 text-black" />
                        <input
                            type="password"
                            className="grow bg-transparent focus:outline-none"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    {/* Error Message */}
                    {registerError && <p className="text-red-400 text-sm">{registerError}</p>}

                    {/* Submit Button */}
                    <button
                        className="btn btn-outline-primary w-full"
                        onClick={handleRegister}
                        disabled={registerLoading}
                    >
                        {registerLoading ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                &nbsp;Création...
                            </>
                        ) : (
                            "Créer et Associer"
                        )}
                    </button>
                </motion.section>
            )}

        </div>
    );
}
