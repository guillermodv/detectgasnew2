"use client";
import { useContext } from 'react';
import Image from 'next/image';
import Header from "../components/Header";
import { UserContext } from "../context/userContext";

export default function UserProfile() {
  const { userSession } = useContext(UserContext);

  if (!userSession) {
    return <p>Cargando datos del usuario...</p>;
  }

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#61AFB6] to-[#3862A4] min-h-screen">
        <div className="mb-40 bg-[#c3e5e7] rounded-lg p-8 w-full max-w-lg shadow-lg">
          <div className="flex flex-col items-center mb-5">
            <div>
              <Image
                className="mt-[-5px] mb-6 ml-3"
                src="/robot.PNG"
                alt="Profile Image"
                width={150}
                height={150}
                priority
              />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4 text-[#00368a]">Perfil de Usuario</h2>
          </div>

          <div className="space-y-4 text-center">
            <div className="flex items-center text-lg">
              <span className="font-semibold mr-1">Nombre de usuario:</span>
              <span>{userSession.name}</span>
            </div>
            <div className="flex items-center text-lg">
              <span className="font-semibold mr-1">Correo electrónico:</span>
              <span>{userSession.email}</span>
            </div>
            <div className="flex items-center text-lg">
              <span className="font-semibold mr-1">Dispositivos conectados:</span>
              <span>1</span> {/* Hardcodeado como 1 */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
