function Cmd(command) {
    var splitted = command.split(/\s+/g);
    var name = splitted.shift();
    var cmd = {
        name: name,
        command: command,
        tail: splitted,
        args: [],
        opts: []
    };
    this.solve = function (term) {
        for (var i in cmd.tail) {
            var word = cmd.tail[i];
            if (word.match(/^-[a-zA-Z]$/) || word.match(/^-{2}[^-]\S*/)) {
                // Check if it's flag or option
                word = word.replace(/^-{1,2}/, '');
                cmd.opts.push(word);
            } else if (word.match(/^[^-]\S*/)) {
                // Check if it's argument
                cmd.args.push(word);
            } else {
                // Invalid argument/option
                if (term) {
                    term.error(Utilities.textPattern(lang.termInvalidArgument, word, cmd.command));
                }
                return false;
            }
        }
        return cmd;
    };
    this.get = function() {
        return cmd;
    };
}