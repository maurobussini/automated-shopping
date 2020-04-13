const requestPromise = require("request-promise");
const config = require("./configUtils");

function slackPost(message) {
  const configuration = new config.ConfigUtils().get();
  if (!configuration) {
    throw new Error("Configuration error");
  }

  //Get 'providers' configuration
  const slack = configuration.slack;
  if (!slack) {
    throw new Error("Section 'slack' is missing in configuration");
  }

  // If not enabled, exit
  if (!slack.isEnabled){
    console.warn("Slack web notification is NOT enabled! Writing on console...");
    console.log("MESSAGE:" + JSON.stringify(message));
    return;
  }

  //Create request options
  var options = {
    method: "POST",
    uri: slack.webhook,
    body: {
      text: message,
    },
    json: true, // Automatically stringifies the body to JSON
  };

  //Execute request
  requestPromise(options)
    .then((parsedBody) => {
      console.log("Message sent to Slack!");
    })
    .catch((err) => {
      console.log("Post to Slack failed: " + err);
    });
}

module.exports = {
  slackPost: slackPost,
};
