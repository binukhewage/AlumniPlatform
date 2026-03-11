import { useEffect, useState } from "react";
import api from "../../api/axios";

const CoursesSection = () => {

  const [courses,setCourses] = useState([]);
  const [editingId,setEditingId] = useState(null);
  const [showForm,setShowForm] = useState(false);

  const [form,setForm] = useState({
    course_name:"",
    provider:"",
    course_url:"",
    completion_date:""
  });

  const loadCourses = async () => {

    try{

      const res = await api.get("/courses");

      const sorted = res.data.sort((a,b)=> b.id - a.id);

      setCourses(sorted);

    }catch(err){

      console.log("LOAD COURSES ERROR:",err);

    }

  };

  useEffect(()=>{
    loadCourses();
  },[]);

  const submit = async (e)=>{

    e.preventDefault();

    if(!form.course_name || !form.provider || !form.completion_date){

      alert("Please fill all required fields");
      return;

    }

    try{

      if(editingId){

        await api.put(`/courses/${editingId}`,form);

      }else{

        await api.post("/courses",form);

      }

      setEditingId(null);

      setForm({
        course_name:"",
        provider:"",
        course_url:"",
        completion_date:""
      });

      setShowForm(false);

      loadCourses();

    }catch(err){

      console.log("ADD COURSE ERROR:",err.response?.data || err);

      alert(err.response?.data?.error || "Failed to add course");

    }

  };

  const edit = (course)=>{

    setEditingId(course.id);

    setShowForm(true);

    setForm({
      course_name:course.course_name,
      provider:course.provider,
      course_url:course.course_url || "",
      completion_date:course.completion_date?.substring(0,10)
    });

  };

  const remove = async(id)=>{

    try{

      await api.delete(`/courses/${id}`);

      loadCourses();

    }catch(err){

      console.log("DELETE COURSE ERROR:",err);

    }

  };

  return (

    <div className="border p-6 rounded space-y-4">

      <div className="flex justify-between items-center">

        <h2 className="text-xl font-semibold">
          Courses
        </h2>

        {!showForm && (
          <button
            onClick={()=>setShowForm(true)}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Add Course
          </button>
        )}

      </div>

      {/* COURSE LIST */}

      {courses.map(c => (

        <div
          key={c.id}
          className="flex justify-between border p-3 rounded"
        >

          <div>

            <p className="font-semibold">
              {c.course_name}
            </p>

            <p className="text-sm text-gray-600">
              {c.provider}
            </p>

            <p className="text-xs text-gray-500">
              {c.completion_date?.substring(0,10)}
            </p>

            {c.course_url && (

              <a
                href={c.course_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 text-sm"
              >
                View Course
              </a>

            )}

          </div>

          <div className="space-x-3">

            <button
              onClick={()=>edit(c)}
              className="text-blue-500"
            >
              Edit
            </button>

            <button
              onClick={()=>remove(c.id)}
              className="text-red-500"
            >
              Delete
            </button>

          </div>

        </div>

      ))}

      {/* FORM */}

      {showForm && (

        <form onSubmit={submit} className="space-y-2 border-t pt-4">

          <input
            placeholder="Course Name"
            required
            className="border p-2 w-full"
            value={form.course_name}
            onChange={(e)=>setForm({...form,course_name:e.target.value})}
          />

          <input
            placeholder="Provider"
            required
            className="border p-2 w-full"
            value={form.provider}
            onChange={(e)=>setForm({...form,provider:e.target.value})}
          />

          <input
            placeholder="Course URL"
            required
            className="border p-2 w-full"
            value={form.course_url}
            onChange={(e)=>setForm({...form,course_url:e.target.value})}
          />

          <input
            type="date"
            required
            className="border p-2 w-full"
            value={form.completion_date}
            onChange={(e)=>setForm({...form,completion_date:e.target.value})}
          />

          <div className="flex gap-2">

            <button className="bg-blue-600 text-white px-4 py-1 rounded">
              {editingId ? "Update Course" : "Add Course"}
            </button>

            <button
              type="button"
              onClick={()=>{
                setShowForm(false);
                setEditingId(null);
              }}
              className="bg-gray-400 text-white px-4 py-1 rounded"
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