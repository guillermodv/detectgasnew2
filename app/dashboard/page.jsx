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
  const { userSession } = user;

  const [devices, setDevices] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [lastNotifiedMeasurement, setLastNotifiedMeasurement] = useState(null); // Estado para evitar notificaciones duplicadas

  // Referencia al elemento de audio
  const audioRef = useRef(null);

  useEffect(() => {
    async function fetchDevicesAndMeasurements() {
      try {
        // 1. Obtener los dispositivos del usuario logueado
        const devicesResponse = await fetch(`http://detectgas.brazilsouth.cloudapp.azure.com:3001/devices`);
        const devicesData = await devicesResponse.json();
        const userDevices = devicesData.filter(device => device.userId === userSession.id);
        setDevices(userDevices);

        // 2. Obtener las mediciones para esos dispositivos
        const measuresResponse = await fetch(`http://detectgas.brazilsouth.cloudapp.azure.com:3001/measures`);
        const measuresData = await measuresResponse.json();
        setMeasurements(measuresData);

      } catch (error) {
        console.error("Error fetching devices and measurements:", error);
      }
    }

    fetchDevicesAndMeasurements();
  }, [userSession]);

  const getDeviceLastMeasurement = (deviceId) => {
    // Encuentra la última medición para este dispositivo
    const deviceMeasurements = measurements.filter(measure => measure.deviceId === deviceId);
    return deviceMeasurements.length > 0 ? deviceMeasurements[deviceMeasurements.length - 1] : null;
  };

  const handleAlarmNotification = (measurement, createdAt) => {
    const currentTime = new Date();
    const measurementTime = new Date(createdAt);
    const timeDifference = (currentTime - measurementTime) / 1000; // Diferencia en segundos

    // Mostrar la notificación solo si la medición es reciente (menos de 20 segundos)
    if (measurement > 200 && timeDifference <= 20 && lastNotifiedMeasurement !== createdAt) {
      toast.error(
        `⚠️ Alarma de gas! Nivel: ${measurement}ppm`,
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

      if (audioRef.current) {
        audioRef.current.play();
      }

      setLastNotifiedMeasurement(createdAt);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#61AFB6] to-[#3862A4] min-h-screen">
      <Header />
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          {devices.map(device => {
            const lastMeasurementData = getDeviceLastMeasurement(device.deviceId);
            const lastMeasurement = lastMeasurementData ? lastMeasurementData.measurement : "Cargando...";
            const lastMeasurementTime = lastMeasurementData ? new Date(lastMeasurementData.createdAt) : null;

            // Notificar si es necesario
            if (lastMeasurementData && lastMeasurement > 200) {
              handleAlarmNotification(lastMeasurement, lastMeasurementData.createdAt);
            }

            return (
              <SensorCard
                key={device.deviceId}
                deviceId={device.deviceId} // Añadir deviceId aquí
                sensorName={device.name}
                message={`Área: ${device.areaDescription}`}
                gasLevel={
                  lastMeasurementData
                    ? `${lastMeasurement} ppm - ${getGasLevelText(lastMeasurement)}`
                    : "Cargando..."
                }
                isActive={lastMeasurementTime && isMeasurementRecent(lastMeasurementTime)}
              />
            );
          })}

          {/* Botones centrados */}
          <div className="flex justify-center space-x-4">
            <Link href="/device" passHref>
              <button className="bg-[#00D1B8] text-white px-4 py-2 rounded">
                Agregar Dispositivo
              </button>
            </Link>
            <button
              onClick={() => console.log("Eliminar dispositivo")}
              className="bg-[#FF0000] text-white px-4 py-2 rounded"
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

// Funciones auxiliares
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

const isMeasurementRecent = (measurementTime) => {
  const currentTime = new Date();
  const timeDifference = (currentTime - measurementTime) / 1000 / 60;
  return timeDifference <= 10;
};

