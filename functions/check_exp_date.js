// This is your new function. To start, set the name and path on the left.
const valid = require('card-validator');
exports.check_exp_date = async function (context, event, callback) {
  try {
    let Say;
    let Prompt;
    let Listen = false;
    let Collect = false;
    let Remember = {};
    let Tasks = false;
    let Redirect = false;
    let Handoff = false;
    console.log("check_exp_date initiated");
    const Memory = JSON.parse(event.Memory);

    Remember.from_task = "collect_expiration_date";
    Remember.repeat = false;
    console.log("task_fail_counter: " + Memory.task_fail_counter)
    let exp_date = "";
    try {
      exp_date = Memory.twilio.collected_data.collect_exp_date.answers.cc_exp_date.answer || event.Field_exp_date_Value;
    }
    catch
    {
      exp_date = "";
    }
    console.log("exp_date:" + exp_date);
    if (exp_date) {
      let formatted_date = exp_date.split('-')[0] + '-' + exp_date.split('-')[1];
      console.log("formatted_date:" + formatted_date);
      if (exp_date.length === 6)
      {
        formatted_date = exp_date.substring((exp_date.length - 4), exp_date.length)+'-'+exp_date.substring(0, 2);
        
      }
      
      console.log("formatted_date-4-dgts:" + formatted_date);
      const validDate = valid.expirationDate(formatted_date).isValid;
      console.log("validDate:" + validDate);
      if (validDate) {
        Say = `You said <say-as interpret-as="date" format="ym">${formatted_date}</say-as>. `;
        Prompt = `Is that correct?`;

        Say += Prompt;
        Remember.Card_Date = formatted_date;
        Remember.question = 'exp_date_check';
        Listen = true;
        Tasks = ['yes_no', 'agent_transfer'];
      }
      else {
        if (Memory.task_fail_counter < 3) {
          Remember.say_err_msg = `The expiration date you provided <say-as interpret-as="date" format="ym">${formatted_date}</say-as> is not valid. you can also enter
            Two digits for the month and four digits for the year, , ,
            Example, a date of March 2026 should be entered as 03, for the month and  2 0 2 6 for the year`;
          Redirect = "task://collect_expiration_date";
        }
        else {
          Redirect = "task://agent_transfer";
        }
      }
    }
    else {
      Say = false;
      Listen = false;
      Remember.from_task = event.CurrentTask;
      Redirect = 'task://fallback';
    }

    //     //End of your code.


    let RB = require(Runtime.getFunctions()['responseBuilder'].path);
    await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);

  } catch (error) {
    console.error(error);
    callback(error);
  }
};

