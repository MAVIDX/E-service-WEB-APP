import api from './api'

export default {
  getUsers(params)       { return api.get('/admin/users', { params }) },
  getUser(id)            { return api.get(`/admin/users/${id}`) },
  createUser(data)       { return api.post('/admin/users', data) },
  updateUser(id, data)   { return api.put(`/admin/users/${id}`, data) },
  deleteUser(id)         { return api.delete(`/admin/users/${id}`) },
  bulkAction(data)       { return api.post('/admin/users/bulk', data) },
}
