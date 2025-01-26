"use client"; // si vous utilisez l’App Router de Next.js (v13+)

import React, { useState } from "react";
import { IoIosFlash, IoIosFlashOff } from "react-icons/io";
import { MdFlipCameraAndroid } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa";
import Image from "next/image";
import logo from "../app/logo.png";
import { IoMdSend } from "react-icons/io";
import { PiArrowBendLeftDownFill } from "react-icons/pi";
import { Pi } from "lucide-react";
import takePhotoPermissionPhoto from "../public/takePhotoPermissionPhoto.png"


export default function TakePhotoPermission() {
  const [flashOn, setFlashOn] = useState(false);
  const [isCameraFlipped, setIsCameraFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSecondaryImage, setShowSecondaryImage] = useState(false);
  const [showCameraControls, setShowCameraControls] = useState(true);
  const [removeSecondaryImage, setRemoveSecondaryImage] = useState(false); // État pour la transition de suppression


  // États pour les sources des images principale et secondaire
  const [mainImageSrc, setMainImageSrc] = useState(
    "https://picsum.photos/350/700"
  );
  const [secondaryImageSrc, setSecondaryImageSrc] = useState(
    "https://picsum.photos/350/700?random=1"
  );

  const handleTakePhoto = async () => {
    setIsLoading(true); // Démarrer le loader

    // Simuler la prise de photo
    setShowCameraControls(false);
    setTimeout(() => {
      setIsLoading(false); // Arrêter le loader après 3 secondes
      setShowSecondaryImage(true); // Afficher l'image secondaire après la prise de photo
    }, 3000);
  };

  // Fonction pour échanger les images
  const swapImages = () => {
    setMainImageSrc((prevMainImageSrc) => {
      setSecondaryImageSrc(prevMainImageSrc); // La source principale devient la secondaire
      return secondaryImageSrc; // La source secondaire devient la principale
    });
  };

  const handleRemoveSecondaryImage = () => {
    setRemoveSecondaryImage(true); // Activer l'animation de disparition
    setTimeout(() => {
      setShowSecondaryImage(false); // Supprimer l'image secondaire
      setShowCameraControls(true); // Réafficher les contrôles de la caméra
      setRemoveSecondaryImage(false); // Réinitialiser l'animation
    }, 100); // Durée de l'animation
  };

  const handleSendImage = async () => {
    console.log("Image sent! : ", mainImageSrc, secondaryImageSrc);
  }

  const handlePermission = async () => {
    try {
      // Demande l'autorisation pour accéder à la caméra
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  
      // Si la permission est accordée, vous pouvez manipuler le flux
      console.log("Camera permission granted", stream);
  
      // Ici, vous pouvez gérer ce que vous faites avec le flux de la caméra
      // Par exemple : assigner le flux à une balise vidéo
    } catch (error) {
      // Gère les erreurs, comme un refus d'accès ou un problème matériel
      console.error("Camera permission denied or error:", error);
      alert("Impossible d'accéder à la caméra. Assurez-vous d'avoir donné la permission.");
    }
  };
  

  return (
    <div className="flex flex-col bg-black h-screen gap-4 p-4">
      {/* Header */}
      <div className="flex flex-row justify-center gap-2 mb-3 mt-3">
        <div className="flex items-center gap-4 mt-4">
          <Image
            src={logo}
            alt="logo"
            placeholder="blur"
            priority
            width={200}
            height={200}
            quality={100}
            className="rounded-md invert"
          />
        </div>
      </div>

      {/* Camera */}
      <div className="relative flex items-center justify-center h-2/3 flex flex-col ">
        {/* Photo principale */}
        {/* <img
          src={mainImageSrc}
          alt="Main Capture"
          className="h-full w-full object-cover rounded-lg transition-transform duration-500 ease-in-out scale-100 border-red-700 border-2"
        /> */}

        <div className="h-full w-full rounded-lg border-red-700 border-2 flex flex-col p-4 text-white">
          <h1 className="text-2xl text-center mb-4">
            Connecte ta Caméra à Sawarni, en toute sécurité
          </h1>

          <p className="text-center text-sm mb-6 text-gray-400">
            Pour capturer l&apos;instant présent, Sawarni a besoin de ta permission.
          </p>

          {/* Conteneur bleu avec l'image */}
          <div onClick={handlePermission} className="border-blue-600 border-2 h-auto mx-6 rounded-2xl overflow-hidden p-2">
            <img
              src="/takePhotoPermissionPhoto.png"
              alt="Take Photo Permission"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Flèche */}
          <div className="flex flex-row justify-end">
            <PiArrowBendLeftDownFill
              size={64}
              className="text-blue-600 rotate-180 mr-20 font-thin"
            />
          </div>

          {/* Texte supplémentaire */}
          <div className="flex flex-row justify-center items-center mt-8 text-lg break-words">
            ( C&apos;est comme BeReal )
          </div>
        </div>

        {/* Afficher l'image secondaire uniquement si showSecondaryImage est true */}
        {showSecondaryImage && (
          <div>
            <div
              className={`absolute z-10 top-4 left-4 w-36 h-40 border-2 border-black rounded-lg overflow-hidden transform transition-transform duration-500 ease-in-out ${removeSecondaryImage ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
                }`}
              onClick={swapImages} // Appeler la fonction pour échanger les images
            >
              <img
                src={secondaryImageSrc}
                alt="Secondary Capture"
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
              />
            </div>
            <button
              className="
              absolute
              top-4
              right-4
              bg-white/50
              px-2
              py-1
              rounded-full
              backdrop-blur
              text-black
              font-bold
              hover:text-white
              transition-all
            "
              onClick={handleRemoveSecondaryImage}
            >
              X
            </button>
          </div>
        )}

        {/* Loader */}
        {isLoading && (
          <div className="absolute flex flex-col items-center justify-center gap-1">
            <span className="loading loading-infinity font-light loading-lg text-white"></span>
            <p className="text-white text-sm font-semibold">
              Capturing the memory
            </p>
          </div>
        )}
      </div>

      {/* Camera Controls */}
      {showCameraControls ? (
        <div className="flex flex-row justify-center gap-6 mt-4">
          {/* Bouton Flash */}
          <button
            className="p-4 rounded-full text-white transition-all duration-300"
            onClick={() => setFlashOn(!flashOn)}
          >
            {flashOn ? (
              <IoIosFlash size={32} className="transition-opacity duration-300" />
            ) : (
              <IoIosFlashOff
                size={32}
                className="transition-opacity duration-300"
              />
            )}
          </button>

          {/* Bouton Prendre Photo */}
          <button
            className="p-4 rounded-full active:scale-95 transition-transform duration-300"
            onClick={handleTakePhoto}
          >
            <FaRegCircle size={64} className="text-white" />
          </button>

          {/* Bouton Flip Caméra */}
          <button
            className={`p-4 rounded-full transition-transform duration-500 ${isCameraFlipped ? "rotate-180" : "rotate-0"
              }`}
            onClick={() => setIsCameraFlipped(!isCameraFlipped)}
          >
            <MdFlipCameraAndroid size={32} className="text-white" />
          </button>
        </div>
      ) : (
        showSecondaryImage && (
          <div onClick={handleSendImage} className="flex flex-row justify-center items-center gap-3 ml-4 h-32 text-white font-bold text-5xl transition-opacity duration-500 ease-in-out opacity-100">
            SEND
            <IoMdSend size={40} className="text-white" />
          </div>
        )
      )}
    </div>
  );
}
