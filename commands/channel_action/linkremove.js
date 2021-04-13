const configModel = require("../../models/configSchema");

module.exports = {
	name: "linkremove",
	channels: ["816724723739656222"], //channels that are ignored
	roles: [], //Roles that are igonred
	async do(message, profileData) {
		let configData = await configModel.fetchConfig(process.env.config_id);		//Retreive options
		if (!configData.removeLinks) return;
		if(!channels.find(c => c == message.channel.id)) return;
		var HaveRole;
		roles.forEach(element => {
			if(message.member.roles.cache.get(element) == element){HaveRole= true; return;}
		});
		if(HaveRole) return;
		if(urlfind(message.content) != null){
			message.delete()
			message.reply("Sicka inte länkar!").than(del => del.delete({timeout:1000 * 5}))
		}


		/*let regx = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
		if (regx.test(message.content.toLowerCase().replace(/\s+/g, ''))) {
			setTimeout(function() {
				message.delete()
			}, 2000);
			message.reply("Skicka inte länkar tack!");
		}*/
	}
}
function urlfind(text) {
	var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
	return text.match(urlRegex);
}