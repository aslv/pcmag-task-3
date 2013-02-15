function CommandIntereter () {
    var version = '0.1';
    var name = 'Big Bombs command line interface';

    var commands = [{
        cmd: 'chickens',
        description: 'Set group of chickens on given position',
        args: [{
            display: 'number',
            description: lang.argQuantity,
            where: 'N>0'
        }, {
            display: 'positionX',
            description: lang.argCoordinateX,
            where: 'X=[0..100]'
        }, {
            display: 'positionY',
            description: lang.argCoordinateY,
            where: 'Y=[0..100]'
        }],
        opts: []
    }, {
        cmd: 'pigs',
        description: 'Send group of pigs on given position',
        args: [{
            display: 'number',
            description: lang.argQuantity,
            where: 'N>0'
        }, {
            display: 'positionX',
            description: lang.argCoordinateX,
            where: 'X=[0..100]'
        }, {
            display: 'positionY',
            description: lang.argCoordinateY,
            where: 'Y=[0..100]'
        }],
        opts: []
    }, {
        cmd: 'mine',
        description: 'Set mine on given position',
        args: [{
            display: 'positionX',
            description: lang.argCoordinateX,
            where: 'X=[0..100]'
        }, {
            display: 'positionY',
            description: lang.argCoordinateY,
            where: 'Y=[0..100]'
        }],
        opts: []
    }, {
        cmd: 'bomb',
        description: 'Launch bomb with given range on given position',
        args: [{
            display: 'range',
            description: lang.argQuantity,
            where: 'N>=0'
        }, {
            display: 'positionX',
            description: lang.argCoordinateX,
            where: 'X=[0..100]'
        }, {
            display: 'positionY',
            description: lang.argCoordinateY,
            where: 'Y=[0..100]'
        }],
        opts: []
    }, {
        cmd: 'get',
        description: 'Get what is placed on gived position',
        args: [{
            display: 'positionX',
            description: lang.argCoordinateX,
            where: 'X=[0..100]'
        }, {
            display: 'positionY',
            description: lang.argCoordinateY,
            where: 'Y=[0..100]'
        }],
        opts: []
    }, {
        cmd: 'help',
        description: 'start',
        args: [],
        opts: [{
            display: 'commands',
            description: lang.cmdHelpCommandsDesc,
            flag: true,
            output: function() {
                var output = '\n';
                for (var k in commands) {
                    var commandInfo = commands[k];
                    output += '   ' + Utilities.textPattern('[[b;;]%s]', commandInfo.cmd);
                    for (var j in commandInfo.args) {
                        output += Utilities.textPattern(' [%s]', commandInfo.args[j].display);
                    }
                    for (var j in commandInfo.opts) {
                        output += Utilities.textPattern(' --%s', commandInfo.opts[j].display);
                        if (commandInfo.opts[j].flag) {
                            output += Utilities.textPattern('|-%s', commandInfo.opts[j].display.slice(0,1));
                        }
                    }
                    output += '\n'
                }
                return output;
            }
        }, {
            display: 'version',
            description: lang.cmdHelpVersionDesc,
            flag: true,
            output: version.toString()
        }, {
            display: 'emulator',
            description: lang.cmdHelpEmulatorDesc,
            output: function(term) {
                 return term.signature(1);
            }
        }, {
            display: 'user-agent',
            description: lang.cmdHelpUserAgentDesc,
            output: navigator.userAgent
        }, {
            display: 'time',
            description: lang.cmdHelpTimeDesc,
            output: function() {
                return new Date().toString() + '\n';
            }
        }, {
            display: 'rules',
            description: lang.cmdHelpRulesDesc,
            output: lang.termHelpRules
        }]
    }, {
        cmd: 'current',
        description: 'Return current status of given property',
        args: [],
        opts: [{
            display: 'chickens',
            description: lang.cmdCurrentChickensDesc
        }, {
            display: 'pigs',
            description: lang.cmdCurrentPigsDesc
        }, {
            display: 'mines',
            description: lang.cmdCurrentMinesDesc
        }, {
            display: 'gold',
            description: lang.cmdCurrentGoldDesc
        }]
    }, {
        cmd: 'restart',
        description: 'Restart game',
        args: [],
        opts: []
    }, {
        cmd: 'start',
        description: 'start',
        args: [],
        opts: []
    }, {
        cmd: 'finish',
        description: 'finish',
        args: [],
        opts: []
    }];

    $('#console').terminal(function(command, term) {
        command = $.trim(command);
        var cmdObject = new Cmd(command);
        var cmd = cmdObject.get();

        switch (cmd.name) {
            case 'help' :
                var output = '';
                if (!cmdObject.solve(term) || cmd.args.length) {
                    return false;
                }
                var commandInfo = $.grep(commands, function(elem, index){
                    return (elem.cmd === cmd.name);
                })[0];

                // If there are any options in input command
                if (!cmd.opts.length) {
                    output += name + '\n';
                    output += lang.termHelp + '\n\n';
                    cmd.opts = commandInfo.opts.map(function (elem, index) {
                        return elem.display;
                    });
                }
                // For every option in input
                for (var i in cmd.opts) {
                    // Current option
                    var option = cmd.opts[i];
                    var outputMsg = '';
                    var commandInfoOption = null;

                    // If option is actually a flag
                    if (option.length === 1) {
                        // Find full name of this flag
                        commandInfoOption = $.grep(commandInfo.opts, function(elem, index){
                            return (elem.flag && option === elem.display.slice(0,1));
                        })[0];
                    } else {
                        commandInfoOption = $.grep(commandInfo.opts, function(elem, index){
                            return (option === elem.display);
                        })[0];
                    }
                    if (commandInfoOption) {
                        if ($.isFunction(commandInfoOption.output)) {
                            outputMsg = commandInfoOption.output(term);
                        } else {
                            outputMsg = commandInfoOption.output + '\n';
                        }
                        output += Utilities.textPattern('[[b;;]@%s:] %s', commandInfoOption.display, outputMsg);
                    }
                }
                term.echo(output);
                break;
            case 'chickens' :
            case 'pigs' :
            case 'bomb' :
//                appInstance.addUnit();
            case 'mine' :
            case 'restart' :
            case 'start' :
            case 'finish' :
            case 'current' :
            case 'get' :
                break;
            default :
                term.error(Utilities.textPattern(lang.termUnknownCommand, cmd.name));
        }
}, {
    prompt: '> ',
    name: 'test',
    greetings: 'Greetings madafaka'
});

}
CommandIntereter.prototype = {

};