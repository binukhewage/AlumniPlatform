import express from "express";
import db from "../config/db.js";

const router = express.Router();

/**
 * @swagger
 * /public/featured:
 *   get:
 *     summary: Get today's featured alumnus (Alumni of the Day)
 *     tags: [Public API]
 *     responses:
 *       200:
 *         description: Returns the featured alumnus profile or message if none exists
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     full_name:
 *                       type: string
 *                       example: John Smith
 *                     bio:
 *                       type: string
 *                     linkedin_url:
 *                       type: string
 *                     profile_image:
 *                       type: string
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: No featured alumnus today
 */
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