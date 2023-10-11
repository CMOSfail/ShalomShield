const { Client, Events, GatewayIntentBits } = require('discord.js');
const config = require("./config.js");
const axios = require('axios');

let alerts = "";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });

function checkForUpdates() {
    axios.get('https://www.oref.org.il/WarningMessages/History/AlertsHistory.json')
        .then(response => {
            const data = response.data;
            if (JSON.stringify(alerts) !== JSON.stringify(data)) {
                alerts = data;
                if (data[0].alertDate + data[0].data !== config.LAST) {
                    config.LAST = data[0].alertDate + data[0].data;
                    for (let channelInfo of config.Channels) {
                        const channel = client.channels.cache.get(channelInfo[1].toString());
                        if (channel) {
                            try {
                                channel.send({
                                    embeds: [
                                        {
                                            "type": "rich",
                                            "title": `🔴 ${data[0].title} 🔴`,
                                            "color": 0xff0000,
                                            "fields": [
                                                {
                                                    "name": `שעה:`,
                                                    "value": `${data[0].alertDate.slice(11, 16)}`
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
    setInterval(checkForUpdates, 500);  // Check every 0.5 seconds
    const owner = client.users.cache.get(config.OWNER_ID);
    if (owner) {
        owner.send("ShalomShield bot is up and running!");
    } else {
        console.warn(`Owner with ID ${config.OWNER_ID} not found.`);
    }
});

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    checkForUpdates();  // Initial check on bot startup
});

client.login(config.TOKEN);
