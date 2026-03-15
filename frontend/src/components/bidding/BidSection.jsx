import { useEffect, useState } from "react";
import api from "../../api/axios";

const BidSection = () => {

  const [bid,setBid] = useState(null);
  const [amount,setAmount] = useState("");
  const [status,setStatus] = useState("");
  const [loading,setLoading] = useState(false);

  const loadBid = async () => {

    try{

      const res = await api.get("/bids/my-bid");
      setBid(res.data);
      setStatus(res.data.status);

    }catch{

      setBid(null);

    }

  };

  useEffect(()=>{
    loadBid();
  },[]);

  const placeBid = async (e)=>{

    e.preventDefault();

    try{

      setLoading(true);

      const res = await api.post("/bids",{
        bid_amount:amount
      });

      setStatus(res.data.status);
      setAmount("");

      loadBid();

    }catch(err){

      alert(err.response?.data?.error);

    }

    setLoading(false);

  };

  const increaseBid = async (e)=>{

    e.preventDefault();

    try{

      setLoading(true);

      const res = await api.put(`/bids/${bid.id}`,{
        bid_amount:amount
      });

      setStatus(res.data.status);
      setAmount("");

      loadBid();

    }catch(err){

      alert(err.response?.data?.error);

    }

    setLoading(false);

  };

  return (

    <div className="border p-6 rounded space-y-4">

      <h2 className="text-xl font-semibold">
        Daily Alumni Bid
      </h2>

      {/* CURRENT BID */}

      {bid && (

        <div className="border p-3 rounded">

          <p>
            Current Bid: <b>£{bid.bid_amount}</b>
          </p>

          <p>
            Status: 
            <span className={
              status === "winning"
                ? "text-green-600 font-semibold"
                : "text-red-600 font-semibold"
            }>
              {" "} {status}
            </span>
          </p>

        </div>

      )}

      {/* PLACE BID */}

      {!bid && (

        <form onSubmit={placeBid} className="space-y-2">

          <input
          type="number"
          placeholder="Enter Bid Amount"
          className="border p-2 w-full"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
          required
          />

          <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Place Bid
          </button>

        </form>

      )}

      {/* INCREASE BID */}

      {bid && (

        <form onSubmit={increaseBid} className="space-y-2">

          <input
          type="number"
          placeholder="Increase your bid"
          className="border p-2 w-full"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
          required
          />

          <button
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Increase Bid
          </button>

        </form>

      )}

      <p className="text-sm text-gray-500">
        Highest bid wins at 6PM daily. Winner becomes Alumni of the Day tomorrow.
      </p>

    </div>

  );

};

export default BidSection;