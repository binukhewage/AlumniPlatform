import { useEffect, useState } from "react";
import api from "../../api/axios";

const CertificationsSection = () => {
  const [certs, setCerts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false); // UI state only

  const [form, setForm] = useState({
    certification_name: "",
    organisation: "",
    cert_url: "",
    completion_date: ""
  });

  const loadCerts = async () => {
    try {
      const res = await api.get("/certifications");
      const sorted = res.data.sort((a, b) => b.id - a.id);
      setCerts(sorted);
    } catch (err) {
      console.log("LOAD ERROR:", err.response?.data || err);
    }
  };

  useEffect(() => {
    loadCerts();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.certification_name || !form.organisation || !form.completion_date) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/certifications/${editingId}`, form);
      } else {
        await api.post("/certifications", form);
      }
      setEditingId(null);
      setForm({ certification_name: "", organisation: "", cert_url: "", completion_date: "" });
      setShowForm(false);
      loadCerts();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save certification");
    } finally {
      setLoading(false);
    }
  };

  const edit = (c) => {
    setEditingId(c.id);
    setShowForm(true);
    setForm({
      certification_name: c.certification_name,
      organisation: c.organisation,
      cert_url: c.cert_url || "",
      completion_date: c.completion_date?.substring(0, 10)
    });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this certification?")) return;
    try {
      await api.delete(`/certifications/${id}`);
      loadCerts();
    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data || err);
    }
  };

  return (
    <div className="bg-white rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Certifications</h2>
          
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-bold transition-all border border-blue-100"
          >
            + Add New
          </button>
        )}
      </div>

      {/* CERT LIST */}
      <div className="grid grid-cols-1 gap-4">
        {certs.length === 0 && !showForm && (
          <p className="text-sm text-slate-400 italic py-4">No certifications listed yet.</p>
        )}
        
        {certs.map((c) => (
          <div
            key={c.id}
            className="group flex justify-between items-start p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/50 transition-all"
          >
            <div className="flex gap-4">
              
              <div>
                <p className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                  {c.certification_name}
                </p>
                <p className="text-sm text-slate-600">{c.organisation}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">
                    Issued: {c.completion_date?.substring(0, 10)}
                  </span>
                  {c.cert_url && (
                    <a
                      href={c.cert_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 text-[10px] font-bold uppercase hover:underline"
                    >
                      Verify Link →
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-1">
              <button onClick={() => edit(c)} className="text-xs font-bold text-slate-400 hover:text-blue-600 p-2 uppercase">
                Edit
              </button>
              <button onClick={() => remove(c.id)} className="text-xs font-bold text-slate-400 hover:text-red-500 p-2 uppercase">
                Del
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FORM */}
      {showForm && (
        <form onSubmit={submit} className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Cert Name</label>
              <input
                placeholder="AWS Certified..."
                required
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                value={form.certification_name}
                onChange={(e) => setForm({ ...form, certification_name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Organisation</label>
              <input
                placeholder="Amazon Web Services"
                required
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                value={form.organisation}
                onChange={(e) => setForm({ ...form, organisation: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Credential URL</label>
              <input
                type="url"
                required
                placeholder="https://..."
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                value={form.cert_url}
                onChange={(e) => setForm({ ...form, cert_url: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Completion Date</label>
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
            <button 
              disabled={loading}
              className="flex-1 bg-blue-700 text-white font-bold py-2.5 rounded-lg hover:bg-blue-800 transition shadow-sm"
            >
              {loading ? "Saving..." : (editingId ? "Update Certificate" : "Add Certificate")}
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

export default CertificationsSection;