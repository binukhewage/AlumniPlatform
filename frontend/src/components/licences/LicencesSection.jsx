import { useEffect, useState } from "react";
import api from "../../api/axios";

const LicencesSection = () => {
  const [licences, setLicences] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    licence_name: "",
    authority: "",
    licence_url: "",
    completion_date: ""
  });

  const loadLicences = async () => {
    try {
      const res = await api.get("/licences");
      const sorted = res.data.sort((a, b) => b.id - a.id);
      setLicences(sorted);
    } catch (err) {
      console.log("LOAD LICENCES ERROR:", err);
    }
  };

  useEffect(() => {
    loadLicences();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.licence_name || !form.authority || !form.completion_date) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/licences/${editingId}`, form);
      } else {
        await api.post("/licences", form);
      }
      setEditingId(null);
      setForm({
        licence_name: "",
        authority: "",
        licence_url: "",
        completion_date: ""
      });
      setShowForm(false);
      loadLicences();
    } catch (err) {
      console.log("ADD LICENCE ERROR:", err.response?.data || err);
      alert(err.response?.data?.error || "Failed to add licence");
    }
  };

  const edit = (licence) => {
    setEditingId(licence.id);
    setShowForm(true);
    setForm({
      licence_name: licence.licence_name,
      authority: licence.authority,
      licence_url: licence.licence_url || "",
      completion_date: licence.completion_date?.substring(0, 10)
    });
  };

  const remove = async (id) => {
    if (!window.confirm("Remove this licence?")) return;
    try {
      await api.delete(`/licences/${id}`);
      loadLicences();
    } catch (err) {
      console.log("DELETE LICENCE ERROR:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Licences</h2>
          
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-bold transition-all border border-blue-100"
          >
            + Add Licence
          </button>
        )}
      </div>

      {/* LICENCE LIST */}
      <div className="space-y-4">
        {licences.length === 0 && !showForm && (
          <p className="text-sm text-slate-400 italic py-4">No licences registered.</p>
        )}

        {licences.map((l) => (
          <div
            key={l.id}
            className="group flex justify-between items-start p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/50 transition-all shadow-sm"
          >
            <div className="flex gap-4">
              
              <div>
                <p className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight">
                  {l.licence_name}
                </p>
                <p className="text-sm text-slate-600 font-medium">{l.authority}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">
                    Expires: {l.completion_date?.substring(0, 10)}
                  </span>
                  {l.licence_url && (
                    <a
                      href={l.licence_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 text-[10px] font-bold uppercase hover:underline"
                    >
                      Verify Document →
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => edit(l)}
                className="text-xs font-bold text-slate-400 hover:text-blue-600 p-2 transition-colors uppercase"
              >
                Edit
              </button>
              <button
                onClick={() => remove(l.id)}
                className="text-xs font-bold text-slate-400 hover:text-red-500 p-2 transition-colors uppercase"
              >
                Del
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FORM */}
      {showForm && (
        <form onSubmit={submit} className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase mb-2">
            {editingId ? "Update Licence Details" : "New Licence Registration"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Licence Name</label>
              <input
                placeholder="Professional Engineering..."
                required
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                value={form.licence_name}
                onChange={(e) => setForm({ ...form, licence_name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Issuing Authority</label>
              <input
                placeholder="e.g. Government Board"
                required
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                value={form.authority}
                onChange={(e) => setForm({ ...form, authority: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Licence URL</label>
              <input
                placeholder="https://..."
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                value={form.licence_url}
                onChange={(e) => setForm({ ...form, licence_url: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Expiry/Completion Date</label>
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
              {editingId ? "Save Changes" : "Register Licence"}
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

export default LicencesSection;