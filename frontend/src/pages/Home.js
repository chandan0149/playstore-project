import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";

import API from "../services/api";
import CategorySection from "../components/CategorySection";
import StarRating from "../components/StarRating";

export default function Home() {

  const [apps, setApps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await API.get("/apps");
      setApps(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* Sort sections */

  const topRatedApps = [...apps]
    .sort((a,b)=>b.rating-a.rating)
    .slice(0,6);

  const mostDownloaded = [...apps]
    .sort((a,b)=>b.downloadCount-a.downloadCount)
    .slice(0,6);

  return (

    <div>

      {/* HERO */}

      <div className="hero-section">

        <motion.div
          initial={{opacity:0,y:40}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.6}}
          className="hero-content"
        >

          <h1 className="hero-title">
            Discover <span>Amazing Apps</span>
          </h1>

          <p className="hero-subtitle">
            Explore trending apps for games, beauty, fashion and more.
          </p>

          <div className="hero-buttons">

            <button
              className="explore-btn"
              onClick={()=>window.scrollTo({top:500,behavior:"smooth"})}
            >
              Explore Apps
            </button>

          </div>

        </motion.div>

      </div>


      <div className="container mt-5">

        {/* Categories */}

        <CategorySection />


        {/* TOP RATED APPS */}

        <h4 className="mt-5 mb-4 fw-bold">⭐ Top Rated Apps</h4>

        <div className="row">

          {topRatedApps.map(app => (

            <AppCard key={app._id} app={app} navigate={navigate}/>

          ))}

        </div>


        {/* MOST DOWNLOADED */}

        <h4 className="mt-5 mb-4 fw-bold">📈 Most Downloaded Apps</h4>

        <div className="row">

          {mostDownloaded.map(app => (

            <AppCard key={app._id} app={app} navigate={navigate}/>

          ))}

        </div>


        {/* ALL APPS */}

        <h4 className="mt-5 mb-4 fw-bold">📱 All Apps</h4>

        <div className="row">

          {apps.map(app => (

            <AppCard key={app._id} app={app} navigate={navigate}/>

          ))}

        </div>

      </div>

    </div>

  );

}


/* APP CARD COMPONENT */

function AppCard({app,navigate}){

  return(

    <div className="col-lg-2 col-md-3 col-6 mb-4">

      <motion.div
        whileHover={{y:-5}}
        transition={{duration:0.2}}
        className="app-card"
        onClick={()=>navigate(`/app/${app._id}`)}
      >

        <div className="text-center">

          <div className="app-icon mb-2">

            {app.image ? (

              <img
                src={app.image}
                alt={app.name}
                className="app-logo"
              />

            ) : (

              <div className="icon-placeholder">
                {app.name[0]}
              </div>

            )}

          </div>

          <h6 className="fw-bold app-name">
            {app.name}
          </h6>

          <p className="genre-text">
            {app.genre}
          </p>

          <StarRating rating={app.rating}/>

          <div className="download-text">
            <FaDownload/> {app.downloadCount}
          </div>

        </div>

      </motion.div>

    </div>

  )

}