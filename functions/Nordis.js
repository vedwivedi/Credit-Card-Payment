// This is your new function. To start, set the name and path on the left.
const axios = require('axios');
exports.Nordis = async function (context, event, callback) {

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
        var dateFormat = require('dateformat');
        var count;
        if (Memory.cnt != undefined) {
            console.log("Memory.cnt: " + Memory.cnt);
            count = Number(Memory.cnt);
        }
        else {
            console.log("Memory.cnt: undefined ");
            count = 1;
        }

        console.log("count : " + count);

        const StdData = { "Counter": count, "FullName": "INS20 TEST", "PhoneNumber": "765-749-8823", "FPMTAMT": "15010.61", "FStartDate": "2021-06-10", "PMTAMT": "15010.60", "FACSAcct": "27218371", "FREQ": "WEK", "NOP": "4", "StartDate": "2021-06-10", "ZIP": "33331", "ClientAcct": "656523114", "CcAccountNumber": "4111111111111111", "CardName": "INS20 TEST", "CcExpirationDate": "0326", "CcCVV": "123", "ZipCd": "33331", "Address": "", "City": "", "State": "", "Amt": "15010.60", "PaymentDate": "0001-01-01T00:00:00" };

        var Data;

        const URL = "https://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_EBO_Transactis_IVR/Api/SingleNordisPayment";// Memory.URL;
        const Tout = Memory.timeout | 30000;

        if (Memory.RequestBody != undefined) {
            //console.log("Memory.RequestBody is not undefined." + JSON.stringify(Memory.RequestBody));
            Data = JSON.parse(Memory.RequestBody);

            //Data = StdData;
        }
        else {
            Data = StdData;
        }
        console.log("URL : " + URL);
        console.log("Request Data  : " + JSON.stringify(Data));

        var DueDate = new Date(Data.StartDate);
        console.log("Data.StartDate: " + DueDate);
        Remember.NOP = Data.NOP;
        var FREQ = Data.FREQ;



        if (Number(count) === 1 && parseFloat(Data.FPMTAMT).toFixed(2) > 0) {
            console.log("Condition 1st: counter == 1 && Data.FPMTAMT > 0)");
            Data.PMTAMT = Data.FPMTAMT;
            Remember.NOP = (Number(Data.NOP) + 1).toString();
            Data.PaymentDate = Data.FStartDate;
        }
        else if (Number(count) === 1 && (Data.FPMTAMT == 0 || Data.FPMTAMT === "")) {
            console.log("Condition 2nd: counter == 1 && Data.FPMTAMT = 0)");
            Data.PaymentDate = Data.StartDate;
        }
        else if (Number(count) > 1 && parseFloat(Data.PMTAMT).toFixed(2) > 0) {
            console.log("Condition 3rd: counter > 1 && Data.PMTAMT > 0)");
            var ReduceBy = 1;
            if ((parseFloat(Data.FPMTAMT).toFixed(2) > 0)) {
                Remember.NOP = (Number(Data.NOP) + 1).toString();
                ReduceBy = 2;
            }
            switch (FREQ) {
                case "WEK":
                    DueDate = DueDate.setDate(DueDate.getDate() + (7 * (Number(count) - ReduceBy)));
                    break;

                case "BWK":
                    DueDate = DueDate.setDate(DueDate.getDate() + (14 * (Number(count) - ReduceBy)));
                    break;

                case "DOM":
                    DueDate = DueDate.setMonth(DueDate.getMonth() + (Number(count) - ReduceBy));
                    break;
            }

            DueDate = dateFormat(DueDate, "yyyy-mm-dd");
            console.log("Calculated DueDate: " + DueDate);
            Data.PaymentDate = DueDate;
        }

        console.log("Data.PaymentDate: " + Data.PaymentDate);
        //const responseObj = await axios.post(`${ URL }`, Data).;
        var bResult = false;
        try {
            const responseObj = await axios.post(URL, Data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: Tout,
                })
                .then(response => {
                    console.log("response.data: " + JSON.stringify(response.data));
                    Remember.responseData = JSON.stringify(response.data);
                    console.log("response.data.ConfirmationId: " + response.data.ConfirmationId);
                    Remember.ConfirmationId = response.data.ConfirmationId;
                    if (Number(response.data.ConfirmationId) > 0) {
                        bResult = true;
                    }
                    else {
                        bResult = false;
                    }
                })
                .catch(error => {
                    var errorresult = { "Status": error.message, "Returns": "-1" };
                    Remember.responseData = JSON.stringify(errorresult);
                    console.log("Error Result : " + errorresult);
                    bResult = false;
                    // callback(null, errorresult);
                });
        }
        catch (error) {
            bResult = false;
            //console.log("counter Catch:"+ count);
            console.error(error);
            //callback(error);
        }
        //bResult = true; // for testing to be removed
        if (bResult === true) {
            Say = "Your payment for " + Data.PaymentDate + " has been posted.";
            Remember.Agent = "false";

        }
        else {
            Say = "We need to transfer you to an Agent";
            Remember.Agent = "true";
            Redirect = "task://Agent";
        }
        //var response;
        // if (bResult === true) {
        //     response =
        //     {
        //         "actions": [{
        //             "say": {
        //                 "speech": "Your payment has been posted"
        //             }
        //         },
        //         {
        //             "remember": {
        //                 "Agent": false
        //             }
        //         }
        //         ]
        //     }
        // }
        // else {
        //     response =
        //     {
        //         "actions": [{
        //             "say": {
        //                 "speech": "We need to transfer you to an Agent"
        //             }
        //         },
        //         {
        //             "remember": {
        //                 "Agent": true
        //             }
        //         }, {
        //             "redirect": "task://Agent"
        //         }
        //         ]
        //     }
        // }
        //console.log("response: " + JSON.stringify(response));
        //callback(null, response);
        //End of your code.

        let RB = require(Runtime.getFunctions()['responseBuilder'].path);
        await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);



    } catch (error) {
        //console.log("counter Catch 2:"+ count);
        console.error(error);
        callback(error);
    }
};
