"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("The username is required"),
  email: Yup.string()
    .email("The email is invalid")
    .required("The email is required"),
  password: Yup.string()
    .required("The password is required")
    .min(8, "The password must be at least 8 characters long"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
});

function RegisterPage() {
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

    try {
      const response = await fetch(`${apiUrl}/user`, {
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
      console.log('Authenticated:', data);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-blue-300">
      <div className="w-full max-w-xs">
      <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold mb-8">Vocab Lexic</h1>
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
                  Nombre de usuario
                </label>
                <Field
                  name="name"
                  type="text"
                  placeholder="Nombre de usuario"
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
                  htmlFor="email"
                >
                  Correo electrónico
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="correo@example.com"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-blue-800 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.email && touched.email ? "border-red-500" : ""
                  }`}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-blue-800 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="******************"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-blue-800 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.password && touched.password ? "border-red-500" : ""
                  }`}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-blue-800 text-sm font-bold mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirmar Contraseña
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="******************"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-blue-800 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.confirmPassword && touched.confirmPassword
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>
              {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
              {success && <p className="text-green-500 text-xs italic mt-2">User registered successfully!</p>}
              <div className="mt-4">
                <button
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  {loading ? 'Iniciando sesión...' : 'Registrarse'}
                </button>
              </div>

              <div className="flex items-center justify-between mt-4">
                <a
                  className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800"
                  href="login"
                >
                  ¿Ya tienes una cuenta? Inicia sesión
                </a>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default RegisterPage;