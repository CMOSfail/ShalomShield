const { Client, Events, GatewayIntentBits } = require('discord.js');
const config = require("./config.js");
const axios = require('axios');
const logger = require('./logger');
const processedAlertsTracker = require('./processedAlertsTracker');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });

let processedAlerts = processedAlertsTracker.loadProcessedAlerts();

function checkForUpdates() {
    axios.get('https://www.oref.org.il/WarningMessages/History/AlertsHistory.json')
        .then(response => {
            const data = response.data;
            const tenMinutesAgo = Date.now() - (10 * 60 * 1000);  // 10 minutes in milliseconds
            const newAlerts = data.filter(alert => {
                const alertTime = new Date(alert.alertDate).getTime();
                return !processedAlerts[alert.alertDate + alert.data] && alertTime >= tenMinutesAgo;
            });

            if (newAlerts.length > 0) {
                const groupedAlerts = {};
                newAlerts.forEach(alert => {
                    const key = alert.alertDate;  // Group by exact date and time
                    if (!groupedAlerts[key]) {
                        groupedAlerts[key] = {
                            title: alert.title,
                            locations: [alert.data],
                            alertDate: alert.alertDate
                        };
                    } else {
                        groupedAlerts[key].locations.push(alert.data);
                    }
                });

                for (let key in groupedAlerts) {
                    const alertGroup = groupedAlerts[key];
                    for (let channelInfo of config.Channels) {
                        const channel = client.channels.cache.get(channelInfo[1].toString());
                        if (channel) {
                            try {
                                channel.send({
                                    embeds: [
                                        {
                                            "type": "rich",
                                            "title": `🔴 ${alertGroup.title} 🔴`,
                                            "color": 0xff0000,
                                            "fields": [
                                                {
                                                    "name": `שעה:`,
                                                    "value": `${alertGroup.alertDate.slice(11, 19)}`
                                                },
                                                {
                                                    "name": `מיקום:`,
                                                    "value": `${alertGroup.locations.join(', ')}`
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
                                logger.error(`Failed to send message to channel ${channelInfo[1]}. Error: ${error.message}`);
                            }
                        } else {
                            console.warn(`Channel with ID ${channelInfo[1]} not found.`);
                            logger.warn(`Channel with ID ${channelInfo[1]} not found.`);
                        }
                    }

                    processedAlerts[alertGroup.alertDate + alertGroup.locations.join(', ')] = true;
                }

                processedAlertsTracker.saveProcessedAlerts(processedAlerts);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            logger.error('Error fetching data:', error);
        });
}

client.on('ready', () => {
    setInterval(checkForUpdates, 30);  // Check every 0.03 seconds
    const owner = client.users.cache.get(config.OWNER_ID);
    if (owner) {
        owner.send("ShalomShield is up and running! Thank you for using our service ❤️")
            .then(() => {
                logger.info('Owner DM sent.');
            })
            .catch(error => {
                console.error('Error sending DM:', error);
                logger.error('Error sending DM:', error);
            });
    } else {
        console.warn(`Owner with ID ${config.OWNER_ID} not found.`);
        logger.warn(`Owner with ID ${config.OWNER_ID} not found.`);
    }
});

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}.`);
    logger.info(`Ready! Logged in as ${c.user.tag}.`);
    checkForUpdates();  // Initial check on bot startup
});

client.login(config.TOKEN);
