'use strict';

const express = require('express');
const request = require("request");

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

// Stock exchange symbols
const symbols = [
    "GOOG",
    "AAPL",
    "FB",
    "AMZN",
    "MSFT",
];

app.get('/', (req, res) => {
    var series = [];

    for (const symbol of symbols) {
        // get stock time series
        const options = {
            method: 'GET',
            url: 'https://www.alphavantage.co/query',
            qs:
            {
                function: 'TIME_SERIES_INTRADAY',
                symbol: symbol,
                interval: '30min',
                apikey: 'I9FF5A4FKWJZZN1Q'
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            if (response.statusCode == 200) {
                // console.log("body : ", body);
                const data = JSON.parse(Object(body));

                // handle api limit error
                if(data.hasOwnProperty('Note')){
                    res.send({
                        error: "Sorry, we reached Alpha Vantage API Call limit (5 calls per minute and 500 calls per day), please retry again in a minute or contact support"
                    });
                } else {
                    // console.log("data : ", data);
                    const meta = data["Meta Data"];
                    // console.log("meta : ", meta);
                    var timeseries = Object.values(data)[1];
                    timeseries = Object.values(timeseries)[0];
                    // console.log("timeseries : ", timeseries);
                    const symbolSeries = {
                        symbol: meta["2. Symbol"],
                        open: timeseries["1. open"],
                        high: timeseries["2. high"],
                        low: timeseries["3. low"],
                        close: timeseries["4. close"],
                        volume: timeseries["5. volume"],
                    };
    
                    //const serie = Object.values(data)[1];
                    // console.log(symbolSeries);
                    series.push(symbolSeries);
    
                    // send response when all symbol are retrieved
                    if (series.length == symbols.length) {
                        res.send(series);
                    }
                }
            } else {
                res.send({
                    error: "Unhandled error, please retry again or contact support"
                });
            }
        });
    }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);