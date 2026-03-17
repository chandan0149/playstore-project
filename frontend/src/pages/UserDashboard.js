import { useState } from "react";
import BackButton from "../components/BackButton";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function UserDashboard() {

  const { user } = useAuth();

  const [editing,setEditing] = useState(false);
  const [name,setName] = useState(user?.name || "");
  const [email,setEmail] = useState(user?.email || "");


  const updateProfile = async () => {

    try{

      await API.put("/users/update/"+user._id,{
        name,
        email
      });

      alert("Profile updated");

      setEditing(false);

      window.location.reload();

    }catch(err){
      console.log(err);
    }

  };


  const deleteProfile = async () => {

    if(!window.confirm("Delete your account permanently?")) return;

    try{

      await API.delete("/users/delete/"+user._id);

      localStorage.removeItem("token");

      window.location.href="/";

    }catch(err){
      console.log(err);
    }

  };


  if(!user){
    return <div className="container mt-5">Please login first.</div>;
  }


  return(

    <div className="container mt-4">

      <BackButton/>

      <h2 className="fw-bold mb-4">User Dashboard</h2>


      <div className="card p-4 shadow-sm">

        <h5 className="mb-3">User Details</h5>

        {editing ? (

          <>
            <input
              className="form-control mb-2"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Name"
            />

            <input
              className="form-control mb-3"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Email"
            />

            <button
              className="btn btn-primary btn-sm me-2"
              onClick={updateProfile}
            >
              Save
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={()=>setEditing(false)}
            >
              Cancel
            </button>
          </>

        ) : (

          <>
            <div className="mb-2">
              <b>Name:</b> {user.name}
            </div>

            <div className="mb-2">
              <b>Email:</b> {user.email}
            </div>

            <div className="mb-3">
              <b>Role:</b> {user.role}
            </div>

            <button
              className="btn btn-warning btn-sm me-2"
              onClick={()=>setEditing(true)}
            >
              Edit Profile
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={deleteProfile}
            >
              Delete Account
            </button>
          </>

        )}

      </div>

    </div>

  );

}