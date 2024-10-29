"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import Image from "next/image";

const saveDataToLocalstorage = (userSession) => {
  localStorage.setItem("userWordle", JSON.stringify(userSession));
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("The email format is invalid")
    .required("The email is required"),
  password: Yup.string()
    .required("The password is required")
    .min(8, "The password must be at least 8 characters long"),
});

function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const initialValues = { email: "", password: "" };
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Error";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Authenticated!:", data);
      setSuccess(true);
      saveDataToLocalstorage(data.user);
      router.push("/dashboard");
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
      <div className="w-full max-w-xs bg-white bg-opacity-80 p-6 rounded shadow-md">
        <div className="flex flex-col items-center gap-2">
          <Image src="/Logo_Completo.PNG" alt="Login Image" width={165} height={165} priority />
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
                  Correo electrónico
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
                <div className="flex items-center justify-between mt-4">
                  <a
                    className="mt-[-22px] inline-block align-baseline font-bold text-sm text-blue-400 hover:text-blue-700"
                    href="recovery"
                  >
                    ¿No recuerdas la contraseña?
                  </a>
                </div>
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="mt-[-12px] inline-flex items-center">
                  <Field
                    type="checkbox"
                    name="rememberMe"
                    className="form-checkbox text-blue-600 h-4 w-4"
                  />
                  <span className="ml-2 text-blue-800 text-sm">Recordarme</span>
                </label>
              </div>

              <div className="mt-4">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  {loading ? "Loading..." : "Log in"}
                </button>
              </div>

              {error && (
                <p className="text-red-500 text-xs italic mt-2">{error}</p>
              )}
              {success && (
                <p className="text-green-500 text-xs italic mt-2">
                  Login successful!
                </p>
              )}

              <div className="flex items-center justify-between mt-4">
                <a
                  className="inline-block align-baseline font-bold text-sm text-blue-400 hover:text-blue-700"
                  href="register2"
                >
                  ¿No tienes cuenta? Regístrate
                </a>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default LoginPage;
