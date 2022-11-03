
type CommandInterface = {
    run: () => void;
    hasPermissions: () => Promise<boolean>;
};
export default CommandInterface;
