import { useEffect,useState } from "react";
import api from "../../api/axios";

const LicencesSection = () => {

  const [items,setItems] = useState([]);
  const [editingId,setEditingId] = useState(null);

  const [form,setForm] = useState({
    licence_name:"",
    authority:"",
    licence_url:"",
    completion_date:""
  });

  const load = async ()=>{

    const res = await api.get("/licenses");
    setItems(res.data);

  };

  useEffect(()=>{
    load();
  },[]);

  const submit = async (e)=>{

    e.preventDefault();

    if(editingId){

      await api.put(`/licenses/${editingId}`,form);

    }else{

      await api.post("/licenses",form);

    }

    setEditingId(null);
    setForm({
      licence_name:"",
      authority:"",
      licence_url:"",
      completion_date:""
    });

    load();

  };

  const edit = (item)=>{

    setEditingId(item.id);

    setForm({
      licence_name:item.licence_name,
      authority:item.authority,
      licence_url:item.licence_url,
      completion_date:item.completion_date?.substring(0,10)
    });

  };

  const remove = async(id)=>{

    await api.delete(`/licenses/${id}`);
    load();

  };

  return (

    <div className="border p-6 rounded space-y-4">

      <h2 className="text-xl font-semibold">Licences</h2>

      <form onSubmit={submit} className="space-y-2">

        <input
        placeholder="Licence"
        className="border p-2 w-full"
        value={form.licence_name}
        onChange={(e)=>setForm({...form,licence_name:e.target.value})}
        />

        <input
        placeholder="Authority"
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
        className="border p-2 w-full"
        value={form.completion_date}
        onChange={(e)=>setForm({...form,completion_date:e.target.value})}
        />

        <button className="bg-green-600 text-white px-3 py-1 rounded">
          {editingId ? "Update Licence" : "Add Licence"}
        </button>

      </form>

      {items.map(i=>(
        <div key={i.id} className="flex justify-between border p-2 rounded">

          <span>{i.licence_name} - {i.authority}</span>

          <div className="space-x-2">

            <button
            onClick={()=>edit(i)}
            className="text-blue-500"
            >
              Edit
            </button>

            <button
            onClick={()=>remove(i.id)}
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

export default LicencesSection;