import crypto from "crypto";
import ApiKeyModel from "../models/apiKeyModel.js";

class ApiKeyService {

  //  GENERATE KEY
  static async generateKey(name, permissions = "*") {

    // Generate a secure random key (32 bytes → hex string)
    const key = crypto.randomBytes(32).toString("hex");

    await ApiKeyModel.create(name, key, permissions);

    return { name, permissions, api_key: key };
  }

  // GET ALL KEYS (LIST)
  static async getKeys() {
    return await ApiKeyModel.getAll();
  }

  //  REVOKE KEY
  static async revokeKey(id) {
    await ApiKeyModel.revoke(id);

    return {
      message: "API key revoked successfully"
    };
  }

  // NEW — GET KEY STATS
  static async getKeyStats(id) {
    const key = await ApiKeyModel.getKeyStats(id);

    return key;
  }

}

export default ApiKeyService;