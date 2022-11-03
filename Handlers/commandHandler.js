async function loadCommands(client) {
  const { loadFiles } = require('../Functions/fileLoader');
  const ascii = require('ascii-table');
  // eslint-disable-next-line new-cap
  const table = new ascii().setHeading('Commands', 'Status');

  await client.commands.clear();

  /* eslint prefer-const: 0 */
  let commandsArray = [];

  const Files = await loadFiles('Commands');

  Files.forEach((file) => {
    const command = require(file);
    client.commands.set(command.data.name, command); // need data.name if using builder. Otherwise its command.name

    commandsArray.push(command.data.toJSON());

    table.addRow(command.data.name, '✔️');
  });

  client.application.commands.set(commandsArray);
  return console.log(table.toString(), '\nCommands Loaded.');
}

module.exports = { loadCommands };
