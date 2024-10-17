// app/profile/page.jsx

"use client"
import {useContext} from 'react'
import Header from "../components/Header";
import SensorCard from "../components/SensorCard";
import { UserContext } from "../context/userContext";

export default function UserProfile() {
  const user = useContext(UserContext);
  const {userSession, setUserSession} = user;

  // Datos simulados
  const simulatedUserData = {
    username: "Emiliano Colavita", 
    email: "colavitaemiliano1@gmail.com",
    devicesConnected: 2,
  };

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

          <div className="space-y-6 text-center">
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">Nombre de usuario:</span>
              <span>{simulatedUserData.username}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">Correo electrónico:</span>
              <span>{simulatedUserData.email}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">Dispositivos conectados:</span>
              <span>{simulatedUserData.devicesConnected}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
