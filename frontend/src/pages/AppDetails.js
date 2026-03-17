import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

import StarRating from "../components/StarRating";
import BackButton from "../components/BackButton";

export default function AppDetails() {

  const { id } = useParams();
  const { user } = useAuth();

  const [app, setApp] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editReview, setEditReview] = useState("");

  const loadApp = async () => {

    try {

      const appRes = await API.get(`/apps/${id}`);
      setApp(appRes.data);

      const reviewRes = await API.get(`/reviews/${id}`);
      setReviews(reviewRes.data);

    } catch (err) {
      console.error(err);
    }

  };

  useEffect(() => {
    loadApp();
  }, [id]);

  const installApp = async () => {

    if (!user) {
      alert("Please login first");
      return;
    }

    try {

      const res = await API.post(`/apps/${id}/download`);
      alert(res.data.message);
      loadApp();

    } catch (err) {
      alert("Install failed");
    }

  };

  const submitReview = async () => {

    if (!user) {
      alert("Login first");
      return;
    }

    if (!rating) {
      alert("Select rating");
      return;
    }

    try {

      await API.post(`/reviews/${id}`, {
        rating,
        comment: review
      });

      setRating(0);
      setReview("");
      loadApp();

    } catch (err) {
      alert("Review failed");
    }

  };

  const openEdit = (r) => {
    setEditingReviewId(r._id);
    setEditRating(r.rating);
    setEditReview(r.comment);
  };

  const saveEdit = async () => {

    try {

      await API.put(`/reviews/${editingReviewId}`, {
        rating: editRating,
        comment: editReview
      });

      setEditingReviewId(null);
      loadApp();

    } catch (err) {
      alert("Update failed");
    }

  };

  const deleteReview = async (reviewId) => {

    if (!window.confirm("Delete review?")) return;

    try {

      await API.delete(`/reviews/${reviewId}`);
      loadApp();

    } catch (err) {
      alert("Delete failed");
    }

  };

  if (!app) {
    return <h3 className="text-center mt-5">Loading...</h3>;
  }

  return (

    <div className="container mt-5">

      <BackButton />

      {/* APP HEADER */}

      <motion.div
        className="card-modern p-4 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >

        <div className="row align-items-center">

          {/* APP ICON */}

          <div className="col-md-2 text-center">

            <img
              src={app.image || "https://cdn-icons-png.flaticon.com/512/888/888879.png"}
              alt={app.name}
              className="app-detail-icon"
            />

          </div>

          {/* APP INFO */}

          <div className="col-md-10">

            <h2 className="fw-bold">{app.name}</h2>

            <p className="text-success fw-bold">
              {app.developer || "PlayStore"}
            </p>

            <div className="d-flex gap-5 mt-3">

              {/* ⭐ RATING SECTION */}

              <div>
                <StarRating rating={app.rating} />
                <small>
                  {app.rating?.toFixed(1) || 0} • {app.ratingCount || 0} Ratings
                </small>
              </div>

              {/* DOWNLOADS */}

              <div>
                <h6>{app.downloadCount}</h6>
                <small>Downloads</small>
              </div>

              {/* VERSION */}

              <div>
                <h6>{app.version}</h6>
                <small>Version</small>
              </div>

            </div>

            <button
              className="btn btn-success btn-modern mt-4"
              onClick={installApp}
            >
              <FaDownload /> Install
            </button>

          </div>

        </div>

      </motion.div>

      {/* DESCRIPTION */}

      <div className="card-modern p-4 mb-4">

        <h4>About this app</h4>
        <p>{app.description}</p>

      </div>

      {/* REVIEWS */}

      <h3 className="mb-3">Ratings & Reviews</h3>

      {reviews.length === 0 && <p>No reviews yet</p>}

      {reviews.map((r) => (

        <div key={r._id} className="card-modern p-3 mb-3">

          {editingReviewId === r._id ? (

            <>
              <StarRating rating={editRating} setRating={setEditRating} />

              <textarea
                className="form-control mt-2"
                value={editReview}
                onChange={(e) => setEditReview(e.target.value)}
              />

              <button
                className="btn btn-primary btn-sm mt-2 me-2"
                onClick={saveEdit}
              >
                Save
              </button>

              <button
                className="btn btn-secondary btn-sm mt-2"
                onClick={() => setEditingReviewId(null)}
              >
                Cancel
              </button>
            </>

          ) : (

            <div className="d-flex justify-content-between">

              <div>

                <h6>{r.userId?.name || "User"}</h6>

                <StarRating rating={r.rating} />

                <p>{r.comment}</p>

              </div>

              {user && r.userId && r.userId._id === user.id && (

                <div>

                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => openEdit(r)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteReview(r._id)}
                  >
                    Delete
                  </button>

                </div>

              )}

            </div>

          )}

        </div>

      ))}

      {/* ADD REVIEW */}

      <div className="card-modern p-4 mt-4">

        <h4>Add Review</h4>

        <StarRating rating={rating} setRating={setRating} />

        <textarea
          className="form-control mt-2"
          placeholder="Write your review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <button
          className="btn btn-success mt-3"
          onClick={submitReview}
        >
          Submit Review
        </button>

      </div>

    </div>

  );

}