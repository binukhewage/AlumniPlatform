import db from "../config/db.js";

class CourseModel {

  static async createCourse(profileId, course){

    const { course_name, provider, course_url, completion_date } = course;

    const [result] = await db.execute(
      `INSERT INTO courses
      (profile_id, course_name, provider, course_url, completion_date)
      VALUES (?,?,?,?,?)`,
      [profileId, course_name, provider, course_url, completion_date]
    );

    return result.insertId;

  }

  static async getCourses(profileId){

    const [rows] = await db.execute(
      `SELECT * FROM courses
       WHERE profile_id = ?
       ORDER BY id DESC`,
      [profileId]
    );

    return rows;

  }

  static async updateCourse(id, course){

    const { course_name, provider, course_url, completion_date } = course;

    await db.execute(
      `UPDATE courses
       SET course_name=?, provider=?, course_url=?, completion_date=?
       WHERE id=?`,
      [course_name, provider, course_url, completion_date, id]
    );

  }

  static async deleteCourse(id){

    await db.execute(
      `DELETE FROM courses WHERE id=?`,
      [id]
    );

  }

}

export default CourseModel;