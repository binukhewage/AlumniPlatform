import { useEffect, useState } from "react";
import api from "../api/axios";

const ViewAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState("");

  const [yearFilter, setYearFilter] = useState("All Years");
  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const [degreeFilter, setDegreeFilter] = useState("All Degrees");

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchAlumni = async () => {
    try {
      const res = await api.get("/alumni", getAuthHeader());
      setAlumni(res.data);
    } catch (error) {
      console.error("Failed to load alumni", error);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";
    return String(new Date(date).getFullYear());
  };

  const fixLink = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `https://${url}`;
  };

  const years = [
    "All Years",
    ...new Set(
      alumni
        .filter((item) => item.completion_date)
        .map((item) => formatDate(item.completion_date))
    ),
  ];

  const industries = [
    "All Industries",
    ...new Set(
      alumni
        .filter((item) => item.industry)
        .map((item) => item.industry.trim())
    ),
  ];

  const degrees = [
    "All Degrees",
    ...new Set(
      alumni
        .filter((item) => item.degree_name)
        .map((item) => item.degree_name.trim())
    ),
  ];

  const filtered = alumni.filter((item) => {
    const term = search.toLowerCase();

    const matchesSearch =
      item.full_name?.toLowerCase().includes(term) ||
      item.company?.toLowerCase().includes(term) ||
      item.degree_name?.toLowerCase().includes(term) ||
      item.position?.toLowerCase().includes(term) ||
      item.industry?.toLowerCase().includes(term);

    const matchesYear =
      yearFilter === "All Years" ||
      formatDate(item.completion_date) === yearFilter;

    const matchesIndustry =
      industryFilter === "All Industries" ||
      item.industry === industryFilter;

    const matchesDegree =
      degreeFilter === "All Degrees" ||
      item.degree_name === degreeFilter;

    return (
      matchesSearch &&
      matchesYear &&
      matchesIndustry &&
      matchesDegree
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-900">View Alumni</h1>

          <button
            onClick={() => (window.location.href = "/profile")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Small Search + Filters */}
        <div className="grid md:grid-cols-4 gap-3 mb-6">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            {years.map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>

          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            {industries.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={degreeFilter}
            onChange={(e) => setDegreeFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            {degrees.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="mb-4 text-sm text-slate-500">
          {filtered.length} alumni found
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    item.profile_image ||
                    "https://via.placeholder.com/100x100?text=User"
                  }
                  alt=""
                  className="w-20 h-20 rounded-full object-cover border"
                />

                <div>
                  <h2 className="text-lg font-bold text-slate-800 leading-tight">
                    {item.full_name}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {item.position || "No Position"}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-sm text-slate-700">
                <p><span className="font-semibold">Company:</span> {item.company || "-"}</p>
                <p><span className="font-semibold">Industry:</span> {item.industry || "-"}</p>
                <p><span className="font-semibold">Degree:</span> {item.degree_name || "-"}</p>
                <p><span className="font-semibold">Graduated:</span> {formatDate(item.completion_date)}</p>
              </div>

              {item.linkedin_url && (
                <a
                  href={fixLink(item.linkedin_url)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-4 text-blue-600 text-sm font-semibold hover:underline"
                >
                  View LinkedIn →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewAlumni;