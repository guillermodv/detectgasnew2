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
  const [areas, setAreas] = useState([]); // Lista de áreas obtenidas de la BD
  const [newAreaDescription, setNewAreaDescription] = useState(""); // Descripción de nueva área
  const [isAddingNewArea, setIsAddingNewArea] = useState(false); // Controla si estamos agregando una nueva área

  const initialValues = {
    name: "",
    area: "", // Selección de área o nueva área
    deviceCode: "",
    maxAlert: "",
  };

  useEffect(() => {
    // Obtener usuario desde localStorage
    const storedUser = localStorage.getItem("userApp");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserSession(user);
      // Obtener áreas de la BD
      fetchAreas(user.id);
    } else {
      router.push("/login2");
    }
  }, [router]);

  const fetchAreas = async (userId) => {
    try {
      const response = await fetch(
        `http://detectgas.brazilsouth.cloudapp.azure.com:3001/areas?userId=${userId}`
      );
      const data = await response.json();
      setAreas(data); // Guardar las áreas obtenidas
    } catch (error) {
      console.error("Error al obtener áreas:", error);
    }
  };

  const handleSubmit = async (values) => {
    if (!userSession) {
      setError("Usuario no autenticado.");
      return;
    }
  
    let selectedAreaId = values.area;
    if (isAddingNewArea) {
      try {
        const response = await fetch("http://detectgas.brazilsouth.cloudapp.azure.com:3001/area", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userSession.id,
            description: newAreaDescription,
            maxAlert: values.maxAlert, // Usamos directamente el valor de maxAlert ingresado en el formulario
          }),
        });
        const newArea = await response.json();
        selectedAreaId = newArea.id;
      } catch (err) {
        setError("Error al crear el área.");
        console.error("Error completo:", err);
        return;
      }
    }
  
    // Verificación adicional para asegurarnos de que el ID del área esté presente
    if (!selectedAreaId) {
      setError("Seleccione un área válida.");
      return;
    }
  
    const newDevice = {
      idDevice: values.deviceCode,
      name: values.name,
      idArea: selectedAreaId,
      areaDescription: isAddingNewArea
        ? newAreaDescription
        : areas.find((a) => a.id === Number(selectedAreaId)).description, // Convertir selectedAreaId a número si es string
      idUser: userSession.id,
      enabled: true,
      maxAlert: values.maxAlert,
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
      <div className="bg-gradient-to-b from-[#61AFB6] to-[#3862A4] min-h-screen pt-14">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-lg">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, values, setFieldValue }) => (
                  <Form className="bg-blue-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1 className="text-2xl text-[#00368a] text-center font-bold mb-8">Nuevo Dispositivo</h1>
                    <div className="mb-4">
                      <label className="block text-blue-800 text-sm font-bold mb-2" htmlFor="name">
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
                      <ErrorMessage name="name" component="p" className="text-red-500 text-xs italic" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-blue-800 text-sm font-bold mb-2" htmlFor="area">
                        Área
                      </label>
                      <Field
                        as="select"
                        name="area"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-blue-800 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={(e) => {
                          const value = e.target.value;
                          setIsAddingNewArea(value === "new");
                          setFieldValue("area", value);
                          console.log("Selected area ID:", value); // <-- Añadir para verificar valor seleccionado
                        }}
                      >
                        <option value="" className="hidden">Seleccione un área</option>
                        {areas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {area.description}
                          </option>
                        ))}
                        <option value="new" className="font-bold">Agregar nueva área</option>
                      </Field>

                      <ErrorMessage name="area" component="p" className="text-red-500 text-xs italic" />
                    </div>

                    {isAddingNewArea && (
                      <>
                        <div className="mb-4">
                          <label className="block text-blue-800 text-sm font-bold mb-2" htmlFor="newAreaDescription">
                            Nueva descripción del área
                          </label>
                          <input
                            type="text"
                            id="newAreaDescription"
                            placeholder="Descripción del área"
                            value={newAreaDescription}
                            onChange={(e) => setNewAreaDescription(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-blue-800 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-blue-800 text-sm font-bold mb-2" htmlFor="maxAlert">
                            Umbral de alerta (ppm)
                          </label>
                          <Field
                            name="maxAlert"
                            type="number"
                            placeholder="Umbral de alerta"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-blue-800 leading-tight focus:outline-none focus:shadow-outline"
                          />
                          <ErrorMessage name="maxAlert" component="p" className="text-red-500 text-xs italic" />
                        </div>
                      </>
                    )}

                    <div className="mb-4">
                      <label className="block text-blue-800 text-sm font-bold mb-2" htmlFor="deviceCode">
                        Código de equipo
                      </label>
                      <Field
                        name="deviceCode"
                        type="text"
                        placeholder="Código de equipo"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-blue-800 leading-tight focus:outline-none focus:shadow-outline ${
                          errors.deviceCode && touched.deviceCode ? "border-red-500" : ""
                        }`}
                      />
                      <ErrorMessage name="deviceCode" component="p" className="text-red-500 text-xs italic" />
                    </div>

                    {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
                    {success && <p className="text-green-500 text-xs italic mt-2">¡Dispositivo registrado con éxito!</p>}

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
        </div>
      </div>
    </>
  );
}

export default NewDevicePage;
