import api from './api'

export default {
  getAllProfesional()    { return api.get('/categories') },
  getAll()              { return api.get('/admin/categories') },
  store(data)           { return api.post('/admin/categories', data) },
  update(id, data)      { return api.put(`/admin/categories/${id}`, data) },
  delete(id)            { return api.delete(`/admin/categories/${id}`) },
}
