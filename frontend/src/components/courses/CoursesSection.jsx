import { useEffect, useState } from "react";
import api from "../../api/axios";

const CoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    course_name: "",
    provider: "",
    course_url: "",
    completion_date: ""
  });

  const loadCourses = async () => {
    try {
      const res = await api.get("/courses");
      const sorted = res.data.sort((a, b) => b.id - a.id);
      setCourses(sorted);
    } catch (err) {
      console.log("LOAD COURSES ERROR:", err);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.course_name || !form.provider || !form.completion_date) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, form);
      } else {
        await api.post("/courses", form);
      }
      setEditingId(null);
      setForm({
        course_name: "",
        provider: "",
        course_url: "",
        completion_date: ""
      });
      setShowForm(false);
      loadCourses();
    } catch (err) {
      console.log("ADD COURSE ERROR:", err.response?.data || err);
      alert(err.response?.data?.error || "Failed to add course");
    }
  };

  const edit = (course) => {
    setEditingId(course.id);
    setShowForm(true);
    setForm({
      course_name: course.course_name,
      provider: course.provider,
      course_url: course.course_url || "",
      completion_date: course.completion_date?.substring(0, 10)
    });
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this course?")) return;
    try {
      await api.delete(`/courses/${id}`);
      loadCourses();
    } catch (err) {
      console.log("DELETE COURSE ERROR:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Courses</h2>
          
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-bold transition-all border border-blue-100"
          >
            + Add Course
          </button>
        )}
      </div>

      {/* COURSE LIST */}
      <div className="space-y-4">
        {courses.length === 0 && !showForm && (
          <p className="text-sm text-slate-400 italic py-4">No courses listed yet.</p>
        )}

        {courses.map((c) => (
          <div
            key={c.id}
            className="group flex justify-between items-start p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/50 transition-all shadow-sm"
          >
            <div className="flex gap-4">
              
              <div>
                <p className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight">
                  {c.course_name}
                </p>
                <p className="text-sm text-slate-600 font-medium">{c.provider}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">
                    Completed: {c.completion_date?.substring(0, 10)}
                  </span>
                  {c.course_url && (
                    <a
                      href={c.course_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 text-[10px] font-bold uppercase hover:underline"
                    >
                      View Syllabus →
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => edit(c)}
                className="text-[11px] font-black text-slate-400 hover:text-blue-600 p-2 transition-colors tracking-tighter"
              >
                EDIT
              </button>
              <button
                onClick={() => remove(c.id)}
                className="text-[11px] font-black text-slate-400 hover:text-red-500 p-2 transition-colors tracking-tighter"
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
            {editingId ? "Update Course Record" : "Add New Course"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Course Name</label>
              <input
                placeholder="Advanced React Patterns"
                required
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                value={form.course_name}
                onChange={(e) => setForm({ ...form, course_name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Provider / Platform</label>
              <input
                placeholder="e.g. Coursera, Udemy"
                required
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                value={form.provider}
                onChange={(e) => setForm({ ...form, provider: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Resource URL</label>
              <input
                placeholder="https://..."
                required
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                value={form.course_url}
                onChange={(e) => setForm({ ...form, course_url: e.target.value })}
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
            <button className="flex-1 bg-blue-700 text-white font-bold py-2.5 rounded-lg hover:bg-blue-800 transition shadow-sm active:scale-95">
              {editingId ? "Update Course" : "Add to Profile"}
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

export default CoursesSection;