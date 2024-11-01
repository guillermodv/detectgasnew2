"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Header from "../components/Header";

const validationSchema = Yup.object({
  name: Yup.string().required("El nombre del dispositivo es obligatorio"),
  area: Yup.string().required("El área es obligatoria"),
  deviceCode: Yup.string().required("El código del equipo es obligatorio"),
});

function NewDevicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userSession, setUserSession] = useState(null);
  const [areas, setAreas] = useState([]); 
  const [showAddArea, setShowAddArea] = useState(false); 
  const [newAreaName, setNewAreaName] = useState(""); 

  const initialValues = {
    name: "",
    area: "",
    deviceCode: "",
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userApp");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserSession(user);
    } else {
      router.push("/login2");
    }

    fetch("http://detectgas.brazilsouth.cloudapp.azure.com:3001/areas")
      .then((response) => response.json())
      .then((data) => setAreas(data))
      .catch((error) => console.error("Error fetching areas:", error));
  }, [router]);

  const handleSubmit = async (values) => {
    if (!userSession) {
      setError("Usuario no autenticado.");
      return;
    }

    const newDevice = {
      idDevice: values.deviceCode,
      name: values.name,
      idArea: values.area,
      areaDescription: areas.find((area) => area.id === values.area)?.description || values.area,
      idUser: userSession.id,
      enabled: true,
    };

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://detectgas.brazilsouth.cloudapp.azure.com:3001/device", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDevice),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar el dispositivo.");
      }

      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      setError(err.message);
      console.error("Error completo:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewArea = async () => {
    if (!newAreaName) return;
    
    try {
      const response = await fetch("http://detectgas.brazilsouth.cloudapp.azure.com:3001/area", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: newAreaName }),
      });
      if (!response.ok) throw new Error("Error al crear el área");

      const areaData = await response.json();
      setAreas((prevAreas) => [...prevAreas, areaData]);
      setShowAddArea(false);
      setNewAreaName("");
    } catch (error) {
      console.error("Error al agregar nueva área:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#61AFB6] to-[#3862A4]">
        <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-10">
          <h1 className="text-2xl font-bold text-center text-[#00368a] mb-6">Nuevo Dispositivo</h1>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ errors, touched, values, setFieldValue }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-600" htmlFor="name">
                    Nombre del dispositivo
                  </label>
                  <Field
                    name="name"
                    type="text"
                    placeholder="Nombre del dispositivo"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <ErrorMessage name="name" component="p" className="text-red-500 text-xs italic" />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-600" htmlFor="area">
                    Área
                  </label>
                  <Field as="select" name="area" className="w-full p-2 border border-gray-300 rounded">
                    <option value="" label="Seleccione un área" />
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.description}
                      </option>
                    ))}
                  </Field>
                  <button
                    type="button"
                    onClick={() => setShowAddArea(!showAddArea)}
                    className="text-blue-500 text-xs mt-2 underline"
                  >
                    {showAddArea ? "Cancelar" : "Agregar nueva área"}
                  </button>
                  {showAddArea && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Nombre de nueva área"
                        value={newAreaName}
                        onChange={(e) => setNewAreaName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      <button
                        type="button"
                        onClick={handleAddNewArea}
                        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded"
                      >
                        Agregar Área
                      </button>
                    </div>
                  )}
                  <ErrorMessage name="area" component="p" className="text-red-500 text-xs italic" />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-600" htmlFor="deviceCode">
                    Código de equipo
                  </label>
                  <Field
                    name="deviceCode"
                    type="text"
                    placeholder="Código de equipo"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <ErrorMessage name="deviceCode" component="p" className="text-red-500 text-xs italic" />
                </div>

                {error && <p className="text-red-500 text-xs italic">{error}</p>}
                {success && <p className="text-green-500 text-xs italic">¡Dispositivo registrado con éxito!</p>}

                <button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default NewDevicePage;
