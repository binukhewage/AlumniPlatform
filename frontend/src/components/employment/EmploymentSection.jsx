import { useEffect, useState } from "react";
import api from "../../api/axios";

const EmploymentSection = () => {

  const [jobs,setJobs] = useState([]);
  const [editingId,setEditingId] = useState(null);
  const [showForm,setShowForm] = useState(false);

  const [form,setForm] = useState({
    company:"",
    position:"",
    start_date:"",
    end_date:""
  });

  const load = async () => {
    const res = await api.get("/employment");

    // newest first
    const sorted = res.data.sort((a,b)=> b.id - a.id);

    setJobs(sorted);
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

    setShowForm(false);

    load();
  };

  const edit = (job)=>{

    setEditingId(job.id);
    setShowForm(true);

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

      <div className="flex justify-between items-center">

        <h2 className="text-xl font-semibold">
          Employment History
        </h2>

        {!showForm && (
          <button
            onClick={()=>setShowForm(true)}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Add Job
          </button>
        )}

      </div>

      {/* JOB LIST */}

      {jobs.map(j=>(
        <div key={j.id} className="flex justify-between border p-3 rounded">

          <div>

            <p className="font-semibold">
              {j.company}
            </p>

            <p className="text-sm text-gray-600">
              {j.position}
            </p>

            <p className="text-xs text-gray-500">
              {j.start_date?.substring(0,10)} - {j.end_date?.substring(0,10)}
            </p>

          </div>

          <div className="space-x-3">

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

      {/* FORM */}

      {showForm && (

        <form onSubmit={submit} className="space-y-2 border-t pt-4">

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

          <div className="flex gap-2">

            <button className="bg-blue-600 text-white px-4 py-1 rounded">
              {editingId ? "Update Job" : "Add Job"}
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

export default EmploymentSection;