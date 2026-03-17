import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

export default function Login() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const formik = useFormik({

    initialValues: {
      email: "",
      password: ""
    },

    validationSchema: Yup.object({

      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),

      password: Yup.string()
        .min(4, "Password must be at least 4 characters")
        .required("Password is required")

    }),

    onSubmit: async (values, { setSubmitting }) => {

      const res = await login(values.email, values.password);

      setSubmitting(false);

      if (res.success) {

        const user = JSON.parse(localStorage.getItem("user"));

        if (user.role === "owner") {
          navigate("/owner");
        } else {
          navigate("/");
        }

      } else {
        alert(res.message);
      }

    }

  });

  return (

    <div className="login-page">

      <motion.div
        className="login-card"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >

        <h2 className="login-title">Welcome Back</h2>

        <form onSubmit={formik.handleSubmit}>

          <div className="input-group-modern">

            <FaEnvelope />

            <input
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

          </div>

          {formik.touched.email && formik.errors.email && (
            <div className="error-text">{formik.errors.email}</div>
          )}

          <div className="input-group-modern">

            <FaLock />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

          </div>

          {formik.touched.password && formik.errors.password && (
            <div className="error-text">{formik.errors.password}</div>
          )}

          <button
            className="login-btn"
            type="submit"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="register-link">
          No account?
          <span onClick={() => navigate("/register")}>
            Register
          </span>
        </p>

      </motion.div>

    </div>

  );

}