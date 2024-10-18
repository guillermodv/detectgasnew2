"use client";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import SensorCard from "../components/SensorCard";
import { UserContext } from "../context/userContext";

export default function Home() {
  const user = useContext(UserContext);
  const { userSession, setUserSession } = user;

  // Estado para almacenar la última medición
  const [latestMeasurement, setLatestMeasurement] = useState(null);

  // Fetch para obtener la última medición del backend
  useEffect(() => {
    async function fetchLatestMeasurement() {
      try {
        const response = await fetch("http://detectgas.brazilsouth.cloudapp.azure.com:3001/cores");
        const data = await response.json();
        
        // Obtenemos la última medición
        const lastMeasurement = data[data.length - 1]; // La última medición es el último elemento del array
        setLatestMeasurement(lastMeasurement.measurement); // Guardamos la medición
      } catch (error) {
        console.error("Error fetching measurements:", error);
      }
    }

    fetchLatestMeasurement();
  }, []); // El array vacío asegura que solo se ejecute una vez cuando se monta el componente

  // Función para determinar el nivel de gas basado en la medición
  const getGasLevelText = (measurement) => {
    if (measurement < 50) {
      return "Nivel de Gas Bajo";
    } else if (measurement >= 50 && measurement < 200) {
      return "Nivel de Gas Medio";
    } else if (measurement >= 200 && measurement < 400) {
      return "Nivel de Gas Alto";
    } else {
      return "Nivel de Gas Muy Alto";
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-200 to-blue-400 min-h-screen">
      <Header />
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <SensorCard
            sensorName="DISPOSITIVO 1"
            gasType="Monóxido de Carbono"
            gasLevel={latestMeasurement ? `${latestMeasurement} ppm - ${getGasLevelText(latestMeasurement)}` : "Cargando..."} // Mostrar la última medición y el texto basado en el nivel de gas
            isActive={true}
          />
        </div>

      </div>
    </div>
  );
}
