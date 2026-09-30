import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// GitHub Pages has no /api proxy — talk to Base44 cloud directly.
const serverUrl = import.meta.env.VITE_BASE44_SERVER_URL || 'https://base44.app';

export const base44 = createClient({
  appId: appId || '6a29e5cf7bcb44e60651e6a7',
  token,
  functionsVersion,
  serverUrl,
  requiresAuth: false,
  appBaseUrl: appBaseUrl || 'https://shvarts.black',
});
