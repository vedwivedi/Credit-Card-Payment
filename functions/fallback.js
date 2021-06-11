
// fallback handler function
exports.fallback = async function (context, event, callback) {
  const functions = Runtime.getFunctions();
  let path = functions['responseBuilder'].path;
  let RB = require(path);

  let Say = false;
  let Listen = true;
  let Remember = {};
  let Collect = false;
  let Tasks = false;
  let Redirect = false;
  let Handoff = false;

  console.log('Fallback Triggered.');

  const Memory = JSON.parse(event.Memory);
  //console.log("Memory: " + JSON.stringify(Memory));
  const from_task = Memory.from_task;
  console.log('count: ' + Number(Memory.task_fail_counter));
  if ((Memory.task_fail_counter === undefined)) // new line add
    Remember.task_fail_counter = 0;
  else
    Remember.task_fail_counter = Number(Memory.task_fail_counter) + 1;
  let counter = Number(Memory.task_fail_counter);
  //console.log('Memory.task_fail_counter: ' + counter);
  if (counter > 3) {
    Say = false;
    Listen = false;
    Remember.task_fail_counter = 0;
    Redirect = 'task://agent_transfer';
  }
  else {
    console.log("from_task: " + from_task);
    switch (from_task) {
      case 'greeting':
        {
          Remember.say_err_msg = `I'm sorry, I didn't quite get that. Say your card number or enter it using your telepnone keypad.`;
          Listen = false;
          break;
        }
      case 'collect_expiration_date':
        {
          Remember.say_err_msg = `I'm sorry, I didn't quite get that. Please Say or enter your card expiration date, example  , , you can say march 2026. The month and the year.`;
          Listen = false;
          break;
        }
      case 'collect_cvv':
        {
          Remember.say_err_msg = `I'm sorry, I didn't quite get that. Say or Enter your C V V number located at the back of your card.`;
          Listen = false;
          break;
        }
      default:
        Say = `I'm sorry, I didn't quite get that. Please Say again.`;
        Listen = false;
        break;
    }
    if (from_task != "") {
      Redirect = "task://" + from_task;
    }
  }
  await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
};
