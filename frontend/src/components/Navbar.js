import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [theme, setTheme] = useState("light");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // SEARCH SUGGESTIONS
  useEffect(() => {

    if (!search) {
      setSuggestions([]);
      return;
    }

    const fetchApps = async () => {

      try {
        const res = await API.get(`/apps/search/app?name=${search}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }

    };

    fetchApps();

  }, [search]);

  const handleEnter = (e) => {

    if (e.key === "Enter") {
      navigate("/search/" + search);
      setSuggestions([]);
    }

  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow sticky-top">

      {/* LOGO */}
      <span
        className="navbar-brand fw-bold text-warning"
        style={{ cursor: "pointer", fontSize: "22px" }}
        onClick={() => navigate("/")}
      >
        PlayStore
      </span>

      {/* MOBILE TOGGLE */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">

        {/* SEARCH BAR */}
        <div className="position-relative mx-auto w-50">

          <input
            className="form-control rounded-pill"
            placeholder="🔍 Search apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleEnter}
          />

          {suggestions.length > 0 && (

            <div
              style={{
                position: "absolute",
                background: "white",
                width: "100%",
                zIndex: 1000,
                borderRadius: "10px",
                marginTop: "6px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
            >

              {suggestions.map((app) => (

                <div
                  key={app._id}
                  style={{
                    padding: "10px",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    navigate("/app/" + app._id);
                    setSuggestions([]);
                  }}
                >

                  <div style={{ fontWeight: 600 }}>{app.name}</div>

                  <div style={{ fontSize: "0.8rem", color: "#666" }}>
                    {app.genre} • ⭐ {app.rating}
                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* RIGHT SIDE */}
        <div className="d-flex align-items-center gap-3">

          {/* FILTER */}
          <div className="position-relative">

            <button
              className="btn btn-outline-light btn-sm rounded-pill"
              onClick={() => setShowFilter(!showFilter)}
            >
              Filter
            </button>

            {showFilter && (

              <div
                style={{
                  position: "absolute",
                  background: "#222",
                  padding: "10px",
                  borderRadius: "10px",
                  marginTop: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                }}
              >

                <div
                  className="dropdown-item text-white"
                  onClick={() => navigate("/filter/rating/4")}
                >
                  4⭐ & above
                </div>

                <div
                  className="dropdown-item text-white"
                  onClick={() => navigate("/filter/rating/3")}
                >
                  3⭐ & above
                </div>

                <div
                  className="dropdown-item text-white"
                  onClick={() => navigate("/filter/rating/2")}
                >
                  2⭐ & above
                </div>

                <hr style={{ borderColor: "#555" }} />

                <div
                  className="dropdown-item text-white"
                  onClick={() => navigate("/filter/sort/asc")}
                >
                  A → Z
                </div>

                <div
                  className="dropdown-item text-white"
                  onClick={() => navigate("/filter/sort/desc")}
                >
                  Z → A
                </div>

              </div>

            )}

          </div>

          {/* THEME */}
          <button
            className="btn btn-outline-warning btn-sm rounded-circle"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <NotificationBell />

          {/* USER AREA */}
          {user ? (

            <>
              <span className="text-white small">
                👤 {user.name}
              </span>

              {/* USER DASHBOARD */}
              {user.role === "user" && (
                <button
                  className="btn btn-outline-light btn-sm rounded-pill"
                  onClick={() => navigate("/dashboard")}
                >
                  My Dashboard
                </button>
              )}

              {/* OWNER DASHBOARD */}
              {user.role === "owner" && (
                <button
                  className="btn btn-outline-light btn-sm rounded-pill"
                  onClick={() => navigate("/owner")}
                >
                  Dashboard
                </button>
              )}

              <button
                className="btn btn-outline-danger btn-sm rounded-pill"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>

          ) : (

            <>
              <button
                className="btn btn-outline-light btn-sm rounded-pill"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button
                className="btn btn-warning btn-sm rounded-pill"
                onClick={() => navigate("/register")}
              >
                Create Account
              </button>
            </>

          )}

        </div>

      </div>

    </nav>

  );

}