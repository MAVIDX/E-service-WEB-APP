import api from './api'

export default {
  getMessages: (requestId) => api.get(`/chat/${requestId}`),
  sendMessage: (requestId, message) => api.post(`/chat/${requestId}`, { message }),
  getUnreads: () => api.get('/chat/unreads'),
}
