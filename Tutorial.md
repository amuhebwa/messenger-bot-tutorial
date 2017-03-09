# 🤖 Creating your own Facebook Messenger Bot - Tutorial

This tutorial is based on the Facebook Quickstart https://developers.facebook.com/docs/messenger-platform/guides/quick-start and one from  Jerry Wang (https://jw84.co) (c) 2106: https://github.com/jw84/messenger-bot-tutorial.

If you have not already done so, please finish the setup outlined in the [PreParty.md](https://github.com/amuhebwa/messenger-bot-tutorial/blob/master/PreParty.md) file.

## 🙌  Let's Bot Party 
### We will start our Bot Party by going through the rest of these steps together.

### *Setup the Validation in your Server*

1. Open two command-line prompts and in each, cd to the web server diretory that you created during Setup.

2. In one window, run this command so you can see your web server app logs:

    ```
    heroku logs --source app  -t
    ```

3. Use your other window to edit your index.js file and commit/push your changes. Try changing the "Hello World" text. Remember these steps to deploy your changes:

    ```
    git add .
    git commit --message "Your comment"
    git push heroku master
    ```

4. Refresh your Heroku app and you will see the messages that are logged to the console.

5. Copy the index.js.v2 code into index.js and re-deploy.

6. Refresh your Heroku app to verify that it still works correctly.

7. NOTE: In real-life, you should change the Verify Code to use your own token instead of YOUR_TOKEN, and re-deploy, but for this tutorial it's ok to leave it.


### *Setup the Facebook App*

1. Create a new Facebook Page:
    On your Home page, along the top is a drop down. Select it and you will see "Create Page".

    ![Alt text](/images/CreatePage1.png)

    ![Alt text](/images/CreatePage2.png)

2. Create a new Facebook App: https://developers.facebook.com/apps/. Make it a Messenger App.

    Note: If you are not already a Facebook Developer, you will need to become one.

3. In the App, go to Messenger tab, and under Settings, scroll down and click Setup Webhook.  First, put in the URI of your Heroku server.  Be sure to add /webhook to the end of your Server URI. Go ahead and check all the subscription fields. 

    ![Alt text](/images/WebHook.png)

5. Start with "xyz" for your Verify Token, see that it fails, and watch your Heroku log.  Then put in the YOUR_TOKEN (it needs to match your the code in index.js). Verify and Save.

6. Scroll UP to Token Generation to get a Page Access Token. Select the page that you created earlier and a great-big number will be generated.

    ![Alt text](/images/PageAccessToken.png)

    The Page Access Token is not persisted on the page, so copy/paste and save it somewhere (perhaps in a Draft email).

    We will use it in 2 places: once now to trigger the Facebook App to send messages to the Bot and once later for setting up access to the Facebook API for your Bot.

7. Go back to Terminal and type in this command to trigger the Facebook app to send messages. Instead of \<PAGE_ACCESS_TOKEN\>, use the Page Access Token you requested and saved in the previous step.

    ```bash
    curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=<PAGE_ACCESS_TOKEN>"
    ```

### *Setup the Bot*

Now that Facebook and Heroku can talk to each other we can start coding the Bot.

1. So far our Server has been using GET, both for the Hello World server and the Facebook App Verification. Facebook Messenger will use POST to send requests to your Bot, so we will write code in our Server to handle the POST requests that come from Facebook Messenger to your Bot.

2. Next, replace index.js with index.js.v3 which has the start of code for our Bot to handle these requests.

3. This code adds the POST request handler to simply log the incoming events and messages. 

    ```javascript
    // Process Facebook Messenger Requests

app.post('/webhook', function (req, res)
{
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object === 'page')
    {
        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function(entry)
        {
        var pageID = entry.id;
        var timestamp = entry.time;

        // Iterate over each messaging event
        entry.messaging.forEach(function(event)
        {
            if (event.message)
           {
                if (event.message.is_echo)
                      console.log("Bot received message written event");
                else
                      console.log("Bot received message " + event.message.text);
            }
            else  if (event.delivery)
              console.log("Bot received delivery event");
            else  if (event.read)
              console.log("Bot received message-was-read event");
            else  if (event.postback)
                doPostback(event);
            else
              console.log("Bot received unknown EVENT: ");
          });
        });
    }
    else
    {
      console.log("Bot received unknown OBJECT (not page): ", data.object);
    }

    // All good, sent response status 200

    res.sendStatus(200)
});
    ```

4. Copy the functs.js file to your *myBot1* directory.

5. Commit the code again and push to Heroku

    ```
    git add .
    git commit -m 'updated the bot to speak'
    git push heroku master
    ```
    
6. Go to your Facebook Page and Select Menu, then View as Page Visitor.

    ![Alt text](/images/VisitPage.png)

7. Select Send Message to start a Messenger conversation with your page.

8. Return to your Facebook page and send your Page a message from your user Messenger window.

9. Watch your Heroku logs!

### *Let's get the Bot Talking*

1. Edit your copy of functs.js. This file has the Page Access Token in it  - you will need to change it to yours.

    Find this line:

    ```
    const PAGE_ACCESS_TOKEN = "EAAKTalAQ2eoBEAXiFuM..."
    ```

    Copy and paste your Page Access Token between the quotes.
    
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

2. Update your index.js so that instead of simply logging the incoming message, it calls the function to process it.

    So change this line (it should be line 78):
    ```javascript
    console.log("Bot received message " + event.message.text);
    ```
    to this:
    ```javascript
    functs.receivedMessage(event);
    ```

3. Look at the receivedMessage() code to see what it is doing.


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
