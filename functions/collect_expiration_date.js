// This is your new function. To start, set the name and path on the left.

exports.collect_expiration_date =async function(context, event, callback) {
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

  
  Remember.repeat = false;
  Remember.from_task = "collect_expiration_date";
// this update from VS code.
  
  let collect_question="say your card expiration date, example  , , you can say march 2026. The month and the year."; // Default 
  if(!(Memory.say_err_msg==undefined || Memory.say_err_msg==""))
  collect_question=Memory.say_err_msg;  
  // console.log("say_err_msg: "+Memory.say_err_msg);
  // console.log("collect_question: "+collect_question);
 
  if ( Memory.payment_method === 'credit card' ) {
    Collect = {
      "name": "collect_exp_date",
      "questions": [
        {
          "question": collect_question,
          "voice_digits": {
            "finish_on_key": "#"
          },
          "name": "cc_exp_date",
          "type": "Twilio.DATE"
        }
      ],
      "on_complete": {
        "redirect": "task://check_exp_date"
      }
    };
    
    Say = false;
    Listen = false;
    

  }
  else{
    Say="you have not selected Credit or debit Card option to pay";
  }
   
  //End of your code.
 
let RB = require(Runtime.getFunctions()['responseBuilder'].path);
await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);

  } catch (error) {  
  console.error(error);    
  callback( error);
}
};
