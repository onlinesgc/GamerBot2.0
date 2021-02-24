const fs = require("fs");

module.exports = (client) => {
  const load_dir = (dir) => {
    const eventFiles = fs
      .readdirSync(`./events/${dir}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      const event = require(`./events/${dir}/${file}`);
      if (event.once) {
        client.once(event.name, (...args) => event.do(...args, client));
      } else {
        client.on(event.name, (...args) => event.do(...args, client));
      }
    }
  };

  ["client", "guild"].forEach((e) => load_dir(e));
};
