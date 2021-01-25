// This is your new function. To start, set the name and path on the left.

exports.greeting =async function(context, event, callback) {
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
    Remember.from_task="greeting";
    Remember.agent_transfer=false;
  // this update from VS code.
      
    let collect_question="we will need your card information. Say your card number or enter it using your telepnone keypad."; // Default 
    if(Memory.say_err_msg!=undefined)
    collect_question=Memory.say_err_msg;  
    console.log("say_err_msg: "+Memory.say_err_msg);
    
  console.log("payment_method: "+Memory.payment_method);
    if ( Memory.payment_method === 'credit card' ) {
      Collect = {
        "name": "collect_cc",
        "questions": [
          {
            "question": collect_question,
            "voice_digits": {
              "finish_on_key": "#",
              "num_digits": 16
            },
            "name": "credit_card_num",
            "type": "Twilio.NUMBER_SEQUENCE"
          }
        ],
        "on_complete": {
          "redirect": "task://check_cc"
        }
      };
      
      Say = false;
      Listen = false;
      

    }
    else{
      Say="you have not selected Credit or Debit Card option to pay";
    }
     
    //End of your code.
    
  let RB = require(Runtime.getFunctions()['responseBuilder'].path);
  await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
  
    } catch (error) {  
    console.error(error);    
    callback( error);
  }
  };
  