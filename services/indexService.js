const https = require('https');
// import path from 'path';
const path = require('path');

const axios = require('axios');


/**
 * mini cache class so we don't have to do multiple request for auth token.
 * 
 * this works for this use case because the auth token is a short string (takes up very little memory)
 * and has a somewhat long TTL
 */
class DataCache {
    constructor(fetchFunction, minutesToLive = 10) {
      this.millisecondsToLive = minutesToLive * 60 * 1000;
      this.fetchFunction = fetchFunction;
      this.cache = null;
      this.getData = this.getData.bind(this);
      this.resetCache = this.resetCache.bind(this);
      this.isCacheExpired = this.isCacheExpired.bind(this);
      this.fetchDate = new Date(0);
    }
    isCacheExpired() {
      return (this.fetchDate.getTime() + this.millisecondsToLive) < new Date().getTime();
    }
    getData() {
      if (!this.cache || this.isCacheExpired()) {
        console.log('expired - fetching new data');
        return this.fetchFunction()
          .then((data) => {
          this.cache = data;
          this.fetchDate = new Date();
          return data;
        });
      } else {
        console.log('cache hit');
        return Promise.resolve(this.cache);
      }
    }
    resetCache() {
     this.fetchDate = new Date(0);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    async serveIndexPage (req, res) {
        try {
            res.sendFile(path.join(__dirname, '/../views/index.html'));
        } catch (error) {
            console.error("Got this error in serveIndexPage():", error)
            res.send('Oops, it\'s not you. It\'s us.')
        }
    },

    async serveD3Page (req, res) {
        try {
            res.sendFile(path.join(__dirname, '/../views/d3-js.html'));
        } catch (error) {
            console.error("Got this error in serveIndexPage():", error)
            res.send('Oops, it\'s not you. It\'s us.')
        }
    },

    async getServiceReport(req, res) {

        try {
            // part 0
            const getWSDAuth = () => {
                const url = 'https://api.bls.gov/publicAPI/v2/timeseries/data/LNS14000000';
                return axios.post('https://httpbin.org/post', {
                    "grant_type":  "client_credentials",
                    "client_id": "coding_test",
                    "client_secret": "bwZm5XC6HTlr3fcdzRnD" // should come from .env idealy
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
                })
                .then((result) => result.data);
            }

            // part 1  // returns 200 http status if successful 
            

            const authResponse = await axios.post('https://staging-authentication.wallstreetdocs.com/oauth/token', {
                    "grant_type":  "client_credentials",
                    "client_id": "coding_test",
                    "client_secret": "bwZm5XC6HTlr3fcdzRnD" // should come from .env idealy
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
            })

            console.log('gotten auth')
            // authResponse = JSON.parse(authResponse.data)

            // const authCache = new DataCache(getWSDAuth);
            // const authResponse2 = await authCache.getData() // 7200 is probably minutes
            // don't do another auth call if the previous one hasn't expired.


            // part 2 // returns 202 http status if successful
            const jobIdResponse = await axios.post('https://staging-gateway.priipcloud.com/api/v2.0/gateway/reports/status/service', {},
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Authorization': authResponse.data.token_type + ' ' + authResponse.data.access_token
                }
            })
            console.log('gotten job id')

            await delay(5000) // wait 5 secs, enough time for the report to be ready

            // part 3, // returns 200 http status if successful
            const serviceReportRequest = await axios.get('https://staging-gateway.priipcloud.com/api/v2.0/gateway/reports/status/service/' + jobIdResponse.data.job_id, 
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Authorization': authResponse.data.token_type + ' ' + authResponse.data.access_token
                }
            })
            console.log('gotten service report')

            res.send(serviceReportRequest.data)
        } catch (error) {
            console.error('an error occured', error)
            res.send({message: 'an error occured'}) // ??
        }

        
    }
}