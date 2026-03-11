import db from "../config/db.js";
import CourseModel from "../models/courseModel.js";

class CourseService {

  static async addCourse(userId, data){

    // get profile id using user id
    const [profile] = await db.execute(
      "SELECT id FROM profiles WHERE user_id=?",
      [userId]
    );

    if(profile.length === 0){
      throw new Error("Profile not found");
    }

    const profileId = profile[0].id;

    const id = await CourseModel.createCourse(profileId, data);

    return { id };

  }

  static async getCourses(userId){

    const [profile] = await db.execute(
      "SELECT id FROM profiles WHERE user_id=?",
      [userId]
    );

    if(profile.length === 0){
      throw new Error("Profile not found");
    }

    const profileId = profile[0].id;

    return await CourseModel.getCourses(profileId);

  }

  static async updateCourse(id, data){

    await CourseModel.updateCourse(id, data);

    return { message: "Course updated" };

  }

  static async deleteCourse(id){

    await CourseModel.deleteCourse(id);

    return { message: "Course deleted" };

  }

}

export default CourseService;