import { useEffect, useState } from "react";
import api from "../../api/axios";

const DegreesSection = () => {
  const [degrees, setDegrees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    degree_name: "",
    university: "",
    degree_url: "",
    completion_date: ""
  });

  const loadDegrees = async () => {
    try {
      const res = await api.get("/degrees");
      const sorted = res.data.sort((a, b) => b.id - a.id);
      setDegrees(sorted);
    } catch (err) {
      console.log("LOAD ERROR:", err.response?.data || err);
    }
  };

  useEffect(() => {
    loadDegrees();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.degree_name || !form.university || !form.completion_date) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/degrees/${editingId}`, form);
      } else {
        await api.post("/degrees", form);
      }
      setEditingId(null);
      setForm({ degree_name: "", university: "", degree_url: "", completion_date: "" });
      setShowForm(false);
      loadDegrees();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save degree");
    }
  };

  const edit = (degree) => {
    setEditingId(degree.id);
    setShowForm(true);
    setForm({
      degree_name: degree.degree_name,
      university: degree.university,
      degree_url: degree.degree_url || "",
      completion_date: degree.completion_date?.substring(0, 10)
    });
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this qualification?")) return;
    try {
      await api.delete(`/degrees/${id}`);
      loadDegrees();
    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data || err);
    }
  };

  return (
    <div className="bg-white rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Degrees</h2>
         
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-bold transition-all border border-blue-100"
          >
            + Add Degree
          </button>
        )}
      </div>

      {/* DEGREE LIST */}
      <div className="space-y-4">
        {degrees.length === 0 && !showForm && (
          <p className="text-sm text-slate-400 italic py-4">No records found. Click add to update your history.</p>
        )}
        
        {degrees.map((d) => (
          <div
            key={d.id}
            className="group flex justify-between items-start p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all shadow-sm"
          >
            <div className="flex gap-4">
              {/* Visual "Timeline" Icon */}
              
              <div>
                <p className="font-bold text-slate-800 leading-tight group-hover:text-blue-900 transition-colors">
                  {d.degree_name}
                </p>
                <p className="text-sm text-slate-600 font-medium mt-0.5">{d.university}</p>
                
                <div className="flex items-center gap-3 mt-2">
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight bg-slate-100 px-2 py-0.5 rounded">
                    Completed: {d.completion_date?.substring(0, 10)}
                  </span>
                  {d.degree_url && (
                    <a
                      href={d.degree_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 text-[10px] font-bold uppercase hover:underline"
                    >
                      View Credentials →
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => edit(d)}
                className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                title="Edit Degree"
              >
                <span className="text-xs font-bold uppercase">Edit</span>
              </button>
              <button
                onClick={() => remove(d.id)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Remove Degree"
              >
                <span className="text-xs font-bold uppercase">Del</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FORM */}
      {showForm && (
        <form onSubmit={submit} className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <h3 className="text-sm font-bold text-slate-700 uppercase mb-2">
            {editingId ? "Modify Degree" : "New Degree Entry"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Degree (e.g. BSc Computer Science)"
              required
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
              value={form.degree_name}
              onChange={(e) => setForm({ ...form, degree_name: e.target.value })}
            />
            <input
              placeholder="University"
              required
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
              value={form.university}
              onChange={(e) => setForm({ ...form, university: e.target.value })}
            />
            <input
              placeholder="Link to Certificate (Optional)"
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
              value={form.degree_url}
              onChange={(e) => setForm({ ...form, degree_url: e.target.value })}
            />
            <div className="relative">
              <input
                type="date"
                required
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                value={form.completion_date}
                onChange={(e) => setForm({ ...form, completion_date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button className="flex-1 bg-blue-700 text-white font-bold py-2.5 rounded-lg hover:bg-blue-800 transition shadow-sm active:scale-95">
              {editingId ? "Update Record" : "Add to Profile"}
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

export default DegreesSection;