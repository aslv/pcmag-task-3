function Terminal() {
    var context = this;

    var $terminal = $('#terminal');

    //
    // Private properties
    // Private methods

    function commandHelpOutput(command) {
        return 'This is help for !!!' + command + '!!! function';
    }
    function commandInvalidArgumentsOutput(command) {
        return Utilities.textPattern(LANG.tIvalidArguments, command);
    }
    function commandUnitsErrorsOutput(errors) {
        var output = '';
        for (var i in errors) {
            output += LANG['tUnitsErrors' + errors[i].capitalize()] + '\n';
        }
        return $.trim(output);
    }
    function hasNumericArguments(cmd) {
        for (var i in cmd.arguments) {
            if ( !$.isNumeric(cmd.arguments[i])) {
                return false;
            }
            cmd.arguments[i] = parseInt(cmd.arguments[i]);
        }
        return true;
    }

    // Privileged methods
    // Constructor
    $terminal.terminal(function(command, term) {
            var cmd = new Cmd(command);

            // If help needed
            if (cmd.arguments[0] === '-h' && cmd.arguments.length === 1) {
                term.echo(commandHelpOutput(cmd.command));
            } else {
                switch (cmd.command) {
                    case 'chickens' :
                    case 'pigs' :
                        // Remove the trainling 's' at the end
                        var unitType = cmd.command.substr(0, cmd.command.length - 1);
                    case 'bomb' :
                        // If flag is true, so we already checked for commands above and will skip check below
                        var flagContinue = true;
                        
                        // If we have already set unit type, else it equals the command name
                        var unitType = unitType || cmd.command;
                        
                        // If command has 3 numeric arguments
                        if (cmd.arguments.length === 3 && hasNumericArguments(cmd)) {
                            // Try to set new unit and record the response
                            var newUnitResponse = app.core
                                .setNewUnit(unitType, 
                                    cmd.arguments[1], 
                                    cmd.arguments[2], 
                                    cmd.arguments[0]
                                );
                        }
                    case 'mine' :
                        // If we have already set unit type, else it equals the command name
                        unitType = unitType || cmd.command;
                        
                        // If command has 2 numeric arguments and wasn't checked above
                        if (cmd.arguments.length === 2 
                            && hasNumericArguments(cmd)
                            && !flagContinue 
                        ) {
                            // Try to set new unit and record the response
                            var newUnitResponse = app.core
                                .setNewUnit(unitType, 
                                    cmd.arguments[0], 
                                    cmd.arguments[1]
                                );
                        } 
                        
                        // If the response is true, echo it was succesful command
                        if (newUnitResponse === true) {
                            term.echo(LANG.tNewUnitSuccess);
                        // If the response is not empty array
                        } else if ($.isArray(newUnitResponse) && newUnitResponse.length) {
                            term.error(commandUnitsErrorsOutput(newUnitResponse));
                        // Else arguments were wrong
                        } else {
                            term.error(commandInvalidArgumentsOutput(cmd.command));
                        }
                        break;
                    case 'get' :
                        if (cmd.arguments.length === 2 && hasNumericArguments(cmd)) {
                            var units = app.core.getCoordinates(cmd.arguments[0], cmd.arguments[1]);
                            if (units.length) {
                                term.echo(Utilities.textPattern(LANG.tCoordinatesHasUnits, units[0].getQuantity(), units[0].getType()));
                            } else {
                                term.echo(LANG.tCoordinatesAreEmpty);
                            }
                        } else {
                            term.error(commandInvalidArgumentsOutput(cmd.command));
                        }
                        break;
                    default :
                        term.error(Utilities.textPattern(LANG.tUnknownCommand, cmd.command))
                        break;
                }

            }
        }, {
            prompt: '> ',
            name: 'test',
            greetings: LANG.tGreetings
        });
}

function Cmd(input) {
    this.rawInput = input;
    this.input = $.trim(this.rawInput);
    this.splitted = this.input.split(/\s+/g);
    this.command = this.splitted.shift();
    this.arguments = this.splitted;
}