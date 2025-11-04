const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(config.reviveCommand.name)
        .setDescription(config.reviveCommand.description)
        .addIntegerOption(option =>
            option.setName('id')
                .setDescription('Die Server-ID des Spielers')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(1024)
        ),

    async execute(interaction) {
        // Rolle überprüfen
        const requiredRoleId = process.env.REVIVE_ROLE_ID;

        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return await interaction.reply({
                content: config.messages.noPermission,
                ephemeral: true
            });
        }

        const playerId = interaction.options.getInteger('id');

        // Defer reply da FiveM Request länger dauern kann
        await interaction.deferReply();

        try {
            // Request an FiveM Server senden
            const fivemUrl = `http://${process.env.FIVEM_SERVER_IP}:${process.env.FIVEM_SERVER_PORT}/revive`;

            const response = await axios.post(fivemUrl, {
                playerId: playerId,
                apiKey: process.env.FIVEM_API_KEY
            }, {
                timeout: config.reviveCommand.timeout,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                await interaction.editReply({
                    content: config.messages.success.replace('{id}', playerId)
                });

                console.log(`[REVIVE] Spieler ${playerId} wurde von ${interaction.user.tag} wiederbelebt`);
            } else {
                await interaction.editReply({
                    content: response.data.message || config.messages.error.replace('{id}', playerId)
                });
            }

        } catch (error) {
            console.error('[ERROR] Fehler beim Revive Request:', error.message);

            let errorMessage = config.messages.error.replace('{id}', playerId);

            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                errorMessage = config.messages.serverOffline;
            } else if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            }

            await interaction.editReply({
                content: errorMessage
            });
        }
    }
};
