
type CommandInterface = {
    run: () => void;
    hasPermissions: () => boolean;
};
export default CommandInterface;
