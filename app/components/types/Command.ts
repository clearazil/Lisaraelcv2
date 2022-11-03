import type Argument from './Argument';

type Command = {
        name: string;
        description: string;
        requiredPermissions: bigint | undefined;
        requiredBotPermissions: Map<bigint, string> | undefined;
        ephemeral: boolean;
        arguments: Argument[];
        classType: string;
};

export default Command;
