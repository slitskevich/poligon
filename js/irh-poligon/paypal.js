"use strict";

var paypal = require('paypal-rest-sdk');
var openIdConnect = paypal.openIdConnect;

//set configs for openid_client_id and openid_client_secret if they are different from your
//usual client_id and secret. openid_redirect_uri is required
paypal.configure({
    'mode': 'live',
    'openid_client_id': 'AXXAhgxRVfDYIl84RfUuDEPfzYkHYG-Bh8Y4JUk-9_G3D6ToESyC-YyKA1e54UM0w0m3k4ZXNNFP-r12',
    'openid_client_secret': 'ELPjNWwxAZkqBsu2h0tQifFydspFcFT5QIVdOLsGn3NAsAXzYuL8MFkxwKCwOzU5ywzTaUdi7-LrBG6D',
    'openid_redirect_uri': 'http://example.com'
});

// Login url
console.log(openIdConnect.authorizeUrl({'scope': 'openid profile'}));

// With Authorizatiion code
// AC: C101.08XMjVWT0ggtxKuGfQs2pCA9IG8W3amLj5UddvC-0rc9tazVFNDtyb8EHmHsoVkQ.flU5iGnR7K54Nc6T4vldIJBDtuW
openIdConnect.tokeninfo.create("C101.ad3Hfl2GauZHAamG0GjvW-M3tmmMWEw7BuhJWJ1X_7D3MnDyzUfz0EN8pIGkeJWq.AgO_326guAyOM73s3iOoB-GzhOi", function (error, tokeninfo) {
    if (error) {
        console.log(error);
    } else {
        openIdConnect.userinfo.get(tokeninfo.access_token, function (error, userinfo) {
            if (error) {
                console.log(error);
            } else {
                console.log(tokeninfo);
                console.log(userinfo);
                // Logout url
                console.log(openIdConnect.logoutUrl({ 'id_token': tokeninfo.id_token }));
            }
        });
    }
});

// refresh token: R103.rfVC_uGESkt0cIDFeX_QP6zma7Ze0bGoMdgeK5uiEEIZWlzvjxbDVKSk9UgTGdJct6sTFiUSOb-hmVzk2HgSKuckLKd5EgwBxKK9tZc2IQARwW7UkzFfARVujQyO5lrua5QKSZqZHEXj52Eo
//                R103.rfVC_uGESkt0cIDFeX_QP6zma7Ze0bGoMdgeK5uiEEIZWlzvjxbDVKSk9UgTGdJct6sTFiUSOb-hmVzk2HgSKuckLKd5EgwBxKK9tZc2IQARwW7UkzFfARVujQyO5lrua5QKSZqZHEXj52Eo
// With Refresh token
// openIdConnect.tokeninfo.refresh("R103.rfVC_uGESkt0cIDFeX_QP6zma7Ze0bGoMdgeK5uiEEIZWlzvjxbDVKSk9UgTGdJct6sTFiUSOb-hmVzk2HgSKuckLKd5EgwBxKK9tZc2IQARwW7UkzFfARVujQyO5lrua5QKSZqZHEXj52Eo", function (error, tokeninfo) {
//     if (error) {
//         console.log(error);
//     } else {
//         openIdConnect.userinfo.get(tokeninfo.access_token, function (error, userinfo) {
//             if (error) {
//                 console.log(error);
//             } else {
//                 console.log(tokeninfo);
//                 console.log("user: ", JSON.stringify(userinfo, null, 2));
//             }
//         });
//     }
// });

