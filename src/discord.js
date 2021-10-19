const getRedirectURI = (request) => {
  const origin = new URL(request.url).origin;
  return origin + '/_discord/oauth';
};

export const getDiscordOAuthURL = (request) => {
  const redirectURI = encodeURIComponent(getRedirectURI(request));
  return `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectURI}&response_type=code&scope=guilds`;
};

export const getDiscordTokens = async (request, code) => {
  const res = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: getRedirectURI(request),
      scope: 'guilds',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return res.json();
};

export const getGuilds = async (token) => {
  const res = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};
