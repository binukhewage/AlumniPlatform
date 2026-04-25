import ApiKeyService from "../services/apiKeyService.js";

class ApiKeyController {

  // CREATE KEY (GEnerate new key for developer / user)
  static async createKey(req, res) {
    try {
      const { name, permissions } = req.body;

      const key = await ApiKeyService.generateKey(name, permissions);

      res.status(201).json(key);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // LIST KEYS (Name and created at)
  static async getKeys(req, res) {
    try {
      const keys = await ApiKeyService.getKeys();
      res.json(keys);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // REVOKE KEY
  static async revokeKey(req, res) {
    try {
      const { id } = req.params;

      await ApiKeyService.revokeKey(id);

      res.json({
        message: "API key revoked successfully"
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET KEY STATS
  static async getKeyStats(req, res) {
    try {
      const { id } = req.params;

      const key = await ApiKeyService.getKeyStats(id);

      if (!key) {
        return res.status(404).json({
          error: "API key not found"
        });
      }

      // structred response
      res.json({
        id: key.id,
        name: key.name,
        key: key.key_value,
        permissions: key.permissions,
        is_active: key.is_active,
        is_revoked: key.revoked_at !== null,
        usage_count: key.usage_count,
        created_at: key.created_at,
        last_used: key.last_used
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

export default ApiKeyController;