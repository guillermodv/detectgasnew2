"use client";
import { useContext, useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import SensorCard from "../components/SensorCard";
import { UserContext } from "../context/userContext";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  // Importa el CSS

export default function Home() {
  const user = useContext(UserContext);
  const { userSession, setUserSession } = user;

  const [latestMeasurement, setLatestMeasurement] = useState(null);
  const [latestMeasurementTime, setLatestMeasurementTime] = useState(null);
  const [isAlarm, setIsAlarm] = useState(false);

  // Referencia al elemento de audio
  const audioRef = useRef(null);

  useEffect(() => {
    async function fetchLatestMeasurement() {
      try {
        const response = await fetch("http://detectgas.brazilsouth.cloudapp.azure.com:3001/cores");
        const data = await response.json();

        const lastMeasurement = data[data.length - 1];
        setLatestMeasurement(lastMeasurement.measurement);
        setLatestMeasurementTime(new Date(lastMeasurement.createdAt));

        // Verificar si la medición es mayor a 200 (nivel de alarma)
        if (lastMeasurement.measurement > 200) {
          setIsAlarm(true);
          
          // Mostrar notificación de alarma con el valor ppm
          toast.error(
            `⚠️ Alarma de gas! Nivel: ${lastMeasurement.measurement} ppm`,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
          
          // Reproducir sonido de alarma
          if (audioRef.current) {
            audioRef.current.play();  // Reproducir el sonido
          }

        } else {
          setIsAlarm(false);  // No hay alarma
        }

      } catch (error) {
        console.error("Error fetching measurements:", error);
      }
    }

    fetchLatestMeasurement();
  }, []);

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

  const isMeasurementRecent = () => {
    if (!latestMeasurementTime) return false;
    const currentTime = new Date();
    const timeDifference = (currentTime - latestMeasurementTime) / 1000 / 60;
    return timeDifference <= 10;
  };

  return (
    <div className="bg-gradient-to-b from-blue-200 to-blue-400 min-h-screen">
      <Header />
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <SensorCard
            sensorName="DISPOSITIVO 1"
            message="Detector de niveles peligrosos de contaminación gaseosa"
            gasLevel={
              latestMeasurement
                ? `${latestMeasurement} ppm - ${getGasLevelText(latestMeasurement)}`
                : "Cargando..."
            }
            isActive={isMeasurementRecent()}
          />

          {/* Botones centrados */}
          <div className="flex justify-center space-x-4">
            <Link href="/device" passHref>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Agregar Dispositivo
              </button>
            </Link>
            <button
              onClick={() => console.log("Eliminar dispositivo")}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Eliminar Dispositivo
            </button>
          </div>
        </div>
      </div>

      {/* Elemento de audio para la alarma */}
      <audio ref={audioRef} src="/notifAlarma.mp3" preload="auto" />

      <ToastContainer />  {/* Componente para mostrar las notificaciones */}
    </div>
  );
}
