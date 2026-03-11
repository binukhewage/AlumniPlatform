import db from "../config/db.js";
import LicenceModel from "../models/licenceModel.js";

class LicenceService {

  static async addLicence(userId, data){

    // find profile id using user id
    const [profile] = await db.execute(
      "SELECT id FROM profiles WHERE user_id=?",
      [userId]
    );

    if(profile.length === 0){
      throw new Error("Profile not found");
    }

    const profileId = profile[0].id;

    const id = await LicenceModel.createLicence(profileId, data);

    return { id };

  }

  static async getLicences(userId){

    const [profile] = await db.execute(
      "SELECT id FROM profiles WHERE user_id=?",
      [userId]
    );

    if(profile.length === 0){
      throw new Error("Profile not found");
    }

    const profileId = profile[0].id;

    return await LicenceModel.getLicences(profileId);

  }

  static async updateLicence(id, data){

    await LicenceModel.updateLicence(id, data);

    return { message: "Licence updated" };

  }

  static async deleteLicence(id){

    await LicenceModel.deleteLicence(id);

    return { message: "Licence deleted" };

  }

}

export default LicenceService;