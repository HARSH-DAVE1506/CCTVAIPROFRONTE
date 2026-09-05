import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import https from 'https';
import http from 'http';

export const app = express();

const PORT = parseInt(process.env.PORT || '3000', 10);

// Session management
let sentinelCookie = '';
let lastLoginTime = 0;
let isLoggingIn = false;
let loginPromise: Promise<boolean> | null = null;

// In-memory cache for live playlists to prevent upstream rate-limiting & socket exhaustion
const playlistCache = new Map<string, { body: string; expiry: number }>();

const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 200,
  timeout: 25000,
});

const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 200,
  timeout: 25000,
});

const EMAIL = process.env.CCTV_EMAIL || 'harsh.dave1506@gmail.com';
const PASSWORD = process.env.CCTV_PASSWORD || 'TYTW-7BJ4-E8LT';
const WHEP_HOST = '103.250.160.189';
const WHEP_PORT = 8889;

const BROWSER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36';

export async function login(force = false): Promise<boolean> {
  const now = Date.now();
  if (!force && sentinelCookie && (now - lastLoginTime < 600000)) {
    return true;
  }

  if (isLoggingIn && loginPromise) {
    return loginPromise;
  }

  isLoggingIn = true;
  loginPromise = new Promise<boolean>((resolve) => {
    console.log('[Sentinel] Authenticating session for:', EMAIL);
    const postData = `email=${encodeURIComponent(EMAIL)}&password=${encodeURIComponent(PASSWORD)}`;

    const req = https.request({
      hostname: 'cctv.corp8.cloud',
      path: '/auth/login',
      method: 'POST',
      agent: httpsAgent,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': BROWSER_USER_AGENT,
        'Referer': 'https://cctv.corp8.cloud/auth/login',
        'Origin': 'https://cctv.corp8.cloud',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Ch-Ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Connection': 'keep-alive'
      }
    }, (res) => {
      const cookies = res.headers['set-cookie'];
      if (cookies) {
        const match = cookies.find(c => c.startsWith('sentinel='));
        if (match) {
          sentinelCookie = match.split(';')[0];
          lastLoginTime = Date.now();
          console.log('[Sentinel] Session established successfully.');
          res.resume();
          isLoggingIn = false;
          return resolve(true);
        }
      }
      console.error('[Sentinel] Login failed - status:', res.statusCode);
      res.resume();
      isLoggingIn = false;
      resolve(false);
    });

    req.on('error', (e) => {
      console.error('[Sentinel] Login request error:', e.message);
      isLoggingIn = false;
      resolve(false);
    });

    req.write(postData);
    req.end();
  });

  return loginPromise;
}

// Background heartbeat to keep session warm
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    if (sentinelCookie) {
      const req = https.get({
        hostname: 'cctv.corp8.cloud',
        path: '/cameras.json',
        agent: httpsAgent,
        headers: {
          'Cookie': sentinelCookie,
          'User-Agent': BROWSER_USER_AGENT,
          'Referer': 'https://cctv.corp8.cloud/'
        }
      }, (res) => {
        res.resume();
        if (res.statusCode === 403 || res.statusCode === 302) {
          console.log('[Sentinel] Heartbeat detected session expiry, renewing...');
          login(true);
        }
      });
      req.on('error', () => {});
      req.end();
    }
  }, 90000);
}

// Middleware
app.use(express.raw({ type: ['application/sdp', 'text/plain'], limit: '10mb' }));
app.use(express.json());

// ----------------------------------------------------
// WHEP WebRTC Low-Latency Proxy (/api/whep/*)
// Works on both Local and Vercel Serverless
// ----------------------------------------------------
app.use('/api/whep', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, If-Match');
  res.setHeader('Access-Control-Expose-Headers', 'Location, Link, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const pathParts = req.url.split('?')[0].split('/').filter(Boolean);
  const rawCameraId = pathParts[0] || 'cam01';
  const cameraId = rawCameraId.toLowerCase().replace(/[^a-z0-9]/g, '');
  const remainingPath = pathParts.length > 1 ? '/' + pathParts.slice(1).join('/') : '';
  const targetPath = `/stream/${cameraId}/whep${remainingPath}`;

  const authHeader = 'Basic ' + Buffer.from(`${EMAIL}:${PASSWORD}`).toString('base64');

  const options: http.RequestOptions = {
    hostname: WHEP_HOST,
    port: WHEP_PORT,
    path: targetPath,
    method: req.method,
    agent: httpAgent,
    headers: {
      'Authorization': authHeader,
      'Content-Type': req.headers['content-type'] || 'application/sdp',
      'User-Agent': BROWSER_USER_AGENT,
    }
  };

  if (req.headers['if-match']) {
    options.headers!['If-Match'] = req.headers['if-match'];
  }

  const proxyReq = http.request(options, (proxyRes) => {
    res.status(proxyRes.statusCode || 200);

    Object.keys(proxyRes.headers).forEach(k => {
      if (!['content-length', 'connection'].includes(k.toLowerCase())) {
        res.setHeader(k, proxyRes.headers[k] as string);
      }
    });

    if (proxyRes.headers.location) {
      const originalLoc = proxyRes.headers.location;
      const match = originalLoc.match(/\/stream\/[^/]+\/whep(\/.*)?$/);
      if (match) {
        res.setHeader('Location', `/api/whep/${cameraId}${match[1] || ''}`);
      }
    }

    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error(`[WHEP Proxy Error] ${cameraId}:`, err.message);
    if (!res.headersSent) {
      res.status(502).json({ error: 'WHEP Gateway Error', details: err.message });
    }
  });

  if (req.body && Buffer.isBuffer(req.body) && req.body.length > 0) {
    proxyReq.write(req.body);
    proxyReq.end();
  } else if (req.body && typeof req.body === 'string') {
    proxyReq.write(req.body);
    proxyReq.end();
  } else {
    req.pipe(proxyReq);
  }
});

// ----------------------------------------------------
// HLS Surveillance Proxy (/api/surveillance/*)
// Stateless-Safe with In-Memory Manifest Caching
// ----------------------------------------------------
app.use('/api/surveillance', async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.status(204).end();
  }

  const targetPath = req.url.split('?')[0];
  const query = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';

  // Fast-path for .m3u8 playlist cache (1.5s TTL)
  if (targetPath.toLowerCase().endsWith('.m3u8')) {
    const cached = playlistCache.get(targetPath);
    if (cached && cached.expiry > Date.now()) {
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.status(200).send(cached.body);
    }
  }

  const performRequest = async (retry = true) => {
    if (!sentinelCookie) {
      const ok = await login();
      if (!ok && !res.headersSent) {
        return res.status(401).send('Authentication Failed');
      }
    }

    const options: https.RequestOptions = {
      hostname: 'cctv.corp8.cloud',
      path: targetPath + query,
      method: req.method,
      agent: httpsAgent,
      headers: {
        'Cookie': sentinelCookie,
        'User-Agent': BROWSER_USER_AGENT,
        'Referer': 'https://cctv.corp8.cloud/',
        'Origin': 'https://cctv.corp8.cloud',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Ch-Ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Connection': 'keep-alive',
      }
    };

    const proxyReq = https.request(options, (proxyRes) => {
      if ((proxyRes.statusCode === 302 || proxyRes.statusCode === 403) && retry) {
        proxyRes.resume();
        console.log(`[Surveillance Proxy] Session refresh triggered by ${proxyRes.statusCode} on ${targetPath}...`);
        login(true).then((success) => {
          if (success) performRequest(false);
          else if (!res.headersSent) res.status(403).send('Session Expired');
        });
        return;
      }

      res.setHeader('Access-Control-Allow-Origin', '*');

      if (proxyRes.headers['content-type']) {
        res.setHeader('Content-Type', proxyRes.headers['content-type']);
      }

      res.status(proxyRes.statusCode || 200);

      // A) M3U8 Manifests
      if (targetPath.toLowerCase().endsWith('.m3u8')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        let body = '';
        proxyRes.setEncoding('utf8');
        proxyRes.on('data', chunk => { body += chunk; });
        proxyRes.on('end', () => {
          if (body.includes('browser required') && retry) {
            console.warn('[Proxy] Upstream reported browser required. Retrying...');
            login(true).then(() => performRequest(false));
            return;
          }

          const dirMatch = targetPath.match(/^(\/cam\d+)\//);
          const camPrefix = dirMatch ? dirMatch[1] : '';

          let rewritten = body
            .replace(/https?:\/\/cctv\.corp8\.cloud/g, '/api/surveillance')
            .replace(/URI="\/([^"]+)"/g, 'URI="/api/surveillance/$1"');

          if (camPrefix) {
            rewritten = rewritten.replace(/URI="([^"/]+)"/g, `URI="/api/surveillance${camPrefix}/$1"`);
          }

          playlistCache.set(targetPath, {
            body: rewritten,
            expiry: Date.now() + 1500
          });

          res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
          res.send(rewritten);
        });
      } 
      // B) Camera Catalogue
      else if (targetPath.endsWith('cameras.json')) {
        res.setHeader('Cache-Control', 'public, max-age=60');
        let body = '';
        proxyRes.setEncoding('utf8');
        proxyRes.on('data', chunk => { body += chunk; });
        proxyRes.on('end', () => {
          try {
            const cameras = JSON.parse(body);
            const enriched = Array.isArray(cameras) ? cameras.map((c: any) => ({
              ...c,
              status: 'online',
              streamUrl: `/api/surveillance/${c.id}/index.m3u8`,
              whepUrl: `/api/whep/${c.id}`
            })) : cameras;
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(enriched));
          } catch {
            res.send(body);
          }
        });
      } 
      // C) TS Segments
      else {
        res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
        res.setHeader('Content-Type', 'video/mp2t');
        proxyRes.pipe(res);
      }
    });

    proxyReq.on('error', (e) => {
      console.error('[Surveillance Proxy Error]:', e.message);
      if (!res.headersSent) res.status(502).send('Gateway Error');
    });

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      req.pipe(proxyReq);
    } else {
      proxyReq.end();
    }
  };

  performRequest();
});

// Status endpoints
app.get('/api/surveillance-status', (req, res) => {
  res.json({
    status: sentinelCookie ? 'active' : 'unauthenticated',
    mode: 'direct-auth',
    cookiePresent: !!sentinelCookie,
    emailConfigured: !!EMAIL,
    cachedPlaylists: playlistCache.size
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    proxy: 'active',
    authenticated: !!sentinelCookie,
    whepProxy: `http://${WHEP_HOST}:${WHEP_PORT}`,
    cdnHost: 'https://cctv.corp8.cloud',
    cachedPlaylists: playlistCache.size
  });
});

// Standalone runner for local development (not when imported as Vercel serverless module)
if (process.env.VERCEL !== '1') {
  async function startStandalone() {
    await login(true);

    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`====================================================`);
      console.log(` Inside Vadodara CCTV Surveillance Server Active`);
      console.log(` Local URL: http://localhost:${PORT}`);
      console.log(` WebRTC (WHEP) Proxy: /api/whep/:cameraId`);
      console.log(` HLS CDN Proxy: /api/surveillance/:cameraId/index.m3u8`);
      console.log(` Target Cameras: cam01 - cam30 (High-Concurrency Optimized)`);
      console.log(`====================================================`);
    });
  }

  startStandalone().catch((err) => {
    console.error('[Server Fatal Error]:', err);
  });
}

export default app;
