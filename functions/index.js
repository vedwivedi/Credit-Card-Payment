const functions = Runtime.getFunctions();
let greeting = require(functions['greeting'].path);
let check_cc = require(functions['check_cc'].path);

let collect_expiration_date = require(functions['collect_expiration_date'].path);
let check_exp_date = require(functions['check_exp_date'].path);

let collect_cvv = require(functions['collect_cvv'].path);
let check_cvv = require(functions['check_cvv'].path);

let yes_no = require(functions['yes_no'].path);
let agent_transfer = require(functions['agent_transfer'].path);
let fallback = require(functions['fallback'].path);

exports.handler = async (context, event, callback) => {
 
  const { CurrentTask } = event;
  const {CurrentTaskConfidence} = event;
  console.log("CurrentTask: "+CurrentTask+" CurrentTaskConfidence: "+CurrentTaskConfidence+"\n");
 
  // calling task handlers
  switch (CurrentTask) {
    case 'greeting':
    {
      console.log("CurrentTask: "+CurrentTask );      
      await greeting.greeting(context, event, callback);
      break;
    }
    case 'check_cc':
    {
      console.log("CurrentTask: "+CurrentTask );      
      await check_cc.check_cc(context, event, callback);
      break;
    }  
    case 'collect_expiration_date':
    {
      console.log("CurrentTask: "+CurrentTask );      
      await collect_expiration_date.collect_expiration_date(context, event, callback);
      break;
    }  
    case 'check_exp_date':
    {
      console.log("CurrentTask: "+CurrentTask );      
      await check_exp_date.check_exp_date(context, event, callback);
      break;
    }   
    case 'collect_cvv':
    {
      console.log("CurrentTask: "+CurrentTask );      
      await collect_cvv.collect_cvv(context, event, callback);
      break;
    }  
    case 'check_cvv':
    {
      console.log("CurrentTask: "+CurrentTask );      
      await check_cvv.check_cvv(context, event, callback);
      break;
    }     
    case 'yes_no':
    {
      console.log("CurrentTask: "+CurrentTask );
      await yes_no.yes_no(context, event, callback);
      break;
    } 
    case 'agent_transfer':
    {
      console.log("CurrentTask: "+CurrentTask );
      await agent_transfer.agent_transfer(context, event, callback);
      break;
    }   

    default:
      console.log("CurrentTask: "+CurrentTask );
      await fallback.fallback(context, event, callback);
      break;
  }
};