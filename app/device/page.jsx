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

  const initialValues = {
    name: "",
    area: "",
    deviceCode: "",
  };

  useEffect(() => {
    // Obtener usuario desde localStorage con la clave correcta
    const storedUser = localStorage.getItem("userApp");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserSession(user);
    } else {
      // Si no hay usuario, redirigir al login
      router.push("/login2");
    }
  }, [router]);

  const handleSubmit = async (values) => {
    if (!userSession) {
      setError("Usuario no autenticado.");
      return;
    }

    const newDevice = {
      idDevice: values.deviceCode, // Cambiado de deviceId a idDevice
      name: values.name,
      idArea: 1,
      areaDescription: values.area,
      idUser: userSession.id, // Cambiado de userId a idUser
      enabled: true
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

      // Primero verificamos si la respuesta es OK
      if (!response.ok) {
        // Si la respuesta no es OK, intentamos obtener el mensaje de error
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al registrar el dispositivo.");
        } catch (jsonError) {
          // Si no podemos parsear la respuesta como JSON, usamos el texto de la respuesta
          const errorText = await response.text();
          throw new Error(`Error al registrar el dispositivo: ${errorText}`);
        }
      }

      // Si la respuesta es OK, intentamos parsear la respuesta
      try {
        const data = await response.json();
        console.log("Dispositivo creado:", data);
      } catch (jsonError) {
        console.log("Respuesta exitosa pero no es JSON");
      }

      setSuccess(true);
      // Redirigir al dashboard después de un registro exitoso
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message);
      console.error("Error completo:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
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