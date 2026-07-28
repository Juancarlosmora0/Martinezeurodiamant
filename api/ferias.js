module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { nombre, email, aceptaMarketing } = req.body || {};

  if (!nombre || !email || typeof nombre !== 'string' || typeof email !== 'string') {
    return res.status(400).json({ error: 'Nombre y email son obligatorios' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email no válido' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Configuración del servidor incompleta' });
  }

  try {
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          FIRSTNAME: nombre,
          SORTEO_FERIAS: true,
          ACEPTA_MARKETING: !!aceptaMarketing
        },
        listIds: [3],
        updateEnabled: true
      })
    });

    if (brevoRes.ok || brevoRes.status === 204) {
      return res.status(200).json({ ok: true });
    }

    const data = await brevoRes.json().catch(() => ({}));
    return res.status(502).json({ error: data.message || 'Error al registrar en Brevo' });
  } catch (err) {
    return res.status(500).json({ error: 'Error al conectar con el servicio de email' });
  }
};
