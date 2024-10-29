"use client";

import "chart.js/auto";
import moment from "moment";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PuffLoader } from "react-spinners";
import Header from "../components/Header";
import Modal from "../components/Modal";

export default function HistoricoSensor() {
  const [chartData, setChartData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [alarmas, setAlarmas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchRealData = async () => {
      try {
        const response = await fetch(
          "http://detectgas.brazilsouth.cloudapp.azure.com:3001/cores"
        );
        const data = await response.json();

        // Filtrar los datos por el rango de fechas seleccionado
        const filteredData = data.filter((item) => {
          const itemDate = moment(item.createdAt);
          return itemDate.isBetween(startDate, endDate, "day", "[]");
        });

        if (filteredData.length > 0) {
          const labels = filteredData.map((item) =>
            moment(item.createdAt).format("DD/MM/YYYY HH:mm")
          );
          const measurements = filteredData.map((item) =>
            parseFloat(item.measurement)
          );

          const chartData = {
            labels: labels,
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
          };

          setChartData(chartData);

          // Filtrar alarmas por nivel de gas mayor a 200 ppm
          const alarmasFiltradas = filteredData
            .filter((item) => item.measurement > 200) // Mediciones > 200 ppm
            .map((item, index) => ({
              id: index + 1,
              fecha: moment(item.createdAt).format("YYYY-MM-DD"),
              hora: moment(item.createdAt).format("HH:mm"),
              nivelGas: item.measurement,
              tipoGas: "CO", // Puedes ajustar según el tipo de gas
            }));

          setAlarmas(alarmasFiltradas); // Almacenar las alarmas filtradas
        } else {
          setChartData(null);
          setAlarmas([]); // No hay alarmas si no hay datos
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, [startDate, endDate]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gradient-to-b from-[#61AFB6] to-[#3862A4] min-h-screen">
      <Header />
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold">Dispositivo 1</h1>
          <button
            onClick={() => window.history.back()}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            ← Volver
          </button>
        </div>

        <p>Tipo de gas: Monóxido de carbono</p>
        <p>Área: Fábrica 1</p>

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
            <span className="mr-2">🔔</span>
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
            <div className="mb-4">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="border border-gray-300 p-2 rounded-lg"
                dateFormat="dd/MM/yyyy"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="border border-gray-300 p-2 rounded-lg"
                dateFormat="dd/MM/yyyy"
              />
            </div>

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
                    <span className="text-blue-500">{alarma.tipoGas}</span>
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
