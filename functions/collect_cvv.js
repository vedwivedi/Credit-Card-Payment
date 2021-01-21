// This is your new function. To start, set the name and path on the left.

exports.collect_cvv =async function(context, event, callback) {
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
  
    if(Memory.task_fail_counter===undefined) // new line add
     Remember.task_fail_counter=0;
    else
    Remember.task_fail_counter = Memory.task_fail_counter + 1;
  
    Remember.repeat = false;
    Remember.from_task="collect_cvv";
  // this update from VS code.
    
    let collect_question="Say or Enter your C V V number located at the back of your card."; // Default 
    if(!(Memory.say_err_msg==undefined || Memory.say_err_msg==""))
    collect_question=Memory.say_err_msg;  
    console.log("say_err_msg: "+Memory.say_err_msg);
    console.log("collect_question: "+collect_question);
   
    if ( Memory.payment_method === 'credit card' ) {
      Collect = {
        "name": "collect_cvv",
        "questions": [
          {
            "question": collect_question,
            "voice_digits": {
              "finish_on_key": "#"
            },
            "name": "card_cvv",
            "type": "Twilio.NUMBER_SEQUENCE"
          }
        ],
        "on_complete": {
          "redirect": "task://check_cvv"
        }
      };
      
      Say = false;
      Listen = false;
      

    }
    else{
      Say="you have not selected Credit Card method to pay";
    }
     
    //End of your code.
   
  let RB = require(Runtime.getFunctions()['responseBuilder'].path);
  await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  
    } catch (error) {  
    console.error(error);    
    callback( error);
  }
  };
  