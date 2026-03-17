import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CategoryApps from "./pages/CategoryApps";
import AppDetails from "./pages/AppDetails";
import Search from "./pages/Search";
import Filter from "./pages/Filter";
import AddApps from "./pages/AddApps";
import OwnerDashboard from "./pages/OwnerDashboard";
import UserDashboard from "./pages/UserDashboard";

import { useAuth } from "./context/AuthContext";

import "./App.css";


// Protect Owner Routes
function OwnerRoute({ children }) {

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "owner") {
    return <Navigate to="/" />;
  }

  return children;
}


// Protect User Routes
function UserRoute({ children }) {

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "user") {
    return <Navigate to="/" />;
  }

  return children;
}


function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/category/:name" element={<CategoryApps />} />
        <Route path="/app/:id" element={<AppDetails />} />
        <Route path="/search/:keyword" element={<Search />} />

        <Route path="/filter/rating/:rating" element={<Filter />} />
        <Route path="/filter/sort/:sort" element={<Filter />} />


        {/* Owner Routes */}
        <Route
          path="/owner"
          element={
            <OwnerRoute>
              <OwnerDashboard />
            </OwnerRoute>
          }
        />

        <Route
          path="/add-app"
          element={
            <OwnerRoute>
              <AddApps />
            </OwnerRoute>
          }
        />


        {/* User Route */}
        <Route
          path="/dashboard"
          element={
            <UserRoute>
              <UserDashboard />
            </UserRoute>
          }
        />

      </Routes>

      <Footer />

    </BrowserRouter>

  );
}

export default App;