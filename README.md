# Zwanski Tech — Cloudflare Workers API Platform

**Ultra-fast, global, privacy-first API platform for security, performance and tooling.**

---

## 🎯 Overview

Zwanski Tech's Cloudflare Workers project provides a suite of high-performance APIs deployed globally on Cloudflare's edge network. All endpoints are fast, secure, and built with privacy-first principles.

**Key Features:**
- ⚡ **Edge-deployed** — 200+ data centers worldwide
- 🔒 **Security-first** — CORS, headers, rate limiting
- 🌍 **Global** — Sub-50ms response times
- 📊 **Free APIs** — No auth required for public endpoints
- 🧪 **Interactive playground** — Try APIs live in the browser
- 📱 **Mobile-ready** — Fully responsive UI

---

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/zwanski01/zwanski-cf-worker.git
cd zwanski-cf-worker

# Install dependencies
npm install

# Install Wrangler CLI (if not already installed)
npm install -g wrangler
```

### 2. Local Development

```bash
# Start development server
npm run dev

# Server will run on http://localhost:8787
```

### 3. Deployment

```bash
# Deploy to Cloudflare
npm run deploy

# After deployment, your API will be live at:
# https://<your-subdomain>.workers.dev/
```

---

## 📡 API Endpoints

### 1. **IP Address** — `/api/ip`

Get your public IP address.

```bash
curl https://api.zwanski.tech/api/ip
```

**Response:**
```json
{
  "ip": "203.0.113.42",
  "timestamp": "2024-12-03T10:30:45Z"
}
```

---

### 2. **Geolocation** — `/api/geo`

Get your location (country, city).

```bash
curl https://api.zwanski.tech/api/geo
```

**Response:**
```json
{
  "country": "US",
  "city": "ashburn",
  "coordinates": { "latitude": "39.0469", "longitude": "-77.4903" },
  "timestamp": "2024-12-03T10:30:45Z"
}
```

---

### 3. **Timezone** — `/api/timezone`

Get current time and timezone information.

```bash
curl https://api.zwanski.tech/api/timezone
```

**Response:**
```json
{
  "utc_timestamp": "2024-12-03T10:30:45.000Z",
  "unix_timestamp": 1733152245,
  "readable": "12/3/2024, 10:30:45 AM",
  "timezone_offset": 300
}
```

---

### 4. **Password Generator** — `/api/passgen`

Generate a strong, random password.

**Parameters:**
- `length` (optional, default: 16) — Password length (8–128 characters)

```bash
curl "https://api.zwanski.tech/api/passgen?length=20"
```

**Response:**
```json
{
  "password": "X$mK9qL#2vB*nF@8pQ!7",
  "length": 20
}
```

---

### 5. **SHA-256 Hash** — `/api/hash`

Hash any text using SHA-256.

**Parameters:**
- `text` (required) — Text to hash

```bash
curl "https://api.zwanski.tech/api/hash?text=hello"
```

**Response:**
```json
{
  "input": "hello",
  "hash": "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
  "algorithm": "SHA-256"
}
```

---

### 6. **Lorem Ipsum** — `/api/lorem`

Generate placeholder text.

**Parameters:**
- `size` (optional: small, medium, large) — Text length

```bash
curl "https://api.zwanski.tech/api/lorem?size=medium"
```

**Response:**
```json
{
  "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  "size": "medium"
}
```

---

### 7. **Motivational Quote** — `/api/quote`

Get a random inspirational quote.

```bash
curl https://api.zwanski.tech/api/quote
```

**Response:**
```json
{
  "text": "Security is not a product, but a process.",
  "author": "Bruce Schneier"
}
```

---

### 8. **Zwanski Score** — `/api/score`

Get a website quality score with recommendations.

**Parameters:**
- `url` (required) — Domain to analyze

```bash
curl "https://api.zwanski.tech/api/score?url=example.com"
```

**Response:**
```json
{
  "domain": "example.com",
  "overall_score": 82,
  "seo_score": 75,
  "performance_score": 88,
  "security_score": 90,
  "mobile_friendly": true,
  "https_enabled": true,
  "cdn_detected": true,
  "recommendations": [
    "Add security headers (CSP, X-Frame-Options)",
    "Optimize images and lazy-load content",
    "Implement caching strategies",
    "Use a CDN for global distribution"
  ],
  "analyzed_at": "2024-12-03T10:30:45Z"
}
```

---

### 9. **Browser Fingerprint** — `/api/fingerprint`

Get privacy and security information about your browser.

```bash
curl https://api.zwanski.tech/api/fingerprint
```

**Response:**
```json
{
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "country": "US",
  "https": true,
  "privacy_rating": "good",
  "security_recommendations": [
    "Use HTTPS everywhere",
    "Enable browser security features",
    "Update your browser regularly",
    "Use a VPN for additional privacy"
  ],
  "timestamp": "2024-12-03T10:30:45Z"
}
```

---

### 10. **Device Checker** — `/api/device`

Get device specifications and support information.

**Parameters:**
- `model` (optional, default: "Unknown") — Device model

```bash
curl "https://api.zwanski.tech/api/device?model=iPhone14"
```

**Response:**
```json
{
  "model": "iPhone14",
  "specs": "6.1\" OLED, A16 Bionic",
  "os": "iOS 16+",
  "maintenance": "excellent",
  "carrier_support": "all",
  "repair_difficulty": "moderate",
  "lifecycle": "active"
}
```

---

### 11. **Ping Monitor** — `/api/ping`

Check website uptime and response time.

**Parameters:**
- `url` (required) — Domain to check

```bash
curl "https://api.zwanski.tech/api/ping?url=example.com"
```

**Response:**
```json
{
  "url": "example.com",
  "status": 200,
  "response_time_ms": 42,
  "edge_location": "lax",
  "timestamp": "2024-12-03T10:30:45Z"
}
```

---

### 12. **Crypto Price** — `/api/crypto`

Get cryptocurrency price in USD.

**Parameters:**
- `symbol` (optional, default: BTC) — Crypto symbol

```bash
curl "https://api.zwanski.tech/api/crypto?symbol=ETH"
```

**Response:**
```json
{
  "symbol": "ETH",
  "price": 2250.50,
  "currency": "USD",
  "source": "CoinGecko (free API)",
  "timestamp": "2024-12-03T10:30:45Z"
}
```

---

## 🛠️ Architecture

### File Structure

```
zwanski-cf-worker/
├── src/
│   ├── index.js          # Main Worker entry point
│   └── routes/           # (Optional) Route modules
├── public/
│   └── index.html        # Frontend portal
├── wrangler.toml         # Cloudflare Workers config
├── package.json          # Dependencies
└── README.md             # This file
```

### Technology Stack

- **Runtime:** Cloudflare Workers (V8 JavaScript engine)
- **Framework:** itty-router (lightweight routing)
- **Deployment:** Wrangler CLI
- **Frontend:** Vanilla HTML/CSS/JS
- **Hosting:** Cloudflare's global edge network

---

## 🔒 Security & Privacy

✅ **CORS enabled** — Safe cross-origin requests  
✅ **Security headers** — X-Frame-Options, X-Content-Type-Options  
✅ **HTTPS only** — All traffic encrypted  
✅ **No logging** — User data not stored  
✅ **Rate limiting** — (Can be added via Cloudflare rules)  
✅ **Privacy-first** — Only uses non-sensitive Cloudflare headers  

---

## 📊 Performance

Expected response times:
- **IP/Geo/Timezone:** < 10ms
- **Hash/Quote:** < 5ms
- **Crypto price:** ~100–200ms (depends on CoinGecko)
- **Ping:** ~50–200ms (depends on target)

---

## 🚀 Scaling

Cloudflare Workers automatically scales to millions of requests per day. No infrastructure management required.

**Included:**
- Auto-scaling
- Global CDN
- DDoS protection
- SSL/TLS
- Performance monitoring

---

## 📋 Example Use Cases

1. **Developer Tools** — Build a SaaS tool dashboard
2. **Status Page** — Monitor API and website uptime
3. **Security Scanner** — Integrated score API
4. **Privacy Dashboard** — User fingerprint info
5. **Crypto Tracker** — Real-time price monitoring
6. **Password Manager Helper** — Generate strong passwords
7. **Analytics Backend** — Lightweight data collection

---

## 🤝 Contributing

Want to add more APIs? Fork the repo and submit a PR with:

- New endpoint in `src/index.js`
- Example request/response in README
- Security & privacy review

---

## 📜 License

MIT © 2024 Zwanski Tech

---

## 🔗 Links

- **GitHub:** https://github.com/zwanski01/zwanski-cf-worker
- **Main Site:** https://zwanski01.github.io/zwanski-store/
- **Cloudflare Workers Docs:** https://developers.cloudflare.com/workers/

---

**Built with ❤️ by Zwanski Tech — Fast, Secure, Global.**
