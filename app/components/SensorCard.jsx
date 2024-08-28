export default function SensorCard({
  sensorName,
  gasType,
  gasLevel,
  isActive,
}) {
  return (
    <div className="flex items-center p-4 border rounded-lg shadow-sm">
      <div className="ml-4 flex-1">
        <h3 className="text-xl font-semibold">{sensorName}</h3>
        <p>Tipo de gas: {gasType}</p>
        <p>Nivel de gas: {gasLevel}</p>
        <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Historico del sensor
        </button>
      </div>
      <div className="ml-4">
        {isActive ? (
          <div className="text-green-500">
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
          <div className="text-red-500">
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
