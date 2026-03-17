import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./CategorySection.css";

export default function CategorySection() {

  const navigate = useNavigate();

  const categories = [

    {
      name: "Games",
      slug: "games",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420"
    },

    {
      name: "Beauty",
      slug: "beauty",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
    },

    {
      name: "Fashion",
      slug: "fashion",
      image: "https://images.unsplash.com/photo-1521334884684-d80222895322"
    },

    {
      name: "Women",
      slug: "women",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
    },

    {
      name: "Health",
      slug: "health",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
    }

  ];

  return (

    <div className="container mt-5">

      <h4 className="mb-4 fw-bold">Categories</h4>

      {/* 5 Categories in One Row */}
      <div className="row row-cols-lg-5 row-cols-md-3 row-cols-2 g-4">

        {categories.map((cat) => (

          <div
            key={cat.slug}
            className="col"
            onClick={() => navigate(`/category/${cat.slug}`)}
            style={{ cursor: "pointer" }}
          >

            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="category-card"
            >

              <div className="category-image-wrapper">

                <img
                  src={cat.image}
                  alt={cat.name}
                  className="category-banner"
                />

              </div>

              <div className="category-title">
                {cat.name}
              </div>

            </motion.div>

          </div>

        ))}

      </div>

    </div>

  );

}