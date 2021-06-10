const functions = Runtime.getFunctions();
let Iteration = require(functions['Iteration'].path);
let Nordis = require(functions['Nordis'].path);
let agent_transfer = require(functions['agent_transfer'].path);
let fallback = require(functions['fallback'].path);

exports.handler = async (context, event, callback) => {

  const { CurrentTask } = event;

  // calling task handlers
  switch (CurrentTask) {
    case 'Iteration':
      {
        console.log("CurrentTask: " + CurrentTask);
        await Iteration.Iteration(context, event, callback);
        break;
      }
    case 'Nordis':
      {
        console.log("CurrentTask: " + CurrentTask);
        await Nordis.Nordis(context, event, callback);
        break;
      }
    case 'agent_transfer':
      {
        console.log("CurrentTask: " + CurrentTask);
        await agent_transfer.agent_transfer(context, event, callback);
        break;
      }

    default:
      console.log("CurrentTask: " + CurrentTask);
      await fallback.fallback(context, event, callback);
      break;
  }
};