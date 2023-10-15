const fs = require('fs');

const processedAlertsFile = 'processedAlerts.json';

module.exports = {
    saveProcessedAlerts: function (alerts) {
        fs.writeFileSync(processedAlertsFile, JSON.stringify(alerts));
    },

    loadProcessedAlerts: function () {
        if (fs.existsSync(processedAlertsFile)) {
            return JSON.parse(fs.readFileSync(processedAlertsFile));
        }
        return {};
    }
};
