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
} from "recharts";
import api from "../api/axios";

const COLORS = ["#2563eb", "#0ea5e9", "#14b8a6", "#8b5cf6", "#f59e0b", "#ef4444"];

const StatCard = ({ title, value, subtitle }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition">
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
      {title}
    </p>
    <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
    <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
  </div>
);

const EmptyChart = ({ title }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 min-h-[320px]">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <span className="text-xs text-slate-400">Coming Soon</span>
    </div>

    <div className="h-[240px] rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 text-sm">
      Future API / Chart
    </div>
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

      const [summaryRes, employmentRes, certificationRes] = await Promise.all([
        api.get("/analytics/summary", getAuthHeader()),
        api.get("/analytics/employment-sectors", getAuthHeader()),
        api.get("/analytics/certifications", getAuthHeader()),
      ]);

      setSummary(summaryRes.data);
      setEmploymentData(employmentRes.data);
      setCertificationData(certificationRes.data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
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
            <button className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-sm font-medium hover:bg-slate-50">
              Export CSV
            </button>

            <button className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-sm font-medium hover:bg-slate-50">
              Download PDF
            </button>

            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 rounded-lg bg-blue-700 text-white text-sm font-medium hover:bg-blue-800"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
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
            subtitle="Most employed sector"
          />
          <StatCard
            title="Featured Today"
            value={loading ? "..." : summary.featuredToday}
            subtitle="Daily spotlight winner"
          />
        </section>

        {/* Filters */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select className="border rounded-lg p-2.5">
              <option>All Years</option>
            </select>

            <select className="border rounded-lg p-2.5">
              <option>All Industries</option>
            </select>

            <select className="border rounded-lg p-2.5">
              <option>All Programmes</option>
            </select>

            <button className="rounded-lg bg-blue-700 text-white font-medium hover:bg-blue-800 px-4">
              Apply Filters
            </button>
          </div>
        </section>

        {/* Real Charts */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          {/* Employment Pie */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 min-h-[320px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">
                Employment by Industry
              </h3>
              <span className="text-xs text-slate-400">Live Data</span>
            </div>

            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={employmentData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {employmentData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Certifications Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 min-h-[320px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">
                Certifications Earned
              </h3>
              <span className="text-xs text-slate-400">Live Data</span>
            </div>

            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={certificationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Remaining placeholders */}
          <EmptyChart title="Top Employers" />
          <EmptyChart title="Most Common Job Titles" />
          <EmptyChart title="Alumni Growth Over Time" />
          <EmptyChart title="Degree Distribution" />
        </section>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;