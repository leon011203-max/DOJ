const { Client, GatewayIntentBits, Collection } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = require('./config.json');

// Discord Client erstellen
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ]
});

// Commands Collection
client.commands = new Collection();

// Commands laden
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`[INFO] Command geladen: ${command.data.name}`);
        } else {
            console.log(`[WARNING] Command in ${filePath} fehlt "data" oder "execute" property.`);
        }
    }
}

// Event: Bot ist bereit
client.once('ready', () => {
    console.log('=================================');
    console.log(`✅ Bot ist online als ${client.user.tag}`);
    console.log(`📊 Auf ${client.guilds.cache.size} Server(n)`);
    console.log('=================================');

    // Status setzen
    client.user.setActivity('FiveM Server', { type: 3 }); // 3 = Watching
});

// Event: Interaction (Slash Commands)
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`Kein Command mit dem Namen ${interaction.commandName} gefunden.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Fehler beim Ausführen von ${interaction.commandName}:`, error);

        const errorMessage = { content: '❌ Es gab einen Fehler beim Ausführen dieses Commands!', ephemeral: true };

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
});

// Event: Fehlerbehandlung
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Bot einloggen
client.login(process.env.DISCORD_TOKEN);
