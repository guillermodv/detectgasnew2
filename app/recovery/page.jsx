"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("El formato del correo es inválido")
    .required("El correo electrónico es requerido"),
});

function RecoveryPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const initialValues = { email: "" };
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${apiUrl}/request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        const errorMessage = errorData.message || 'Error';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Correo enviado para recuperación:', data);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/fondo.jpg")' }}
    >
      {/* Aquí se mantiene solo un recuadro con los estilos del login */}
      <div className="w-full max-w-xs bg-white bg-opacity-80 p-6 rounded shadow-md">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl text-[#00368a] font-bold">Recuperar Contraseña</h1>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label
                  className="block text-blue-800 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="email"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-blue-600 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.email && touched.email ? "border-red-500" : ""
                  }`}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>

              <div className="mt-4">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  {loading ? 'Enviando...' : 'Recuperar Contraseña'}
                </button>
              </div>

              {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
              {success && <p className="text-green-500 text-xs italic mt-2">¡Correo enviado para recuperación!</p>}

              <div className="flex items-center justify-center mt-4 w-full">
                <a
                  className="inline-block align-baseline font-bold text-sm text-blue-400 hover:text-blue-700"
                  href="login2"
                >
                  Iniciar sesión
                </a>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default RecoveryPasswordPage;
