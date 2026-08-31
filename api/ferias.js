module.exports = async function handler(req, res) {
  return res.status(410).json({ error: 'Este sorteo ha finalizado. El registro ya no está disponible.' });
};
