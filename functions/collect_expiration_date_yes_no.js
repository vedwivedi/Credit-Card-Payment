// This is your new function. To start, set the name and path on the left.

exports.collect_expiration_date_yes_no = async function (context, event, callback) {
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

        if (Memory.task_fail_counter < 4) {
            Remember.task_fail_counter = Number(Memory.task_fail_counter) + 1;
            Redirect = "task://collect_expiration_date";
            Say = false;
            Remember.Card_Date = '';
            Remember.say_err_msg = `say your card expiration date, example , , you can say march 2026. you can also enter Two digits for the month and four digits for the year, , , 
          Example, a date of March 2026 should be entered as 03, for the month and 2 0 2 6 for the year.`;
        }
        else {
            Redirect = "task://agent_transfer";
        }




        //End of your code.

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
