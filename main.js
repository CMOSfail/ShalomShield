const { Client, Events, GatewayIntentBits } = require('discord.js');
const config = require("./config.js");
const axios = require('axios');
let alerts = "";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function checkForUpdates() {
    axios.get('https://www.oref.org.il/WarningMessages/History/AlertsHistory.json')
      .then(response => {
        const data = response.data;
        if (JSON.stringify(alerts) !== JSON.stringify(data)) {
            alerts = data;
            if (data[0].alertDate + data[0].data !== config.LAST) {
                config.LAST = data[0].alertDate + data[0].data;
                const channel = client.channels.cache.get('1107281385561014372');
                channel.send({
                  "channel_id": `1107281385561014372`,
                  "content": "",
                  "tts": false,
                  "embeds": 
                  [
                    {
                      "type": "rich",
                      "title": `${data[0].title}🔴`,
                      "description": "",
                      "color": 0xff0000,
                      "fields": 
                      [
                        // {
                        //   "name": `סוג התראה: `,
                        //   "value": `${data[0].title}`
                        // },
                        {
                          "name": `שעה:`,
                          "value": `${data[0].alertDate.slice(11)}`
                        },
                        {
                          "name": `מיקום:`,
                          "value": `${data[0].data}`
                        }
                      ]
                    }
                  ]
                });
            }
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
}
client.on('ready', () => {
    setInterval(checkForUpdates, 50) // Runs every 0.5 seconds  
})
 
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    checkForUpdates();
});

client.login(config.TOKEN);




