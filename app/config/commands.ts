
import {PermissionFlagsBits, PermissionsBitField} from 'discord.js';

export default [
    // General
    {
        name: 'settings',
        description: 'Show your personal settings.',
        requiredPermissions: undefined,
        requiredBotPermissions: undefined,
        ephemeral: false,
        arguments: [],
        classType: 'SettingCommand',
    },
    {
        name: 'set-play-times',
        description: 'Set times when to receive notifications.',
        requiredPermissions: undefined,
        requiredBotPermissions: undefined,
        ephemeral: true,
        arguments: [],
        classType: 'SettingCommand',
    },
    {
        name: 'notify-for-all-games',
        description: 'Toggle notifications for all games on/off.',
        requiredPermissions: undefined,
        requiredBotPermissions: undefined,
        ephemeral: false,
        arguments: [],
        classType: 'SettingCommand',
    },
    {
        name: 'time-zone',
        description: 'Set your time zone.',
        requiredPermissions: undefined,
        requiredBotPermissions: undefined,
        ephemeral: false,
        arguments: [
            {
                name: 'time-zone',
                description: 'The time zone you want to set.',
                required: true,
                type: 'String',
            },
        ],
        classType: 'SettingCommand',
    },
    // Games
    {
        name: 'games',
        description: 'Look up and subscribe to games.',
        requiredPermissions: undefined,
        requiredBotPermissions: undefined,
        ephemeral: true,
        arguments: [
            {
                name: 'search',
                description: 'Search for a game.',
                required: false,
                type: 'String',
            },
        ],
        classType: 'GameCommand',
    },
    {
        name: 'ignore-games',
        description: 'Look up and ignore games.',
        requiredPermissions: undefined,
        requiredBotPermissions: undefined,
        ephemeral: true,
        arguments: [
            {
                name: 'search',
                description: 'Search for a game.',
                required: false,
                type: 'String',
            },
        ],
        classType: 'GameCommand',
    },
    {
        name: 'add-game',
        description: 'Add a game.',
        requiredPermissions: PermissionFlagsBits.ManageChannels,
        requiredBotPermissions: undefined,
        ephemeral: false,
        arguments: [
            {
                name: 'game',
                description: 'The game you want to add.',
                required: true,
                type: 'String',
            },
        ],
        classType: 'GameCommand',
    },
    {
        name: 'remove-game',
        description: 'Remove a game.',
        requiredPermissions: PermissionFlagsBits.ManageChannels,
        requiredBotPermissions: undefined,
        ephemeral: false,
        arguments: [
            {
                name: 'game',
                description: 'The game you want to remove.',
                required: true,
                type: 'String',
            },
        ],
        classType: 'GameCommand',
    },
    {
        name: 'add-alias',
        description: 'Add an alias to a game.',
        requiredPermissions: PermissionFlagsBits.ManageChannels,
        requiredBotPermissions: undefined,
        ephemeral: false,
        arguments: [
            {
                name: 'game',
                description: 'The game you want to add an alias to.',
                required: true,
                type: 'String',
            },
            {
                name: 'alias',
                description: 'The alias you want to add to this game.',
                required: true,
                type: 'String',
            },
        ],
        classType: 'GameCommand',
    },
    {
        name: 'remove-alias',
        description: 'Remove an alias from a game.',
        requiredPermissions: PermissionFlagsBits.ManageChannels,
        requiredBotPermissions: undefined,
        ephemeral: false,
        arguments: [
            {
                name: 'alias',
                description: 'The alias you want to remove.',
                required: true,
                type: 'String',
            },
        ],
        classType: 'GameCommand',
    },
    {
        name: 'aliases',
        description: 'View all aliases belonging to a game.',
        requiredPermissions: undefined,
        requiredBotPermissions: undefined,
        ephemeral: false,
        arguments: [
            {
                name: 'game',
                description: 'The game you want to see the aliases of.',
                required: true,
                type: 'String',
            },
        ],
        classType: 'GameCommand',
    },
    {
        name: 'lfg',
        description: 'Post a \'looking for group\' message for a game.',
        requiredPermissions: undefined,
        requiredBotPermissions: new Map([
            [PermissionFlagsBits.ManageRoles, 'manage roles'],
            [PermissionFlagsBits.SendMessages, 'send messages'],
        ]),
        ephemeral: true,
        arguments: [
            {
                name: 'message',
                description: 'Your message. Games will be converted into role mentions.',
                required: true,
                type: 'String',
            },
        ],
        classType: 'GameCommand',
    },
];
