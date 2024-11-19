"use client";
import { usePathname, useSearchParams } from "next/navigation";
import moment from "moment";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PuffLoader } from "react-spinners";
import Header from "../components/Header";
import Modal from "../components/Modal";
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(zoomPlugin);

import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Chart as ChartJS,
} from "chart.js";

// Registrar componentes
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function HistoricoSensor() {
  const searchParams = useSearchParams();
  const deviceId = searchParams.get("deviceId"); // Obtén el deviceId desde la URL

  const [chartData, setChartData] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null); // Estado para nombres dinámicos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [alarmas, setAlarmas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener nombres dinámicos del dispositivo y área
  useEffect(() => {
    if (!deviceId) return;

    const fetchDeviceInfo = async () => {
      try {
        const [deviceResponse, areasResponse] = await Promise.all([
          fetch("http://detectgas.brazilsouth.cloudapp.azure.com:3001/devices"),
          fetch("http://detectgas.brazilsouth.cloudapp.azure.com:3001/areas"),
        ]);

        const devices = await deviceResponse.json();
        const areas = await areasResponse.json();

        // Encontrar dispositivo y área correspondiente
        const device = devices.find((d) => d.deviceId === parseInt(deviceId));
        const area = areas.find((a) => a.id === device?.idArea);

        setDeviceInfo({
          name: device?.name || `Dispositivo ${deviceId}`,
          areaDescription: area?.description || "Área desconocida",
        });
      } catch (error) {
        console.error("Error al obtener nombres dinámicos:", error);
        setDeviceInfo({
          name: `Dispositivo ${deviceId}`,
          areaDescription: "Área desconocida",
        });
      }
    };

    fetchDeviceInfo();
  }, [deviceId]);

  useEffect(() => {
    if (!deviceId) return;
  
    let prevData = null; // Estado local para rastrear datos previos
    const fetchRealData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://detectgas.brazilsouth.cloudapp.azure.com:3001/measures");
        const data = await response.json();
  
        const filteredData = data.filter((item) => {
          const itemDate = moment(item.createdAt);
          return item.deviceId === parseInt(deviceId) && itemDate.isBetween(startDate, endDate, "day", "[]");
        });
  
        if (
          JSON.stringify(filteredData) !== JSON.stringify(prevData) // Comparar con datos previos
        ) {
          prevData = filteredData; // Actualizamos solo si los datos son diferentes
  
          if (filteredData.length > 0) {
            const labels = filteredData.map((item) =>
              moment(item.createdAt).format("DD/MM/YYYY HH:mm")
            );
            const measurements = filteredData.map((item) =>
              parseFloat(item.measurement)
            );
  
            setChartData({
              labels,
              datasets: [
                {
                  label: "Nivel de gas",
                  data: measurements,
                  borderColor: "rgba(75, 192, 192, 1)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  fill: true,
                  pointBorderColor: "rgba(255, 99, 132, 1)",
                  pointBackgroundColor: "rgba(255, 99, 132, 0.2)",
                  pointRadius: 5,
                },
              ],
            });
  
            const alarmasFiltradas = filteredData
              .filter((item) => item.measurement > 200)
              .map((item, index) => ({
                id: index + 1,
                fecha: moment(item.createdAt).format("YYYY-MM-DD"),
                hora: moment(item.createdAt).format("HH:mm"),
                nivelGas: item.measurement,
              }));
  
            setAlarmas(alarmasFiltradas);
          } else {
            setChartData(null);
            setAlarmas([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRealData();
  
    // Intervalo de 10 segundos
    const intervalId = setInterval(fetchRealData, 20000);
  
    return () => clearInterval(intervalId);
  }, [deviceId, startDate, endDate]);
  

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gradient-to-b from-[#61AFB6] to-[#3862A4] min-h-screen">
      <Header />
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold">{deviceInfo?.name || `Dispositivo ${deviceId}`}</h1>
          <button
            onClick={() => window.history.back()}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            ← Volver
          </button>
        </div>

        <p>Área: {deviceInfo?.areaDescription || "Cargando..."}</p>

        <div className="my-4 flex gap-4">
          <div>
            <label className="mr-2">Fecha de inicio:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="border border-gray-300 p-2 rounded-lg"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div>
            <label className="mr-2">Fecha de fin:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="border border-gray-300 p-2 rounded-lg"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>

        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70">
            <PuffLoader color="#36d7b7" size={60} />
          </div>
        ) : null}

        <div className="mt-6">
          {chartData ? (
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: `Historial de niveles de gas desde ${moment(
                      startDate
                    ).format("LL")} hasta ${moment(endDate).format("LL")}`,
                  },
                  zoom: {
                    pan: {
                      enabled: true,
                      mode: "x", // Permite desplazamiento solo en el eje x
                    },
                    zoom: {
                      wheel: {
                        enabled: true,
                      },
                      pinch: {
                        enabled: true,
                      },
                      mode: "x", // Permite hacer zoom solo en el eje x
                    },
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Fecha y hora",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Nivel de gas",
                    },
                    beginAtZero: true,
                  },
                },
              }}
            />
          ) : (
            <p>No hay datos para el rango de fechas seleccionado.</p>
          )}
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="flex items-center">
            <span className="mr-2">
              <img
                src="/alerta.png"
                alt="Alerta"
                className="w-7 h-7 mb-1"
              />
            </span>
            {alarmas.length > 0 ? (
              <p>Última alarma activada a las {alarmas[alarmas.length - 1]?.hora}</p>
            ) : (
              <p>No se activaron alarmas en este rango de fechas.</p>
            )}
          </div>
          <button
            onClick={openModal}
            className="p-2 bg-[#00AD86] hover:bg-[#259C75] text-white rounded-lg"
          >
            Histórico de alarmas
          </button>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div>
            <h2 className="text-2xl font-bold mb-4">📅 Alarmas</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {alarmas.length > 0 ? (
                alarmas.map((alarma) => (
                  <div
                    key={alarma.id}
                    className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md"
                  >
                    <span className="font-semibold">{alarma.id}</span>
                    <span>{moment(alarma.fecha).format("LL")}</span>
                    <span>Hora: {alarma.hora}</span>
                    <span>
                      Nivel de gas: <b>{alarma.nivelGas}</b>
                    </span>
                  </div>
                ))
              ) : (
                <p>No hay alarmas para el rango de fechas seleccionado.</p>
              )}
            </div>

            <button
              onClick={closeModal}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Volver atrás
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
