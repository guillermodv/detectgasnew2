"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Header from "../components/Header"; // Importar el header

const validationSchema = Yup.object({
  name: Yup.string().required("El nombre del dispositivo es obligatorio"),
  area: Yup.string().required("El área es obligatoria"),
  deviceCode: Yup.string().required("El código del equipo es obligatorio"),
});

function NewDevicePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState(null);

  const initialValues = {
    name: "",
    area: "",
    deviceCode: "", // Código ingresado por el usuario
  };

  useEffect(() => {
    // Obtener usuario desde localStorage
    const userSession = localStorage.getItem("userWordle");
    if (userSession) {
      const user = JSON.parse(userSession);
      setUserId(user.id);
    }
  }, []);

  const handleSubmit = async (values) => {
    if (!userId) {
      setError("Usuario no autenticado.");
      return;
    }

    const newDevice = {
      deviceId: values.deviceCode, // Usamos el deviceCode como el deviceId
      name: values.name,
      areaDescription: values.area, // Agregar el área ingresada
      userId: userId, // Asociar el dispositivo con el usuario autenticado
    };

    setLoading(true);
    setError(null);
    setSuccess(false);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://detectgas.brazilsouth.cloudapp.azure.com:3001";

    try {
      const response = await fetch(`${apiUrl}/device`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDevice),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Error al registrar el dispositivo.";
        throw new Error(errorMessage);
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header con fondo blanco y su propio estilo */}
      <Header />

      {/* Contenedor principal del formulario */}
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-blue-300">
        <div className="w-full max-w-lg">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-bold mb-8">Nuevo Dispositivo</h1>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="bg-blue-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <label
                    className="block text-blue-800 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    Nombre del dispositivo
                  </label>
                  <Field
                    name="name"
                    type="text"
                    placeholder="Nombre del dispositivo"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-blue-800 leading-tight focus:outline-none focus:shadow-outline ${
                      errors.name && touched.name ? "border-red-500" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="text-red-500 text-xs italic"
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-blue-800 text-sm font-bold mb-2"
                    htmlFor="area"
                  >
                    Área
                  </label>
                  <Field
                    name="area"
                    type="text"
                    placeholder="Área"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-blue-800 leading-tight focus:outline-none focus:shadow-outline ${
                      errors.area && touched.area ? "border-red-500" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="area"
                    component="p"
                    className="text-red-500 text-xs italic"
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-blue-800 text-sm font-bold mb-2"
                    htmlFor="deviceCode"
                  >
                    Código de equipo
                  </label>
                  <Field
                    name="deviceCode"
                    type="text"
                    placeholder="Código de equipo"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-blue-800 leading-tight focus:outline-none focus:shadow-outline ${
                      errors.deviceCode && touched.deviceCode
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="deviceCode"
                    component="p"
                    className="text-red-500 text-xs italic"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-xs italic mt-2">{error}</p>
                )}
                {success && (
                  <p className="text-green-500 text-xs italic mt-2">
                    ¡Dispositivo registrado con éxito!
                  </p>
                )}

                <div className="mt-4">
                  <button
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    {loading ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default NewDevicePage;
