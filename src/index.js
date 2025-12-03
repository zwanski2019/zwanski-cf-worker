/**
 * Zwanski Tech — Cloudflare Workers API Platform
 * Main entry point for all API routes and frontend
 */

import { Router } from 'itty-router';

const router = Router();

// ============================================================================
// CORS Middleware
// ============================================================================
const setCORSHeaders = (response) => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  return response;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateQuote() {
  const quotes = [
    { text: "Security is not a product, but a process.", author: "Bruce Schneier" },
    { text: "The only secure computer is one that's turned off.", author: "Unknown" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
    { text: "Your data is your digital life. Protect it.", author: "Zwanski" },
    { text: "Speed matters. Edge computing is the future.", author: "Zwanski" },
    { text: "Privacy by design, not by accident.", author: "Zwanski" },
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function generatePassword(length = 16) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

async function hashSHA256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateLorem(size = 'medium') {
  const small = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
  const medium = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  const large = medium + ' Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  
  const sizeMap = { small, medium, large };
  return sizeMap[size] || medium;
}

// ============================================================================
// API ROUTES
// ============================================================================

// GET /api/quote — Motivational quote
router.get('/api/quote', () => {
  return new Response(
    JSON.stringify(generateQuote()),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
});

// GET /api/ip — Client IP address
router.get('/api/ip', (req) => {
  const clientIP = req.headers.get('CF-Connecting-IP') || 'unknown';
  return new Response(
    JSON.stringify({ ip: clientIP, timestamp: new Date().toISOString() }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
});

// GET /api/geo — Geolocation (Cloudflare headers only)
router.get('/api/geo', (req) => {
  const country = req.headers.get('CF-IPCountry') || 'unknown';
  const city = req.headers.get('CF-Metro-Code') || 'unknown';
  const latitude = req.headers.get('CF-IPLatitude') || 'unknown';
  const longitude = req.headers.get('CF-IPLongitude') || 'unknown';
  
  return new Response(
    JSON.stringify({
      country,
      city,
      coordinates: { latitude, longitude },
      timestamp: new Date().toISOString()
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
});

// GET /api/timezone — Current time and timezone
router.get('/api/timezone', (req) => {
  const now = new Date();
  return new Response(
    JSON.stringify({
      utc_timestamp: now.toISOString(),
      unix_timestamp: Math.floor(now.getTime() / 1000),
      readable: now.toLocaleString(),
      timezone_offset: -now.getTimezoneOffset()
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
});

// GET /api/passgen?length=16 — Password generator
router.get('/api/passgen', (req) => {
  const url = new URL(req.url);
  const length = parseInt(url.searchParams.get('length')) || 16;
  const password = generatePassword(Math.min(Math.max(length, 8), 128));
  
  return new Response(
    JSON.stringify({ password, length: password.length }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
});

// GET /api/hash?text=hello — SHA-256 hash
router.get('/api/hash', async (req) => {
  const url = new URL(req.url);
  const text = url.searchParams.get('text') || 'zwanski';
  const hash = await hashSHA256(text);
  
  return new Response(
    JSON.stringify({ input: text, hash, algorithm: 'SHA-256' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
});

// GET /api/lorem?size=medium — Lorem ipsum generator
router.get('/api/lorem', (req) => {
  const url = new URL(req.url);
  const size = url.searchParams.get('size') || 'medium';
  const text = generateLorem(size);
  
  return new Response(
    JSON.stringify({ text, size }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
});

// GET /api/score?url=example.com — Zwanski Score API
router.get('/api/score', async (req) => {
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get('url');
  
  if (!targetUrl) {
    return new Response(
      JSON.stringify({ error: 'url parameter required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Simulated scoring (in production, would fetch and analyze the URL)
  const score = {
    domain: targetUrl,
    overall_score: Math.floor(Math.random() * 30) + 70,
    seo_score: Math.floor(Math.random() * 40) + 60,
    performance_score: Math.floor(Math.random() * 35) + 65,
    security_score: Math.floor(Math.random() * 30) + 70,
    mobile_friendly: Math.random() > 0.3,
    https_enabled: true,
    cdn_detected: Math.random() > 0.4,
    recommendations: [
      'Add security headers (CSP, X-Frame-Options)',
      'Optimize images and lazy-load content',
      'Implement caching strategies',
      'Use a CDN for global distribution'
    ],
    analyzed_at: new Date().toISOString()
  };
  
  return new Response(JSON.stringify(score), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
});

// GET /api/fingerprint — Browser transparency
router.get('/api/fingerprint', (req) => {
  const userAgent = req.headers.get('User-Agent') || 'unknown';
  const country = req.headers.get('CF-IPCountry') || 'unknown';
  
  const fingerprint = {
    user_agent: userAgent,
    country,
    https: true,
    privacy_rating: 'good',
    security_recommendations: [
      'Use HTTPS everywhere',
      'Enable browser security features',
      'Update your browser regularly',
      'Use a VPN for additional privacy'
    ],
    timestamp: new Date().toISOString()
  };
  
  return new Response(JSON.stringify(fingerprint), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
});

// GET /api/device?model=iPhone13 — Device checker
router.get('/api/device', (req) => {
  const url = new URL(req.url);
  const model = url.searchParams.get('model') || 'Unknown';
  
  const devices = {
    'iPhone13': { specs: '6.1" OLED, A15 Bionic', os: 'iOS 15+', maintenance: 'good', carrier_support: 'all' },
    'iPhone14': { specs: '6.1" OLED, A16 Bionic', os: 'iOS 16+', maintenance: 'excellent', carrier_support: 'all' },
    'Galaxy23': { specs: '6.1" AMOLED, Snapdragon 8 Gen 2', os: 'Android 13+', maintenance: 'very_good', carrier_support: 'all' },
  };
  
  const info = devices[model] || { specs: 'N/A', os: 'Unknown', maintenance: 'unknown', carrier_support: 'check_carrier' };
  
  return new Response(
    JSON.stringify({
      model,
      ...info,
      repair_difficulty: 'moderate',
      lifecycle: 'active'
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
});

// GET /api/ping?url=example.com — Uptime monitor
router.get('/api/ping', async (req) => {
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get('url');
  
  if (!targetUrl) {
    return new Response(
      JSON.stringify({ error: 'url parameter required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const startTime = Date.now();
    const response = await fetch(`https://${targetUrl}`, { method: 'HEAD' });
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    return new Response(
      JSON.stringify({
        url: targetUrl,
        status: response.status,
        response_time_ms: responseTime,
        edge_location: req.headers.get('CF-Ray')?.split('-')[1] || 'unknown',
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ url: targetUrl, error: 'Could not reach URL', message: err.message }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

// GET /api/crypto?symbol=BTC — Crypto price (uses free public API)
router.get('/api/crypto', async (req) => {
  const url = new URL(req.url);
  const symbol = (url.searchParams.get('symbol') || 'BTC').toUpperCase();
  
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`);
    const data = await response.json();
    
    const price = data[symbol.toLowerCase()]?.usd || 'N/A';
    
    return new Response(
      JSON.stringify({
        symbol,
        price,
        currency: 'USD',
        source: 'CoinGecko (free API)',
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ symbol, error: 'Could not fetch price', message: err.message }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

// ============================================================================
// FRONTEND ROUTES
// ============================================================================

// Serve frontend from /public/index.html
router.get('/', (req) => {
  return new Response(getIndexHTML(), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
});

// 404 handler
router.all('*', () => {
  return new Response(
    JSON.stringify({ error: 'Not found', message: 'Endpoint does not exist' }),
    { status: 404, headers: { 'Content-Type': 'application/json' } }
  );
});

// ============================================================================
// FRONTEND HTML
// ============================================================================

function getIndexHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zwanski Tech — Cloudflare Workers API Platform</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #ffffff;
      color: #0F172A;
      line-height: 1.6;
    }
    
    header {
      background: linear-gradient(135deg, #1E293B 0%, #3B82F6 100%);
      color: white;
      padding: 3rem 2rem;
      text-align: center;
    }
    
    header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    
    header p {
      font-size: 1.2rem;
      opacity: 0.9;
    }
    
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .section {
      margin: 3rem 0;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 2rem;
      background: #f8fafc;
    }
    
    .section h2 {
      color: #1E293B;
      margin-bottom: 1rem;
      font-size: 1.8rem;
    }
    
    .api-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }
    
    .api-card {
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 1.5rem;
      transition: box-shadow 0.3s;
    }
    
    .api-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .api-card h3 {
      color: #3B82F6;
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }
    
    .api-card p {
      color: #64748b;
      font-size: 0.95rem;
    }
    
    .endpoint {
      background: #1E293B;
      color: #38BDF8;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.85rem;
      margin-top: 0.5rem;
      word-break: break-all;
    }
    
    .playground {
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 1.5rem;
      margin-top: 1.5rem;
    }
    
    .playground h3 {
      margin-bottom: 1rem;
      color: #1E293B;
    }
    
    .playground input,
    .playground select {
      padding: 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      font-size: 1rem;
      margin-right: 0.5rem;
    }
    
    .playground button {
      background: #3B82F6;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s;
    }
    
    .playground button:hover {
      background: #2563EB;
    }
    
    .result {
      background: #0F172A;
      color: #38BDF8;
      border-radius: 4px;
      padding: 1rem;
      margin-top: 1rem;
      font-family: monospace;
      font-size: 0.9rem;
      max-height: 300px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }
    
    footer {
      text-align: center;
      padding: 2rem;
      border-top: 1px solid #e2e8f0;
      color: #64748b;
      margin-top: 3rem;
    }
    
    .badge {
      display: inline-block;
      background: #0F172A;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 3px;
      font-size: 0.8rem;
      margin-right: 0.5rem;
    }
  </style>
</head>
<body>
  <header>
    <h1>Zwanski Tech API Platform</h1>
    <p>High-performance, edge-deployed tools for security, performance and privacy</p>
  </header>
  
  <div class="container">
    <section class="section">
      <h2>🚀 Welcome to Zwanski Workers</h2>
      <p>A global, edge-deployed API platform built on Cloudflare Workers. All endpoints are fast, secure, and privacy-first.</p>
      <p style="margin-top: 1rem; color: #64748b;">
        <span class="badge">Ultra-fast</span>
        <span class="badge">Global CDN</span>
        <span class="badge">Privacy-first</span>
        <span class="badge">Open APIs</span>
      </p>
    </section>
    
    <section class="section">
      <h2>📡 API Endpoints</h2>
      <div class="api-grid">
        <div class="api-card">
          <h3>🌐 IP Address</h3>
          <p>Get your public IP address</p>
          <div class="endpoint">GET /api/ip</div>
        </div>
        
        <div class="api-card">
          <h3>🗺️ Geolocation</h3>
          <p>Your location (country, city)</p>
          <div class="endpoint">GET /api/geo</div>
        </div>
        
        <div class="api-card">
          <h3>⏰ Timezone</h3>
          <p>Current time and timezone</p>
          <div class="endpoint">GET /api/timezone</div>
        </div>
        
        <div class="api-card">
          <h3>🔐 Password Generator</h3>
          <p>Strong password generation</p>
          <div class="endpoint">GET /api/passgen?length=16</div>
        </div>
        
        <div class="api-card">
          <h3>🔒 SHA-256 Hash</h3>
          <p>Hash any text safely</p>
          <div class="endpoint">GET /api/hash?text=hello</div>
        </div>
        
        <div class="api-card">
          <h3>📝 Lorem Ipsum</h3>
          <p>Generate placeholder text</p>
          <div class="endpoint">GET /api/lorem?size=medium</div>
        </div>
        
        <div class="api-card">
          <h3>💬 Quote</h3>
          <p>Get motivational quotes</p>
          <div class="endpoint">GET /api/quote</div>
        </div>
        
        <div class="api-card">
          <h3>📊 Zwanski Score</h3>
          <p>Website quality analysis</p>
          <div class="endpoint">GET /api/score?url=example.com</div>
        </div>
        
        <div class="api-card">
          <h3>👁️ Browser Fingerprint</h3>
          <p>Privacy & security info</p>
          <div class="endpoint">GET /api/fingerprint</div>
        </div>
        
        <div class="api-card">
          <h3>📱 Device Checker</h3>
          <p>Device specs and support</p>
          <div class="endpoint">GET /api/device?model=iPhone14</div>
        </div>
        
        <div class="api-card">
          <h3>⚡ Ping Monitor</h3>
          <p>Check uptime and response time</p>
          <div class="endpoint">GET /api/ping?url=example.com</div>
        </div>
        
        <div class="api-card">
          <h3>💰 Crypto Price</h3>
          <p>Get cryptocurrency prices</p>
          <div class="endpoint">GET /api/crypto?symbol=BTC</div>
        </div>
      </div>
    </section>
    
    <section class="section">
      <h2>🧪 Try It Now</h2>
      <div class="playground">
        <h3>Interactive Playground</h3>
        <div>
          <label for="endpoint">Endpoint:</label>
          <select id="endpoint">
            <option value="ip">/api/ip</option>
            <option value="geo">/api/geo</option>
            <option value="timezone">/api/timezone</option>
            <option value="quote">/api/quote</option>
            <option value="passgen">/api/passgen</option>
            <option value="hash">/api/hash</option>
            <option value="fingerprint">/api/fingerprint</option>
            <option value="crypto">/api/crypto</option>
            <option value="score">/api/score</option>
          </select>
          <input type="text" id="param" placeholder="param value (optional)" />
          <button onclick="runAPI()">Run</button>
        </div>
        <div class="result" id="result"></div>
      </div>
    </section>
    
    <section class="section">
      <h2>📚 Documentation</h2>
      <h3>Example: Get your IP</h3>
      <div class="endpoint">curl https://api.zwanski.tech/api/ip</div>
      <p style="margin-top: 1rem;">Response:</p>
      <div class="endpoint">{"ip":"203.0.113.42","timestamp":"2024-12-03T10:30:45Z"}</div>
      
      <h3 style="margin-top: 2rem;">Example: Generate Password</h3>
      <div class="endpoint">curl https://api.zwanski.tech/api/passgen?length=20</div>
      <p style="margin-top: 1rem;">Response:</p>
      <div class="endpoint">{"password":"X$mK9qL#2vB*nF@8pQ!","length":20}</div>
    </section>
    
    <footer>
      <p>&copy; 2024 Zwanski Tech. Built on Cloudflare Workers. Privacy-first, edge-deployed.</p>
    </footer>
  </div>
  
  <script>
    async function runAPI() {
      const endpoint = document.getElementById('endpoint').value;
      const param = document.getElementById('param').value;
      const resultDiv = document.getElementById('result');
      
      let url = \`/api/\${endpoint}\`;
      
      if (endpoint === 'hash' && param) {
        url += \`?text=\${encodeURIComponent(param)}\`;
      } else if (endpoint === 'passgen' && param) {
        url += \`?length=\${param}\`;
      } else if (endpoint === 'score' && param) {
        url += \`?url=\${encodeURIComponent(param)}\`;
      } else if (endpoint === 'crypto' && param) {
        url += \`?symbol=\${encodeURIComponent(param)}\`;
      }
      
      resultDiv.textContent = 'Loading...';
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        resultDiv.textContent = JSON.stringify(data, null, 2);
      } catch (err) {
        resultDiv.textContent = \`Error: \${err.message}\`;
      }
    }
  </script>
</body>
</html>`;
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  fetch: (request, env, ctx) => {
    const response = router.handle(request);
    return setCORSHeaders(response);
  }
};
