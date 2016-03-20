var credentials = require('./credentials');
var PlugAPI = require('plugapi');
var plug = new PlugAPI(credentials);
var Discord = require("discord.js");
var discord = new Discord.Client();

discord.on("ready", function () {
	console.log("Discord> Ready to begin!");
});

discord.on("message", function(message){
	if (message.author.username != discord.user.username && message.channel == discord.channels[credentials.channelID])
	{
		var formated_message = message.content;
		for (var mentionID in message.mentions)
			formated_message = formated_message.replace("<@" + message.mentions[mentionID].id + ">", "@" + message.mentions[mentionID].username);
		plug.sendChat("<" + message.author.username + "> " + formated_message);
		formated_message = null;
		delete formated_message;
	}
});
discord.login(credentials.email, credentials.password).then(success).catch(err);

function success(token) {
    console.log("Discord> Logged");
}

function err(error) {
	console.log("Discord> error during credentials exchange");
	console.log(error);
	process.exit(1);
}


plug.connect(credentials.plugdjChannel);

plug.on('roomJoin', function(room) {
    console.log("Joined " + room);
});

setInterval(function()
{
	if (plug.getTimeRemaining() == 0 && plug.getDJ() != null)
		plug.moderateForceSkip();
}, 4000);

plug.on('chat', function(data) {
    if (data.type == "message" && data.from != plug.getSelf().username)
		discord.sendMessage(discord.channels[credentials.channelID], "<**" + data.from + "**> " + data.message);
});

plug.on ('advance', function(data) {
	if (data.media != null)
	{
		discord.setStatus("online", data.media.title, function(err) {
			if (err != null)
				console.log(err);
		});
	}
});
