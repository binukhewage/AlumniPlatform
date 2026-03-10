import { useEffect,useState } from "react";
import api from "../../api/axios";

const CoursesSection = () => {

  const [courses,setCourses] = useState([]);
  const [editingId,setEditingId] = useState(null);

  const [form,setForm] = useState({
    course_name:"",
    provider:"",
    course_url:"",
    completion_date:""
  });

  const load = async ()=>{

    const res = await api.get("/courses");
    setCourses(res.data);

  };

  useEffect(()=>{
    load();
  },[]);

  const submit = async (e)=>{

    e.preventDefault();

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

    load();

  };

  const edit = (c)=>{

    setEditingId(c.id);

    setForm({
      course_name:c.course_name,
      provider:c.provider,
      course_url:c.course_url,
      completion_date:c.completion_date?.substring(0,10)
    });

  };

  const remove = async(id)=>{

    await api.delete(`/courses/${id}`);
    load();

  };

  return (

    <div className="border p-6 rounded space-y-4">

      <h2 className="text-xl font-semibold">
        Courses
      </h2>

      <form onSubmit={submit} className="space-y-2">

        <input
        placeholder="Course"
        className="border p-2 w-full"
        value={form.course_name}
        onChange={(e)=>setForm({...form,course_name:e.target.value})}
        />

        <input
        placeholder="Provider"
        className="border p-2 w-full"
        value={form.provider}
        onChange={(e)=>setForm({...form,provider:e.target.value})}
        />

        <input
        placeholder="Course URL"
        className="border p-2 w-full"
        value={form.course_url}
        onChange={(e)=>setForm({...form,course_url:e.target.value})}
        />

        <input
        type="date"
        className="border p-2 w-full"
        value={form.completion_date}
        onChange={(e)=>setForm({...form,completion_date:e.target.value})}
        />

        <button className="bg-green-600 text-white px-3 py-1 rounded">
          {editingId ? "Update Course" : "Add Course"}
        </button>

      </form>

      {courses.map(c=>(
        <div key={c.id} className="flex justify-between border p-2 rounded">

          <span>{c.course_name} - {c.provider}</span>

          <div className="space-x-2">

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

    </div>

  );

};

export default CoursesSection;