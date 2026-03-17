import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaDownload, FaStar } from "react-icons/fa";

import API from "../services/api";

import BackButton from "../components/BackButton";
import StarRating from "../components/StarRating";

export default function Filter() {

  const params = useParams();
  const navigate = useNavigate();

  const rating = params.rating;
  const sort = params.sort;

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApps();
  }, [rating, sort]);

  const fetchApps = async () => {

    try {

      let res;

      if (rating) {

        res = await API.get(`/apps/filter/rating?rating=${rating}`);

      } else if (sort) {

        res = await API.get(`/apps/filter/sort?sort=${sort}`);

      }

      if (res) {
        setApps(res.data);
      }

    } catch (err) {

      console.error("Filter error:", err);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (
      <div className="text-center mt-5">
        <h3>Loading apps...</h3>
      </div>
    );

  }

  return (

    <div className="container mt-4">

      <BackButton />

      <h2 className="mb-4">

        {rating
          ? <> <FaStar /> Apps rated {rating}⭐ & above </>
          : `Sorted ${sort === "asc" ? "A → Z" : "Z → A"}`}

      </h2>

      {apps.length === 0 && (
        <div className="text-center text-muted mt-5">
          <h5>No apps found</h5>
        </div>
      )}

      <div className="row">

        {apps.map((app) => (

          <div key={app._id} className="col-lg-3 col-md-4 col-6 mb-4">

            <motion.div
              className="category-card"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              onClick={() => navigate(`/app/${app._id}`)}
            >

              <div className="text-center">

                <img
                  src={app.image || "https://via.placeholder.com/80"}
                  alt={app.name}
                  className="category-app-icon"
                />

                <h6 className="fw-bold mt-2">
                  {app.name}
                </h6>

                <p className="category-genre">
                  {app.genre}
                </p>

                <StarRating rating={app.rating} />

                <div className="category-download">
                  <FaDownload /> {app.downloadCount}
                </div>

              </div>

            </motion.div>

          </div>

        ))}

      </div>

    </div>

  );

}