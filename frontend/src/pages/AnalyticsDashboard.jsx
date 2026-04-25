import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Papa from "papaparse";

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

const ExportStatCard = ({ title, value, subtitle }) => (
  <div
    style={{
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "16px",
      padding: "18px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    }}
  >
    <div
      style={{
        fontSize: "11px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#64748b",
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontSize: "30px",
        fontWeight: 800,
        color: "#1e293b",
        marginTop: "8px",
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
      {subtitle}
    </div>
  </div>
);

const ExportChartCard = ({ title, children }) => (
  <div
    style={{
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "16px",
      padding: "18px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      breakInside: "avoid",
      pageBreakInside: "avoid",
    }}
  >
    <h3
      style={{
        fontSize: "16px",
        fontWeight: 700,
        color: "#0f172a",
        marginBottom: "14px",
      }}
    >
      {title}
    </h3>
    <div style={{ width: "100%", height: "280px" }}>{children}</div>
  </div>
);

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const exportRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [exportingPdf, setExportingPdf] = useState(false);

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

  const [filterOptions, setFilterOptions] = useState({
    years: [],
    industries: [],
    programmes: [],
  });

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchFilterOptions = async () => {
    try {
      const res = await api.get("/analytics/filter-options", getAuthHeader());
      setFilterOptions(res.data || { years: [], industries: [], programmes: [] });
    } catch (error) {
      console.error("Failed to fetch filter options:", error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const params = {};
      if (yearFilter !== "All Years") params.year = yearFilter;
      if (industryFilter !== "All Industries") params.industry = industryFilter;
      if (programmeFilter !== "All Programmes") params.programme = programmeFilter;

      const config = {
        ...getAuthHeader(),
        params,
      };

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
        api.get("/analytics/summary", config),
        api.get("/analytics/skills-gap", config),
        api.get("/analytics/employment-sectors", config),
        api.get("/analytics/job-titles", config),
        api.get("/analytics/top-employers", config),
        api.get("/analytics/geographic-distribution", config),
        api.get("/analytics/sector-demand", config),
        api.get("/analytics/certifications", config),
        api.get("/analytics/courses-popularity", config),
      ]);

      setSummary(summaryRes.data || {});
      setSkillsGapData(skillsRes.data || []);
      setEmploymentData(employmentRes.data || []);
      setJobTitlesData(jobsRes.data || []);
      setTopEmployersData(employersRes.data || []);
      setGeoData(geoRes.data || []);
      setSectorDemandData(sectorRes.data || []);
      setCertificationData(certRes.data || []);
      setCoursesData(courseRes.data || []);
    } catch (error) {
      console.error("Dashboard fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [yearFilter, industryFilter, programmeFilter]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  const exportCSV = () => {
    let csvString = "University Analytics Report\n\n";

    const addSection = (title, data) => {
      if (!data || data.length === 0) return;
      csvString += `--- ${title} ---\n`;
      csvString += Papa.unparse(data) + "\n\n";
    };

    addSection("Summary", [
      {
        totalAlumni: summary.totalAlumni,
        totalCertifications: summary.totalCertifications,
        featuredToday: summary.featuredToday,
        topIndustry: summary.topIndustry,
      },
    ]);

    addSection("Skills Gap", skillsGapData);
    addSection("Industry Employment", employmentData);
    addSection("Job Titles", jobTitlesData);
    addSection("Top Employers", topEmployersData);
    addSection("Geographic Distribution", geoData);
    addSection("Sector Demand", sectorDemandData);
    addSection("Certification Trend", certificationData);
    addSection("Courses Popularity", coursesData);

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Analytics_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const exportPDF = async () => {
    if (!exportRef.current) return;

    try {
      setExportingPdf(true);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f8fafc",
        logging: false,
        windowWidth: 1400,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth - 10;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 5;

      pdf.addImage(imgData, "PNG", 5, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 10;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 5;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 5, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 10;
      }

      pdf.save("analytics-dashboard.pdf");
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to generate screenshot-style PDF.");
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
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
              disabled={exportingPdf}
              className="px-4 py-2 rounded-lg bg-white border"
            >
              {exportingPdf ? "Generating PDF..." : "Download PDF"}
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

        <section className="bg-white rounded-xl shadow-sm border p-5 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="border rounded-lg p-2.5"
            >
              <option>All Years</option>
              {filterOptions.years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="border rounded-lg p-2.5"
            >
              <option>All Industries</option>
              {filterOptions.industries.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <select
              value={programmeFilter}
              onChange={(e) => setProgrammeFilter(e.target.value)}
              className="border rounded-lg p-2.5"
            >
              <option>All Programmes</option>
              {filterOptions.programmes.map((prog) => (
                <option key={prog} value={prog}>{prog}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setYearFilter("All Years");
                setIndustryFilter("All Industries");
                setProgrammeFilter("All Programmes");
              }}
              className="rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium p-2.5 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold mb-4">Curriculum Skill Gap Analysis</h3>
            <div className="h-[260px]">
              <ResponsiveContainer>
                <RadarChart data={skillsGapData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar dataKey="current" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
                  <Radar dataKey="target" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold mb-4">Employment by Industry Sector</h3>
            <div className="h-[260px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={employmentData} dataKey="value" nameKey="name" outerRadius={90} label>
                    {employmentData.map((e, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold mb-4">Most Common Job Titles</h3>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={jobTitlesData} dataKey="value" nameKey="name" outerRadius={90} label>
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

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold mb-4">Geographic Distribution</h3>
            <div className="h-[260px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={geoData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
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

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold mb-4">Industry Demand by Sector</h3>
            <div className="h-[260px]">
              <ResponsiveContainer>
                <BarChart data={sectorDemandData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold mb-4">Certification Growth Trend (by Demand)</h3>
            <div className="h-[260px]">
              <ResponsiveContainer>
                <LineChart data={certificationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36}/>
                  <Line type="monotone" dataKey="Cloud" stroke="#0ea5e9" strokeWidth={2} />
                  <Line type="monotone" dataKey="Agile" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="Data" stroke="#14b8a6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Security" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="Other" stroke="#94a3b8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold mb-4">Professional Development Trends</h3>
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

      <div
        style={{
          position: "absolute",
          left: "-10000px",
          top: 0,
          width: "1400px",
          background: "#f8fafc",
          padding: "32px",
        }}
      >
        <div
          ref={exportRef}
          style={{
            width: "1340px",
            background: "#f8fafc",
            padding: "8px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div
            style={{
              marginBottom: "24px",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "18px",
              padding: "24px",
            }}
          >
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 800,
                color: "#1e3a8a",
                margin: 0,
              }}
            >
              University Analytics Dashboard
            </h1>
            <p
              style={{
                marginTop: "8px",
                fontSize: "15px",
                color: "#64748b",
              }}
            >
              Alumni Intelligence & Graduate Outcomes
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "18px",
              marginBottom: "24px",
            }}
          >
            <ExportStatCard
              title="Total Alumni"
              value={summary.totalAlumni}
              subtitle="Registered graduates"
            />
            <ExportStatCard
              title="Certifications"
              value={summary.totalCertifications}
              subtitle="Across all users"
            />
            <ExportStatCard
              title="Top Industry"
              value={summary.topIndustry}
              subtitle="Highest employment sector"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "18px",
            }}
          >
            <ExportChartCard title="Curriculum Skill Gap Analysis">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillsGapData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar dataKey="current" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
                  <Radar dataKey="target" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </ExportChartCard>

            <ExportChartCard title="Employment by Industry Sector">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={employmentData} dataKey="value" nameKey="name" outerRadius={95} label>
                    {employmentData.map((e, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ExportChartCard>

            <ExportChartCard title="Most Common Job Titles">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={jobTitlesData} dataKey="value" nameKey="name" outerRadius={95} label>
                    {jobTitlesData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ExportChartCard>

            <ExportChartCard title="Top Employers Hiring Alumni">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topEmployersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </ExportChartCard>

            <ExportChartCard title="Geographic Distribution">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={geoData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95}>
                    {geoData.map((e, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ExportChartCard>

            <ExportChartCard title="Industry Demand by Sector">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorDemandData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </ExportChartCard>

            <ExportChartCard title="Certification Growth Trend (by Demand)">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={certificationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36}/>
                  <Line type="monotone" dataKey="Cloud" stroke="#0ea5e9" strokeWidth={2} />
                  <Line type="monotone" dataKey="Agile" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="Data" stroke="#14b8a6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Security" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="Other" stroke="#94a3b8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ExportChartCard>

            <ExportChartCard title="Professional Development Trends">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={coursesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={140} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </ExportChartCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;