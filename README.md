# 🤖 Creating your own Facebook Messenger bot

This tutorial is based on one from  2016 Jerry Wang (https://jw84.co) (c) 2106.

Facebook recently opened up their Messenger platform to enable bots to converse with users through Facebook Apps and on Facebook Pages. 

You can read the  [documentation](https://developers.facebook.com/docs/messenger-platform/quickstart) the Messenger team prepared but it's not very clear for beginners and intermediate hackers. 

So instead, here are details instructions on how to create your own Messenger Bot. 

## 🙌 Pre-Party, Get Set

Messenger bots uses a web server to process messages it receives or to figure out what messages to send. You will also need to have the bot be authenticated to speak with the web server and the bot approved by Facebook to speak with the public.

### Before the Bot Party:
### *Build the Server*

1. Make sure you have access to a Linux-flavor command line.

2. Install the Heroku toolbelt from here https://toolbelt.heroku.com - this lets you launch, stop and monitor instances. Sign up for free at https://www.heroku.com if you don't have an account yet.

3. Install Node from here https://nodejs.org, this will be the server environment. Then open up Terminal or Command Line Prompt and make sure you've got the very most recent version of npm by installing it again:

    ```
    sudo npm install npm -g
    ```

4. Make a new folder and cd to this directory. You will create a Node project for your server in this directory. Once you have cd'd there, run the following command; you may hit Enter to accept the defaults.


    ```
    npm init
    ```

5. Install the additional Node dependencies. Express is for the server, request is for sending out messages and body-parser is to process messages.

    ```
    npm install express request body-parser --save
    ```

6. Make a file called Procfile and copy this into it. This is so Heroku can know what file to run.

    ```
    web: node index.js
    ```

7. Create an index.js file in the folder and copy the following code into it. For this step, you will start by creating a basic Node.js server app. Later we will add the code to authenticate the Facebook Messenger Bot.

    ```javascript
    'use strict'

    const express = require('express')
    const bodyParser = require('body-parser')
    const request = require('request')
    const app = express()

    app.set('port', (process.env.PORT || 5000))

    // Process application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({extended: false}))

    // Process application/json
    app.use(bodyParser.json())

    app.get('/', function (req, res)
    {
        console.log("plain GET request");
        res.send('Hello World, I would like to be a chat bot')
    })

    // Spin up the server
    app.listen(app.get('port'), function()
    {   
        console.log('running on port', app.get('port'))
    })
    ```

8. Commit all the code with Git then create a new Heroku instance and push the code to the cloud.

    ```
    git init
    git add .
    git commit --message "hello world"
    heroku create
    git push heroku master
    ```
9. You should be able to "open your app" in Heroku to run it and see the Hello World message.

10. If you want to change your server code, re-deploy it with the following commands (put your own comments in for the commit):

    ```
    git add . 
    git commit --message "Your comment"
    git push heroku master
    ```

### Before the Bot Party:
### *Become A Facebook Developer*

1. If you are not already a facebook Developer, become one: https://developers.facebook.com/

### Before the Bot Party:
### *Get setup to Learn about Natural Language for Developers with https://wit.ai/*

    ```
    git clone https://github.com/wit-ai/node-wit
    cd node-wit
    npm install
    ```
 
## 🙌  Let's Bot Party 
### We will start our Bot Party by going through the rest of these steps together.

### *Setup the Validation in your Server*

1. Open two command-line prompts and in each, cd to your web server diretory.

2. In one window, run this command so you can see your web server app logs:

    ```
    heroku logs --source app  -t
    ```

3. Use your other window to edit your index.js file and commit/push your changes.

4. Refresh your Heroku app and you will see the messages that are logged to the console.

5. Copy the index.js.v2 code into index.js, change the code to use your own token instead of YOUR_TOKEN, and re-deploy.

6. Refresh your Heroku app to verify that it still works correctly.

7. In real-life, you should change the Very Code to use your own token instead of YOUR_TOKEN, and re-deploy.

8. Refresh your Heroku app to verify that it still works correctly.

### *Setup the Facebook App*

1. Create a new Facebook Page: On your Home page, along the top is a drop down. Select it and you will see "Create Page".

![Alt text](/images/CreatePage1.png)
...
![Alt text](/images/CreatePage2.png)

1. Create a new Facebook App: https://developers.facebook.com/apps/

2. If you are not already a facebook Developer, become one.

2. In the app go to Messenger tab then click Setup Webhook.  First, put in put in the URI of your Heroku server.  Be sure to add /webhook to the end of your Server URI.
Go ahead and check all the subscription fields. 
Start with "xyz" for your token, see that it fails, and watch your Heroku log.  Then put in the YOUR_TOKEN you used in your index.js code. Verify and Save.

3. Get a Page Access Token and save this somewhere. We will use it in 2 places - once later for setting up access to the Facebook API for your Bot and once now to trigger the Facebook app to send messages to the Bot. You will need to select the page that you created earlier.

4. Go back to Terminal and type in this command to trigger the Facebook app to send messages. Remember to use the token you requested earlier.

    ```bash
    curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=<PAGE_ACCESS_TOKEN>"
    ```

### *Setup the bot*

Now that Facebook and Heroku can talk to each other we can code out the bot.

1. So far we've been using GET. Your Bot will use POST, so we will write code in our Bot to handle the post requests that come from Facebook Messenger to your Bot.

2. Next, replace index.js with index.js.v3 and we will start coding out Bot to handle these requests.
    
    **Optional, but recommended**: keep your app secrets out of version control!
    - On Heroku, its easy to create dynamic runtime variables (known as [config vars](https://devcenter.heroku.com/articles/config-vars)). This can be done in the Heroku dashboard UI for your app **or** from the command line:
    ![Alt text](/demo/config_vars.jpg)
    ```bash
    heroku config:set FB_PAGE_ACCESS_TOKEN=fake-access-token-dhsa09uji4mlkasdfsd
    
    # view
    heroku config
    ```

    - For local development: create an [environmental variable](https://en.wikipedia.org/wiki/Environment_variable) in your current session or add to your shell config file.
    ```bash
    # create env variable for current shell session
    export FB_PAGE_ACCESS_TOKEN=fake-access-token-dhsa09uji4mlkasdfsd
    
    # alternatively, you can add this line to your shell config
    # export FB_PAGE_ACCESS_TOKEN=fake-access-token-dhsa09uji4mlkasdfsd
    
    echo $FB_PAGE_ACCESS_TOKEN
    ```
    
    - `config var` access at runtime
    ``` javascript
    const token = process.env.FB_PAGE_ACCESS_TOKEN
    ```
    
3. This code adds the POST request handler to simply log the incoming messages. Note: once you deploy this, your Page's messenger will be broken (temporarily).

    ```javascript
    function sendTextMessage(sender, text) {
	    let messageData = { text:text }
	    request({
		    url: 'https://graph.facebook.com/v2.6/me/messages',
		    qs: {access_token:token},
		    method: 'POST',
    		json: {
			    recipient: {id:sender},
    			message: messageData,
    		}
    	}, function(error, response, body) {
    		if (error) {
			    console.log('Error sending messages: ', error)
    		} else if (response.body.error) {
			    console.log('Error: ', response.body.error)
		    }
	    })
    }
    ```

4. Commit the code again and push to Heroku

    ```
    git add .
    git commit -m 'updated the bot to speak'
    git push heroku master
    ```
    
5. Go to the Facebook Page and click on Message to start chatting!

![Alt text](/demo/shot4.jpg)

## ⚙ Customize what the bot says

### *Send a Structured Message*

Facebook Messenger can send messages structured as cards or buttons. 

![Alt text](/demo/shot5.jpg)

1. Copy the code below to index.js to send a test message back as two cards.

    ```javascript
    function sendGenericMessage(sender) {
	    let messageData = {
		    "attachment": {
			    "type": "template",
			    "payload": {
    				"template_type": "generic",
				    "elements": [{
    					"title": "First card",
					    "subtitle": "Element #1 of an hscroll",
					    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
					    "buttons": [{
						    "type": "web_url",
						    "url": "https://www.messenger.com",
						    "title": "web url"
					    }, {
						    "type": "postback",
						    "title": "Postback",
						    "payload": "Payload for first element in a generic bubble",
					    }],
				    }, {
					    "title": "Second card",
					    "subtitle": "Element #2 of an hscroll",
					    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					    "buttons": [{
						    "type": "postback",
						    "title": "Postback",
						    "payload": "Payload for second element in a generic bubble",
					    }],
				    }]
			    }
		    }
	    }
	    request({
		    url: 'https://graph.facebook.com/v2.6/me/messages',
		    qs: {access_token:token},
		    method: 'POST',
		    json: {
			    recipient: {id:sender},
			    message: messageData,
		    }
	    }, function(error, response, body) {
		    if (error) {
			    console.log('Error sending messages: ', error)
		    } else if (response.body.error) {
			    console.log('Error: ', response.body.error)
		    }
	    })
    }
    ```

2. Update the webhook API to look for special messages to trigger the cards

    ```javascript
    app.post('/webhook/', function (req, res) {
	    let messaging_events = req.body.entry[0].messaging
	    for (let i = 0; i < messaging_events.length; i++) {
		    let event = req.body.entry[0].messaging[i]
		    let sender = event.sender.id
		    if (event.message && event.message.text) {
			    let text = event.message.text
			    if (text === 'Generic') {
				    sendGenericMessage(sender)
			    	continue
			    }
			    sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
		    }
	    }
	    res.sendStatus(200)
    })
    ```

### *Act on what the user messages*

What happens when the user clicks on a message button or card though? Let's update the webhook API one more time to send back a postback function.

```javascript  
  app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
  	    let text = event.message.text
  	    if (text === 'Generic') {
  		    sendGenericMessage(sender)
  		    continue
  	    }
  	    sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
      }
      if (event.postback) {
  	    let text = JSON.stringify(event.postback)
  	    sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
  	    continue
      }
    }
    res.sendStatus(200)
  })
```

Git add, commit, and push to Heroku again.

Now when you chat with the bot and type 'Generic' you can see this.

   ![Alt text](/demo/shot6.jpg)

## 📡 How to share your bot

### *Add a chat button to your webpage*

Go [here](https://developers.facebook.com/docs/messenger-platform/plugin-reference) to learn how to add a chat button your page.

### *Create a shortlink*

You can use https://m.me/<PAGE_USERNAME> to have someone start a chat.

## 💡 What's next?

You can learn how to get your bot approved for public use [here](https://developers.facebook.com/docs/messenger-platform/app-review).

You can also connect an AI brain to your bot [here](https://wit.ai)

Read about all things chat bots with the ChatBots Magazine [here](https://medium.com/chat-bots)

You can also design Messenger bots in Sketch with the [Bots UI Kit](https://bots.mockuuups.com)!

## How I can help

I build and design bots all day. Email me for help!
