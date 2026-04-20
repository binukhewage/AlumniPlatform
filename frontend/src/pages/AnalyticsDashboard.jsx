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
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
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
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition">
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
      {title}
    </p>
    <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
    <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
  </div>
);

const AnalyticsDashboard = () => {
  const [summary, setSummary] = useState({
    totalAlumni: 0,
    totalCertifications: 0,
    featuredToday: 0,
    topIndustry: "Loading...",
  });

  const [employmentData, setEmploymentData] = useState([]);
  const [certificationData, setCertificationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topEmployersData, setTopEmployersData] = useState([]);
  const [jobTitlesData, setJobTitlesData] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [degreeData, setDegreeData] = useState([]);
  const [skillsGapData, setSkillsGapData] = useState([]);
  const [graduationYearData, setGraduationYearData] = useState([]);
  const [sectorDemandData, setSectorDemandData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);

  const [yearFilter, setYearFilter] = useState("All Years");
  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const [programmeFilter, setProgrammeFilter] = useState("All Programmes");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        summaryRes,
        employmentRes,
        certificationRes,
        topEmployersRes,
        jobTitlesRes,
        growthRes,
        degreeRes,
        skillsGapRes,
        graduationYearsRes,
        sectorDemandRes,
        coursesRes,
      ] = await Promise.all([
        api.get("/analytics/summary", getAuthHeader()),
        api.get("/analytics/employment-sectors", getAuthHeader()),
        api.get("/analytics/certifications", getAuthHeader()),
        api.get("/analytics/top-employers", getAuthHeader()),
        api.get("/analytics/job-titles", getAuthHeader()),
        api.get("/analytics/growth", getAuthHeader()),
        api.get("/analytics/degrees", getAuthHeader()),
        api.get("/analytics/skills-gap", getAuthHeader()),
        api.get("/analytics/graduation-years", getAuthHeader()),
        api.get("/analytics/sector-demand", getAuthHeader()),
        api.get("/analytics/courses-popularity", getAuthHeader()),
      ]);

      setSummary(summaryRes.data);
      setEmploymentData(employmentRes.data);
      setCertificationData(certificationRes.data);
      setTopEmployersData(topEmployersRes.data);
      setJobTitlesData(jobTitlesRes.data);
      setGrowthData(growthRes.data);
      setDegreeData(degreeRes.data);
      setSkillsGapData(skillsGapRes.data);
      setGraduationYearData(graduationYearsRes.data);
      setSectorDemandData(sectorDemandRes.data);
      setCoursesData(coursesRes.data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const filteredEmployment =
    industryFilter === "All Industries"
      ? employmentData
      : employmentData.filter((item) => item.name === industryFilter);

  const filteredSector =
    industryFilter === "All Industries"
      ? sectorDemandData
      : sectorDemandData.filter((item) => item.name === industryFilter);

  const filteredDegrees =
    programmeFilter === "All Programmes"
      ? degreeData
      : degreeData.filter((item) => item.name === programmeFilter);

  const filteredYears =
    yearFilter === "All Years"
      ? graduationYearData
      : graduationYearData.filter((item) => String(item.name) === yearFilter);

  const exportCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Alumni", summary.totalAlumni],
      ["Certifications", summary.totalCertifications],
      ["Top Employer", summary.topIndustry],
      ["Featured Today", summary.featuredToday],
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "analytics-report.csv";
    link.click();
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
              className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-sm font-medium hover:bg-slate-50"
            >
              Export CSV
            </button>

            <button
              onClick={exportPDF}
              className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-sm font-medium hover:bg-slate-50"
            >
              Download PDF
            </button>

            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 rounded-lg bg-blue-700 text-white text-sm font-medium hover:bg-blue-800"
            >
              Refresh
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600"
            >
              LogOut
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
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
            title="Top Employer"
            value={loading ? "..." : summary.topIndustry}
            subtitle="Most common employer"
          />
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="border rounded-lg p-2.5"
            >
              <option>All Years</option>
              {graduationYearData.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>

            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="border rounded-lg p-2.5"
            >
              <option>All Industries</option>
              {sectorDemandData.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>

            <select
              value={programmeFilter}
              onChange={(e) => setProgrammeFilter(e.target.value)}
              className="border rounded-lg p-2.5"
            >
              <option>All Programmes</option>
              {degreeData.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>

            <button className="rounded-lg bg-blue-700 text-white font-medium px-4">
              Filters Active
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 min-h-[320px]">
            <h3 className="font-semibold text-slate-800 mb-4">Skills Gap Radar</h3>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillsGapData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar dataKey="current" stroke="#2563eb" fill="#2563eb" fillOpacity={0.5} />
                  <Radar dataKey="target" stroke="#ef4444" fill="#ef4444" fillOpacity={0.25} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 min-h-[320px]">
            <h3 className="font-semibold text-slate-800 mb-4">Industry Employment</h3>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={filteredEmployment} dataKey="value" nameKey="name" outerRadius={90} label>
                    {filteredEmployment.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 min-h-[320px]">
            <h3 className="font-semibold text-slate-800 mb-4">Graduate Trends</h3>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 min-h-[320px]">
            <h3 className="font-semibold text-slate-800 mb-4">Top Employers</h3>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topEmployersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" hide />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#14b8a6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 min-h-[320px]">
            <h3 className="font-semibold text-slate-800 mb-4">Certifications by Category</h3>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={certificationData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    label
                  >
                    {certificationData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 min-h-[320px]">
            <h3 className="font-semibold text-slate-800 mb-4">Alumni by Graduation Year</h3>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredYears}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#c4b5fd" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 min-h-[320px]">
            <h3 className="font-semibold text-slate-800 mb-4">Sector Demand</h3>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredSector} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" width={90} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 min-h-[320px]">
            <h3 className="font-semibold text-slate-800 mb-4">Courses Popularity</h3>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="20%" outerRadius="90%" data={coursesData}>
                  <RadialBar dataKey="value" />
                  <Legend />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;