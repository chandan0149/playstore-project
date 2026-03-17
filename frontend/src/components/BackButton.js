import { useNavigate } from "react-router-dom";

export default function BackButton({ label = "Back", fallback = "/", force }) {

  const navigate = useNavigate();

  const handleBack = () => {

    if (force) {
      navigate(force);
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }

  };

  return (

    <button
      className="btn btn-outline-secondary mb-3"
      onClick={handleBack}
      style={{ borderRadius: "20px", fontSize: "0.9rem" }}
    >
      ← {label}
    </button>

  );

}