import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaEyeSlash,
  FaEye,
  FaDownload,
  FaPlus,
  FaUsers
} from "react-icons/fa";

import API from "../services/api";
import BackButton from "../components/BackButton";
import { useAuth } from "../context/AuthContext";

export default function OwnerDashboard() {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [apps,setApps] = useState([]);
  const [users,setUsers] = useState([]);
  const [activeTab,setActiveTab] = useState("apps");

  const [editingApp,setEditingApp] = useState(null);
  const [form,setForm] = useState({});

  useEffect(()=>{
    loadApps();
    loadUsers();
  },[]);

  /* LOAD APPS */

  const loadApps = async ()=>{

    try{
      const res = await API.get("/apps/owner/apps");
      setApps(res.data);
    }catch(err){
      console.log(err);
    }

  };

  /* LOAD USERS */

  const loadUsers = async ()=>{

    try{
      const res = await API.get("/owner/users");
      setUsers(res.data);
    }catch(err){
      console.log(err);
    }

  };

  /* TOGGLE ROLE */

  const toggleRole = async(u)=>{

    try{

      if(u.role === "owner"){
        await API.put("/owner/make-user/"+u._id);
      }else{
        await API.put("/owner/make-owner/"+u._id);
      }

      loadUsers();

    }catch(err){
      console.log(err);
    }

  };

  const deleteUser = async(id)=>{
    if(!window.confirm("Delete this user?")) return;
    await API.delete("/owner/delete-user/"+id);
    loadUsers();
  };

  /* APP MANAGEMENT */

  const deleteApp = async(id)=>{
    if(!window.confirm("Delete this app?")) return;
    await API.delete("/apps/"+id);
    loadApps();
  };

  const toggleVisibility = async(id)=>{
    await API.put("/apps/"+id+"/visibility");
    loadApps();
  };

  const openEdit = (app)=>{

    setEditingApp(app._id);

    setForm({
      name:app.name || "",
      genre:app.genre || "",
      version:app.version || "",
      developer:app.developer || "",
      description:app.description || "",
      image:app.image || ""
    });

  };

  const saveEdit = async ()=>{
    await API.put("/apps/"+editingApp,form);
    setEditingApp(null);
    loadApps();
  };

  return(

    <div className="container mt-4">

      <BackButton/>

      <h2 className="fw-bold mb-4">Owner Dashboard</h2>

      {/* OWNER INFO */}

      <div className="card p-3 shadow-sm mb-4">

        <h5>Owner Info</h5>

        <div className="small">
          <div><b>Name:</b> {user?.name}</div>
          <div><b>Email:</b> {user?.email}</div>
          <div><b>Role:</b> {user?.role}</div>
        </div>

      </div>


      {/* STATS */}

      <div className="row mb-4">

        <div className="col-md-6 mb-2">

          <div className="card p-3 text-center shadow-sm">
            <div className="text-muted">Total Apps</div>
            <h3>{apps.length}</h3>
          </div>

        </div>

        <div className="col-md-6 mb-2">

          <div className="card p-3 text-center shadow-sm">
            <div className="text-muted">Total Users</div>
            <h3>{users.length}</h3>
          </div>

        </div>

      </div>


      {/* TAB BUTTONS */}

      <div className="mb-4">

        <button
        className={`btn me-2 ${activeTab==="apps"?"btn-primary":"btn-outline-primary"}`}
        onClick={()=>setActiveTab("apps")}
        >
          Manage Apps
        </button>

        <button
        className={`btn ${activeTab==="users"?"btn-primary":"btn-outline-primary"}`}
        onClick={()=>setActiveTab("users")}
        >
          <FaUsers className="me-1"/> Manage Users
        </button>

      </div>


      {/* APPS SECTION */}

      {activeTab==="apps" && (

        <div>

          <div className="d-flex justify-content-between mb-3">

            <h5>Apps</h5>

            <button
            className="btn btn-success btn-sm"
            onClick={()=>navigate("/add-app")}
            >
              <FaPlus/> Add App
            </button>

          </div>

          {apps.map(app=>(

            <motion.div
            key={app._id}
            className="card p-3 mb-2 shadow-sm"
            whileHover={{y:-3}}
            >

            {editingApp === app._id ? (

            <div>

              <input
              className="form-control mb-2"
              placeholder="Name"
              value={form.name}
              onChange={(e)=>setForm({...form,name:e.target.value})}
              />

              <input
              className="form-control mb-2"
              placeholder="Genre"
              value={form.genre}
              onChange={(e)=>setForm({...form,genre:e.target.value})}
              />

              <input
              className="form-control mb-2"
              placeholder="Version"
              value={form.version}
              onChange={(e)=>setForm({...form,version:e.target.value})}
              />

              <input
              className="form-control mb-2"
              placeholder="Developer"
              value={form.developer}
              onChange={(e)=>setForm({...form,developer:e.target.value})}
              />

              <textarea
              className="form-control mb-2"
              placeholder="Description"
              value={form.description}
              onChange={(e)=>setForm({...form,description:e.target.value})}
              />

              <input
              className="form-control mb-2"
              placeholder="Image URL"
              value={form.image}
              onChange={(e)=>setForm({...form,image:e.target.value})}
              />

              <button
              className="btn btn-primary btn-sm me-2"
              onClick={saveEdit}
              >
                Save
              </button>

              <button
              className="btn btn-secondary btn-sm"
              onClick={()=>setEditingApp(null)}
              >
                Cancel
              </button>

            </div>

            ) : (

            <div style={{
              display:"flex",
              justifyContent:"space-between",
              alignItems:"center"
            }}>

              <div style={{display:"flex",alignItems:"center",gap:"12px"}}>

                <img
                src={app.image || "https://via.placeholder.com/60"}
                alt={app.name}
                style={{width:50,height:50,borderRadius:10}}
                />

                <div>

                  <div style={{fontWeight:"600"}}>
                    {app.name}
                  </div>

                  <div style={{fontSize:"13px",color:"#777"}}>
                    {app.genre} • v{app.version}
                  </div>

                  <div style={{fontSize:"13px"}}>
                    <FaDownload/> {app.downloadCount}
                  </div>

                </div>

              </div>

              <div style={{display:"flex",gap:"6px"}}>

                <button
                className="btn btn-warning btn-sm"
                onClick={()=>openEdit(app)}
                >
                  <FaEdit/>
                </button>

                <button
                className="btn btn-secondary btn-sm"
                onClick={()=>toggleVisibility(app._id)}
                >
                  {app.visibility ? <FaEyeSlash/> : <FaEye/>}
                </button>

                <button
                className="btn btn-danger btn-sm"
                onClick={()=>deleteApp(app._id)}
                >
                  <FaTrash/>
                </button>

              </div>

            </div>

            )}

            </motion.div>

          ))}

        </div>

      )}


      {/* USERS SECTION */}

      {activeTab==="users" && (

        <div>

          <h5 className="mb-3">Manage Users</h5>

          {users.map(u=>(

            <motion.div
            key={u._id}
            className="card p-3 mb-2 shadow-sm"
            whileHover={{y:-2}}
            >

              <div style={{
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center"
              }}>

                <div style={{display:"flex",alignItems:"center",gap:"12px"}}>

                  <div style={{
                    width:"38px",
                    height:"38px",
                    borderRadius:"50%",
                    background:"#6366f1",
                    color:"white",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontWeight:"600"
                  }}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>

                  <div>

                    <div style={{fontWeight:"600"}}>
                      {u.name}
                    </div>

                    <div style={{fontSize:"13px",color:"#777"}}>
                      {u.email}
                    </div>

                    <div style={{fontSize:"12px",color:"#999"}}>
                      Role: {u.role}
                    </div>

                  </div>

                </div>

                {/* TOGGLE SWITCH */}

                
                {/* ROLE DROPDOWN */}

<div style={{display:"flex",alignItems:"center",gap:"10px"}}>

  <select
    className="form-select form-select-sm"
    style={{width:"120px"}}
    value={u.role}
    onChange={(e)=>{

      const role = e.target.value;

      if(role === "owner"){
        API.put("/owner/make-owner/"+u._id).then(loadUsers);
      }else{
        API.put("/owner/make-user/"+u._id).then(loadUsers);
      }

    }}
  >

    <option value="user">User</option>
    <option value="owner">Owner</option>

  </select>

  <button
  className="btn btn-danger btn-sm"
  onClick={()=>deleteUser(u._id)}
  >
    Delete
  </button>

</div>

              </div>

            </motion.div>

          ))}

        </div>

      )}

    </div>

  );

}