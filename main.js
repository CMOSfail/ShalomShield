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

                    // Loop through each channel in the config and send an alert
                    for (let channelInfo of config.Channels) {
                        const channel = client.channels.cache.get(channelInfo[1]);
                        if (channel) {
                            try {
                                channel.send({
                                    "channel_id": channelInfo[1],
                                    "content": "",
                                    "tts": false,
                                    "embeds": [
                                        {
                                            "type": "rich",
                                            "title": `🔴 ${data[0].title} 🔴`,
                                            "description": "",
                                            "color": 0xff0000,
                                            "fields": [
                                                {
                                                    "name": `שעה:`,
                                                    "value": `${data[0].alertDate.slice(11, 16)}`  // Only extract hours and minutes
                                                },
                                                {
                                                    "name": `מיקום:`,
                                                    "value": `${data[0].data}`
                                                }
                                            ],
                                            "footer": {
                                                "text": "© ShalomShield 2023"
                                            }
                                        }
                                    ]
                                });
                            } catch (error) {
                                console.error(`Failed to send message to channel ${channelInfo[1]}. Error:`, error.message);
                            }
                        } else {
                            console.warn(`Channel with ID ${channelInfo[1]} not found.`);
                        }
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

client.on('ready', () => {
    setInterval(checkForUpdates, 30000);  // Check every 30 seconds
});

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    checkForUpdates();  // Initial check on bot startup
});

client.login(config.TOKEN);
