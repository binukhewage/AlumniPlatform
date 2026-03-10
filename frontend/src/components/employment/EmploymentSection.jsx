import { useEffect,useState } from "react";
import api from "../../api/axios";

const EmploymentSection = () => {

  const [jobs,setJobs] = useState([]);
  const [editingId,setEditingId] = useState(null);

  const [form,setForm] = useState({
    company:"",
    position:"",
    start_date:"",
    end_date:""
  });

  const load = async ()=>{

    const res = await api.get("/employment");
    setJobs(res.data);

  };

  useEffect(()=>{
    load();
  },[]);

  const submit = async (e)=>{

    e.preventDefault();

    if(editingId){

      await api.put(`/employment/${editingId}`,form);

    }else{

      await api.post("/employment",form);

    }

    setEditingId(null);

    setForm({
      company:"",
      position:"",
      start_date:"",
      end_date:""
    });

    load();

  };

  const edit = (job)=>{

    setEditingId(job.id);

    setForm({
      company:job.company,
      position:job.position,
      start_date:job.start_date?.substring(0,10),
      end_date:job.end_date?.substring(0,10)
    });

  };

  const remove = async(id)=>{

    await api.delete(`/employment/${id}`);
    load();

  };

  return (

    <div className="border p-6 rounded space-y-4">

      <h2 className="text-xl font-semibold">
        Employment History
      </h2>

      <form onSubmit={submit} className="space-y-2">

        <input
        placeholder="Company"
        className="border p-2 w-full"
        value={form.company}
        onChange={(e)=>setForm({...form,company:e.target.value})}
        />

        <input
        placeholder="Position"
        className="border p-2 w-full"
        value={form.position}
        onChange={(e)=>setForm({...form,position:e.target.value})}
        />

        <input
        type="date"
        className="border p-2 w-full"
        value={form.start_date}
        onChange={(e)=>setForm({...form,start_date:e.target.value})}
        />

        <input
        type="date"
        className="border p-2 w-full"
        value={form.end_date}
        onChange={(e)=>setForm({...form,end_date:e.target.value})}
        />

        <button className="bg-green-600 text-white px-3 py-1 rounded">
          {editingId ? "Update Job" : "Add Job"}
        </button>

      </form>

      {jobs.map(j=>(
        <div key={j.id} className="flex justify-between border p-2 rounded">

          <span>{j.company} - {j.position}</span>

          <div className="space-x-2">

            <button
            onClick={()=>edit(j)}
            className="text-blue-500"
            >
              Edit
            </button>

            <button
            onClick={()=>remove(j.id)}
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

export default EmploymentSection;