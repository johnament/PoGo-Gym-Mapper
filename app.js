// Load up the discord.js library
const Discord = require("discord.js");

// Load sqlite3 library
const sqlite3 = require("sqlite3").verbose();

// Load sqlite file of gym info generated elsewhere (requires columns "name", "latitude", "longitude"
const db = new sqlite3.Database('gymdetails');

// Create the main client object with methods to interface with Discord
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.
// config.gmapsApiKey contains the bot's Google Maps Static API key

const gmapsUrlBase = 'https://www.google.com/maps/search/?api=1&query=';

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setActivity(`on ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`on ${client.guilds.size} servers`);
});

client.on("error", error => {
  console.log("Received an error ${error}");
});

client.on("guildDelete", guild => {
  // This event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`on ${client.guilds.size} servers`);
});

client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // skip self messages
  if (message.author == client.user) return; 
  
  // skip other bot messages
  if (message.author.bot) return;
  
  // Remove any mentions but save the mentions TODO
  const content = message.content.replace(/<(@|#)\d+>/g, '').trim();
  const mentions = message.content.match(/(<(@|#)\d+>)/g);
  var mentionsStr = '';
  if (mentions != null) {
    mentionsStr = mentions.join(' ');
  }
  
  // Ignore any message that does not start with our prefix, 
  if (content.indexOf(config.prefix) !== 0) return;
  
  // Separate our "command" name, and our "arguments" for the command. 
  const args = content.split(/\s+/g);
  const command = args.shift().slice(config.prefix.length).toLowerCase();
    
  if (command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Testing ping...");
    m.edit(`Pongo! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if (command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
  }
  
  // get a Google Maps url based on the gym name. not case sensitive. periods and asterisks are removed.
  // e.g. +whereis washington's crossing
  if (command === "where" || command === "whereis" || command === "map") {
    const enteredLoc = args.join(' ').replace(/\*/g, '').trim(); // remove any asterisks
    findGymCoords(enteredLoc, results => {
      if (results != null && results.length > 0) {
        for (row of results) {
          const exRaidEmoji = client.emojis.get("408703057950408724")
          const exRaid = row.exraid_eligible === 1 ? exRaidEmoji : ''
          message.reply(`**${row.name}**: ${gmapsUrlBase}${row.latitude},${row.longitude} ${mentionsStr} ${exRaid}`);
        }
      } else {
        message.reply(`Sorry, I couldn't find a gym named **${enteredLoc}**. Please check that you entered the name correctly.`);
        console.log(`Could not find gym named: ${enteredLoc} ${mentionsStr}`);
      }
    });
  }
});

function findGymCoords(enteredLoc, callback) {
  const searchLoc = '%'+enteredLoc+'%';
  db.all('SELECT DISTINCT name,latitude,longitude, exraid_eligible FROM gym g LEFT JOIN gym_aliases ga using (name) where g.name like ? or ga.alias_name like ?', searchLoc, searchLoc,
    (err, rows) => {
      if (err) {
        console.log(`Database error finding raid: ${err}`);
        callback(null);
      } else {
        callback(rows);
      }
    }
  );
}

db.on("error", error => console.log("Database error: ", error));

process.on('uncaughtException', function(err) {
  console.log("uncaughtException");
  console.error(err.stack);
  process.exit();
});

process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});

client.login(config.token);
