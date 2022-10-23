import Command from '@components/Command';
import type CommandInterface from '../interfaces/CommandInterface';

export default class GameCommand extends Command implements CommandInterface {
    public run() {
        // Do something
    }

    public hasPermissions() {
        return true;
    }
}
