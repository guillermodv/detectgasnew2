"use client";
import { useContext } from "react";
import Header from "../components/Header";
import SensorCard from "../components/SensorCard";
import { UserContext } from "../context/userContext";

export default function Home() {
  const user = useContext(UserContext);
  const { userSession, setUserSession } = user;

  return (
    <div className="bg-gradient-to-b from-blue-200 to-blue-400 min-h-screen">
      <Header />
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <SensorCard
            sensorName="DISPOSITIVO 1"
            gasType="Monóxido de Carbono"
            gasLevel="Bajo"
            isActive={true}
          />
          <SensorCard
            sensorName="DISPOSITIVO 2"
            gasType="Monóxido de Carbono"
            gasLevel="No medido"
            isActive={false}
          />
        </div>

      <div className="flex justify-center mt-8">
          <button className="mx-4 p-2 bg-[#d2eaf1] rounded-lg hover:bg-[#b3d4d9] text-gray-800">
            Agregar Dispositivo
          </button>
          <button className="mx-4 p-2 bg-[#d2eaf1] rounded-lg hover:bg-[#b3d4d9] text-gray-800">
            Eliminar Dispositivo
          </button>
        </div> 
      </div>
    </div>
  );
}
