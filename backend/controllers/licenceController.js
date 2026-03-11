import LicenceService from "../services/licenceService.js";

class LicenceController {

  static async addLicence(req,res){

    try{

      const userId = req.user.userId;

      const result = await LicenceService.addLicence(userId,req.body);

      res.status(201).json(result);

    }catch(err){

      res.status(400).json({error:err.message});

    }

  }

  static async getLicences(req,res){

    const userId = req.user.userId;

    const licences = await LicenceService.getLicences(userId);

    res.json(licences);

  }

  static async updateLicence(req,res){

    const result = await LicenceService.updateLicence(
      req.params.id,
      req.body
    );

    res.json(result);

  }

  static async deleteLicence(req,res){

    const result = await LicenceService.deleteLicence(
      req.params.id
    );

    res.json(result);

  }

}

export default LicenceController;