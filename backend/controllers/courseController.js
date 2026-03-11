import CourseService from "../services/courseService.js";

class CourseController {

  static async addCourse(req,res){

    try{

      const userId = req.user.userId;

      const result = await CourseService.addCourse(userId, req.body);

      res.status(201).json(result);

    }catch(error){

      res.status(400).json({ error: error.message });

    }

  }

  static async getCourses(req,res){

    const userId = req.user.userId;

    const courses = await CourseService.getCourses(userId);

    res.json(courses);

  }

  static async updateCourse(req,res){

    const result = await CourseService.updateCourse(
      req.params.id,
      req.body
    );

    res.json(result);

  }

  static async deleteCourse(req,res){

    const result = await CourseService.deleteCourse(
      req.params.id
    );

    res.json(result);

  }

}

export default CourseController;