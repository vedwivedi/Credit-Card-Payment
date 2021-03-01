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
        Remember.from_task = "check_cvv";

        let cvv;
        try {
            cvv = Memory.twilio.collected_data.collect_cvv.answers.card_cvv.answer;
        }
        catch (err) {
            console.log("catch: " + err);
            cvv = "";
        }
        if (Memory.task_fail_counter <= 3) {
            Remember.task_fail_counter = Number(Memory.task_fail_counter) + 1;
            if (cvv.length === 0) {
                Remember.say_err_msg = "you have not entered any C,V,V, number, ";
                Redirect = "task://collect_cvv";
            }
            else if (cvv.length === 3) {

                Remember.say_err_msg = "";
                Remember.card_cvv = cvv;

                Say = `You provided <say-as interpret-as='digits'>${cvv}</say-as>. `;
                Prompt = `Is that correct? say yes or No. you can also press 1 for yes and 2 for no.`;

                Say += Prompt;

                Remember.question = 'cvv_check';

                Listen = true;
                Listen = {
                    "voice_digits": {
                        "num_digits": 1,
                        "finish_on_key": "#",
                        "redirects": {
                            1: "task://Bot_success",
                            2: "task://collect_cvv_yes_no"
                        }
                    }
                };
                Tasks = ['yes_no', 'agent_transfer'];

            }
            else {
                Remember.say_err_msg = `The C V V you entered <say-as interpret-as='digits'>${cvv}</say-as>,,, is not correct, Please say or enter it using your telepnone keypad.`;
                Redirect = "task://collect_cvv";
            }
        }
        else {
            Redirect = "task://agent_transfer";
        }

        let RB = require(Runtime.getFunctions()['responseBuilder'].path);
        await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);

    } catch (error) {
        console.error(error);
        callback(error);
    }
};