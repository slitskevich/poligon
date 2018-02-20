let input = {
    "awslogs": {
        "data": "H4sIAAAAAAAAAFVQu27cMBD8lQOR0oy4fIrqDrBiBHAqqYrvYFDUnk1YEi8kz0Zg+N9D20mRZovZndmZeSUr5uwecPx9RtKR6/24v//RD8P+pidXJL5smCrcKsuE5IorLSu8xIebFC/numncS24Wt06za0J6pPkpbJVDfUJX8DpudeInZSgVWyuHMzANQMNEc/fldj/2w3hU9uTa00k66yfpmZtaQC3BSwnKaeGqRL5M2adwLiFu38JSMGXS3ZHbj+ef4vfvFnxc17jRhDleksdMZ1zCM6YxDovzT+T44aZ/xq28C7ySMFdTQmhtLGjGuLRSgVYMWsvq0K0Bo5Q0VnELHGzdMAG2nsvWVmMl1BKLW2sfoJg1HJQ2hvOrf+X+zUwBKBMjqI7pjpmvhrOfh9IqJrTwnNbUbT1BQ6dZIpVKeaE8dyhPh/Jfn93ue3rsU4qp2yX8dQkJ5243u+IOG3k7vv0BkAU49dYBAAA="
    }
};
var zlib = require('zlib');

console.log(`log: ${JSON.stringify(input, null, 2)}`);
var payload = new Buffer(input.awslogs.data, 'base64');
zlib.gunzip(payload, function(e, result) {
    if (e) { 
        context.fail(e);
    } else {
        result = JSON.parse(result.toString('ascii'));
        console.log("Event Data:", JSON.stringify(result, null, 2));
    }
});

