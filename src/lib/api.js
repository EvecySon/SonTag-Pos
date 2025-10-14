const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

let authToken = localStorage.getItem('authToken') || null;

export function setToken(token) {
  authToken = token;
  if (token) localStorage.setItem('authToken', token);
  else localStorage.removeItem('authToken');
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  const contentType = res.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

export const api = {
  async login({ username, password }) {
    return request('/auth/login', { method: 'POST', body: { username, password } });
  },
  async register({ username, email, password, branchName, branchLocation }) {
    return request('/auth/register', { method: 'POST', body: { username, email, password, branchName, branchLocation } });
  },
  async me() {
    return request('/users/me');
  },
  products: {
    list({ branchId } = {}) {
      const q = branchId ? `?branchId=${encodeURIComponent(branchId)}` : '';
      return request(`/products${q}`);
    },
    create(data) {
      return request('/products', { method: 'POST', body: data });
    },
    update(id, data) {
      return request(`/products/${id}`, { method: 'PUT', body: data });
    },
  },
  inventory: {
    list({ branchId }) {
      const q = `?branchId=${encodeURIComponent(branchId)}`;
      return request(`/inventory${q}`);
    },
    adjust(productId, branchId, delta) {
      const q = `?branchId=${encodeURIComponent(branchId)}`;
      return request(`/inventory/${productId}/adjust${q}`, { method: 'PUT', body: { delta } });
    },
  },
  orders: {
    list({ branchId, from, to } = {}) {
      const params = new URLSearchParams();
      if (branchId) params.set('branchId', branchId);
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const q = params.toString() ? `?${params.toString()}` : '';
      return request(`/orders${q}`);
    },
    create({ branchId, items, payment } = {}) {
      const body = { branchId, items };
      if (payment) body.payment = payment;
      return request('/orders', { method: 'POST', body });
    },
  },
  prices: {
    effective({ branchId, sectionId } = {}) {
      const params = new URLSearchParams();
      if (branchId) params.set('branchId', branchId);
      if (sectionId) params.set('sectionId', sectionId);
      const q = params.toString() ? `?${params.toString()}` : '';
      return request(`/prices${q}`);
    },
  },
  sections: {
    list({ branchId } = {}) {
      const params = new URLSearchParams();
      if (branchId) params.set('branchId', branchId);
      const q = params.toString() ? `?${params.toString()}` : '';
      return request(`/sections${q}`);
    },
  },
  tables: {
    list({ sectionId } = {}) {
      const params = new URLSearchParams();
      if (sectionId) params.set('sectionId', sectionId);
      const q = params.toString() ? `?${params.toString()}` : '';
      return request(`/tables${q}`);
    },
    lock(id) {
      return request(`/tables/${encodeURIComponent(id)}/lock`, { method: 'PUT' });
    },
    unlock(id) {
      return request(`/tables/${encodeURIComponent(id)}/unlock`, { method: 'PUT' });
    },
  },
};
