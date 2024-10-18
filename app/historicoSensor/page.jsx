"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Header from "../components/Header";
import Modal from "../components/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

export default function HistoricoSensor() {
  // Estado para almacenar los datos del gráfico
  const [chartData, setChartData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla el modal
  const [startDate, setStartDate] = useState(new Date()); // Fecha de inicio
  const [endDate, setEndDate] = useState(new Date()); // Fecha de fin
  const [alarmas, setAlarmas] = useState([]);

  // Fetch para obtener los datos del backend y formatearlos para el gráfico
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const response = await fetch("http://detectgas.brazilsouth.cloudapp.azure.com:3001/cores");
        const data = await response.json();

        // Filtrar los datos por el rango de fechas seleccionado
        const filteredData = data.filter((item) => {
          const itemDate = moment(item.createdAt);
          return itemDate.isBetween(startDate, endDate, "day", "[]"); // Incluye las fechas de inicio y fin
        });

        if (filteredData.length > 0) {
          // Crear etiquetas de tiempo y valores de medición
          const labels = filteredData.map((item) => moment(item.createdAt).format("DD/MM/YYYY HH:mm"));
          const measurements = filteredData.map((item) => parseFloat(item.measurement));

          // Configurar los datos del gráfico
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
        } else {
          setChartData(null);
        }

        // Simula la carga de alarmas (puedes ajustar esta parte con datos reales de alarmas)
        const alarmasSimuladas = [
          { id: 1, fecha: "2024-10-16", hora: "23:35", nivelGas: 310, tipoGas: "CO" },
          { id: 2, fecha: "2024-10-18", hora: "02:26", nivelGas: 30, tipoGas: "CO" },
        ];

        // Filtrar las alarmas entre el rango de fechas seleccionado
        const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
        const formattedEndDate = moment(endDate).format("YYYY-MM-DD");
        setAlarmas(
          alarmasSimuladas.filter((a) =>
            moment(a.fecha).isBetween(formattedStartDate, formattedEndDate, "day", "[]")
          )
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRealData();
  }, [startDate, endDate]);

  // Función para manejar la apertura del modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold">Dispositivo 1</h1>
          <button onClick={() => window.history.back()} className="p-2 bg-gray-200 rounded-lg">
            ← Volver
          </button>
        </div>

        <p>Tipo de gas: Monóxido de carbono</p>
        <p>Área: Fábrica 1</p>

        {/* Selector de rango de fechas */}
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

        <div className="mt-6">
          {/* Componente del gráfico */}
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
                    text: `Historial de niveles de gas desde ${moment(startDate).format("LL")} hasta ${moment(
                      endDate
                    ).format("LL")}`,
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
              <p>Alarma activada a las {alarmas[0].hora}</p> // Muestra la primera alarma dentro del rango
            ) : (
              <p>No se activaron alarmas en este rango de fechas.</p> // Si no hay alarmas, muestra este mensaje
            )}
          </div>
          <button onClick={openModal} className="p-2 bg-green-500 text-white rounded-lg">
            Histórico de alarmas
          </button>
        </div>

        {/* Modal para el historial de alarmas */}
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

            {/* Lista de alarmas filtradas */}
            <div className="space-y-4">
              {alarmas.length > 0 ? (
                alarmas.map((alarma) => (
                  <div
                    key={alarma.id}
                    className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md"
                  >
                    <span className="font-semibold">{alarma.id}</span>
                    <span>{moment(alarma.fecha).format("LL")}</span>
                    <span>Hora: {alarma.hora}</span>
                    <span>Nivel de gas: <b>{alarma.nivelGas}</b></span>
                    <span className="text-blue-500">{alarma.tipoGas}</span>
                  </div>
                ))
              ) : (
                <p>No hay alarmas para el rango de fechas seleccionado.</p>
              )}
            </div>

            <button onClick={closeModal} className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg">
              Volver atrás
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
