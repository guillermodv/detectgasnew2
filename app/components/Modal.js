// components/Modal.js
export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Histórico de alarmas</h2>
            <button onClick={onClose} className="text-gray-500 text-xl">✕</button>
          </div>
          {children}
        </div>
      </div>
    );
  }
  