// This is your new function. To start, set the name and path on the left.

exports.yes_no = async function (context, event, callback) {
  try {
    let Say;
    let Prompt = '';
    let Tasks = false;
    let Remember = {};
    let Redirect = false;
    let Listen = false;
    let Collect = false;
    let Handoff = false;

    const Memory = JSON.parse(event.Memory);
    
    Remember.repeat = false;
    console.log("yes_no: " + event.Field_yes_no_Value);
    console.log("Memory.question: " + Memory.question);

    switch (Memory.question) {
      case 'exp_date_check':
        if (event.Field_yes_no_Value === 'Yes') {
          Redirect = "task://collect_cvv";
          Say = false;
          Remember.digits_request_task = 'cvv';
          Remember.say_err_msg = "";
          Remember.task_fail_counter = 0;

          break;

        }
        else if (event.Field_yes_no_Value === 'No') {
          Redirect = "task://collect_expiration_date";
          Say = false;
          Remember.Card_Date = '';
          Remember.say_err_msg = "";
          break;

        } else {
          Say = false;
          Redirect = 'task://fallback';

          break;
        }

      case 'cvv_check':
        if (event.Field_yes_no_Value === 'Yes') {
          Say = "Alright! your cvv is validated successfuly.";
          Remember.say_err_msg = "";
          Remember.task_fail_counter = 0;

          break;

        } else if (event.Field_yes_no_Value === 'No') {

          Say = false;
          Redirect = "task://collect_cvv";
          Remember.card_cvv = '';
          Remember.digits_request_task = 'cvv';

          break;

        } else {
          Say = false;
          Redirect = 'task://fallback';

          break;
        }
      case 'agent_transfer':
        if (event.Field_yes_no_Value === 'Yes') {

          Say = false;
          Redirect = 'task://agent_transfer';

          break;

        } else if (event.Field_yes_no_Value === 'No') {

          Say = false;
          Redirect = 'task://goodbye';

          break;

        } else {
          Say = false;
          Redirect = 'task://fallback';

          break;
        }


      default:
        Say = false;
        Redirect = 'task://fallback';

        break;
    }

    //End of your code.

    // This callback is what is returned in response to this function being invoked.
    const functions = Runtime.getFunctions();
    let path = functions['responseBuilder'].path;
    let RB = require(path);
    await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);

  } catch (error) {
    console.error(error);
    callback(error);
  }
};
