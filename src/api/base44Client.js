import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// On Base44 hosting, empty serverUrl (same-origin /api) works via their proxy.
// On GitHub Pages there is no /api — must call the Base44 cloud API directly.
const serverUrl =
  import.meta.env.VITE_BASE44_SERVER_URL ||
  'https://base44.app';

export const base44 = createClient({
  appId: appId || '6a7cf89663ffa8e0d4ea7f6d',
  token,
  functionsVersion,
  serverUrl,
  requiresAuth: false,
  appBaseUrl: appBaseUrl || 'https://shvarts.black',
});
