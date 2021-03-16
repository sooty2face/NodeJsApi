﻿require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const googleTrends = require('google-trends-api');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());
app.use(cors());
// api routes
app.use('/users', require('./users/users.controller'));
app.use('/googleTrends', require('./googleTrends/googleTrends.controller'));
app.get('/:country/removedthistext', async (req, res) => {
    try {
        var result = [];
        await googleTrends.dailyTrends({ geo: req.params.country })
            .then(function (results) {
                console.log('dailyTrends result1: ' + results);
                var arr = JSON.parse(results).default.trendingSearchesDays[0].trendingSearches
                for (var i = 0; i < arr.length; i++) {
                    // result.push(arr[i].title.query)
                    result.push(arr[i])
                }
                res.json(result)
            })
        console.log('dailyTrends result2: ' + result);
        //res.json({'trend1':trend1,'trend2':trend2})
    } catch (err) { console.log(err) }
});

// THIS THINGS WORKS, NO GOOGLE REDIRECT...
// app.get("/:country", async (req, res) => {
//     try {
//         //console.log('reached')	        
//         var result = [];
//         var result2 = [];
//         var result3 = [];

//         googleTrends.interestOverTime({ keyword: 'test' })
//             .then(function (results) {
//                 // console.log((JSON.parse(results).default.timelineData[0]));	
//                 JSON.parse(results).default.timelineData.map((data, i) => {
//                     result.push({
//                         'date': data.formattedTime,
//                         'value': data.value[0]
//                     })
//                 })
//             }).then(function () {
//                 googleTrends.interestOverTime({ keyword: 'test2' }).then(function (results) {	                        // console.log((JSON.parse(results).default.timelineData[0]));	
//                     JSON.parse(results).default.timelineData.map((data, i) => {
//                         result2.push({ 'date': data.formattedTime, 'value': data.value[0] })
//                     })
//                 }).then(function () {
//                     googleTrends.interestOverTime({ keyword: 'test' + " " + 'test2' })
//                         .then(function (results) {
//                             // console.log((JSON.parse(results).default.timelineData[0]));	
//                             JSON.parse(results).default.timelineData.map((data, i) => {
//                                 result3.push({
//                                     'date': data.formattedTime,
//                                     'value': data.value[0]
//                                 })
//                             })
//                             var final = new Array(result.length + 1);
//                             final[0] = new Array(4);
//                             final[0][0] = "Timeline";
//                             final[0][1] = 'test';
//                             final[0][2] = 'test2'
//                             final[0][3] = 'test' + " " + 'test2';
//                             for (var i = 1; i < final.length; i++) {
//                                 final[i] = new Array(4);
//                                 final[i][0] = result[i - 1] && result[i - 1].date ? result[i - 1].date : "";
//                                 final[i][1] = result[i - 1] && result[i - 1].value;
//                                 final[i][2] = result2 && result2.length && result2[i - 1].value ? result2[i - 1].value : 0;
//                                 final[i][3] = result3 && result3.length && result3[i - 1].value ? result3[i - 1].value : 0;
//                             }
//                             res.json(final);
//                         })
//                 })
//             })
//     } catch (err) { console.log(err) }
// })

app.get("/:country", async (req, res) => {
    try {
        //console.log('reached')	        
        var result = [];
        var result2 = [];
        var result3 = [];

        googleTrends.interestOverTime({ keyword: req.params.country })
            .then(function (results) {
                console.log('results are: ' + results);	
                res.json(results)
            })
    } catch (err) { console.log(err) }
})

app.get("/:keyword/:keyword2", async (req, res) => {
    try {
        //console.log('reached')	        
        var result = [];
        var result2 = [];
        var result3 = [];

        googleTrends.interestOverTime({ keyword: req.params.keyword })
            .then(function (results) {
                // console.log((JSON.parse(results).default.timelineData[0]));	
                JSON.parse(results).default.timelineData.map((data, i) => {
                    result.push({
                        'date': data.formattedTime,
                        'value': data.value[0]
                    })
                })
            }).then(function () {
                googleTrends.interestOverTime({ keyword: req.params.keyword2 }).then(function (results) {	                        // console.log((JSON.parse(results).default.timelineData[0]));	
                    JSON.parse(results).default.timelineData.map((data, i) => {
                        result2.push({ 'date': data.formattedTime, 'value': data.value[0] })
                    })
                }).then(function () {
                    googleTrends.interestOverTime({ keyword: req.params.keyword + " " + req.params.keyword2 })
                        .then(function (results) {
                            // console.log((JSON.parse(results).default.timelineData[0]));	
                            JSON.parse(results).default.timelineData.map((data, i) => {
                                result3.push({
                                    'date': data.formattedTime,
                                    'value': data.value[0]
                                })
                            })
                            var final = new Array(result.length + 1);
                            final[0] = new Array(4);
                            final[0][0] = "Timeline";
                            final[0][1] = req.params.keyword;
                            final[0][2] = req.params.keyword2
                            final[0][3] = req.params.keyword + " " + req.params.keyword2;
                            for (var i = 1; i < final.length; i++) {
                                final[i] = new Array(4);
                                final[i][0] = result[i - 1] && result[i - 1].date ? result[i - 1].date : "";
                                final[i][1] = result[i - 1] && result[i - 1].value;
                                final[i][2] = result2 && result2.length && result2[i - 1].value ? result2[i - 1].value : 0;
                                final[i][3] = result3 && result3.length && result3[i - 1].value ? result3[i - 1].value : 0;
                            }
                            res.json(final);
                        })
                })
            })
    } catch (err) { console.log(err) }
})

app.get('/:region/:keyword', async (req, res) => {
    try {
        var result = [];
        await googleTrends.interestByRegion({
            keyword: req.params.keyword,
            startTime: new Date('2017-02-01'),
            endTime: new Date('2017-02-01'),
            resolution: req.params.keyword
        })
            .then((results) => {
                var arr = JSON.parse(results).default.trendingSearchesDays.trendingSearches
                for (var i = 0; i < arr.length; i++) {
                    // result.push(arr[i].title.query)
                    result.push(arr[i])
                }
                res.json(result)
                console.log(res);
            })
    } catch (err) { console.log(err) }
});
// app.use('/todos', require('./ToDos/todosApi'));

// global error handler
app.use(errorHandler);

// start server
// const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const port = process.env.PORT || 4000;

const server = app.listen(port, function () {
    console.log('Gsb server listening on port ' + port);
});
