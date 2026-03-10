import { useEffect, useState } from "react";
import api from "../../api/axios";

const ProfileInfo = () => {

  const [profile,setProfile] = useState(null);

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
    }
    catch{
      setProfile(null);
    }

  };

  useEffect(()=>{
    loadProfile();
  },[]);

  const createProfile = async (e)=>{

    e.preventDefault();

    const formData = new FormData();

    formData.append("full_name",form.full_name);
    formData.append("bio",form.bio);
    formData.append("linkedin_url",form.linkedin_url);

    if(image){
      formData.append("profile_image",image);
    }

    await api.post("/profile",formData);

    loadProfile();

  };

  return (

    <div className="border p-6 rounded space-y-4">

      <h2 className="text-xl font-semibold">
        Profile Information
      </h2>

      {!profile && (

        <form onSubmit={createProfile} className="space-y-3">

          <input
          placeholder="Full Name"
          className="border p-2 w-full"
          onChange={(e)=>setForm({...form,full_name:e.target.value})}
          />

          <textarea
          placeholder="Bio"
          className="border p-2 w-full"
          onChange={(e)=>setForm({...form,bio:e.target.value})}
          />

          <input
          placeholder="LinkedIn URL"
          className="border p-2 w-full"
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

      {profile && (

        <div className="space-y-2">

          <p className="font-medium">
            {profile.full_name}
          </p>

          <p>
            {profile.bio}
          </p>

          {profile.linkedin_url && (
            <a
            href={profile.linkedin_url}
            target="_blank"
            className="text-blue-600"
            >
              LinkedIn
            </a>
          )}

        </div>

      )}

    </div>

  );

};

export default ProfileInfo;