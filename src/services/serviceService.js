import api from './api'

export default {
  getAll(params)    { return api.get('/admin/services', { params }) },
  store(data)       { return api.post('/admin/services', data) },
  update(id, data)  { return api.put(`/admin/services/${id}`, data) },
  delete(id)        { return api.delete(`/admin/services/${id}`) },
}
