import UserDTO from "../dto/user.dto.js";

class SessionsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getLogin(req, res) {
    try {
      return await this.dao.getLoginDao(req, res);
    } catch (error) {
      return `${error}`;
    }
  }

  async getRegister(req, res) {
    try {
      return await this.dao.getRegisterDao(req, res);
    } catch (error) {
      return `${error}`;
    }
  }

  async getCurrent(req, res) {
    try {
      const { user } = req.session;
      const currentUser = new UserDTO(user);
      return currentUser;
    } catch (error) {
      return `${error}`;
    }
  }

  async getGithub(req, res) {
    try {
      return await this.dao.getGithubDao(req, res);
    } catch (error) {
      return `${error}`;
    }
  }

  async getGithubCallback(req, res) {
    try {
      return await this.dao.getGithubCallbackDao(req, res);
    } catch (error) {
      return `${error}`;
    }
  }

  async getLogout(req, res) {
    try {
      return await this.dao.getLogoutDao(req, res);
    } catch (error) {
      return `${error}`;
    }
  }

  async getRestore(req, res) {
    try {
      return await this.dao.getRestoreDao(req, res);
    } catch (error) {
      return `${error}`;
    }
  }

  async getRestoreCallback(req, res) {
    try {
      return await this.dao.getRestoreCallbackDao(req, res);
    } catch (error) {
      return `${error}`;
    }
  }

  async getPremium(req, res) {
    try {
      return await this.dao.getPremiumDao(req, res);
    } catch (error) {
      return `${error}`;
    }
  }

  async getUser(req, res) {
    try {
      return await this.dao.getUserDao(req, res);
    } catch (error) {
      return `${error}`;
    }
  }
}

export default SessionsRepository;
