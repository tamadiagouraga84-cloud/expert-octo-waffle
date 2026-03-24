export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Rate limiting simple par IP
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  const now = Date.now();
  if (!global._rateLimits) global._rateLimits = {};
  const userLimit = global._rateLimits[ip] || { count: 0, resetAt: now + 3600000 };
  if (now > userLimit.resetAt) { userLimit.count = 0; userLimit.resetAt = now + 3600000; }
  const MAX_PER_HOUR = parseInt(process.env.MAX_CV_PER_HOUR || '5');
  if (userLimit.count >= MAX_PER_HOUR) {
    return res.status(429).json({ error: `Limite atteinte : ${MAX_PER_HOUR} CV/heure. Réessayez plus tard.` });
  }
  userLimit.count++;
  global._rateLimits[ip] = userLimit;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Clé API non configurée.' });

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Données manquantes.' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err.error?.message || 'Erreur génération.' });
    }

    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({
      html: data.content[0]?.text || '',
      remaining: MAX_PER_HOUR - userLimit.count
    });

  } catch (error) {
    console.error('Erreur:', error);
    return res.status(500).json({ error: 'Erreur interne.' });
  }
}
