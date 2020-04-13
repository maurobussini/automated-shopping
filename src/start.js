const tigros = require("./tigros-automate");
const esselunga = require("./esselunga-automate");
const delay = require("delay");
const config = require("./configUtils");

async function doWork() {
  try {
    //Get current date
    let date = new Date().toLocaleTimeString();

    // Execute Tigros provider
    console.log("[" + date + "] Starting check online shop on Tigros...");
    const tigrosAutomate = new tigros.TigrosAutomate();
    await tigrosAutomate.check();
    console.log("Check completed.");

    // Execute Esselung provider
    console.log("[" + date + "] Starting check online shop on Esselunga...");
    const esselungaAutomate = new esselunga.EsselungaAutomate();
    await esselungaAutomate.check();
    console.log("Check completed.");
  } catch (exc) {
    console.log("Unhandled exception:" + exc);
  }
}

(async () => {
  for (let i = 0; i < 1000; i++) {
    
    //Execute online shop cheking
    await doWork();
    
    //Get minutes of sleeping
    const minutes = getMinutesInterval();
    console.log("Sleeping for " + minutes + " minutes...");    
    await delay(minutes * 60 * 1000);
  }
})();

function getMinutesInterval() {
  const configuration = new config.ConfigUtils().get();
  if (!configuration) {
    throw new Error("Configuration error");
  }
  const misc = configuration.misc;
  if (!misc) {
    throw new Error("Section 'misc' is missing in configuration");
  }
  return misc.minutesInterval;
}
