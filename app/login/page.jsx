"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import * as Yup from "yup";
import { UserContext } from "../context/userContext";



const validationSchema = Yup.object({
  username: Yup.string().required("El nombre de usuario es obligatorio"),
  password: Yup.string()
    .required("La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

function LoginPage() {
  const router = useRouter();
  const user = useContext(UserContext);
  const { setUserSession } = user;

  const initialValues = { username: "", password: "" };

  const onSubmit = (values) => {
    setUserSession(values);
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 text-white font-bold">
      <div className="w-full max-w-md"> {/* Ajuste de ancho para hacerlo más grande */}
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/filee.png"
            alt="Detect Gas Logo"
            width={210}
            height={200}
          />
          <h1
            className={`text-4xl font-extrabold text-white tracking-wide`}
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
          >
            DETECT GAS
          </h1>
          <p className="text-lg font-bold mb-6 capitalize font-sans text-white">
            analizador de gases
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) => (
            <Form className="bg-blue-200 shadow-md rounded-lg px-12 pt-8 pb-10 mb-6">
              <div className="mb-6">
                <label
                  className="block text-white text-lg font-bold mb-2"
                  htmlFor="username"
                >
                  Nombre de usuario
                </label>
                <Field
                  name="username"
                  type="text"
                  placeholder="Ingresa tu nombre de usuario"
                  className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.username && touched.username
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <ErrorMessage
                  name="username"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-white text-lg font-bold mb-2"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="******************"
                  className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>

              <div className="flex items-center justify-between mb-6">
                <label className="inline-flex items-center text-white">
                  <Field
                    type="checkbox"
                    name="rememberMe"
                    className="form-checkbox text-teal-600 h-5 w-5"
                  />
                  <span className="ml-2 text-white text-lg">Recordarme</span>
                </label>
              </div>

              <div className="mt-4">
                <button
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                  type="submit"
                >
                  Iniciar sesión
                </button>
              </div>

              <div className="flex items-center justify-between mt-4">
                <a
                  className="inline-block align-baseline font-bold text-sm text-white hover:text-teal-100"
                  href="register"
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
