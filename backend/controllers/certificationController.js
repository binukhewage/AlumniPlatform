import CertificationService from "../services/certificationService.js";

class CertificationController {

  static async addCertification(req,res){

    try{

      const userId = req.user.userId;

      const result = await CertificationService.addCertification(
        userId,
        req.body
      );

      res.status(201).json(result);

    }catch(error){

      res.status(400).json({error:error.message});

    }
  }

  static async getCertifications(req,res){

    const userId = req.user.userId;

    const certs = await CertificationService.getCertifications(userId);

    res.json(certs);
  }

  static async deleteCertification(req,res){

    const result = await CertificationService.deleteCertification(
      req.params.id
    );

    res.json(result);
  }

}

export default CertificationController;