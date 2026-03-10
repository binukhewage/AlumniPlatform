import CertificationModel from "../models/certificationModel.js";
import ProfileModel from "../models/profileModel.js";

class CertificationService {

  static async addCertification(userId, data) {

    const profile = await ProfileModel.getProfileByUser(userId);

    const certId = await CertificationModel.addCertification(
      profile.id,
      data
    );

    return { certificationId: certId };
  }

  static async getCertifications(userId) {

    const profile = await ProfileModel.getProfileByUser(userId);

    return CertificationModel.getCertifications(profile.id);
  }

  static async deleteCertification(id) {

    await CertificationModel.deleteCertification(id);

    return { message: "Certification deleted" };
  }
}

export default CertificationService;