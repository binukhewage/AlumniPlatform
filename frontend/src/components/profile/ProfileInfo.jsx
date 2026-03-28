import { useEffect, useState } from "react";
import api from "../../api/axios";

const ProfileInfo = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    bio: "",
    linkedin_url: ""
  });
  const [image, setImage] = useState(null);

  const loadProfile = async () => {
    try {
      const res = await api.get("/profile");
      setProfile(res.data);
      setForm({
        full_name: res.data.full_name || "",
        bio: res.data.bio || "",
        linkedin_url: res.data.linkedin_url || ""
      });
    } catch (error) {
      if (error.response?.status === 404) {
        setProfile(null);
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const createProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("full_name", form.full_name);
      formData.append("bio", form.bio);
      formData.append("linkedin_url", form.linkedin_url);
      if (image) formData.append("profile_image", image);

      await api.post("/profile", formData);
      setImage(null);
      loadProfile();
    } catch (err) {
      alert(err.response?.data?.error || "Profile creation failed");
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("full_name", form.full_name);
      formData.append("bio", form.bio);
      formData.append("linkedin_url", form.linkedin_url);
      if (image) formData.append("profile_image", image);

      await api.put("/profile", formData);
      setEditing(false);
      setImage(null);
      loadProfile();
    } catch (err) {
      alert(err.response?.data?.error || "Profile update failed");
    }
  };

  const deleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    try {
      await api.delete("/profile");
      setProfile(null);
    } catch (err) {
      alert(err.response?.data?.error || "Profile deletion failed");
    }
  };

  return (
    <div className="bg-white rounded-xl">
      {/* 1. CREATE PROFILE FORM */}
      {!profile && (
        <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Complete Your Profile</h2>
          <form onSubmit={createProfile} className="space-y-4">
            <input
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
            />
            <textarea
              placeholder="Tell us about your professional journey..."
              className="w-full p-3 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
            <input
              placeholder="LinkedIn URL (https://...)"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.linkedin_url}
              onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
            />
            <div className="bg-white p-3 border rounded-lg">
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Profile Picture</label>
              <input type="file" onChange={(e) => setImage(e.target.files[0])} className="text-sm text-slate-500" />
            </div>
            <button className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition shadow-md">
              Publish Profile
            </button>
          </form>
        </div>
      )}

      {/* 2. VIEW PROFILE MODE */}
      {profile && !editing && (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative">
            {profile.profile_image ? (
              <img
                src={`http://localhost:8080/uploads/${profile.profile_image}`}
                alt="profile"
                className="w-32 h-32 rounded-2xl object-cover ring-4 ring-white shadow-lg border border-slate-100"
              />
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 shadow-inner">
                No Image
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">{profile.full_name}</h2>
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 text-sm font-medium hover:underline flex items-center justify-center md:justify-start mt-1 gap-1"
                >
                   LinkedIn →
                </a>
              )}
            </div>
            
            <p className="text-slate-600 leading-relaxed max-w-2xl">
              {profile.bio || "No bio provided yet."}
            </p>

            <div className="flex justify-center md:justify-start gap-3 pt-4">
              <button
                onClick={() => setEditing(true)}
                className="bg-slate-800 text-white text-sm px-5 py-2 rounded-lg font-medium hover:bg-slate-700 transition"
              >
                Edit Details
              </button>
              <button
                onClick={deleteProfile}
                className="text-red-500 text-sm px-5 py-2 rounded-lg font-medium hover:bg-red-50 transition border border-transparent hover:border-red-100"
              >
                Remove Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. EDIT PROFILE MODE */}
      {profile && editing && (
        <form onSubmit={updateProfile} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
              <input
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">LinkedIn URL</label>
              <input
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.linkedin_url}
                onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Bio</label>
            <textarea
              className="w-full p-2.5 border rounded-lg h-28 focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-4 bg-white p-3 border rounded-lg">
             <input type="file" onChange={(e) => setImage(e.target.files[0])} className="text-sm" />
          </div>
          <div className="flex gap-3 pt-2">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition shadow-sm">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-white text-slate-600 border border-slate-300 px-6 py-2 rounded-lg font-bold hover:bg-slate-50 transition"
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