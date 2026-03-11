import db from "../config/db.js";
import EmploymentModel from "../models/employmentModel.js";

class EmploymentService {

  static async addJob(userId, data){

    // find profile id from user id
    const [profile] = await db.execute(
      "SELECT id FROM profiles WHERE user_id=?",
      [userId]
    );

    if(profile.length === 0){
      throw new Error("Profile not found");
    }

    const profileId = profile[0].id;

    const id = await EmploymentModel.createJob(profileId, data);

    return { id };

  }

  static async getJobs(userId){

    const [profile] = await db.execute(
      "SELECT id FROM profiles WHERE user_id=?",
      [userId]
    );

    if(profile.length === 0){
      throw new Error("Profile not found");
    }

    const profileId = profile[0].id;

    return await EmploymentModel.getJobs(profileId);

  }

  static async updateJob(id, data){

    await EmploymentModel.updateJob(id, data);

    return { message: "Job updated" };

  }

  static async deleteJob(id){

    await EmploymentModel.deleteJob(id);

    return { message: "Job deleted" };

  }

}

export default EmploymentService;