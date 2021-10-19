# Discord Guild Gateway Worker

A Cloudflare Worker for restricting access to a site based on membership in a Discord guild (server).

## Installation

1. Download and install [wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update), the CLI for Cloudflare workers
2. Copy this worker with `wrangler generate my-discord-gateway https://github.com/dacruz21/discord-guild-gateway-worker`
3. Create a Discord application at https://discord.com/developers/applications
4. In the Discord application settings:
   1. Click OAuth2 on the left
   2. Note your client ID and client secret for later
   3. Add a redirect of the form `https://my.site.com/_discord/oauth` for each site you intend to deploy the worker to
5. Generate a ES256 public/private keypair in PKCS8 (private) and SPKI (public) format.
6. Edit `wrangler.toml`, providing the following values:
    | Variable   | Description |
    |------------|-------------|
    | CLIENT_ID  | Discord client ID from step 4.2 |
    | GUILD_ID   | Discord guild ID, found by right-clicking a server icon and clicking "Copy ID" from within Discord |
    | GUILD_NAME | Name of your Discord guild, shown to users who do not have access |
    | JWT_PUB    | Public key from step 5 |
7. Create secret variables with `wrangler secret put`:
    | Variable      | Description |
    |---------------|-------------|
    | CLIENT_SECRET | Discord client secret from step 4.2 |
    | JWT_KEY       | Private key from step 5
8. Deploy the worker with `wrangler deploy`
9. Log into the Cloudflare dashboard at https://dash.cloudflare.com
10. Select the zone of the site(s) you intend to deploy the worker to
11. Select the Workers tab at the top
12. Click Add route, specifying the path of sites to protect (ex. `https://my.site.com/*`), and the worker from the dropdown
13. Open your site in your browser! You should be redirected to Discord to check your list of guilds, and redirected to your site after authorizing the check.
