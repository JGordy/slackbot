function getHelp(command, args, message) {
  let helpMessage;
  if (args === '!echo') {
    return '!echo Mimics any text after the !echo command';
  } else if (args === '!help') {
    return '!help Lists all currently supported commands.';
  } else if (args === '!dadjoke') {
    return '!dadjoke replies with a randomly chosen dad joke. Try adding a term behind the command to get specific jokes. I.E !dadjoke batman';
  } else if (args === '!gif') {
    return '!gif currently in the works. Try back later.';
  } else if (args === '!feature') {
    return '!feature Adds a project to-do in Generosity_Market/front_end_POC repository. Will support other GM repos soon.';
  } else {
    return args + ' command not regconized. Type !help to see all supported commands.';
  }
}


module.exports = { getHelp };
