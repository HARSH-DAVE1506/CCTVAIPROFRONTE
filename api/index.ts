import type { IncomingMessage, ServerResponse } from 'http';
import https from 'https';
import http from 'http';

// Credentials fallback (works immediately even if environment variables are not set in Vercel UI)
const EMAIL = process.env.CCTV_EMAIL || 'harsh.dave1506@gmail.com';
const PASSWORD = process.env.CCTV_PASSWORD || 'TYTW-7BJ4-E8LT';
const WHEP_HOST = '103.250.160.189';
const WHEP_PORT = 8889;
const BROWSER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36';

let sentinelCookie = '';
let lastLoginTime = 0;
let isLoggingIn = false;
let loginPromise: Promise<boolean> | null = null;

// Playlist caching across serverless invocations
const playlistCache = new Map<string, { body: string; expiry: number }>();

const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 100,
  timeout: 20000,
});

const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 100,
  timeout: 20000,
});

async function login(force = false): Promise<boolean> {
  const now = Date.now();
  if (!force && sentinelCookie && (now - lastLoginTime < 600000)) {
    return true;
  }

  if (isLoggingIn && loginPromise) {
    return loginPromise;
  }

  isLoggingIn = true;
  loginPromise = new Promise<boolean>((resolve) => {
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
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
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
          res.resume();
          isLoggingIn = false;
          return resolve(true);
        }
      }
      res.resume();
      isLoggingIn = false;
      resolve(false);
    });

    req.on('error', (e) => {
      console.error('[Sentinel Vercel] Login request error:', e.message);
      isLoggingIn = false;
      resolve(false);
    });

    req.write(postData);
    req.end();
  });

  return loginPromise;
}

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Expose-Headers', 'Location, Link, Content-Type, Content-Length');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  const url = req.url || '';

  // 1. Health endpoint
  if (url.includes('/api/health') || url.includes('/api/surveillance-status')) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      status: 'ok',
      authenticated: !!sentinelCookie,
      platform: 'vercel-serverless',
      time: new Date().toISOString()
    }));
  }

  // 2. WHEP WebRTC Low-Latency Proxy (/api/whep/*)
  if (url.includes('/api/whep')) {
    const cleanUrl = url.split('?')[0];
    const afterWhep = cleanUrl.substring(cleanUrl.indexOf('/api/whep') + '/api/whep'.length);
    const pathParts = afterWhep.split('/').filter(Boolean);
    const rawCameraId = pathParts[0] || 'cam01';
    const cameraId = rawCameraId.toLowerCase().replace(/[^a-z0-9]/g, '');
    const remainingPath = pathParts.length > 1 ? '/' + pathParts.slice(1).join('/') : '';
    const targetPath = `/stream/${cameraId}/whep${remainingPath}`;

    const authHeader = 'Basic ' + Buffer.from(`${EMAIL}:${PASSWORD}`).toString('base64');

    return new Promise<void>((resolve) => {
      const options: http.RequestOptions = {
        hostname: WHEP_HOST,
        port: WHEP_PORT,
        path: targetPath,
        method: req.method || 'POST',
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
        res.statusCode = proxyRes.statusCode || 200;

        Object.keys(proxyRes.headers).forEach((k) => {
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
        proxyRes.on('end', () => resolve());
      });

      proxyReq.on('error', (err) => {
        console.error(`[Vercel WHEP Error] ${cameraId}:`, err.message);
        if (!res.headersSent) {
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'WHEP Gateway Error', details: err.message }));
        }
        resolve();
      });

      let bodyData = req.body;
      if (typeof bodyData === 'object' && !Buffer.isBuffer(bodyData)) {
        bodyData = JSON.stringify(bodyData);
      }

      if (bodyData) {
        proxyReq.write(bodyData);
        proxyReq.end();
      } else {
        req.pipe(proxyReq);
      }
    });
  }

  // 3. Surveillance HLS & Camera Catalog Proxy (/api/surveillance/*)
  if (url.includes('/api/surveillance')) {
    const cleanUrl = url.split('?')[0];
    const query = url.includes('?') ? '?' + url.split('?')[1] : '';
    let targetPath = cleanUrl.substring(cleanUrl.indexOf('/api/surveillance') + '/api/surveillance'.length);
    if (!targetPath.startsWith('/')) {
      targetPath = '/' + targetPath;
    }

    // Fast-path for .m3u8 playlist cache
    if (targetPath.toLowerCase().endsWith('.m3u8')) {
      const cached = playlistCache.get(targetPath);
      if (cached && cached.expiry > Date.now()) {
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.statusCode = 200;
        return res.end(cached.body);
      }
    }

    const performRequest = async (retry = true): Promise<void> => {
      if (!sentinelCookie) {
        const ok = await login();
        if (!ok && !res.headersSent) {
          res.statusCode = 401;
          res.end('Authentication Failed');
          return;
        }
      }

      return new Promise<void>((resolve) => {
        const options: https.RequestOptions = {
          hostname: 'cctv.corp8.cloud',
          path: targetPath + query,
          method: req.method || 'GET',
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
            login(true).then((success) => {
              if (success) {
                performRequest(false).then(resolve);
              } else {
                if (!res.headersSent) {
                  res.statusCode = 403;
                  res.end('Session Expired');
                }
                resolve();
              }
            });
            return;
          }

          if (proxyRes.headers['content-type']) {
            res.setHeader('Content-Type', proxyRes.headers['content-type']);
          }

          res.statusCode = proxyRes.statusCode || 200;

          // A) M3U8 Manifests
          if (targetPath.toLowerCase().endsWith('.m3u8')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            let body = '';
            proxyRes.setEncoding('utf8');
            proxyRes.on('data', (chunk: string) => { body += chunk; });
            proxyRes.on('end', () => {
              if (body.includes('browser required') && retry) {
                login(true).then(() => performRequest(false).then(resolve));
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
              res.end(rewritten);
              resolve();
            });
          } 
          // B) Camera Catalog (cameras.json)
          else if (targetPath.endsWith('cameras.json')) {
            res.setHeader('Cache-Control', 'public, max-age=60');
            let body = '';
            proxyRes.setEncoding('utf8');
            proxyRes.on('data', (chunk: string) => { body += chunk; });
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
                res.end(JSON.stringify(enriched));
              } catch {
                res.end(body);
              }
              resolve();
            });
          } 
          // C) TS Segments & binary
          else {
            res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
            res.setHeader('Content-Type', 'video/mp2t');
            proxyRes.pipe(res);
            proxyRes.on('end', () => resolve());
          }
        });

        proxyReq.on('error', (e) => {
          console.error('[Vercel Surveillance Error]:', e.message);
          if (!res.headersSent) {
            res.statusCode = 502;
            res.end('Gateway Error');
          }
          resolve();
        });

        proxyReq.end();
      });
    };

    return await performRequest();
  }

  // Default 404 for unknown /api route
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify({ error: 'Endpoint not found' }));
}

