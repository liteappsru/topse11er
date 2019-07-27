var request = require('request');
var cookieParser = require('cookie-parser');

const config = {
    since:'2019-07-11T00:00:00.032Z',
    to:'2019-07-12T00:00:00.033Z',
    ozonID:'698',
    ozonAPIKey:'7a562dfd-61cf-4fd3-a629-735924f53e5f'
}

const ozonBody = {
    since:config.since,
    to:config.to,
    delivery_schema:'fbo',
    page:1,
    page_size:1000
};

const ozonConfig = {
    method: "POST",
    uri: "https://api-seller.ozon.ru/v1/order/list",
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': ozonBody.length,
        'Client-Id':config.ozonID,
        'Api-Key':config.ozonAPIKey
    }
};

const ozonOptions = {
    uri: ozonConfig.uri,
    method: ozonConfig.method,
    body: ozonBody,
    json: true,
    headers: ozonConfig.headers
};

function ozonCallback(error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
};

request(ozonOptions, ozonCallback);