import ProfileInfo from "../components/profile/ProfileInfo";
import DegreesSection from "../components/degrees/DegreesSection";
import CertificationsSection from "../components/certifications/CertificationsSection";
import LicencesSection from "../components/licences/LicencesSection";
import CoursesSection from "../components/courses/CoursesSection";
import EmploymentSection from "../components/employment/EmploymentSection";
import BidSection from "../components/bidding/BidSection";


const Profile = () => {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const featuredAlumni = () => {
    window.location.href = "/featured";
  };

  const viewAlumni = () => {
    window.location.href = "/view-alumni";
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Refined Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-900 tracking-tight">
            Alumni Platform <span className="text-gray-400 font-light mx-2"></span> 
          </h1>

          <div className="flex gap-3">
            <button
              onClick={featuredAlumni}
              className="text-sm font-medium bg-blue-500 text-white hover:bg-blue-400 px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Featured Alumni
            </button>
            <button
              onClick={viewAlumni}
              className="text-sm font-medium bg-blue-500 text-white hover:bg-blue-400 px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              View Alumni 
            </button>

            <button
              onClick={logout}
              className="text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors border border-red-100 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-10">
        
        {/* Main Identity Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-blue-700 to-blue-900"></div>
          <div className="px-8 pb-8 -mt-12">
            <ProfileInfo />
          </div>
        </section>

        {/* Action/Engagement Section */}
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <BidSection />
          </div>
        </div>

        {/* Academic & Professional Grid */}
        <div className="space-y-8">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Credentials & Experience</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <DegreesSection />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <CertificationsSection />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <LicencesSection />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <CoursesSection />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <EmploymentSection />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;