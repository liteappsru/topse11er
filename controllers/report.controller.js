let reports = require('../reports');
let session = require('../session');

exports.sales = function (req, res) {
    console.log(Date.now() + ' ' + session.username + ' salesByDay');
    reports.salesByDay(session.username, function (result) {
        if (result) {
            res.send(result)
        } else {
            res.send({});
        }
    });
};

exports.margin = function (req, res) {
    console.log(Date.now() + ' ' + session.username + ' marginByDay');
    reports.marginByDay(session.username, function (result) {
        if (result) {
            res.send(result)
        } else {
            res.send({});
        }
    });

    // console.log(Date.now() + ' marginByGoods');
    // reports.marginByGoods(session.username, function (result) {
    //     if (result) {
    //         res.send(result)
    //     } else {
    //         res.send({});
    //     }
    // });
};

exports.profit = function (req, res) {
    console.log(Date.now() + ' ' + session.username + ' profitByDay');
    reports.profitByDay(session.username, function (result) {
        if (result) {
            res.send(result)
        } else {
            res.send({});
        }
    });
};

exports.orders = function (req, res) {
    console.log(Date.now() + ' ' + session.username + ' orders');
    reports.orders(session.username, function (result) {
        if (result) {
            res.send(result)
        } else {
            res.send({});
        }
    });
};

exports.common = function (req, res) {
    console.log(Date.now() + ' ' + session.username + ' commmonData');
    reports.commonData(session.username, function (result) {
        if (result) {
            res.send(result)
        } else {
            res.send({});
        }
    });
};