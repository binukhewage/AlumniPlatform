import { useEffect, useState } from "react";
import api from "../../api/axios";

const CertificationsSection = () => {

  const [certs,setCerts] = useState([]);
  const [editingId,setEditingId] = useState(null);

  const [form,setForm] = useState({
    certification_name:"",
    organisation:"",
    cert_url:"",
    completion_date:""
  });

  const loadCerts = async () => {

    const res = await api.get("/certifications");
    setCerts(res.data);

  };

  useEffect(()=>{
    loadCerts();
  },[]);

  const submit = async (e)=>{

    e.preventDefault();

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

    loadCerts();

  };

  const edit = (c)=>{

    setEditingId(c.id);

    setForm({
      certification_name:c.certification_name,
      organisation:c.organisation,
      cert_url:c.cert_url,
      completion_date:c.completion_date?.substring(0,10)
    });

  };

  const remove = async(id)=>{

    await api.delete(`/certifications/${id}`);
    loadCerts();

  };

  return (

    <div className="border p-6 rounded space-y-4">

      <h2 className="text-xl font-semibold">
        Certifications
      </h2>

      <form onSubmit={submit} className="space-y-2">

        <input
        placeholder="Certification"
        className="border p-2 w-full"
        value={form.certification_name}
        onChange={(e)=>setForm({...form,certification_name:e.target.value})}
        />

        <input
        placeholder="Organisation"
        className="border p-2 w-full"
        value={form.organisation}
        onChange={(e)=>setForm({...form,organisation:e.target.value})}
        />

        <input
        placeholder="Certificate URL"
        className="border p-2 w-full"
        value={form.cert_url}
        onChange={(e)=>setForm({...form,cert_url:e.target.value})}
        />

        <input
        type="date"
        className="border p-2 w-full"
        value={form.completion_date}
        onChange={(e)=>setForm({...form,completion_date:e.target.value})}
        />

        <button className="bg-green-600 text-white px-3 py-1 rounded">
          {editingId ? "Update Certification" : "Add Certification"}
        </button>

      </form>

      {certs.map(c=>(
        <div key={c.id} className="flex justify-between border p-2 rounded">

          <span>{c.certification_name} - {c.organisation}</span>

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

export default CertificationsSection;