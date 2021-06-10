// This is your new function. To start, set the name and path on the left.
const axios = require('axios');
exports.Iteration = async function (context, event, callback) {

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
    var cnt;
    var reqData;
    //const URL = "https://pecodeviis:Test123!@pecodev.convergentusa.com/Convergent_EBO_Transactis_IVR/Api/NordisApi";
    //const URL = context.URL;

    // if (Memory.RequestBody != undefined) {
    //   //console.log("Memory.RequestBody is not undefined." + Memory.RequestBody);
    //   reqData = Memory.RequestBody;
    // }
    // else {
    //   reqData = {"FullName":"INS20 TEST","PhoneNumber":"765-749-8823","FPMTAMT":"0.00","FStartDate":"","PMTAMT":"15010.60","FACSAcct":"27218371","FREQ":"POI","NOP":"1","StartDate":"2021-06-08","ZIP":"33331","ClientAcct":"656523114","CcAccountNumber":"4111111111111111","CardName":"INS20 TEST","CcExpirationDate":"0326","CcCVV":"123","ZipCd":"33331","Address":"","City":"","State":"","Amt":"15010.60","PaymentDate":"0001-01-01T00:00:00"};
    //   //reqData=context.reqData;
    // }
    const NOP = 4; //reqData.NOP;

   // console.log("URL : " + URL);
    //console.log("Request Data  : " +JSON.stringify(reqData));
    console.log("NOP : " + NOP);

    //Remember.RequestBody =reqData;


    if (Memory.Counter != undefined) {
      cnt = Memory.Counter;
    }
    else {
      cnt = 0;
    }
    
    cnt = cnt + 1;
    console.log("cnt : " + cnt);
    var response;
    if(cnt > NOP)
    {
      response=
      {
        "actions": [{
                "say": {
                    "speech": "Iteration goodbye"
                }
            }, 
             {
                "remember": {
                    "Counter": cnt,
                    "Agent": false
                }
            }, {
                "redirect": "task://goodbye"
            }
        ]
    }
      // Listen=false;
      // Remember.Counter=cnt;
      // Redirect="task://goodbye";
    }
    else
    {
      response=
      {
        "actions": [{
                "say": {
                    "speech": "Iteration Nordis"
                }
            }, 
            {
                "remember": {
                    "Counter": cnt,
                    "Agent": false
                }
            }, {
                "redirect": "task://Nordis"
            }
        ]
    }
      // Listen=false;
      // Remember.Counter=cnt;
      // Redirect="task://Nordis";
      
    }
    //let RB = require(Runtime.getFunctions()['responseBuilder'].path);
    //await RB.responseBuilder(Say, Listen, Remember, Collect, Tasks, Redirect, Handoff, callback);
    console.log("response: "+ JSON.stringify(response));
    callback(null,response);

  } catch (error) {
    console.error(error);
    callback(error);
  }
};