import { useEffect,useState } from "react";
import api from "../../api/axios";

const DegreesSection = () => {

  const [degrees,setDegrees] = useState([]);

  const [form,setForm] = useState({
    degree_name:"",
    university:"",
    degree_url:"",
    completion_date:""
  });

  const loadDegrees = async ()=>{

    const res = await api.get("/degrees");
    setDegrees(res.data);

  };

  useEffect(()=>{
    loadDegrees();
  },[]);

  const addDegree = async (e)=>{

    e.preventDefault();

    await api.post("/degrees",form);

    loadDegrees();

  };

  const deleteDegree = async(id)=>{

    await api.delete(`/degrees/${id}`);

    loadDegrees();

  };

  return (

    <div className="border p-6 rounded space-y-4">

      <h2 className="text-xl font-semibold">
        Degrees
      </h2>

      <form onSubmit={addDegree} className="space-y-2">

        <input
        placeholder="Degree"
        className="border p-2 w-full"
        onChange={(e)=>setForm({...form,degree_name:e.target.value})}
        />

        <input
        placeholder="University"
        className="border p-2 w-full"
        onChange={(e)=>setForm({...form,university:e.target.value})}
        />

        <input
        placeholder="URL"
        className="border p-2 w-full"
        onChange={(e)=>setForm({...form,degree_url:e.target.value})}
        />

        <input
        type="date"
        className="border p-2 w-full"
        onChange={(e)=>setForm({...form,completion_date:e.target.value})}
        />

        <button className="bg-green-600 text-white px-3 py-1 rounded">
          Add Degree
        </button>

      </form>

      <div className="space-y-2">

        {degrees.map(d=>(

          <div
          key={d.id}
          className="flex justify-between border p-2 rounded"
          >

            <span>
              {d.degree_name} - {d.university}
            </span>

            <button
            onClick={()=>deleteDegree(d.id)}
            className="text-red-500"
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>

  );

};

export default DegreesSection;