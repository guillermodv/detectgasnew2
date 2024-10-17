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
  const [selectedDate, setSelectedDate] = useState(new Date()); // Fecha seleccionada
  const [alarmas, setAlarmas] = useState([]);

  // Simula la carga de datos desde el dispositivo
  useEffect(() => {
    const fetchData = async () => {
      const dataFromDevice = {
        "2024-10-01": {
          labels: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
          datasets: [
            {
              label: "Nivel de gas",
              data: [300, 310, 320, 350, 390, 360, 340, 330, 320],
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
              pointBorderColor: "rgba(255, 99, 132, 1)",
              pointBackgroundColor: "rgba(255, 99, 132, 0.2)",
              pointRadius: 5,
            },
          ],
        },
        "2024-09-30": {
          labels: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
          datasets: [
            {
              label: "Nivel de gas",
              data: [320, 330, 380, 370, 400, 380, 360, 350, 340], // Cambiado para simular un pico
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
              pointBorderColor: "rgba(255, 99, 132, 1)",
              pointBackgroundColor: "rgba(255, 99, 132, 0.2)",
              pointRadius: 5,
            },
          ],
        },
      };

      // Simula la carga de alarmas
      const alarmasSimuladas = [
        { id: 1, fecha: "2024-10-01", hora: "12:00 PM", nivelGas: 380, tipoGas: "CO" },
        { id: 2, fecha: "2024-10-01", hora: "17:30 PM", nivelGas: 400, tipoGas: "CO" },
        { id: 3, fecha: "2024-09-30", hora: "10:00 AM", nivelGas: 450, tipoGas: "CO" },
      ];

      // Simula la carga del gráfico y las alarmas según la fecha seleccionada
      const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
      setAlarmas(alarmasSimuladas.filter((a) => a.fecha === formattedDate));

      // Verifica si hay una alarma para la fecha seleccionada
      if (formattedDate === "2024-09-30" && alarmasSimuladas.some(a => a.fecha === formattedDate)) {
        const alarm = alarmasSimuladas.find(a => a.fecha === formattedDate);
        
        // Modificar los datos para agregar un pico a las 10:00
        const updatedData = [...dataFromDevice[formattedDate].datasets[0].data];
        updatedData[2] = Math.max(...updatedData) + 50; // Agrega un pico de 50 unidades más
        dataFromDevice[formattedDate].datasets[0].data = updatedData;
      }

      setChartData(dataFromDevice[formattedDate] || null);
    };

    fetchData();
  }, [selectedDate]); // Refrescar cuando cambia la fecha seleccionada

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

        {/* Selector de fecha */}
        <div className="my-4">
          <label className="mr-2">Seleccionar fecha:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="border border-gray-300 p-2 rounded-lg"
            dateFormat="dd/MM/yyyy"
          />
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
                    text: `Historial de niveles de gas para ${moment(selectedDate).format("LL")}`,
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Hora",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Nivel de gas",
                    },
                    beginAtZero: true,
                    min: 300,
                    max: 450, // Aumenta el máximo para permitir el pico
                  },
                },
              }}
            />
          ) : (
            <p>No hay datos para la fecha seleccionada.</p>
          )}
        </div> 
        
        <div className="flex justify-between items-center mt-8">
          <div className="flex items-center">
            <span className="mr-2">🔔</span>
            {alarmas.length > 0 ? (
            <p>Alarma activada a las {alarmas[0].hora}</p> // Muestra la primera alarma del día
            ) : (
            <p>No se activaron alarmas en esta fecha.</p> // Si no hay alarmas, muestra este mensaje
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
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
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
                <p>No hay alarmas para la fecha seleccionada.</p>
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
