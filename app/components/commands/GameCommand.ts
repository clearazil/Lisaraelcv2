import Command from '@components/Command';
import type CommandInterface from '../interfaces/CommandInterface';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} from 'discord.js';
import Game from '@database/models/Game';
import Guild from '@database/models/Guild';
import GameLister from '@components/GameLister';

export default class GameCommand extends Command implements CommandInterface {
    public run() {
        if (this.interaction.commandName === 'games') {
            console.log('Running games command...');
            void this.listGames();
        }
    }

    public hasPermissions() {
        return true;
    }

    public async listGames() {
        // Search
        // Grab first 5 games from Database paginate
        // Need to remember:
        // search term used
        // page we were on
        // Max 5 rows, max 5 buttons per row

        const gameLister = await GameLister.createGameLister(this.interaction);

        if (gameLister === undefined) {
            await this.interaction.reply({content: 'This server doesn\'t have any games! Ask a moderator to add some.'});
            return;
        }

        const description = gameLister.getDescription();
        const rows = gameLister.getActionRows();

        const embeds = [
            new EmbedBuilder()
                .setColor(0x0099FF)
                .setDescription(description),
        ];

        await this.interaction.reply({embeds, components: rows});
    }
}
