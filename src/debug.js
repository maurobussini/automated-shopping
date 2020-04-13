const esselunga = require("./esselunga-automate");
const tigros = require("./tigros-automate");

(async () => {

    // Debug Tigros
    // const instance = new tigros.TigrosAutomate();
    // await instance.check();

    // Debug Esselunga
    const instance = new esselunga.EsselungaAutomate();
    await instance.check();
})();


