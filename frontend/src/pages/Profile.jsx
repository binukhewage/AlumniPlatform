import ProfileInfo from "../components/profile/ProfileInfo";
import DegreesSection from "../components/degrees/DegreesSection";
import CertificationsSection from "../components/certifications/CertificationsSection";
import LicencesSection from "../components/licences/LicencesSection";
import CoursesSection from "../components/courses/CoursesSection";
import EmploymentSection from "../components/employment/EmploymentSection";

const Profile = () => {

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (

    <div className="max-w-4xl mx-auto p-10 space-y-8">

      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          Alumni Profile
        </h1>

        <button
        onClick={logout}
        className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>

      </div>

      <ProfileInfo />

      <DegreesSection />

      <CertificationsSection />

      <LicencesSection />

      <CoursesSection />

      <EmploymentSection />

    </div>

  );

};

export default Profile;