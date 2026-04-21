import AlumniModel from "../models/alumniModel.js";

class AlumniService {
  static async getAll() {
    const alumni = await AlumniModel.getAll();

    return alumni.map((item) => ({
      ...item,
      profile_image: item.profile_image
        ? `http://localhost:8080/uploads/${item.profile_image}`
        : null,
    }));
  }
}

export default AlumniService;