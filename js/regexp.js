function test(value, exp) {
    console.log(`${value}: ${(new RegExp(exp)).test(value)}`);
}

function isValidEmail(email) {
    // returns true if the email is a valid email address, false otherwise.
    // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    // Supposedly unicode-ready; I didn't test it.
    const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  
    return re.test(email);
  }

const ssnExp = '^[0-9]{4}$';

// test('0', ssnExp);
// test('a', ssnExp);
// test('1234', ssnExp);
// test('286348', ssnExp);
// test('abcd', ssnExp);
// test('ab6348', ssnExp);
// test('2863ba', ssnExp);

// YYYY-MM-DD
const dob = '^1[90]{1}[0-9]{2}-[01]{1}[0-9]{1}-[0123]{1}[0-9]{1}'

test('1975-08-21', dob);

const email = '';
console.log('is valid ')