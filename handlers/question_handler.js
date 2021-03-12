const fs = require("fs");

module.exports = (client) => {
	const question_files = fs.readdirSync(`./commands/on_question/`).filter(file => file.endsWith(".js"));
	for (const file of question_files) {
		const question_command = require(`../commands/on_question/${file}`);
		if (question_command.name) {
			client.question_commands.set(question_command.name, question_command);
		} else {
			console.log("Question command Name error!");
		}
	}
}