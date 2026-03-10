import DegreeModel from "../models/degreeModel.js";
import ProfileModel from "../models/profileModel.js";

class DegreeService {

  static async addDegree(userId, data) {

    const profile = await ProfileModel.getProfileByUser(userId);

    if (!profile) {
      throw new Error("Profile not found");
    }

    const urlRegex = /^(https?:\/\/)/;

    if (!urlRegex.test(data.degree_url)) {
      throw new Error("Invalid degree URL");
    }

    const degreeId = await DegreeModel.addDegree(profile.id, data);

    return { degreeId };
  }

  static async getDegrees(userId) {

    const profile = await ProfileModel.getProfileByUser(userId);

    return DegreeModel.getDegrees(profile.id);
  }

  static async updateDegree(id, data) {

    await DegreeModel.updateDegree(id, data);

    return { message: "Degree updated" };
  }

  static async deleteDegree(id) {

    await DegreeModel.deleteDegree(id);

    return { message: "Degree deleted" };
  }
}

export default DegreeService;