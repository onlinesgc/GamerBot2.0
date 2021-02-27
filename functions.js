module.exports = {
	msToString(input) {
		let totalSeconds = (input / 1000);
		let days = Math.floor(totalSeconds / 86400);
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = Math.floor(totalSeconds % 60);
		let time = `${input} milliseconds`;
		if (days > 0) {
			time = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
		} else if (days === 0 && hours > 0) {
			time = `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
		} else if (days === 0 && hours === 0 && minutes > 0) {
			time = `${minutes} minutes and ${seconds} seconds`;
		} else if (days === 0 && hours === 0 && minutes === 0 && seconds > 0) {
			time = `${seconds} seconds`;
		}
		if (days === 1) {
			time = time.replace("days", "day");
		}
		if (hours === 1) {
			time = time.replace("hours", "hour");
		}
		if (minutes === 1) {
			time = time.replace("minutes", "minute");
		}
		if (seconds === 1) {
			time = time.replace("seconds", "second");
		}
		return time;
	},
	checkIfMentioned(message) {
		if (message.mentions.members.first()) {
			if (message.mentions.members.first() === message.guild.me) {
				return true;
			}
		}
		return false;
	},
	getRandomIntRange(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}