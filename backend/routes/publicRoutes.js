import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/featured", async (req, res) => {

  try{

    const [rows] = await db.execute(`
      SELECT 
        p.full_name,
        p.bio,
        p.linkedin_url,
        CONCAT('http://localhost:8080/uploads/',p.profile_image) AS profile_image
      FROM featured_alumni f
      JOIN profiles p ON f.profile_id = p.id
      WHERE f.feature_date = CURDATE()
      LIMIT 1
    `);

    if(rows.length === 0){
      return res.json({
        message:"No featured alumnus today"
      });
    }

    res.json(rows[0]);

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }

});

export default router;