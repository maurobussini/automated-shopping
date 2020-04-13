const puppeteer = require("puppeteer");
const slack = require("./slack-utils");

const config = require("./configUtils");

class TigrosAutomate {
  USERNAME = null;
  PASSWORD = null;
  ISENABLED = false;

  constructor() {
    // Get configuration
    const configuration = new config.ConfigUtils().get();
    if (!configuration) {
      throw new Error("Configuration error");
    }

    //Get 'providers' configuration
    const providers = configuration.providers;
    if (!providers){
      throw new Error("Section 'providers' is missing in configuration");
    }

    //Get "tigros" configuration
    const tigros = providers.tigros;
    if (!tigros) {
      throw new Error("Section 'tigros' is missing in configuration");
    }

    // Set local variabled
    this.USERNAME = tigros.username;
    this.PASSWORD = tigros.password;
    this.ISENABLED = tigros.isEnabled;
  }

  /**
   * Executes check
   */
  async check() {

    //If disabled, skip
    if (!this.ISENABLED) {
      console.log('Provider "esselunga" is NOT enabled. Skipping...');
    }

    //Apertura del browser
    const browser = await puppeteer.launch({
      headless: true,
      slowMo: 20,
    });

    //Nuova pagina come home page Tigro
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1000 });
    await page.goto("https://www.tigros.it/shop/home");

    //Apertura menu login e autenticazione
    await page.click(".dropdown-toggle");
    await page.type('input[name="username"]', this.USERNAME);
    await page.type('input[name="password"]', this.PASSWORD);
    await page.click(".btn.btn-primary.btn-block");

    //Attesa completamento login
    await page.waitFor(3000);

    //Conferma della selezione del supermercato
    await page.click(".btn.btn-primary");
    await page.screenshot({ path: "./screens/tigros-accesso.png" });

    //Recupero dei tab con i giorni
    const days = await page.$$(".uib-tab.nav-item");

    //Predisposizione orari vuoti
    let freeHours = [];

    //Scorro i giorni
    for (let i = 0; i < days.length; i++) {
      //Clicco sul giorno e foto
      await days[i].click();
      await page.screenshot({
        path: "./screens/" + "tigros-orari-day-" + i + ".png",
      });

      //Recupero testo giorno
      const dayText = await page.evaluate(
        (element) => element.textContent,
        days[i]
      );

      //Ricerca dei tag con gli orari liberi => .col.timeslot.empty
      const freeSlots = await page.$$(".col.timeslot.empty");

      //Iterazione sugli orari liberi
      for (let k = 0; k < freeSlots.length; k++) {
        //Recupero testo contenuto
        const hourText = await page.evaluate(
          (element) => element.textContent,
          freeSlots[k]
        );

        //Accodamento inner text con orario
        freeHours.push(dayText + "(" + hourText + ")");
      }
    }

    //Se ho anche solo un orario libero, segnalazione
    if (freeHours.length > 0) {
      //Composizione messaggio
      console.log(
        "Trovati " + freeHours.length + " orari disponibili. Invio a Slack..."
      );
      let message = freeHours.join(",");
      slack.slackPost("Tigros: trovati orari disponibili: " + message);
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
  TigrosAutomate: TigrosAutomate
};