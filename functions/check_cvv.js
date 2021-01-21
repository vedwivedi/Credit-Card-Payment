exports.check_cvv = async function (context, event, callback) {
    try {
        let Say;
        let Prompt;
        let Listen = false;
        let Collect = false;
        let Remember = {};
        let Tasks = false;
        let Redirect = false;
        let Handoff = false;

        console.log("check_cvv initiated");
        const Memory = JSON.parse(event.Memory);
        Remember.repeat = false;
        console.log("task_fail_counter: " + Memory.task_fail_counter);
        Remember.from_task="collect_cvv";

        let cvv;
        try {
            cvv = Memory.twilio.collected_data.collect_cvv.answers.card_cvv.answer;
        }
        catch (err)
        {
            console.log("catch: "+err);
            cvv = "";
        }

        if (cvv.length === 0) {
            Remember.say_err_msg = "you have not entered any C,V,V, number, ";
            Redirect = "task://collect_cvv";
        }
        else if (cvv.length === 3) {

            Remember.say_err_msg = "";
            Remember.card_cvv = cvv;
            
            Say = `You provided <say-as interpret-as='digits'>${cvv}</say-as>. `;
            Prompt = `Is that correct?`;

            Say += Prompt;
            
            Remember.question = 'cvv_check';

            Listen = true;
            Tasks = ['yes_no', 'agent_transfer'];

        }
        else {
            Remember.say_err_msg = `The C V V you entered <say-as interpret-as='digits'>${cvv}</say-as>,,, is not correct, Please say or enter it using your telepnone keypad.`;
            Redirect = "task://collect_cvv";
        }


        let RB = require(Runtime.getFunctions()['responseBuilder'].path);
        await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);

    } catch (error) {
        console.error(error);
        callback(error);
    }
};