export default async function handler(req, res) {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Missing name parameter' });

  try {
    const response = await fetch(
      `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(name)}?limit=1`,
      {
        headers: {
          'X-RapidAPI-Key': 'af7754f17bmshc95f932574bacd6p142395jsnc602e7e85e2a',
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        },
      }
    );
    const data = await response.json();
    if (data && data[0] && data[0].gifUrl) {
      res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
      return res.status(200).json({ gifUrl: data[0].gifUrl });
    }
    return res.status(404).json({ error: 'Not found' });
  } catch (e) {
    return res.status(500).json({ error: 'API error' });
  }
}
