import { useEffect, useState } from "react";
import api from "../../api/axios";

const CertificationsSection = () => {

  const [certs,setCerts] = useState([]);
  const [editingId,setEditingId] = useState(null);
  const [showForm,setShowForm] = useState(false);

  const [form,setForm] = useState({
    certification_name:"",
    organisation:"",
    cert_url:"",
    completion_date:""
  });

  const loadCerts = async () => {

    try{

      const res = await api.get("/certifications");

      const sorted = res.data.sort((a,b)=> b.id - a.id);

      setCerts(sorted);

    }catch(err){

      console.log("LOAD ERROR:", err.response?.data || err);

    }

  };

  useEffect(()=>{
    loadCerts();
  },[]);

  const submit = async (e)=>{

    e.preventDefault();

    if(!form.certification_name || !form.organisation || !form.completion_date){
      alert("Please fill all required fields");
      return;
    }

    try{

      if(editingId){

        await api.put(`/certifications/${editingId}`,form);

      }else{

        await api.post("/certifications",form);

      }

      setEditingId(null);

      setForm({
        certification_name:"",
        organisation:"",
        cert_url:"",
        completion_date:""
      });

      setShowForm(false);

      loadCerts();

    }catch(err){

      console.log("ADD ERROR:", err.response?.data || err);

      alert(err.response?.data?.error || "Failed to add certification");

    }

  };

  const edit = (c)=>{

    setEditingId(c.id);
    setShowForm(true);

    setForm({
      certification_name:c.certification_name,
      organisation:c.organisation,
      cert_url:c.cert_url || "",
      completion_date:c.completion_date?.substring(0,10)
    });

  };

  const remove = async(id)=>{

    try{

      await api.delete(`/certifications/${id}`);
      loadCerts();

    }catch(err){

      console.log("DELETE ERROR:", err.response?.data || err);

    }

  };

  return (

    <div className="border p-6 rounded space-y-4">

      <div className="flex justify-between items-center">

        <h2 className="text-xl font-semibold">
          Certifications
        </h2>

        {!showForm && (
          <button
          onClick={()=>setShowForm(true)}
          className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Add Certification
          </button>
        )}

      </div>

      {/* CERT LIST */}

      {certs.map(c=>(

        <div
        key={c.id}
        className="flex justify-between border p-3 rounded"
        >

          <div>

            <p className="font-semibold">
              {c.certification_name}
            </p>

            <p className="text-sm text-gray-600">
              {c.organisation}
            </p>

            <p className="text-xs text-gray-500">
              {c.completion_date?.substring(0,10)}
            </p>

            {c.cert_url && (
              <a
              href={c.cert_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 text-sm"
              >
                View Certificate
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
          placeholder="Certification Name"
          required
          className="border p-2 w-full"
          value={form.certification_name}
          onChange={(e)=>setForm({...form,certification_name:e.target.value})}
          />

          <input
          placeholder="Organisation"
          required
          className="border p-2 w-full"
          value={form.organisation}
          onChange={(e)=>setForm({...form,organisation:e.target.value})}
          />

          <input
          type="url"
          required
          placeholder="Certificate URL"
          className="border p-2 w-full"
          value={form.cert_url}
          onChange={(e)=>setForm({...form,cert_url:e.target.value})}
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
              {editingId ? "Update Certification" : "Add Certification"}
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

export default CertificationsSection;