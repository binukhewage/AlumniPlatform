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

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Alumni Profile</h1>

        <div className="flex justify-end gap-2">
          <button
            onClick={featuredAlumni}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Featured Alumni
          </button>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <ProfileInfo />
      <BidSection />

      <DegreesSection />

      <CertificationsSection />

      <LicencesSection />

      <CoursesSection />

      <EmploymentSection />
    </div>
  );
};

export default Profile;
