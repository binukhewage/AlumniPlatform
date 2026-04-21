import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
} from "recharts";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const COLORS = [
  "#2563eb",
  "#0ea5e9",
  "#14b8a6",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
];

const StatCard = ({ title, value, subtitle }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
      {title}
    </p>
    <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
    <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
  </div>
);

const AnalyticsDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    totalAlumni: 0,
    totalCertifications: 0,
    featuredToday: 0,
    topIndustry: "N/A",
  });

  const [skillsGapData, setSkillsGapData] = useState([]);
  const [employmentData, setEmploymentData] = useState([]);
  const [jobTitlesData, setJobTitlesData] = useState([]);
  const [topEmployersData, setTopEmployersData] = useState([]);
  const [geoData, setGeoData] = useState([]);
  const [sectorDemandData, setSectorDemandData] = useState([]);
  const [certificationData, setCertificationData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);

  const [yearFilter, setYearFilter] = useState("All Years");
  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const [programmeFilter, setProgrammeFilter] = useState("All Programmes");

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        summaryRes,
        skillsRes,
        employmentRes,
        jobsRes,
        employersRes,
        geoRes,
        sectorRes,
        certRes,
        courseRes,
      ] = await Promise.all([
        api.get("/analytics/summary", getAuthHeader()),
        api.get("/analytics/skills-gap", getAuthHeader()),
        api.get("/analytics/employment-sectors", getAuthHeader()),
        api.get("/analytics/job-titles", getAuthHeader()),
        api.get("/analytics/top-employers", getAuthHeader()),
        api.get("/analytics/geographic-distribution", getAuthHeader()),
        api.get("/analytics/sector-demand", getAuthHeader()),
        api.get("/analytics/certifications", getAuthHeader()),
        api.get("/analytics/courses-popularity", getAuthHeader()),
      ]);

      setSummary(summaryRes.data);
      setSkillsGapData(skillsRes.data);
      setEmploymentData(employmentRes.data);
      setJobTitlesData(jobsRes.data);
      setTopEmployersData(employersRes.data);
      setGeoData(geoRes.data);
      setSectorDemandData(sectorRes.data);
      setCertificationData(certRes.data);
      setCoursesData(courseRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  const exportCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Alumni", summary.totalAlumni],
      ["Certifications", summary.totalCertifications],
      ["Featured Today", summary.featuredToday],
      ["Top Industry", summary.topIndustry],
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics.csv";
    a.click();
  };

  const exportPDF = () => window.print();

  const filteredEmployment = React.useMemo(() => {
    if (industryFilter === "All Industries") return employmentData;
    return employmentData.filter(
      (item) => item.name?.trim() === industryFilter.trim()
    );
  }, [employmentData, industryFilter]);

  const filteredSector =
    industryFilter === "All Industries"
      ? sectorDemandData
      : sectorDemandData.filter((i) => i.name === industryFilter);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">
              University Analytics Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Alumni Intelligence & Graduate Outcomes
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportCSV}
              className="px-4 py-2 rounded-lg bg-white border"
            >
              Export CSV
            </button>

            <button
              onClick={exportPDF}
              className="px-4 py-2 rounded-lg bg-white border"
            >
              Download PDF
            </button>

            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 rounded-lg bg-blue-700 text-white"
            >
              Refresh
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <StatCard
            title="Total Alumni"
            value={loading ? "..." : summary.totalAlumni}
            subtitle="Registered graduates"
          />
          <StatCard
            title="Certifications"
            value={loading ? "..." : summary.totalCertifications}
            subtitle="Across all users"
          />
          <StatCard
            title="Top Industry"
            value={loading ? "..." : summary.topIndustry}
            subtitle="Highest employment sector"
          />
        </section>

        {/* Filters */}
        <section className="bg-white rounded-xl shadow-sm border p-5 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="border rounded-lg p-2.5"
            >
              <option>All Years</option>
            </select>

            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="border rounded-lg p-2.5"
            >
              <option>All Industries</option>
              {employmentData.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>

            <select
              value={programmeFilter}
              onChange={(e) => setProgrammeFilter(e.target.value)}
              className="border rounded-lg p-2.5"
            >
              <option>All Programmes</option>
            </select>

            <button className="rounded-lg bg-blue-700 text-white font-medium px-4">
              Filters Active
            </button>
          </div>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          {/* 1 */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold mb-4">
              Curriculum Skill Gap Analysis
            </h3>
            <div className="h-[260px]">
              <ResponsiveContainer>
                <RadarChart data={skillsGapData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar
                    dataKey="current"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.4}
                  />
                  <Radar
                    dataKey="target"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.2}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2 */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold mb-4">
              Employment by Industry Sector
            </h3>
            <div className="h-[260px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={filteredEmployment}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {filteredEmployment.map((e, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3 */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold mb-4">Most Common Job Titles</h3>

            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jobTitlesData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {jobTitlesData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4 */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold mb-4">Top Employers Hiring Alumni</h3>
            <div className="h-[260px]">
              <ResponsiveContainer>
                <BarChart data={topEmployersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 5 */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold mb-4">Geographic Distribution</h3>
            <div className="h-[260px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={geoData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                  >
                    {geoData.map((e, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 6 */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold mb-4">Industry Demand by Sector</h3>
            <div className="h-[260px]">
              <ResponsiveContainer>
                <BarChart data={filteredSector}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 7 */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold mb-4">Certification Growth Trend</h3>
            <div className="h-[260px]">
              <ResponsiveContainer>
                <LineChart data={certificationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 8 */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold mb-4">
              Professional Development Trends
            </h3>
            <div className="h-[260px]">
              <ResponsiveContainer>
                <BarChart data={coursesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={140} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;