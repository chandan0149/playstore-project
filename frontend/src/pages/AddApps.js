import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { FaMobileAlt } from "react-icons/fa";

import API from "../services/api";
import BackButton from "../components/BackButton";

export default function AddApps() {

  const navigate = useNavigate();

  const formik = useFormik({

    initialValues: {
      name: "",
      genre: "",
      version: "",
      developer: "",
      description: "",
      image: ""
    },

    validationSchema: Yup.object({

      name: Yup.string().required("App name is required"),

      genre: Yup.string().required("Genre is required"),

      version: Yup.string().required("Version is required"),

      developer: Yup.string().required("Developer name is required"),

      description: Yup.string()
        .min(10, "Description should be at least 10 characters")
        .required("Description is required"),

      image: Yup.string()
        .url("Enter a valid image URL")
        .required("Image URL is required")

    }),

    onSubmit: async (values, { setSubmitting }) => {

      try {

        await API.post("/apps", values);

        alert("App added successfully");

        navigate("/owner");

      } catch (err) {

        alert("Failed to add app");

      }

      setSubmitting(false);

    }

  });

  return (

    <div className="addapp-page">

      <BackButton />

      <motion.div
        className="addapp-card"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >

        <h2 className="mb-4 text-center">
          <FaMobileAlt /> Publish New App
        </h2>

        {/* APP ICON PREVIEW */}

        {formik.values.image && (
          <div className="text-center mb-3">
            <img
              src={formik.values.image}
              alt="preview"
              className="app-preview"
            />
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>

          <input
            className="form-control mb-2"
            name="name"
            placeholder="App Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.name && formik.errors.name && (
            <div className="text-danger mb-2">{formik.errors.name}</div>
          )}

          {/* GENRE DROPDOWN */}

          <select
            className="form-control mb-2"
            name="genre"
            value={formik.values.genre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >

            <option value="">Select Genre</option>
            <option value="games">Games</option>
            <option value="beauty">Beauty</option>
            <option value="fashion">Fashion</option>
            <option value="women">Women</option>
            <option value="health">Health</option>

          </select>

          {formik.touched.genre && formik.errors.genre && (
            <div className="text-danger mb-2">{formik.errors.genre}</div>
          )}

          <input
            className="form-control mb-2"
            name="version"
            placeholder="Version (1.0.0)"
            value={formik.values.version}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.version && formik.errors.version && (
            <div className="text-danger mb-2">{formik.errors.version}</div>
          )}

          <input
            className="form-control mb-2"
            name="developer"
            placeholder="Developer Name"
            value={formik.values.developer}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.developer && formik.errors.developer && (
            <div className="text-danger mb-2">{formik.errors.developer}</div>
          )}

          <textarea
            className="form-control mb-2"
            name="description"
            placeholder="App Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.description && formik.errors.description && (
            <div className="text-danger mb-2">{formik.errors.description}</div>
          )}

          <input
            className="form-control mb-3"
            name="image"
            placeholder="Image URL"
            value={formik.values.image}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.image && formik.errors.image && (
            <div className="text-danger mb-2">{formik.errors.image}</div>
          )}

          <button
            className="btn btn-success w-100 btn-modern"
            type="submit"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Publishing..." : "Publish App"}
          </button>

        </form>

      </motion.div>

    </div>

  );

}