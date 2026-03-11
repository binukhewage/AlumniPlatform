import EmploymentService from "../services/employmentService.js";

class EmploymentController {

  static async addJob(req,res){

    try{

      const userId = req.user.userId;

      const result = await EmploymentService.addJob(userId, req.body);

      res.status(201).json(result);

    }catch(error){

      res.status(400).json({ error: error.message });

    }

  }

  static async getJobs(req,res){

    const userId = req.user.userId;

    const jobs = await EmploymentService.getJobs(userId);

    res.json(jobs);

  }

  static async updateJob(req,res){

    const result = await EmploymentService.updateJob(
      req.params.id,
      req.body
    );

    res.json(result);

  }

  static async deleteJob(req,res){

    const result = await EmploymentService.deleteJob(
      req.params.id
    );

    res.json(result);

  }

}

export default EmploymentController;