var err = {
    "cause": {
        "response": {
            "name": "USER_BUSINESS_ERROR",
            "message": "User business error.",
            "debug_id": "2db507ee9d5c0",
            "information_link": "https://developer.paypal.com/docs/api/payments.payouts-batch/#errors",
            "details": [
                {
                    "field": "SENDER_BATCH_ID",
                    "issue": "Batch with given sender_batch_id already exists",
                    "link": [
                        {
                            "href": "https://api.sandbox.paypal.com/v1/payments/payouts/GMF9PBFDN9YXE",
                            "rel": "self",
                            "method": "GET"
                        }
                    ]
                }
            ],
            "httpStatusCode": 400
        },
        "httpStatusCode": 400
    },
    "isOperational": true,
    "response": {
        "name": "USER_BUSINESS_ERROR",
        "message": "User business error.",
        "debug_id": "2db507ee9d5c0",
        "information_link": "https://developer.paypal.com/docs/api/payments.payouts-batch/#errors",
        "details": [
            {
                "field": "SENDER_BATCH_ID",
                "issue": "Batch with given sender_batch_id already exists",
                "link": [
                    {
                        "href": "https://api.sandbox.paypal.com/v1/payments/payouts/GMF9PBFDN9YXE",
                        "rel": "self",
                        "method": "GET"
                    }
                ]
            }
        ],
        "httpStatusCode": 400
    },
    "httpStatusCode": 400
};
// console.log("error: ", JSON.stringify(err, null, 2));

var errorMsg = '';
if (err.response != null && err.response.details != null && Array.isArray(err.response.details)) {
    for (index in err.response.details) {
        var item = err.response.details[index];
        console.log("response item: ", item);
        if (item.issue != null && typeof item.issue === 'string') {
            errorMsg += 'Paypal transaction error: ' + item.issue;
        } else {
            errorMsg += 'Paypal transaction error: unknown error';
        }
    }
}
console.log("errorMsg: ", errorMsg);
