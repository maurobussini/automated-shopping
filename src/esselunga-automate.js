const puppeteer = require("puppeteer");
const slack = require("./slack-utils");
const config = require("./configUtils");

class EsselungaAutomate {

  USERNAME = null;
  PASSWORD = null;
  ISENABLED = false;

  constructor () {

    // Get configuration
    const configuration = new config.ConfigUtils().get();
    if (!configuration){
      throw new Error("Configuration error");
    }

    //Get 'providers' configuration
    const providers = configuration.providers;
    if (!providers){
      throw new Error("Section 'providers' is missing in configuration");
    }

    //Get "esselunga" configuration
    const esselunga = providers.esselunga;
    if (!esselunga){
      throw new Error("Section 'esselunga' is missing in configuration");
    }

    // Set local variabled
    this.USERNAME = esselunga.username;
    this.PASSWORD = esselunga.password;
    this.ISENABLED = esselunga.isEnabled;
  }

  /**
   * Executes check
   */
  async check() {

    //If disabled, skip
    if (!this.ISENABLED){
      console.log('Provider "esselunga" is NOT enabled. Skipping...');
    }

    //Apertura del browser
    const browser = await puppeteer.launch({
      headless: true,
      slowMo: 50,
    });

    //Nuova pagina come home page Esselunga
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1000 });
    await page.goto(
      "https://www.esselunga.it/area-utenti/applicationCheck?appName=esselungaEcommerce&daru=https%3A%2F%2Fwww.esselungaacasa.it%3A443%2Fecommerce%2Fnav%2Fauth%2Fsupermercato%2Fhome.html%3F&loginType=light"
    );

    //Apertura menu login e autenticazione
    await page.type('input[name="username"]', this.USERNAME);
    await page.type('input[name="password"]', this.PASSWORD);

    await page.click('button[type="submit"]');

    //Attesa completamento login
    await page.waitFor(3000);

    //Print della pagina
    await page.screenshot({ path: "./screens/esselunga-accesso.png" });

    //Clic sulla funzione di consegna
    await page.click('i[class="icon-furgoncino"]');

    //Attesa completamento login
    await page.waitFor(3000);

    //Recupero dei tab con i giorni
    const fasce = await page.$$('input[name="quality"]');

    //Predisposizione orari vuoti
    let freeHours = [];

    //Print della pagina con le disponibilità
    await page.screenshot({ path: "./screens/esselunga-orari.png" });

    //Scorro i giorni
    for (let i = 0; i < fasce.length; i++) {
      // Recupero della classe con il nome "esaurita", "non attiva", "disponibile"
      let className = await page.evaluate(
        (element) => element.className,
        fasce[i]
      );

      //Se è disponibile, la accodo
      if (className === "disponibile") {
        freeHours.push("Fascia " + i);
      }
    }

    //Se ho anche solo un orario libero, segnalazione
    if (freeHours.length > 0) {
      //Composizione messaggio
      console.log(
        "Trovati " + freeHours.length + " orari disponibili. Invio a Slack..."
      );
      let message = freeHours.join(",");
      slack.slackPost("Esselunga: trovati orari disponibili: " + message);
    } else {
      console.log("Nessun orario disponibile!");
    }

    //Attesa completamento invio a slack
    await page.waitFor(3000);

    //Chiusura browser
    await browser.close();
  }
}

module.exports = {
  EsselungaAutomate: EsselungaAutomate
};