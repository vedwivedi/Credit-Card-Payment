// This is your new function. To start, set the name and path on the left.
const valid = require('card-validator');
exports.check_cc = async function (context, event, callback) {
    try {
        let Say;
        let Prompt;
        let Listen = false;
        let Collect = false;
        let Remember = {};
        let Tasks = false;
        let Redirect = false;
        let Handoff = false;
        //console.log("check_cc initiated");
        const Memory = JSON.parse(event.Memory);        
        Remember.from_task = "greeting";
        Remember.repeat = false;
        //console.log("task_fail_counter: " + Number(Memory.task_fail_counter));
        let CC = "";
        try {
            CC = Memory.twilio.collected_data.collect_cc.answers.credit_card_num.answer ||
                event.Field_credit_card_num_Value || event.Field_credit_card_num_alt_Value;
        }
        catch
        {
            CC = "";
        }
        //console.log('Entered_CCNumber: ' + CC);
        //console.log('CC_LastFour: '+ CC.substring((CC.length - 4), CC.length));
        Remember.CC_LastFour=CC.substring((CC.length - 4), CC.length);

        let { isValid, cardType, say_err_msg } = validateCC(CC);

        if (isValid == true) {
            Remember.isValid = isValid;
            Remember.card_number = CC;
            Remember.card_type = cardType;
            Remember.say_err_msg = "";
            Remember.task_fail_counter = 0;
            Redirect = "task://collect_expiration_date";

        }
        else if (isValid == false && Number(Memory.task_fail_counter) < 3) {
            Remember.task_fail_counter = Number(Memory.task_fail_counter)+1;
            Remember.say_err_msg = say_err_msg;
            //console.log('cnt:' + Memory.task_fail_counter);
            Redirect = "task://greeting";
        } else if (Memory.task_fail_counter === 3) {
            Redirect = "task://agent_transfer";  // go to an agent
        }
        else {
            Say = false;
            Listen = false;
            Remember.from_task = event.CurrentTask;
            Redirect = 'task://fallback';
        }
        //End of your code.


        let RB = require(Runtime.getFunctions()['responseBuilder'].path);
        await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);

    } catch (error) {
        console.error(error);
        callback(error);
    }
};

const validateCC = (CC) => {
    let cardType;
    let isValid = false;
    let CC_LastFour = CC.substring((CC.length - 4), CC.length);
    let say_err_msg = "";
    //console.log("CC_LastFour: " + CC_LastFour);
    try {
        var numberValidation = valid.number(CC);
        //console.log("numberValidation: " + JSON.stringify(numberValidation));

        if (CC.length === 0) {
            say_err_msg = "you did not say or enter any the card number, ";
            isValid = false;  //failure
           // console.log("say_err_msg:" + say_err_msg);
        }
        else if (numberValidation.isValid) {

            cardType = numberValidation.card.type.toLowerCase();
            //console.log("cardType: " + cardType);
            isValid = true;
            if (!(cardType === "discover" || cardType === "mastercard" || cardType === "visa")) {
                say_err_msg = "This card is " + cardType + ", we only accept discover, mastercard or visa,, Please say or enter your card number again.";
                isValid = false;  //failure
                //console.log("say_err_msg:" + say_err_msg);
            }

        }
        else {
            say_err_msg = `The card number you entered is not correct. The last four digits of the card you entered is <say-as interpret-as='digits'>${CC_LastFour}</say-as>,,,Please say or enter you card number again.`;
            isValid = false;  //failure
            //console.log("say_err_msg:" + say_err_msg);
        }


    }
    catch (err) {
        console.log("error:" + err);
        isValid = false;
        cardType = "unknown";
    }
    return { isValid, cardType, say_err_msg };
};
