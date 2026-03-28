import db from "../config/db.js";

class ApiKeyModel {

  //  CREATE API KEY
  static async create(name, key) {
    const [result] = await db.execute(
      "INSERT INTO api_keys (name, key_value) VALUES (?, ?)",
      [name, key]
    );

    return result.insertId;
  }

  //  LIST API KEYS (CLEAN)
  static async getAll() {
    const [rows] = await db.execute(
      `SELECT 
         id, 
         name, 
         created_at 
       FROM api_keys`
    );
    return rows;
  }

  //  FIND BY KEY (FOR MIDDLEWARE)
  static async findByKey(key) {
    const [rows] = await db.execute(
      "SELECT * FROM api_keys WHERE key_value = ? AND is_active = TRUE",
      [key]
    );
    return rows[0];
  }

  // INCREMENT USAGE + LAST USED
  static async incrementUsage(id) {
    await db.execute(
      `UPDATE api_keys 
       SET usage_count = usage_count + 1,
           last_used = NOW()
       WHERE id = ?`,
      [id]
    );
  }

  // REVOKE KEY
  static async revoke(id) {
    await db.execute(
      `UPDATE api_keys
       SET is_active = 0,
           revoked_at = NOW()
       WHERE id = ?`,
      [id]
    );
  }

  // GET KEY STATISTICS (NEW FEATURE)
  static async getKeyStats(id) {
    const [rows] = await db.execute(
      `SELECT 
         id,
         name,
         key_value,
         is_active,
         usage_count,
         created_at,
         revoked_at,
         last_used
       FROM api_keys
       WHERE id = ?`,
      [id]
    );

    return rows[0];
  }

}

export default ApiKeyModel;