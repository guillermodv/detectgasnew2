"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  username: Yup.string().required("El nombre de usuario es obligatorio"),
  email: Yup.string()
    .email("El correo electrónico no es válido")
    .required("El correo electrónico es obligatorio"),
  password: Yup.string()
    .required("La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
    .required("La confirmación de la contraseña es obligatoria"),
});

function RegisterPage() {
  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      <div className="w-full max-w-xs">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) => (
            <Form className="bg-blue-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
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

              <div className="mb-4">
                <label
                  className="block text-teal-800 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Correo electrónico
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="correo@example.com"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-teal-800 leading-tight focus:outline-none focus:shadow-outline ${
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

              <div className="mb-6">
                <label
                  className="block text-teal-800 text-sm font-bold mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirmar Contraseña
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="******************"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-teal-800 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
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

              <div className="mt-4">
                <button
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Registrarse
                </button>
              </div>

              <div className="flex items-center justify-between mt-4">
                <a
                  className="inline-block align-baseline font-bold text-sm text-teal-600 hover:text-teal-800"
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
