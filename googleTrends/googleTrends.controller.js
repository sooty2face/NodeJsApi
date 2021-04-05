﻿const express = require('express');
/* we want the router portion from express */
const router = express.Router();

const googleTrends = require('./googleTrends.service');
// const TestChema = require('../models/daily-trends');
const dailyTrendsSchema = require('../models/daily-trends');
const db = require('../models/daily-trends');

// routes
router.get('/:country/:day/', getGoogleTrends);

module.exports = router;

async function getGoogleTrends(req, res, next) {
    await googleTrends.getGoogleTrends(req.params.day, req.params.country)
        .then(gTrends => {
            try {
                if (gTrends.length !== 0) {
                    // const mongoDBRes1 = testSchema.save();
                    // console.log('1: ' + gTrends[0].title.query);
                    // console.log('2: ' + gTrends[0].title.exploreLink);
                    // console.log('3: ' + gTrends[0].formattedTraffic);
                    // console.log('4: ' + gTrends[0].relatedQueries[0].query ? gTrends[0].relatedQueries[0].query : 'empty');
                    // console.log('5: ' + gTrends[0].relatedQueries[0].exploreLink ? gTrends[0].relatedQueries[0].exploreLink : 'empty');
                    // console.log('6: ' + gTrends[0].image.source);
                    // console.log('7: ' + gTrends[0].image.imageUrl);
                    // console.log('7: ' + gTrends[0].image.newsUrl);
                    // console.log('8: ' + gTrends[0].articles[0].title);
                    // console.log('9: ' + gTrends[0].articles[0].timeAgo);
                    // console.log('10: ' + gTrends[0].articles[0].source);
                    // console.log('11: ' + gTrends[0].articles[0].image.newsUrl);
                    // console.log('12: ' + gTrends[0].articles[0].image.source);
                    // console.log('13: ' + gTrends[0].articles[0].image.imageUrl);
                    // console.log('14: ' + gTrends[0].articles[0].url);
                    // console.log('15: ' + gTrends[0].articles[0].snippet);
                    // console.log('16: ' + gTrends[0].shareUrl);
                    let arr = gTrends;
                    for (let i = 0; i < arr.length; i++) {


                        const dailyTrendsObject = new dailyTrendsSchema({
                            dailyTrends: {
                                date: req.params.day,
                                country: req.params.country,
                                title: {
                                    query: gTrends[i].title.query ? gTrends[i].title.query : undefined,
                                    exploreLink: gTrends[i].title.exploreLink ? gTrends[i].title.exploreLink : undefined
                                },
                                formattedTraffic: gTrends[i].formattedTraffic ? gTrends[i].formattedTraffic : undefined,
                                // relatedQueries: [{
                                //     query: gTrends[0].relatedQueries[0].query ? gTrends[0].relatedQueries[0].query : undefined,
                                //     exploreLink: gTrends[0].relatedQueries[0].exploreLink ? gTrends[0].relatedQueries[0].exploreLink : undefined
                                // }],
                                image: {
                                    newsUrl: gTrends[i].image.newsUrl ? gTrends[i].image.newsUrl : undefined,
                                    source: gTrends[i].image.source ? gTrends[i].image.source : undefined,
                                    imageUrl: gTrends[i].image.imageUrl ? gTrends[i].image.imageUrl : undefined
                                },
                                // articles: [{
                                //     title: 'default', //undefined,
                                //     timeAgo: 'default', //undefined,
                                //     source: 'default', //undefined,
                                //     image: {
                                //         newsUrl: 'default', //undefined,
                                //         source: 'default', //undefined,
                                //         imageUrl: 'default', //undefined

                                //     },
                                //     url: 'default', //undefined,
                                //     snippet: 'default', //undefined
                                // }],
                                // articles: [{
                                //     title: gTrends[0].articles[0].title ? gTrends[0].articles[0].title : undefined,
                                //     timeAgo: gTrends[0].articles[0].timeAgo ? gTrends[0].articles[0].timeAgo : undefined,
                                //     source: gTrends[0].articles[0].source ? gTrends[0].articles[0].source : undefined,
                                //     image: {
                                //         newsUrl: gTrends[0].articles[0].image.newsUrl ? gTrends[0].articles[0].image.newsUrl : undefined,
                                //         source: gTrends[0].articles[0].image.source ? gTrends[0].articles[0].image.source : undefined,
                                //         imageUrl: gTrends[0].articles[0].image.imageUrl ? gTrends[0].articles[0].image.imageUrl : undefined

                                //     },
                                //     url: gTrends[0].articles[0].url ? gTrends[0].articles[0].url : undefined,
                                //     snippet: gTrends[0].articles[0].snippet ? gTrends[0].articles[0].snippet : undefined
                                // }],
                                shareUrl: gTrends[i].shareUrl ? gTrends[i].shareUrl : undefined
                            }
                        });
                        console.log('Articles length for daily-trend: ' + " - " + i + " - " + gTrends[i].articles.length)
                        //DELETE ALL RECORDS IN THE DOCUMENT
                        // dailyTrendsSchema.deleteMany({ 'dailyTrends.date': /*req.params.day*/  '2021-04-04'  }, function (err) {
                        //     if(err) console.log(err);
                        //     console.log("Successful deletion");
                        //   });

                        // CREATE IF IT DOES NOT EXIST
                        let docs = dailyTrendsSchema.findOne({
                            'dailyTrends.date': req.params.day,
                            'dailyTrends.country': req.params.country,
                            'dailyTrends.title.query': gTrends[i].title.query ? gTrends[i].title.query : 'notitlequery'
                        }, function (err, dailyTrendsDBExists) {
                            if (err) {
                                console.log('ERROR again1: ' + err);
                            }
                            // console.log('dailyTrendsDBExists? ' + dailyTrendsDBExists ? dailyTrendsDBExists : 'does not exist');
                            // console.log('length: ' + " - " + i + " - " + gTrends[i].articles.length)
                            // dailyTrendsDBExists = null || 'default';
                            // console.log('do we have i ? ' + i)
                            if (dailyTrendsDBExists === null) {
                                dailyTrendsObject.save();
                            }
                            else {

                                if (gTrends[i].articles) {
                                    for (let i2 = 0; i2 < gTrends[i].articles.length; i2++) {
                                        // console.log('gTrends.articles? ' + gTrends[i].articles[i2] ? gTrends[i].articles[i2] : 'does not exist');

                                        let articleToInsert =
                                        {
                                            title: gTrends[i].articles[i2].title ? gTrends[i].articles[i2].title : undefined,
                                            timeAgo: gTrends[i].articles[i2].timeAgo ? gTrends[i].articles[i2].timeAgo : undefined,
                                            source: gTrends[i].articles[i2].source ? gTrends[i].articles[i2].source : undefined,
                                            image: {
                                                // newsUrl: gTrends[i].articles[i2].image.newsUrl ? gTrends[i].articles[i2].image.newsUrl : undefined,
                                                // source: gTrends[i].articles[i2].image.source ? gTrends[i].articles[i2].image.source : undefined,
                                                // imageUrl: gTrends[i].articles[i2].image.imageUrl ? gTrends[i].articles[i2].image.imageUrl : undefined

                                            },
                                            url: gTrends[i].articles[0].url ? gTrends[i].articles[0].url : undefined,
                                            snippet: gTrends[i].articles[0].snippet ? gTrends[i].articles[0].snippet : undefined
                                        };
                                        // console.log('article to insert: ' + JSON.stringify(articleToInsert));
                                        dailyTrendsSchema.findOneAndUpdate(
                                            {
                                                'dailyTrends.date': req.params.day,
                                                'dailyTrends.country': req.params.country,
                                                'dailyTrends.title.query': gTrends[i].title.query ? gTrends[i].title.query : 'notitlequery'
                                            },
                                            {   /* addToSet only pushes items if they do not exist */
                                                $addToSet: {
                                                    'dailyTrends.articles': articleToInsert
                                                },
                                                $set: {
                                                    'dailyTrends.formattedTraffic': '123K'
                                                }
                                            },
                                            { upsert: false, new: true },
                                            function (err, docs) {
                                                if (err) {
                                                    console.log('ERROR again2: ' + err);
                                                }
                                                else {
                                                    //console.log("Updated Docs : " + docs);
                                                }
                                            }
                                        )
                                    }
                                }
                            }

                        });

                        // UPDATE RELATED QUERIES
                        // if (gTrends[0].relatedQueries[0].query && gTrends[0].relatedQueries[0].exploreLink) {

                        // }
                        // relatedQueries: [{
                        //     query: gTrends[0].relatedQueries[0].query ? gTrends[0].relatedQueries[0].query : undefined,
                        //     exploreLink: gTrends[0].relatedQueries[0].exploreLink ? gTrends[0].relatedQueries[0].exploreLink : undefined
                        // }],
                    }
                }
            }


            catch (err) {
                console.log('mongo failure: ' + err);
            }
            // console.log('results in controller: ' + JSON.stringify(gTrends));
            res.json(gTrends)
        })
        .catch(next);
}
