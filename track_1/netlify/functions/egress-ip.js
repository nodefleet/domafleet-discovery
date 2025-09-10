exports.handler = async () => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const json = await res.json();
    const ip = json && json.ip ? json.ip : null;

    console.log('Netlify egress IP:', ip);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
      body: JSON.stringify({
        ip,
        region: process.env.AWS_REGION || process.env.NETLIFY_REGION || null,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Failed to fetch egress IP', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Failed to fetch egress IP' }),
    };
  }
};
