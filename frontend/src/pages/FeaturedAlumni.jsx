import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const FeaturedAlumni = () => {

  const [alumni,setAlumni] = useState(null);
  const [loading,setLoading] = useState(true);

  const loadFeatured = async () => {

    try{

      const res = await api.get("/public/featured");

      if(res.data.message){
        setAlumni(null);
      }else{
        setAlumni(res.data);
      }

    }catch(error){

      console.log(error);

    }

    setLoading(false);

  };

  useEffect(()=>{
    loadFeatured();
  },[]);

  if(loading){
    return <p className="p-10">Loading...</p>;
  }

  return (

    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-4">

      <div className="bg-white shadow-xl rounded-xl p-8 w-96 text-center">

        <h1 className="text-2xl font-bold mb-4">
          ⭐ Alumni of the Day
        </h1>

        {!alumni && (
          <p>No featured alumnus today</p>
        )}

        {alumni && (

          <div className="space-y-3">

            <img
              src={alumni.profile_image}
              alt="profile"
              className="w-28 h-28 rounded-full mx-auto object-cover"
            />

            <h2 className="text-xl font-semibold">
              {alumni.full_name}
            </h2>

            <p className="text-gray-600">
              {alumni.bio}
            </p>

            <a
              href={alumni.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              View LinkedIn
            </a>

          </div>

        )}

      </div>

      {/* BACK BUTTON */}

      <Link
        to="/profile"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Back to Profile
      </Link>

    </div>

  );

};

export default FeaturedAlumni;