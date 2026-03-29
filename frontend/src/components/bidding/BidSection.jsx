import { useEffect, useState } from "react";
import api from "../../api/axios";

const BidSection = () => {
  const [bid, setBid] = useState(null);
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const loadBid = async () => {
    try {
      const res = await api.get("/bids/my-bid");
  
      // FIX: detect no active bid properly
      if (res.data.message) {
        setBid(null);
        setStatus("");
      } else {
        setBid(res.data);
        setStatus(res.data.status);
      }
  
    } catch {
      setBid(null);
      setStatus("");
    }
  };

  const placeBid = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/bids", { bid_amount: amount });
      setStatus(res.data.status);
      setAmount("");
      loadBid();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to place bid");
    } finally {
      setLoading(false);
    }
  };

  const increaseBid = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put(`/bids/${bid.id}`, { bid_amount: amount });
      setStatus(res.data.status);
      setAmount("");
      loadBid();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to increase bid");
    } finally {
      setLoading(false);
    }
  };

  // NEW: cancel bid
  const cancelBid = async () => {
    if (!bid) return;

    setLoading(true);
    try {
      await api.delete(`/bids/${bid.id}`);
      setBid(null);
      setStatus("");
      loadBid();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to cancel bid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Daily Alumni Bid</h2>
          <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mt-1">
            Featured Spotlight Auction
          </p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 uppercase">
          Ends at 6:00 PM
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* LEFT COLUMN: STATUS DISPLAY */}
        <div className={`p-5 rounded-2xl border transition-all ${
          bid 
            ? (status === "winning" ? "bg-green-50 border-green-100" : "bg-orange-50 border-orange-100") 
            : "bg-slate-50 border-slate-100"
        }`}>
          {!bid ? (
            <div className="text-center py-4">
              <p className="text-slate-500 text-sm">You haven't placed a bid for tomorrow's spotlight yet.</p>
            </div>
          ) : (
            <div className="space-y-3 text-center md:text-left">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Your Current Stake</span>
                <span className="text-3xl font-black text-slate-800">£{bid.bid_amount}</span>
              </div>
              <div className="pt-2 border-t border-white/50">
                <span className="text-xs font-bold text-slate-400 uppercase">Current Standing</span>
                <div className={`text-lg font-bold flex items-center justify-center md:justify-start gap-2 capitalize ${
                  status === "winning" ? "text-green-600" : "text-orange-600"
                }`}>
                  <span className={`w-2 h-2 rounded-full animate-pulse ${status === "winning" ? "bg-green-500" : "bg-orange-500"}`}></span>
                  {status}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ACTION FORM */}
        <div className="space-y-4">
          <form onSubmit={bid ? increaseBid : placeBid} className="space-y-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">£</span>
              <input
                type="number"
                placeholder={bid ? "New bid amount..." : "Enter bid amount..."}
                className="w-full pl-8 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-md active:scale-95
                ${bid 
                  ? "bg-slate-800 hover:bg-slate-900" 
                  : "bg-blue-700 hover:bg-blue-800"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Processing..." : bid ? "Update My Bid" : "Join the Auction"}
            </button>

            {/* NEW: cancel button */}
            {bid && (
              <button
                type="button"
                onClick={cancelBid}
                disabled={loading}
                className="w-full py-2 rounded-xl font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-all"
              >
                Cancel My Bid
              </button>
            )}
          </form>
          
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
             <p className="text-[11px] leading-relaxed text-slate-500 italic">
               The highest bidder at 6:00 PM will be featured as the **Alumni of the Day** on the main dashboard for the next 24 hours.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidSection;