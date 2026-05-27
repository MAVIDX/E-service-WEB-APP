import api from './api'

export default {
  getUsers()            { return api.get('/admin/users') },
  createCategory(data)  { return api.post('/admin/categories', data) },
  getStats()            { return api.get('/admin/stats') },
  getReports(params)    { return api.get('/admin/reports', { params }) },
  getPayments(params)   { return api.get('/admin/payments', { params }) },
  getLiveServices()     { return api.get('/admin/live-services') },
  getLogs(params)       { return api.get('/admin/logs', { params }) },
  getSubAdmins()        { return api.get('/admin/sub-admins') },
  createSubAdmin(data)  { return api.post('/admin/sub-admins', data) },
  updateSubAdmin(id, d) { return api.put(`/admin/sub-admins/${id}`, d) },
  deleteSubAdmin(id)    { return api.delete(`/admin/sub-admins/${id}`) },
}
