import Botkit from 'botkit';
import alexa from 'alexa-botkit';
import localtunnel from 'localtunnel';
import { uTu, constants } from 'utu';

// tag utu constants to app environment
const utu = new uTu(process.env.UTU_SECRET, {
  platform: constants.ALEXA,
  appId: process.env.ALEXA_APPID,
});

// define ears for Alexa
const ears = alexa({
  debug: true,
});

// give alexa the tools to listen and communicate to the outside world
const earBuds = ears.spawn({});

// start listening to your Alexa ears!
ears.setupWebserver(3000, (err, webserver) => {
  ears.createWebhookEndpoints(webserver, earBuds);
});

ears.middleware.receive.use((bot, message, next) => {
  message.utu = utu.withContext(
    {
      platformId: message.user,
      sessionId: message.alexa.getSessionId(),
    }
  );
  next();
});

export default ears;