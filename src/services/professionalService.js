import api from './api'

export default {
  getListProfessionals() { return api.get('/professionals') },
  getDashboard()         { return api.get('/professional/dashboard') },
  saveProfile(data)      { return api.post('/professional/profile', data) },
}
