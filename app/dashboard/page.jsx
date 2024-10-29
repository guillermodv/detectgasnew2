"use client";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Importa el CSS
import Header from "../components/Header";
import SensorCard from "../components/SensorCard";
import { UserContext } from "../context/userContext";

export default function Dashboard() {
  const user = useContext(UserContext);
  const { userSession } = user;
  const [showModal, setShowModal] = useState(false);

  const confirmDelete = (device) => {
    setDeviceToDelete(device); // Establecer el dispositivo que se desea eliminar
    setShowModal(true); // Mostrar el modal de confirmación
  };

  console.log("user Session--->", userSession);
  const [devices, setDevices] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [lastNotifiedMeasurement, setLastNotifiedMeasurement] = useState(null); // Estado para evitar notificaciones duplicadas
  const [deviceToDelete, setDeviceToDelete] = useState(null); // Estado para seleccionar el dispositivo a eliminar

  // Referencia al elemento de audio
  const audioRef = useRef(null);

  const fetchDevicesAndMeasurements = async () => {
    try {
      // 1. Obtener los dispositivos del usuario logueado
      const devicesResponse = await fetch(
        `http://detectgas.brazilsouth.cloudapp.azure.com:3001/devices`
      );
      const devicesData = await devicesResponse.json();
      const userDevices = devicesData.filter(
        (device) => device.userId === userSession.id
      );
      setDevices(userDevices);

      // 2. Obtener las mediciones para esos dispositivos
      const measuresResponse = await fetch(
        `http://detectgas.brazilsouth.cloudapp.azure.com:3001/measures`
      );
      const measuresData = await measuresResponse.json();
      setMeasurements(measuresData);
    } catch (error) {
      console.error("Error fetching devices and measurements:", error);
    }
  };

  useEffect(() => {
    // Cargar los datos inicialmente
    fetchDevicesAndMeasurements();

    // Establecer un intervalo para actualizar los datos cada 20 segundos
    const intervalId = setInterval(() => {
      fetchDevicesAndMeasurements();
    }, 20000); // 20 segundos

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [userSession]); // Puedes agregar dependencias adicionales si es necesario

  const getDeviceLastMeasurement = (deviceId) => {
    // Encuentra la última medición para este dispositivo
    const deviceMeasurements = measurements.filter(
      (measure) => measure.deviceId === deviceId
    );
    return deviceMeasurements.length > 0
      ? deviceMeasurements[deviceMeasurements.length - 1]
      : null;
  };

  const handleAlarmNotification = (measurement, createdAt) => {
    const currentTime = new Date();
    const measurementTime = new Date(createdAt);
    const timeDifference = (currentTime - measurementTime) / 1000; // Diferencia en segundos

    // Mostrar la notificación solo si la medición es reciente (menos de 20 segundos)
    if (
      measurement > 200 &&
      timeDifference <= 20 &&
      lastNotifiedMeasurement !== createdAt
    ) {
      toast.error(`⚠️ Alarma de gas! Nivel: ${measurement}ppm`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      if (audioRef.current) {
        audioRef.current.play();
      }

      setLastNotifiedMeasurement(createdAt);
    }
  };


  const handleDeleteDevice = async (deviceId) => {
    try {
      const response = await fetch(`http://detectgas.brazilsouth.cloudapp.azure.com:3001/device/${deviceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Eliminar el dispositivo del estado local
        setDevices((prevDevices) =>
          prevDevices.filter((device) => device.deviceId !== deviceId)
        );

        // Mostrar un mensaje de éxito
        toast.success("Dispositivo eliminado con éxito", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else {
        throw new Error("Error eliminando el dispositivo");
      }
    } catch (error) {
      console.error("Error eliminando el dispositivo:", error);
      toast.error("Hubo un problema al eliminar el dispositivo", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const isMeasurementRecent = (measurementTime) => {
    const currentTime = new Date();
    const timeDifference = (currentTime - measurementTime) / 1000 / 60;
    return timeDifference <= 10;
  };

  return (
    <div className="bg-gradient-to-b from-[#61AFB6] to-[#3862A4] min-h-screen">
      <Header />
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          {devices.map((device) => {
            const lastMeasurementData = getDeviceLastMeasurement(
              device.deviceId
            );
            const lastMeasurement = lastMeasurementData
              ? lastMeasurementData.measurement
              : "Cargando...";
            const lastMeasurementTime = lastMeasurementData
              ? new Date(lastMeasurementData.createdAt)
              : null;

            // Notificar si es necesario
            if (lastMeasurementData && lastMeasurement > 200) {
              handleAlarmNotification(
                lastMeasurement,
                lastMeasurementData.createdAt
              );
            }

            return (
              <div key={device.deviceId} className="relative">
                <SensorCard
                  deviceId={device.deviceId}
                  sensorName={device.name}
                  message={`Área: ${device.areaDescription}`}
                  gasLevel={
                    lastMeasurementData
                      ? `${lastMeasurement} ppm - ${getGasLevelText(lastMeasurement)}`
                      : "Cargando..."
                  }
                  isActive={
                    lastMeasurementTime && isMeasurementRecent(lastMeasurementTime)
                  }
                />
                {/* Botón de eliminación con icono de tacho de basura */}
                <button
                  onClick={() => confirmDelete(device)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
            );
          })}

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="mb-4">
                  ¿Está seguro que desea eliminar el dispositivo{" "}
                  {deviceToDelete?.name}?
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      handleDeleteDevice(deviceToDelete.deviceId);
                      setShowModal(false); // Cerrar el modal después de eliminar
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Sí, eliminar
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded ml-2"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}


          <div className="flex justify-center space-x-4 mt-6">
            <Link href="/device" passHref>
              <button className="bg-[#00AD86] hover:bg-[#259C75] text-white px-4 py-2 rounded">
                Agregar Dispositivo
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* Elemento de audio para la alarma */}
      <audio ref={audioRef} src="/notifAlarma.mp3" preload="auto" />
      <ToastContainer /> {/* Componente para mostrar las notificaciones */}
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
