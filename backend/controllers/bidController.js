import BidService from "../services/bidService.js";

class BidController {

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


  // ⭐ NEW METHOD (for frontend)

  static async getMyBid(req,res){

    try{

      const userId = req.user.userId;

      const bid = await BidService.getMyBid(userId);

      res.json(bid);

    }catch(error){

      res.status(400).json({error:error.message});

    }

  }

}

export default BidController;