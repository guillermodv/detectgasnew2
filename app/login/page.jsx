"use client";
import {useContext} from 'react'
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
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
  const {setUserSession} = user;

  const initialValues = { username: "", password: "" };

  const onSubmit = (values) => {
    setUserSession(values);
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-teal-300 to-teal-500">
      <div className="w-full max-w-xs">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) => (
            <Form className="bg-teal-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label
                  className="block text-teal-800 text-sm font-bold mb-2"
                  htmlFor="username"
                >
                  Nombre de usuario
                </label>
                <Field
                  name="username"
                  type="text"
                  placeholder="Nombre de usuario"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-teal-800 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.username && touched.username ? "border-red-500" : ""
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
                  className="block text-teal-800 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="******************"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-teal-800 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.password && touched.password ? "border-red-500" : ""
                  }`}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-xs italic"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center">
                  <Field
                    type="checkbox"
                    name="rememberMe"
                    className="form-checkbox text-teal-600 h-4 w-4"
                  />
                  <span className="ml-2 text-teal-800 text-sm">Recordarme</span>
                </label>
              </div>

              <div className="mt-4">
                <button
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Iniciar sesión
                </button>
              </div>

              <div className="flex items-center justify-between mt-4">
                <a
                  className="inline-block align-baseline font-bold text-sm text-teal-600 hover:text-teal-800"
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
