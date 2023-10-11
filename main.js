const { Client, Events, GatewayIntentBits } = require('discord.js');
const config = require("./config.js");
const axios = require('axios');

// Cache for the most recent alerts
let alerts = "";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Function to check for new alerts
function checkForUpdates() {
    axios.get('https://www.oref.org.il/WarningMessages/History/AlertsHistory.json')
        .then(response => {
            const data = response.data;

            if (JSON.stringify(alerts) !== JSON.stringify(data)) {
                alerts = data;

                if (data[0].alertDate + data[0].data !== config.LAST) {
                    config.LAST = data[0].alertDate + data[0].data;

                    for (let channelInfo of config.Channels) {
                        const channel = client.channels.cache.get(channelInfo[1].toString()); // Make sure to use the ID as a string

                        if (channel) {
                            try {
                                channel.send({
                                    "channel_id": channelInfo[1].toString(),
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
    console.log(`Bot started and ready!`);
    
    // Send a message on all channels when bot starts
    for (let channelInfo of config.Channels) {
        const channel = client.channels.cache.get(channelInfo[1].toString());
        if (channel) {
            try {
                channel.send("ShalomShield is now online and monitoring!");
            } catch (error) {
                console.error(`Failed to send startup message to channel ${channelInfo[1]}. Error:`, error.message);
            }
        }
    }
    
    setInterval(checkForUpdates, 500); // Regularly check for updates
});

// Event for initial bot readiness
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    checkForUpdates();  // Initial check on bot startup
});

// Log in to the bot
client.login(config.TOKEN);
