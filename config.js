module.exports = {
    dbName: 'topse11er',
    url: 'mongodb://localhost:27017/topse11er',
    ozon:{
        since:'2019-07-01T00:00:00.032Z',
        to:'2020-08-01T00:00:00.033Z',
        method: "POST",
        uri: "https://api-seller.ozon.ru/v1/order/list",
        uriOrder:"https://api-seller.ozon.ru/v1/order/",
        headers: {
            'Content-Type': 'application/json',
            'Client-Id':'698',
            'Api-Key': '7a562dfd-61cf-4fd3-a629-735924f53e5f'
        }
    },
    wb:{
        wbUserName:'sup-26735-20092',
        wbPassword:'vj5I69U6',
        // wbReportIds:['794566',
        //     '784485',
        //     '781702',
        //     '770060'],
        wbReportIds:['781702'],
        method: "POST",
        uriSite:"https://suppliers.wildberries.ru",
        uriAuth: "https://suppliers.wildberries.ru/Account/Login",
        uriReport: "https://suppliers.wildberries.ru/realization/getreportdetails/",
        headerAuth: {
            'Content-Type': 'application/json'
        }
    }
}