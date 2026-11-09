// Tiferet: small read-only status endpoint for the listmonk dashboard.
// Returns Amazon SES sending quota + AWS Free plan credit balance as JSON.
// Env: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SES_REGION (default eu-north-1),
//      ALLOW_ORIGIN (default https://lists.tiferet-ly.com), PORT (default 8080).
'use strict';
const http = require('http');
const https = require('https');
const crypto = require('crypto');

const KEY = process.env.AWS_ACCESS_KEY_ID || '';
const SECRET = process.env.AWS_SECRET_ACCESS_KEY || '';
const REGION = process.env.SES_REGION || 'eu-north-1';
const ORIGIN = process.env.ALLOW_ORIGIN || 'https://lists.tiferet-ly.com';
const PORT = parseInt(process.env.PORT || '8080', 10);
const CACHE_MS = 10 * 60 * 1000;

const hmac = (k, s) => crypto.createHmac('sha256', k).update(s, 'utf8').digest();
const sha = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');

// AWS Signature V4. Returns headers to send.
function sign({ method, host, path, region, service, body, headers, amzDate }) {
  amzDate = amzDate || new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
  const date = amzDate.slice(0, 8);
  const h = Object.assign({ host, 'x-amz-date': amzDate }, headers || {});
  const names = Object.keys(h).map((n) => n.toLowerCase()).sort();
  const lower = {};
  Object.keys(h).forEach((n) => { lower[n.toLowerCase()] = String(h[n]).trim(); });
  const canonHeaders = names.map((n) => n + ':' + lower[n] + '\n').join('');
  const signed = names.join(';');
  const canonReq = [method, path, '', canonHeaders, signed, sha(body || '')].join('\n');
  const scope = [date, region, service, 'aws4_request'].join('/');
  const toSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha(canonReq)].join('\n');
  let k = hmac('AWS4' + SECRET, date);
  k = hmac(k, region); k = hmac(k, service); k = hmac(k, 'aws4_request');
  const sig = crypto.createHmac('sha256', k).update(toSign, 'utf8').digest('hex');
  lower.authorization = 'AWS4-HMAC-SHA256 Credential=' + KEY + '/' + scope +
    ', SignedHeaders=' + signed + ', Signature=' + sig;
  return lower;
}

function call(opts) {
  return new Promise((resolve, reject) => {
    const headers = sign(opts);
    const req = https.request({ host: opts.host, path: opts.path, method: opts.method, headers, timeout: 15000 }, (res) => {
      let d = '';
      res.on('data', (c) => { d += c; });
      res.on('end', () => {
        if (res.statusCode >= 300) return reject(new Error(opts.service + ' ' + res.statusCode + ': ' + d.slice(0, 300)));
        try { resolve(JSON.parse(d || '{}')); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('timeout')));
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

const sesAccount = () => call({
  method: 'GET', host: 'email.' + REGION + '.amazonaws.com', path: '/v2/email/account',
  region: REGION, service: 'ses', body: '',
});

const planState = () => call({
  method: 'POST', host: 'freetier.us-east-1.api.aws', path: '/',
  region: 'us-east-1', service: 'freetier', body: '{}',
  headers: { 'content-type': 'application/x-amz-json-1.0', 'x-amz-target': 'AWSFreeTierService.GetAccountPlanState' },
});

let cache = null;
let cacheAt = 0;

async function status() {
  if (cache && Date.now() - cacheAt < CACHE_MS) return cache;
  const out = { updated: new Date().toISOString() };
  const [ses, plan] = await Promise.allSettled([sesAccount(), planState()]);
  if (ses.status === 'fulfilled') {
    const q = ses.value.SendQuota || {};
    out.ses = {
      max24h: q.Max24HourSend, sent24h: q.SentLast24Hours, maxRate: q.MaxSendRate,
      production: ses.value.ProductionAccessEnabled, sendingEnabled: ses.value.SendingEnabled,
      status: ses.value.EnforcementStatus,
    };
  } else out.sesError = String(ses.reason && ses.reason.message);
  if (plan.status === 'fulfilled') {
    const p = plan.value;
    out.plan = {
      type: p.accountPlanType, status: p.accountPlanStatus,
      credits: p.accountPlanRemainingCredits, expires: p.accountPlanExpirationDate,
    };
  } else out.planError = String(plan.reason && plan.reason.message);
  cache = out; cacheAt = Date.now();
  return out;
}

http.createServer(async (req, res) => {
  const cors = { 'Access-Control-Allow-Origin': ORIGIN, 'Vary': 'Origin', 'Cache-Control': 'no-store' };
  if (req.url === '/health') { res.writeHead(200, cors); return res.end('ok'); }
  if (req.url !== '/status') { res.writeHead(404, cors); return res.end(); }
  if (!KEY || !SECRET) { res.writeHead(503, cors); return res.end('{"error":"no credentials"}'); }
  try {
    const s = await status();
    res.writeHead(200, Object.assign({ 'Content-Type': 'application/json' }, cors));
    res.end(JSON.stringify(s));
  } catch (e) {
    res.writeHead(502, cors); res.end(JSON.stringify({ error: String(e.message) }));
  }
}).listen(PORT, () => console.log('ses-status listening on ' + PORT));

module.exports = { sign };
