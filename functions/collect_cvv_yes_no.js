// This is your new function. To start, set the name and path on the left.

exports.collect_cvv_yes_no = async function (context, event, callback) {
  try {
    let Say;
    let Prompt;
    let Listen = false;
    let Collect = false;
    let Remember = {};
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;

    const Memory = JSON.parse(event.Memory);
    

    //End of your code.

    if (Memory.task_fail_counter <= 3) {
      //Remember.task_fail_counter = Number(Memory.task_fail_counter) + 1;
      Say = false;
      Remember.say_err_msg = "";
      Redirect = "task://collect_cvv";
      Remember.digits_request_task = 'cvv';
  }
  else {
      Redirect = "task://agent_transfer";
  }


    // This callback is what is returned in response to this function being invoked.
    const functions = Runtime.getFunctions();
    let path = functions['responseBuilder'].path;
    //console.log("path:"+path);
    let RB = require(path);
    await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);

  } catch (error) {
    console.error(error);
    callback(error);
  }
};
