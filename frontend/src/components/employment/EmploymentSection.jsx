import { useEffect, useState } from "react";
import api from "../../api/axios";

const EmploymentSection = () => {
  const [jobs, setJobs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    company: "",
    position: "",
    start_date: "",
    end_date: ""
  });

  const load = async () => {
    try {
      const res = await api.get("/employment");
      const sorted = res.data.sort((a, b) => b.id - a.id);
      setJobs(sorted);
    } catch (err) {
      console.log("LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/employment/${editingId}`, form);
      } else {
        await api.post("/employment", form);
      }
      setEditingId(null);
      setForm({ company: "", position: "", start_date: "", end_date: "" });
      setShowForm(false);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save employment record");
    }
  };

  const edit = (job) => {
    setEditingId(job.id);
    setShowForm(true);
    setForm({
      company: job.company,
      position: job.position,
      start_date: job.start_date?.substring(0, 10),
      end_date: job.end_date?.substring(0, 10)
    });
  };

  const remove = async (id) => {
    if (!window.confirm("Remove this work experience?")) return;
    try {
      await api.delete(`/employment/${id}`);
      load();
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Employment History</h2>

        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-bold transition-all border border-blue-100"
          >
            + Add Position
          </button>
        )}
      </div>

      {/* JOB LIST */}
      <div className="space-y-4">
        {jobs.length === 0 && !showForm && (
          <p className="text-sm text-slate-400 italic py-4">No work experience added yet.</p>
        )}

        {jobs.map((j) => (
          <div
            key={j.id}
            className="group flex justify-between items-start p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/50 transition-all shadow-sm"
          >
            <div className="flex gap-4">
              
              <div>
                <p className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight">
                  {j.company}
                </p>
                <p className="text-sm text-slate-600 font-medium">{j.position}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-slate-500 uppercase">
                  <span className="bg-slate-100 px-2 py-0.5 rounded tracking-tighter">
                    {j.start_date?.substring(0, 10)}
                  </span>
                  <span>—</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded tracking-tighter">
                    {j.end_date ? j.end_date.substring(0, 10) : "Present"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => edit(j)}
                className="text-[11px] font-black text-slate-400 hover:text-blue-600 p-2 transition-colors"
              >
                EDIT
              </button>
              <button
                onClick={() => remove(j.id)}
                className="text-[11px] font-black text-slate-400 hover:text-red-500 p-2 transition-colors"
              >
                DEL
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FORM */}
      {showForm && (
        <form onSubmit={submit} className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase mb-2">
            {editingId ? "Update Job Details" : "New Work Experience"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Company / Organization</label>
              <input
                placeholder="Google, Microsoft, etc."
                required
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Job Title / Position</label>
              <input
                placeholder="Software Engineer Intern"
                required
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Start Date</label>
              <input
                type="date"
                required
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">End Date (Leave empty if current)</label>
              <input
                type="date"
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button className="flex-1 bg-blue-700 text-white font-bold py-2.5 rounded-lg hover:bg-blue-800 transition shadow-sm active:scale-95">
              {editingId ? "Update Experience" : "Add Experience"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-200 transition rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EmploymentSection;