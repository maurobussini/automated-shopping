# Automated Shopping

Verifica la presenza di orari e giorni di disponibilità su supermercati online.
Attualmente l'implementazione supporta i seguenti portali:

- Tigros [Tigros Spesa Online](https://www.tigros.it/)
- Esselunga [Esselunga a casa](https://www.esselungaacasa.it/)

## Requisiti di funzionamento

Per l'esecuzione sono necessari i seguenti requisiti sul computer di esecuzione

- NodeJs [NodeJs Runtime](https://nodejs.org/)
  - Installare la versione LTS, con le impostazioni di default
- Yarn [Yarn Package Manager](https://classic.yarnpkg.com/latest.msi)
  - Installare la versione stable con le impostazioni di default

Dopo aver installato NodeJe e Yarn, verificare il loro funzionamento lanciando da 
linea di comando (Powershell o Cmd) i seguenti comandi:

- `node --version`
- `yarn --version`

se per entrambi viene riportato il numero di versione, tutto è corretto.

## Installazione delle estensioni

Per eseguire il programma è necessario prima eseguire l'installazione dei pacchetti
compatibili con il proprio sistema operativo. Per fare questo, posizionarsi nella
cartella con i file (quella contenente il "package.json"), lanciare la commandline
e digitare

`yarn install`

quindi attendere l'installazione che potrebbe durare qualche minuto.

## Configurazione dei propri account per gli online shop

- Copiare il file `config.sample.yml` e rinominarlo in `config.yml` lasciandolo nella
  directory principale del programma.
- Modificare il file - senza cambiare l'indentazione
  dello stesso - inserendo le proprie **username** e **password** di accesso per i
  provider supportati
- Eventualmente **abilitare** o **disabilitare** con i valori `true` e `false` i
  provider di accesso non utilizzabili
- Cambiare il numero di minuti di intervallo tra un check e il seguente cambiando
  il valore riportato nella configurazione. Per prevenire blocchi dell'account è
  consigliabile non scendere mai sotto i **5 minuti**.

## Avvio del programma

Lanciare sempre da linea di comando, partendo dalla cartella base del programma
e usando Powersheell, CMD o Git Bash il seguente comando:

`npm run start`
