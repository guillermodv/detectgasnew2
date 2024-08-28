import Header from "../components/Header";
import SensorCard from "../components/SensorCard";

export default function Home() {
  return (
    <div>
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
            sensorName="SENSOR CABINA"
            gasType="Gases Tóxicos"
            gasLevel="Alto"
            isActive={false}
          />
        </div>

        <div className="flex justify-center mt-8">
          <button className="mx-4 p-2 bg-gray-200 rounded-lg">
            Agregar Dispositivo
          </button>
          <button className="mx-4 p-2 bg-gray-200 rounded-lg">
            Eliminar Dispositivo
          </button>
        </div>
      </div>
    </div>
  );
}
