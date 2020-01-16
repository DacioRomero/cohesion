const SteamWrapper = require('@dacio/steam-wrapper').default;

module.exports = new SteamWrapper(process.env.STEAM_API_KEY);
