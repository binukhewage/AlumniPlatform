import BidService from "../services/bidService.js";

class BidController {

// PLace BID 
  static async placeBid(req,res){

    try{

      const userId=req.user.userId;

      const {bid_amount}=req.body;

      const result=await BidService.placeBid(userId,bid_amount);

      res.status(201).json(result);

    }catch(error){

      res.status(400).json({error:error.message});

    }

  }

  // UPDATE BID (ONLY NICREASING IS ALLWED)

  static async updateBid(req,res){

    try{

      const userId=req.user.userId;

      const {bid_amount}=req.body;

      const result=await BidService.updateBid(
        userId,
        req.params.id,
        bid_amount
      );

      res.json(result);

    }catch(error){

      res.status(400).json({error:error.message});

    }

  }


  //  GET BID details of the logged in user 

  static async getMyBid(req,res){

    try{

      const userId = req.user.userId;

      const bid = await BidService.getMyBid(userId);

      res.json(bid);

    }catch(error){

      res.status(400).json({error:error.message});

    }

  }

  //Get bid history 

  static async getBidHistory(req, res) {
    try {
      const userId = req.user.userId;
  
      const bids = await BidService.getBidHistory(userId);
  
      res.json(bids);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Cancel BID 
  static async cancelBid(req, res) {
    try {
      const userId = req.user.id || req.user.userId;
  
      const result = await BidService.cancelBid(
        userId,
        req.params.id
      );
  
      res.json(result);
  
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

}

export default BidController;