const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchProductsAPI() {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export async function createProductAPI(productData: any) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export async function updateProductAPI(id: string, updatedData: any) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export async function deleteProductAPI(id: string) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export async function fetchOrdersAPI() {
  const res = await fetch(`${API_BASE_URL}/orders`);
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export async function createOrderAPI(orderData: any) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export async function updateOrderStatusAPI(id: string, status: string) {
  const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export async function dispatchOrderCourierAPI(id: string, provider: 'pathao' | 'steadfast') {
  const res = await fetch(`${API_BASE_URL}/orders/${id}/courier`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider }),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export async function fetchCourierSettingsAPI() {
  const res = await fetch(`${API_BASE_URL}/courier-settings`);
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export async function updateCourierSettingsAPI(settings: any) {
  const res = await fetch(`${API_BASE_URL}/courier-settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}
