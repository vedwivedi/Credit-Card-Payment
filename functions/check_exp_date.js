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

    Remember.from_task = "check_exp_date";
    Remember.repeat = false;
    console.log("task_fail_counter: " + Memory.task_fail_counter)
    const { CurrentInput } = event;


    let exp_date = "";
    let formatted_date = "";
    let StrMonth = "";
    let StrYear = "";
    let StrDay = "";

    try {
      exp_date = Memory.twilio.collected_data.collect_exp_date.answers.cc_exp_date.answer || event.Field_exp_date_Value;
    }
    catch
    {
      exp_date = "";
    }

    console.log("CurrentInput: " + CurrentInput + ", exp_date: " + exp_date);
    if (exp_date) {

      //let formatted_date = exp_date.split('-')[0] + '-' + exp_date.split('-')[1];


      console.log("formatted_date:" + formatted_date);
      if (exp_date.toString().length === 6) {
        StrMonth = exp_date.substring(0, 2);
        StrYear = exp_date.substring(2, exp_date.length);

        formatted_date = StrYear.toString() + '-' + StrMonth.toString();

      }
      else if (exp_date.toString().length < 6) {
        StrMonth = 0;
        StrYear = 0;

        formatted_date = StrYear.toString() + '-' + StrMonth.toString();
      }
      else {
        let D_Date = new Date(exp_date);
        console.log('exp_date: ' + exp_date);
        StrMonth = D_Date.getMonth() + 1;     //Get the month as a number (0-11)
        StrYear = D_Date.getFullYear();       //Get the year as a four digit number (yyyy)
        StrDay = D_Date.getDate();            //Get Day as a number (1-31)
        console.log('strMonth: ' + StrMonth);
        console.log('strYear: ' + StrYear);
        console.log('day' + D_Date.getDate());  //Get the day as a number (1-31)
        formatted_date = StrYear + '-' + StrMonth;
      }

      console.log("formatted_date-4-dgts:" + formatted_date);
      let validDate = valid.expirationDate(formatted_date).isValid;
      console.log("validDate check before exceptional case:" + validDate);
      /// Code for 4/3 digit current input///////////
      if ((CurrentInput.length === 4 || CurrentInput.length === 3) && validDate === false) {    //Input  Example: 1125, 125
        StrMonth = CurrentInput.substring(0, (CurrentInput.length - 2));
        StrYear = '20' + CurrentInput.substring((CurrentInput.length - 2), CurrentInput.length);

        console.log('CurrentInputMonth: ' + StrMonth);
        console.log('CurrentInputYear: ' + StrYear);
        formatted_date = StrYear + '-' + StrMonth;
      }
      else if (validDate === true && (!(CurrentInput.includes(StrYear)))) {       //Input  Example: November 26th
        StrYear = '20' + StrDay;
        formatted_date = StrYear + '-' + StrMonth;
        console.log('CurrentInputYearNonDigit: ' + StrYear);

      }
      validDate = valid.expirationDate(formatted_date).isValid;
      /// End Code for 4/3 digit current input/////////////

      console.log("validDate:" + validDate);
      if (validDate) {
        console.log("CurrentInput: " + CurrentInput + ", exp_date: " + exp_date + ", formatted_date: " + formatted_date);
        Say = `You said <say-as interpret-as="date" format="ym">${formatted_date}</say-as>. `;
        Prompt = `Is that correct? say yes or No. you can also press 1 for yes and 2 for no.`;

        Say += Prompt;
        Listen = true;
        Listen = {
          "voice_digits": {
            "num_digits": 1,
            "finish_on_key": "#",
            "redirects": {
              1: "task://collect_cvv_yes_no",
              2: "task://collect_expiration_date_yes_no"
            }
          }
        };
        if (StrMonth.toString().length === 1)
          Remember.Card_Date = '0' + StrMonth.toString() + StrYear.toString().substring(2, 4);
        else
          Remember.Card_Date = StrMonth.toString() + StrYear.toString().substring(2, 4);


        Remember.question = 'exp_date_check';

        Tasks = ['yes_no', 'agent_transfer'];
      }
      else {
        // if (Memory.task_fail_counter < 4) {
        //   Remember.task_fail_counter = Number(Memory.task_fail_counter) + 1;
        Remember.say_err_msg = `The expiration date you provided is not valid. you can also enter
            Two digits for the month and four digits for the year, , ,
            Example, a date of March 2026 should be entered as 03, for the month and  2 0 2 6 for the year`;
        Redirect = "task://collect_expiration_date";
        // }
        // else {
        //   Redirect = "task://agent_transfer";
        // }
      }
    }
    else {
      Say = false;
      Listen = false;
      Remember.from_task = event.CurrentTask;
      Redirect = 'task://fallback';
    }

    //     //End of your code.
    if (Memory.task_fail_counter < 4) {
      Remember.task_fail_counter = Number(Memory.task_fail_counter) + 1;
    }
    else {
      Say = false;
      Listen = false;
      Remember.say_err_msg="";
      Remember.question="";
      Redirect = "task://agent_transfer";
    }

    let RB = require(Runtime.getFunctions()['responseBuilder'].path);
    await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);

  } catch (error) {
    console.error(error);
    callback(error);
  }
};

