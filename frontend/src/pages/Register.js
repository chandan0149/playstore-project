import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

export default function Register() {

  const navigate = useNavigate();
  const { register } = useAuth();

  const formik = useFormik({

    initialValues: {
      name: "",
      email: "",
      password: ""
    },

    validationSchema: Yup.object({

      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),

      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required")

    }),

    onSubmit: async (values, { setSubmitting }) => {

      const res = await register(values);

      setSubmitting(false);

      if (res.success) {

        alert("Registration successful. Please login.");
        navigate("/login");

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

        <h2 className="login-title">Create Account</h2>

        <form onSubmit={formik.handleSubmit}>

          <div className="input-group-modern">

            <FaUser />

            <input
              name="name"
              placeholder="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

          </div>

          {formik.touched.name && formik.errors.name && (
            <div className="error-text">{formik.errors.name}</div>
          )}

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
            {formik.isSubmitting ? "Creating account..." : "Register"}
          </button>

        </form>

        <p className="register-link">
          Already have an account?
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

      </motion.div>

    </div>

  );

}