import { useNavigate } from "react-router-dom";
import { FaGamepad, FaHeart, FaShoppingBag, FaFilm, FaBook } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {

  const navigate = useNavigate();

  const categories = [

    { name: "Games", slug: "games", icon: <FaGamepad /> },
    { name: "Beauty", slug: "beauty", icon: <FaHeart /> },
    { name: "Education", slug: "education", icon: <FaBook /> },
    { name: "Shopping", slug: "shopping", icon: <FaShoppingBag /> },
    { name: "Entertainment", slug: "entertainment", icon: <FaFilm /> }

  ];

  return (

    <footer className="modern-footer">

      <div className="container">

        <div className="footer-top">

          <h4 className="footer-logo">
            PlayStore
          </h4>

          <p className="footer-desc">
            Discover and download the best apps for games, beauty, fashion and more.
          </p>

        </div>

        <div className="footer-categories">

          {categories.map((cat) => (

            <div
              key={cat.slug}
              className="footer-category"
              onClick={() => navigate(`/category/${cat.slug}`)}
            >

              <span className="footer-icon">
                {cat.icon}
              </span>

              {cat.name}

            </div>

          ))}

        </div>

        <hr />

        <div className="footer-bottom">

          © {new Date().getFullYear()} PlayStore — All rights reserved.

        </div>

      </div>

    </footer>

  );

}