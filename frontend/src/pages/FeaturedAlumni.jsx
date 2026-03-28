import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const FeaturedAlumni = () => {
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadFeatured = async () => {
    try {
      const res = await api.get("/public/featured");
      if (res.data.message) {
        setAlumni(null);
      } else {
        setAlumni(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatured();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-blue-800 font-bold tracking-widest uppercase italic">
          Fetching Spotlight...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-6">
      {/* Hall of Fame Card */}
      <div className="relative bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-md border border-amber-100">
        
        {/* Golden Header Accent */}
        <div className="h-32 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center relative">
           <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white text-[10px] font-black uppercase tracking-widest">
             Daily Spotlight
           </div>
           <span className="text-5xl opacity-80">👑</span>
        </div>

        <div className="p-10 pt-0 text-center">
          {/* Overlapping Profile Image */}
          <div className="-mt-16 mb-6 inline-block relative">
            {alumni?.profile_image ? (
              <img
                src={alumni.profile_image}
                alt="Featured Alumnus"
                className="w-32 h-32 rounded-2xl mx-auto object-cover border-4 border-white shadow-xl ring-1 ring-amber-200"
              />
            ) : (
              <div className="w-32 h-32 rounded-2xl mx-auto bg-slate-200 border-4 border-white shadow-xl flex items-center justify-center">
                 <span className="text-slate-400">No Image</span>
              </div>
            )}
          </div>

          {!alumni ? (
            <div className="py-8">
              <h1 className="text-2xl font-bold text-slate-800">Spotlight Vacant</h1>
              <p className="text-slate-500 mt-2">No bids have been placed for today's featured slot.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 leading-tight">
                  {alumni.full_name}
                </h1>
                <p className="text-amber-600 font-bold text-xs uppercase tracking-widest mt-1">
                  Alumni of the Day
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-slate-600 leading-relaxed italic text-sm">
                  "{alumni.bio || "This alumnus is letting their achievements speak for themselves."}"
                </p>
              </div>

              {alumni.linkedin_url && (
                <a
                  href={alumni.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg hover:shadow-blue-200"
                >
                 LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="mt-10 flex flex-col items-center gap-4">
        <Link
          to="/profile"
          className="text-slate-500 font-semibold hover:text-blue-700 transition-colors flex items-center gap-2"
        >
          ← Return to Portal
        </Link>
        
        
      </div>
    </div>
  );
};

export default FeaturedAlumni;