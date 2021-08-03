module.exports = {
	name: "relocate",
	aliases: [],
	description: "Flytta den aktuella kanalen till en annan kategori.",
	usage: ["relocate <categoryID>"],
	perms: ["adminCmd"],
	async do(message, args) {
		await message.channel.setParent(args[0]).then(() => {
			message.channel.send(`Jag flyttade kanalen till \`${message.channel.parent.name.toUpperCase()}\``);
		}).catch(err => {
			message.channel.send(`Det finns ingen kategori med id: \`${args[0]}\``);
		});
	}
}