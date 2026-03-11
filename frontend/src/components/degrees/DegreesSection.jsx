import { useEffect, useState } from "react";
import api from "../../api/axios";

const DegreesSection = () => {

  const [degrees,setDegrees] = useState([]);
  const [editingId,setEditingId] = useState(null);
  const [showForm,setShowForm] = useState(false);

  const [form,setForm] = useState({
    degree_name:"",
    university:"",
    degree_url:"",
    completion_date:""
  });

  const loadDegrees = async () => {
    try{
      const res = await api.get("/degrees");
      const sorted = res.data.sort((a,b)=> b.id - a.id);
      setDegrees(sorted);
    }catch(err){
      console.log("LOAD ERROR:", err.response?.data || err);
    }
  };

  useEffect(()=>{
    loadDegrees();
  },[]);

  const submit = async (e)=>{

    e.preventDefault();

    // basic validation
    if(!form.degree_name || !form.university || !form.completion_date){
      alert("Please fill all required fields");
      return;
    }

    try{

      if(editingId){

        await api.put(`/degrees/${editingId}`,form);

      }else{

        await api.post("/degrees",form);

      }

      setEditingId(null);

      setForm({
        degree_name:"",
        university:"",
        degree_url:"",
        completion_date:""
      });

      setShowForm(false);

      loadDegrees();

    }catch(err){

      console.log("ADD ERROR:", err.response?.data || err);

      alert(err.response?.data?.error || "Failed to add degree");

    }

  };

  const edit = (degree)=>{

    setEditingId(degree.id);
    setShowForm(true);

    setForm({
      degree_name:degree.degree_name,
      university:degree.university,
      degree_url:degree.degree_url || "",
      completion_date:degree.completion_date?.substring(0,10)
    });

  };

  const remove = async(id)=>{

    try{

      await api.delete(`/degrees/${id}`);
      loadDegrees();

    }catch(err){

      console.log("DELETE ERROR:", err.response?.data || err);

    }

  };

  return (

    <div className="border p-6 rounded space-y-4">

      <div className="flex justify-between items-center">

        <h2 className="text-xl font-semibold">
          Degrees
        </h2>

        {!showForm && (
          <button
          onClick={()=>setShowForm(true)}
          className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Add Degree
          </button>
        )}

      </div>

      {/* DEGREE LIST */}

      {degrees.map(d=>(

        <div
        key={d.id}
        className="flex justify-between border p-3 rounded"
        >

          <div>

            <p className="font-semibold">
              {d.degree_name}
            </p>

            <p className="text-sm text-gray-600">
              {d.university}
            </p>

            <p className="text-xs text-gray-500">
              {d.completion_date?.substring(0,10)}
            </p>

            {d.degree_url && (
              <a
              href={d.degree_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 text-sm"
              >
                View Degree
              </a>
            )}

          </div>

          <div className="space-x-3">

            <button
            onClick={()=>edit(d)}
            className="text-blue-500"
            >
              Edit
            </button>

            <button
            onClick={()=>remove(d.id)}
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
          placeholder="Degree Name"
          required
          className="border p-2 w-full"
          value={form.degree_name}
          onChange={(e)=>setForm({...form,degree_name:e.target.value})}
          />

          <input
          placeholder="University"
          required
          className="border p-2 w-full"
          value={form.university}
          onChange={(e)=>setForm({...form,university:e.target.value})}
          />

          <input
          placeholder="Degree URL"
          className="border p-2 w-full"
          value={form.degree_url}
          onChange={(e)=>setForm({...form,degree_url:e.target.value})}
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
              {editingId ? "Update Degree" : "Add Degree"}
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

export default DegreesSection;