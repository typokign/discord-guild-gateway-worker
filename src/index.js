import { signJWT, verifyJWT } from './jwt';
import { getDiscordOAuthURL, getDiscordTokens, getGuilds } from './discord';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});

const handleRequest = async (request) => {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/_discord/oauth')) {
    return handleCallback(request);
  }

  const cookies = request.headers.get('Cookie')?.split('; ');
  if (cookies != null) {
    const jwt = Object.fromEntries(
      cookies.map(cookie => cookie.split('='))
    )['discordAuthJWT'];

    if (jwt != null) {
      if (await verifyJWT(jwt)) {
        return fetch(request);
      } else {
        return new Response('invalid token, clear cookies and try again', { status: 403 });
      }
    }
  }

  const redirect = getDiscordOAuthURL(request);
  return Response.redirect(redirect, 302);
};

const handleCallback = async (request) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (code == null) {
    return new Response('no code found', { status: 400 });
  }

  const tokens = await getDiscordTokens(request, code);
  let guilds = await getGuilds(tokens.access_token);
  guilds = guilds.map(guild => guild.id);
  if (!guilds.includes(GUILD_ID)) {
    return new Response(`This site is only for members of ${GUILD_NAME}`, { status: 403 });
  }

  const jwt = await signJWT();

  const root = url.origin + '/';
  const cookie = [
    `discordAuthJWT=${jwt}`,
    `Max-Age=${60 * 60 * 24 * 7}`, // seconds, expire in 1 week
    `Path=/`,
  ].join('; ');

  return new Response('Authorized, redirecting', {
    status: 302,
    headers: {
      Location: root,
      'Set-Cookie': cookie,
    },
  });
};
