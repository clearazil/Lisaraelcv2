import Command from '@components/Command';
import type CommandInterface from '../interfaces/CommandInterface';

export default class GeneralCommand extends Command implements CommandInterface {
    public run() {
        if (this.interaction.commandName === 'help') {
            console.log('Running help command...');

            void this.help();
        }
    }

    public async help() {
        let contentReply = 'Lisaraelc notifies you for games others are playing.\n\n';
        contentReply += 'You can enable notifications by running these commands:\n';
        contentReply += '`/set-playing-times` set the times you wish to receive notifications at\n';
        contentReply += '`/games` set the games you want to receive notifications for\n';
        contentReply += '`/notify-for-all-games` alternatively, you can use this to get them for all games\n\n';
        contentReply += 'Alerting others for game(s):\n';
        contentReply += '`/lfg <message>` type a message about a game. Your message will be posted and game names will be replaced with (automatically assigned) roles\n\n';
        contentReply += 'Other commands:\n';
        contentReply += '`/time-zone` set your time zone\n';
        contentReply += '`/aliases <game>` some games have aliases, use this to view them\n';
        contentReply += '`/ignore-games` make exceptions for games if you have notifications for all games turned on\n';
        contentReply += '`/settings` view your personal settings for this bot';

        const embed = {
            color: 0x0099ff,
            title: 'Getting notifications for games',
            description: contentReply,
            thumbnail: {
                url: 'https://i.imgur.com/oE4ozlI.png',
            },
        };

        await this.interaction.reply({embeds: [embed]});
    }
}
