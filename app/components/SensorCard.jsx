import Link from "next/link";

export default function SensorCard({
  sensorName,
  message,
  gasLevel,
  isActive,
}) {
  return (
    <div className="bg-blue-200 rounded-lg shadow-md p-6 flex justify-between items-center">
      {/* Información del sensor */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700">{sensorName}</h2>
        <p className="text-gray-500">Detector de niveles peligrosos de contaminación gaseosa</p>  {/* Texto agregado */}
        <p className="text-gray-600">{message}</p>
        {isActive && <p className="text-gray-600">Nivel de gas: {gasLevel}</p>}

        {/* Link al historial del sensor */}
        <Link href="/historicoSensor" passHref>
          <button
            className={`mt-2 px-4 py-2 text-white rounded-lg ${
              isActive ? 'bg-[#00AD86] hover:bg-[#259C75]' : 'bg-[#CB213E] hover:bg-[#AF212D]'
            }`}
          >
            Histórico del sensor
          </button>
        </Link>
      </div>

      {/* Estado del sensor */}
      <div className="ml-4">
        {isActive ? (
          <div className="flex items-center text-green-500">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        ) : (
          <div className="flex items-center text-red-500">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
