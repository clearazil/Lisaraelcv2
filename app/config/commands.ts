
import {PermissionFlagsBits} from 'discord.js';

export default [
    // General
    {
        name: 'settings',
        description: 'Show your personal settings.',
        requiredPermissions: undefined,
        ephemeral: false,
        arguments: [],
        classType: 'SettingCommand',
    },
    {
        name: 'game-settings',
        description: 'Shows the games you are (or are not) subscribed to.',
        requiredPermissions: undefined,
        ephemeral: false,
        arguments: [],
        classType: 'SettingCommand',
    },
    {
        name: 'time-zone',
        description: 'Set your time zone.',
        requiredPermissions: undefined,
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
    // Setup
    {
        name: 'setup',
        description: 'View setup requirements.',
        requiredPermissions: PermissionFlagsBits.Administrator,
        ephemeral: false,
        arguments: [],
        classType: 'SetupCommand',
    },
    {
        name: 'setup-playing-channel',
        description: 'Set the \'now playing\' channel.',
        requiredPermissions: PermissionFlagsBits.Administrator,
        ephemeral: false,
        arguments: [
            {
                name: 'channel',
                description: 'The channel where messages from the /lfg command are displayed.',
                required: true,
                type: 'Channel',
            },
        ],
        classType: 'SetupCommand',
    },
    // Games
    {
        name: 'add-game',
        description: 'Add a game.',
        requiredPermissions: PermissionFlagsBits.ManageChannels,
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
        ephemeral: false,
        arguments: [
            {
                name: 'game',
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
        name: 'purge-roles',
        description: 'Purge roles not used after a given date.',
        requiredPermissions: PermissionFlagsBits.Administrator,
        ephemeral: false,
        arguments: [
            {
                name: 'date',
                description: 'Purge the roles that haven\'t been used after this date (yyyy-mm-dd).',
                required: true,
                type: 'String',
            },
        ],
        classType: 'GameCommand',
    },
];
