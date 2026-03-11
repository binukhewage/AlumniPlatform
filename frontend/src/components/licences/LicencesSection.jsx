import { useEffect, useState } from "react";
import api from "../../api/axios";

const LicencesSection = () => {

  const [licences,setLicences] = useState([]);
  const [editingId,setEditingId] = useState(null);
  const [showForm,setShowForm] = useState(false);

  const [form,setForm] = useState({
    licence_name:"",
    authority:"",
    licence_url:"",
    completion_date:""
  });

  const loadLicences = async () => {

    try{

      const res = await api.get("/licences");

      const sorted = res.data.sort((a,b)=> b.id - a.id);

      setLicences(sorted);

    }catch(err){

      console.log("LOAD LICENCES ERROR:",err);

    }

  };

  useEffect(()=>{
    loadLicences();
  },[]);

  const submit = async (e)=>{

    e.preventDefault();

    if(!form.licence_name || !form.authority || !form.completion_date){
      alert("Please fill all required fields");
      return;
    }

    try{

      if(editingId){

        await api.put(`/licences/${editingId}`,form);

      }else{

        await api.post("/licences",form);

      }

      setEditingId(null);

      setForm({
        licence_name:"",
        authority:"",
        licence_url:"",
        completion_date:""
      });

      setShowForm(false);

      loadLicences();

    }catch(err){

      console.log("ADD LICENCE ERROR:",err.response?.data || err);

      alert(err.response?.data?.error || "Failed to add licence");

    }

  };

  const edit = (licence)=>{

    setEditingId(licence.id);
    setShowForm(true);

    setForm({
      licence_name:licence.licence_name,
      authority:licence.authority,
      licence_url:licence.licence_url || "",
      completion_date:licence.completion_date?.substring(0,10)
    });

  };

  const remove = async(id)=>{

    try{

      await api.delete(`/licences/${id}`);

      loadLicences();

    }catch(err){

      console.log("DELETE LICENCE ERROR:",err);

    }

  };

  return (

    <div className="border p-6 rounded space-y-4">

      <div className="flex justify-between items-center">

        <h2 className="text-xl font-semibold">
          Licences
        </h2>

        {!showForm && (
          <button
            onClick={()=>setShowForm(true)}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Add Licence
          </button>
        )}

      </div>

      {/* LICENCE LIST */}

      {licences.map(l=>(
        <div
          key={l.id}
          className="flex justify-between border p-3 rounded"
        >

          <div>

            <p className="font-semibold">
              {l.licence_name}
            </p>

            <p className="text-sm text-gray-600">
              {l.authority}
            </p>

            <p className="text-xs text-gray-500">
              {l.completion_date?.substring(0,10)}
            </p>

            {l.licence_url && (
              <a
                href={l.licence_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 text-sm"
              >
                View Licence
              </a>
            )}

          </div>

          <div className="space-x-3">

            <button
              onClick={()=>edit(l)}
              className="text-blue-500"
            >
              Edit
            </button>

            <button
              onClick={()=>remove(l.id)}
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
            placeholder="Licence Name"
            required
            className="border p-2 w-full"
            value={form.licence_name}
            onChange={(e)=>setForm({...form,licence_name:e.target.value})}
          />

          <input
            placeholder="Authority"
            required
            className="border p-2 w-full"
            value={form.authority}
            onChange={(e)=>setForm({...form,authority:e.target.value})}
          />

          <input
            placeholder="Licence URL"
            className="border p-2 w-full"
            value={form.licence_url}
            onChange={(e)=>setForm({...form,licence_url:e.target.value})}
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
              {editingId ? "Update Licence" : "Add Licence"}
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

export default LicencesSection;