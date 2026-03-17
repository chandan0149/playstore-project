import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaTimes } from "react-icons/fa";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

import "./NotificationBell.css";

export default function NotificationBell() {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {

    if (!user) return;

    fetchNotifications();

  }, [user]);

  const fetchNotifications = async () => {

    try {

      const res = await API.get("/notifications");

      setNotifications(res.data);

    } catch (err) {

      console.error(err);

    }

  };

  const markAsRead = async (id) => {

    try {

      await API.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.filter((n) => n._id !== id)
      );

    } catch (err) {

      console.error(err);

    }

  };

  const handleClick = (notification) => {

    markAsRead(notification._id);

    setShowDropdown(false);

    if (notification.appId) {
      navigate(`/app/${notification.appId}`);
    }

  };

  const formatTime = (date) => {

    const diff = Math.floor((new Date() - new Date(date)) / 60000);

    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;

    const h = Math.floor(diff / 60);

    if (h < 24) return `${h}h ago`;

    return `${Math.floor(h / 24)}d ago`;

  };

  if (!user) return null;

  return (

    <div className="notification-wrapper">

      <button
        className="notification-btn"
        onClick={() => setShowDropdown(!showDropdown)}
      >

        <FaBell />

        {notifications.length > 0 && (

          <span className="notification-badge">
            {notifications.length > 99 ? "99+" : notifications.length}
          </span>

        )}

      </button>

      {showDropdown && (

        <div className="notification-dropdown">

          <div className="notification-header">
            Notifications
          </div>

          <div className="notification-list">

            {notifications.length === 0 ? (

              <div className="notification-empty">
                No notifications
              </div>

            ) : (

              notifications.map((n) => (

                <div
                  key={n._id}
                  className="notification-item"
                  onClick={() => handleClick(n)}
                >

                  <div className="notification-text">

                    {n.message.split("\n").map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}

                    <span className="notification-time">
                      {formatTime(n.createdAt)}
                    </span>

                  </div>

                  <button
                    className="notification-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(n._id);
                    }}
                  >

                    <FaTimes />

                  </button>

                </div>

              ))

            )}

          </div>

        </div>

      )}

    </div>

  );

}