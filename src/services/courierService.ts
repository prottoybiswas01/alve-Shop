import type { CourierConsignment, CourierSettings, Order } from '../types';

export const DEFAULT_COURIER_SETTINGS: CourierSettings = {
  pathao: {
    enabled: true,
    sandbox: true,
    clientId: 'pathao_demo_client_8921',
    clientSecret: 'pathao_sec_99382104918209',
    username: 'merchant@alveshop.com',
    password: '••••••••••••',
    storeId: '48201',
  },
  steadfast: {
    enabled: true,
    sandbox: true,
    apiKey: 'stf_api_live_449201948201948',
    secretKey: 'stf_sec_991029304910293',
  },
};

/**
 * Dispatch an order to Pathao Courier API
 */
export async function dispatchToPathao(
  order: Order,
  _settings: CourierSettings
): Promise<CourierConsignment> {
  // Simulate network delay for API request
  await new Promise((resolve) => setTimeout(resolve, 800));

  const randomConsignment = 'PTH-' + Math.floor(1000000 + Math.random() * 9000000);
  const randomTracking = 'PTH-DH-' + Math.floor(1000 + Math.random() * 9000);

  // If live mode with credentials, we would call fetch('https://api-hermes.pathao.com/...', ...)
  const charge = order.shippingAddress.deliveryType === 'inside_dhaka' ? 80 : 150;

  return {
    provider: 'pathao',
    consignmentId: randomConsignment,
    trackingCode: randomTracking,
    status: 'in_transit',
    createdAt: new Date().toISOString(),
    estimatedDelivery: order.shippingAddress.deliveryType === 'inside_dhaka' ? 'Within 24 Hours' : '2-3 Business Days',
    charge,
  };
}

/**
 * Dispatch an order to Steadfast Courier API
 */
export async function dispatchToSteadfast(
  order: Order,
  _settings: CourierSettings
): Promise<CourierConsignment> {
  // Simulate network delay for API request
  await new Promise((resolve) => setTimeout(resolve, 800));

  const randomConsignment = 'STF-' + Math.floor(100000 + Math.random() * 900000);
  const randomTracking = 'STF-BD-' + Math.floor(1000 + Math.random() * 9000);

  const charge = order.shippingAddress.deliveryType === 'inside_dhaka' ? 80 : 150;

  return {
    provider: 'steadfast',
    consignmentId: randomConsignment,
    trackingCode: randomTracking,
    status: 'in_transit',
    createdAt: new Date().toISOString(),
    estimatedDelivery: order.shippingAddress.deliveryType === 'inside_dhaka' ? 'Within 24 Hours' : '48 Hours',
    charge,
  };
}

/**
 * Calculate dynamic shipping rate based on destination
 */
export function calculateShippingFee(deliveryType: 'inside_dhaka' | 'outside_dhaka'): number {
  return deliveryType === 'inside_dhaka' ? 80 : 150;
}
