import { useEffect, useState } from "react";
import api from "../../api/axios";

const ProfileInfo = () => {

  const [profile,setProfile] = useState(null);
  const [editing,setEditing] = useState(false);

  const [form,setForm] = useState({
    full_name:"",
    bio:"",
    linkedin_url:""
  });

  const [image,setImage] = useState(null);

  const loadProfile = async () => {

    try{

      const res = await api.get("/profile");

      setProfile(res.data);

      setForm({
        full_name:res.data.full_name || "",
        bio:res.data.bio || "",
        linkedin_url:res.data.linkedin_url || ""
      });

    }catch(error){

      if(error.response?.status === 404){
        setProfile(null);
      }else{
        console.log(error);
      }

    }

  };

  useEffect(()=>{
    loadProfile();
  },[]);

  /* ---------------- CREATE PROFILE ---------------- */

  const createProfile = async (e) => {

    e.preventDefault();

    try{

      const formData = new FormData();

      formData.append("full_name",form.full_name);
      formData.append("bio",form.bio);
      formData.append("linkedin_url",form.linkedin_url);

      if(image){
        formData.append("profile_image",image);
      }

      await api.post("/profile",formData);

      setImage(null);
      loadProfile();

    }catch(err){

      alert(err.response?.data?.error || "Profile creation failed");

    }

  };

  /* ---------------- UPDATE PROFILE ---------------- */

  const updateProfile = async (e) => {

    e.preventDefault();

    try{

      const formData = new FormData();

      formData.append("full_name",form.full_name);
      formData.append("bio",form.bio);
      formData.append("linkedin_url",form.linkedin_url);

      if(image){
        formData.append("profile_image",image);
      }

      await api.put("/profile",formData);

      setEditing(false);
      setImage(null);

      loadProfile();

    }catch(err){

      alert(err.response?.data?.error || "Profile update failed");

    }

  };

  /* ---------------- DELETE PROFILE ---------------- */

  const deleteProfile = async () => {

    const confirm = window.confirm("Are you sure you want to delete your profile?");

    if(!confirm) return;

    try{

      await api.delete("/profile");

      setProfile(null);

    }catch(err){

      alert(err.response?.data?.error || "Profile deletion failed");

    }

  };

  return (

    <div className="border p-6 rounded space-y-4">

      <h2 className="text-xl font-semibold">
        Profile Information
      </h2>

      {/* CREATE PROFILE */}

      {!profile && (

        <form onSubmit={createProfile} className="space-y-3">

          <input
          placeholder="Full Name"
          className="border p-2 w-full"
          value={form.full_name}
          onChange={(e)=>setForm({...form,full_name:e.target.value})}
          />

          <textarea
          placeholder="Bio"
          className="border p-2 w-full"
          value={form.bio}
          onChange={(e)=>setForm({...form,bio:e.target.value})}
          />

          <input
          placeholder="LinkedIn URL"
          className="border p-2 w-full"
          value={form.linkedin_url}
          onChange={(e)=>setForm({...form,linkedin_url:e.target.value})}
          />

          <input
          type="file"
          onChange={(e)=>setImage(e.target.files[0])}
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Create Profile
          </button>

        </form>

      )}

      {/* VIEW PROFILE */}

      {profile && !editing && (

        <div className="space-y-3">

          {profile.profile_image && (
            <img
              src={`http://localhost:8080/uploads/${profile.profile_image}`}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border"
            />
          )}

          <p className="font-semibold text-lg">
            {profile.full_name}
          </p>

          <p>{profile.bio}</p>

          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              LinkedIn Profile
            </a>
          )}

          <div className="flex gap-3 pt-2">

            <button
            onClick={()=>setEditing(true)}
            className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Edit Profile
            </button>

            <button
            onClick={deleteProfile}
            className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete Profile
            </button>

          </div>

        </div>

      )}

      {/* EDIT PROFILE */}

      {profile && editing && (

        <form onSubmit={updateProfile} className="space-y-3">

          <input
          className="border p-2 w-full"
          value={form.full_name}
          onChange={(e)=>setForm({...form,full_name:e.target.value})}
          />

          <textarea
          className="border p-2 w-full"
          value={form.bio}
          onChange={(e)=>setForm({...form,bio:e.target.value})}
          />

          <input
          className="border p-2 w-full"
          value={form.linkedin_url}
          onChange={(e)=>setForm({...form,linkedin_url:e.target.value})}
          />

          <input
          type="file"
          onChange={(e)=>setImage(e.target.files[0])}
          />

          <div className="flex gap-3">

            <button className="bg-green-600 text-white px-4 py-1 rounded">
              Update
            </button>

            <button
            type="button"
            onClick={()=>setEditing(false)}
            className="bg-gray-500 text-white px-4 py-1 rounded"
            >
              Cancel
            </button>

          </div>

        </form>

      )}

    </div>

  );

};

export default ProfileInfo;