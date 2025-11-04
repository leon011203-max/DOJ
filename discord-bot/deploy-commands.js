const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Commands laden
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`[INFO] Command geladen: ${command.data.name}`);
    } else {
        console.log(`[WARNING] Command in ${filePath} fehlt "data" oder "execute" property.`);
    }
}

// REST API Instance
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Commands deployen
(async () => {
    try {
        console.log(`[INFO] Starte Deployment von ${commands.length} Slash Command(s)...`);

        // Commands für einen spezifischen Server registrieren (schneller)
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log(`[SUCCESS] ✅ ${data.length} Slash Command(s) erfolgreich registriert!`);

        // Optional: Für globale Commands (dauert bis zu 1 Stunde)
        // await rest.put(
        //     Routes.applicationCommands(process.env.CLIENT_ID),
        //     { body: commands },
        // );

    } catch (error) {
        console.error('[ERROR] Fehler beim Deployment:', error);
    }
})();
