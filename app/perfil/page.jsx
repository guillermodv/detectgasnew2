"use client";
import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Header from "../components/Header";
import { UserContext } from "../context/userContext";

export default function UserProfile() {
  const { userSession } = useContext(UserContext);
  const [userDevices, setUserDevices] = useState([]); // Estado para almacenar los dispositivos del usuario

  useEffect(() => {
    if (!userSession) return; // Espera hasta que userSession esté disponible

    // Función para obtener dispositivos
    const fetchUserDevices = async () => {
      try {
        const response = await fetch("http://detectgas.brazilsouth.cloudapp.azure.com:3001/devices");
        const devices = await response.json();

        // Filtrar dispositivos que pertenecen al usuario actual
        const userDevices = devices.filter(device => device.userId === userSession.id);
        setUserDevices(userDevices);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchUserDevices();
  }, [userSession]);

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
              <span>{userDevices.length}</span> {/* Mostrar el número de dispositivos */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
