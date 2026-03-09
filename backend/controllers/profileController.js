import ProfileService from "../services/profileService.js";

class ProfileController {

  static async createProfile(req, res) {

    try {

      const userId = req.user.userId;

      const data = {
        full_name: req.body.full_name,
        bio: req.body.bio,
        linkedin_url: req.body.linkedin_url,
        profile_image: req.file ? req.file.filename : null
      };

      const result = await ProfileService.createProfile(userId, data);

      res.status(201).json(result);

    } catch (error) {

      res.status(400).json({
        error: error.message
      });

    }
  }

  static async getProfile(req, res) {

    try {

      const userId = req.user.userId;

      const profile = await ProfileService.getProfile(userId);

      res.json(profile);

    } catch (error) {

      res.status(400).json({
        error: error.message
      });

    }
  }

  static async updateProfile(req, res) {

    try {

      const userId = req.user.userId;

      const data = {
        full_name: req.body.full_name,
        bio: req.body.bio,
        linkedin_url: req.body.linkedin_url,
        profile_image: req.file ? req.file.filename : null
      };

      const result = await ProfileService.updateProfile(userId, data);

      res.json(result);

    } catch (error) {

      res.status(400).json({
        error: error.message
      });

    }
  }

  static async deleteProfile(req, res) {

    try {

      const userId = req.user.userId;

      const result = await ProfileService.deleteProfile(userId);

      res.json(result);

    } catch (error) {

      res.status(400).json({
        error: error.message
      });

    }
  }
}

export default ProfileController;