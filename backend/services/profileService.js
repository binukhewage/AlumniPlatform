import ProfileModel from "../models/profileModel.js";

class ProfileService {

  static async createProfile(userId, data) {

    if (data.linkedin_url) {
      const urlRegex = /^(https?:\/\/)/;

      if (!urlRegex.test(data.linkedin_url)) {
        throw new Error("Invalid LinkedIn URL");
      }
    }

    const profileId = await ProfileModel.createProfile(userId, data);

    return { profileId };
  }

  static async getProfile(userId) {

    const profile = await ProfileModel.getProfileByUser(userId);

    return profile;
  }

  static async updateProfile(userId, data) {

    await ProfileModel.updateProfile(userId, data);

    return { message: "Profile updated" };
  }

  static async deleteProfile(userId) {

    await ProfileModel.deleteProfile(userId);

    return { message: "Profile deleted" };
  }
}

export default ProfileService;