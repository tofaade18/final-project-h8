import axios from 'axios';

const API_URL = 'https://group-connection.handuktangerang.online/api/auth/';

class AuthService {
  async login(user) {
    const response = await axios
      .post(API_URL + 'signin', {
        username: user.username,
        password: user.password
      });
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', user)
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token')
  }

  register(user) {
    return axios.post(API_URL + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password
    });
  }
}

export default new AuthService();