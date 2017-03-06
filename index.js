'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

const PAGE_ACCESS_TOKEN = "EAADJq7pENYsBAH9zp9N6IHspsXg1E4Q4FKk2T3MsbgGXPlOfTTSOixfJllLrbrGAjBa8BX7lHYON27RVpFzYEym4nDT8puZAEW8ZCwMkK43TOCH92yNhTuQRSDUc4PZCHVZAkOWFWXWSR7iF26hdZAQ8NeH2MzZBWuD5ZBEUMADewZDZD"

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

app.get('/webhook', function (req, res)
{
    console.log("/webhook get");
    //res.send("/webhook Post req received ")
    res.send('Hello webhook get world, I would like to be a chat bot')
})
// for Facebook verification
app.get('/', function (req, res)
{
    console.log("/ Verify Token?");
    if (req.query['hub.verify_token'] == 'undefined')
    {
        console.log("Verify Token undefined");
        res.send('Hello plain get world, I would like to be a chat bot')
    }
    else
    {
        // Facebook verification

        console.log("Verify Token sent");
        if (req.query['hub.mode'] === 'subscribe')
        {
            console.log("Subscribe Verify Token, check: " + req.query['hub.verify_token']);
            if (req.query['hub.verify_token'] === 'CMUR_Bot013')
            {
                console.log("Validating webhook");
                res.send(req.query['hub.challenge'])
            }
            else
            {
                console.log("Oh No, invalid Verify Token: " + req.query['hub.verify_token']);
                res.send("Error, wrong token.");
           }
        }
        else
        {
            console.log("not subscribing");
            res.send('Hello plain get world, I would like to be a chat bot')
        }
    }
});
// Spin up the server
app.listen(app.get('port'), function()
{
    console.log('running on port', app.get('port'))
})
