class Log {
	static client = null;
	static errorChannel = null;

	static configure(client, errorChannel) {
		this.client = client;
		this.errorChannel = errorChannel;
	}
	static error(body) {
		let channel = this.client.channels.cache.get(this.errorChannel);
		channel.send(body);
	}
}

module.exports = { Log };