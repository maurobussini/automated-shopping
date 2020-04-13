const requestPromise = require("request-promise");
const config = require("./configUtils");

const SLACK_WEBOOK = "https://hooks.slack.com/services/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"

function slackPost(message) {

  const configuration = new config.ConfigUtils().get();
    if (!configuration){
      throw new Error("Configuration error");
    }

    //Get 'providers' configuration
    const slack = configuration.slack;
    if (!slack){
      throw new Error("Section 'slack' is missing in configuration");
    }

    var options = {      
      method: "POST",
      uri: slack.webhook,
      body: {
        text: message
      },
      json: true // Automatically stringifies the body to JSON
    };

    //Execute request
    requestPromise(options)
      .then(parsedBody => {
        console.log("Message sent to Slack!");
      })
      .catch(err => {
        console.log("Post to Slack failed: " + err);
      });
  }

module.exports = {
    slackPost: slackPost
}