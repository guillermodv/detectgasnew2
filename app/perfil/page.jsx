"use client";
import { useContext } from 'react';
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
      <div className="flex flex-col items-center justify-center p-6 bg-[#e0f7f9] min-h-screen">
        <div className="bg-[#c3e5e7] rounded-lg p-8 w-full max-w-lg shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-[#d1c4e9] rounded-full p-6 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-20 h-20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 18.75a7.5 7.5 0 1115 0v.75H4.5v-.75z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Perfil de Usuario</h2>
          </div>

          <div className="space-y-4 text-center"> {/* Espacio vertical reducido */}
            <div className="flex items-center text-lg"> {/* Cambiado a items-center */}
              <span className="font-semibold mr-1">Nombre de usuario:</span> {/* Añadido margen derecho */}
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
