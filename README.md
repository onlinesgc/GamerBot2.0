# GamerBot2.0

## What is Gamerbot2.0?
Gamerbot2.0 is a discord-bot developed by-and-for the STAMSITE discord community. The intended purpose is to facilitate levelup-bonuses and fun interactions for the discord community, and to potentially be expanded to include a few small minigames in the future :D



STAMSITE is not involved in the development of this bot, do NOT ask him about issues with it. Contact @Sake100#1952 or @Little_Fox#2194 on discord with issues or leave an issue under [Issues](https://github.com/stamdiscord/GamerBot2.0/issues) here on GitHub if you have discovered a bug.

## Running your own GamerBot2.0!

### Installation
GamerBot2.0 requires node.js, npm and MongoDB to run.

1. Clone this repository into the directory you want to run the bot in.
2. Run `npm install` in order to install all the required node.js packages.
3. Create a new bot under [Discord developers portal](https://discord.com/developers)
4. Set up a MongoDB database (the free tier will do fine).
5. in the `.env` file in the GamerBot2.0 directory add the following:

        token = YOUR_DISCORD_BOT_TOKEN
        mongodb_srv = ADDRESS_TO_MONGODB_SERVICE
        config_id = normally 1 but can be changed for debugging purposes or running several bots on the same database.
6. To run the bot type `node GamerBot2.0.js` and if you have invited the bot to your server you should see it coming online!

### Commands:
TODO




## Contribution
If you want to contribute to the development of the bot you can do so in the following ways:
- **Create a new [issue](https://github.com/stamdiscord/GamerBot2.0/issues):** This is used to notify others that you've found a bug that needs to be fixed or that you want a new feature.
- **Make a [Pull Request](https://github.com/stamdiscord/GamerBot2.0/pulls):** Make Pull Requests with small changes. Try to only face one issue at a time.

