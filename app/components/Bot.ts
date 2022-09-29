import type {Client} from 'discord.js';
import {REST, Routes} from 'discord.js';
import config from '@config/general';
import type commands from '@config/commands';
import CommandBuilder from './CommandBuilder';

/**
 *
 */
export default class Bot {
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async login() {
        await this.client.login(config.discord.token);
    }

    public async registerCommands(commandsList: typeof commands) {
        const slashCommands = new CommandBuilder(commandsList).run();
        const rest = new REST({version: '10'}).setToken(config.discord.token);

        this.client.once('ready', async () => {
            const results = [];
            for (const guild of this.client.guilds.cache.values()) {
                results.push(rest.put(
                    Routes.applicationGuildCommands(config.discord.appId, guild.id), {body: slashCommands},
                ));
            }

            await Promise.all(results);
        });
    }

    public testFunction() {
        return 'This is a test function';
    }
}

