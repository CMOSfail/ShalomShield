# ShalomShield
![banner](https://github.com/CMOSfail/ShalomShield/assets/49645262/a05db33d-fb5a-4807-921b-a329842518f9)

ShalomShield is a Discord bot designed to send real-time alerts about the "Tzeva Adom" (Color Red) sirens in Israel. Drawing data directly from "Pikud HaOref" (Israel's Home Front Command), this bot provides notifications to specified Discord channels regarding imminent threats.

## Backstory

Developed amidst the tumultuous 2023 conflict between Israel and Hamas, known as "חרבות ברזל", ShalomShield is the brainchild of [Itamar Itzhaki](https://github.com/CMOSfail), a senior high school student. Recognizing the need for a tool that can keep communities informed, Itamar crafted this bot to serve a greater good. 

In the spirit of unity and solidarity, he has made this project available on [GitHub](https://github.com/CMOSfail/ShalomShield). During such tough times, it's essential for everyone to come together, pooling resources and skills for the collective safety and welfare. This bot is Itamar's contribution to that effort, and he welcomes you to leverage it for your Discord communities, free of charge.

## Setup

### Prerequisites
- Node.js and npm
- A Discord bot token

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/CMOSfail/ShalomShield.git
   ```

2. Navigate to the project directory:
   ```
   cd ShalomShield
   ```

3. Install the necessary dependencies:
   ```
   npm install
   ```

4. Rename `config.js.example`, `creds.js.example` to `config.js`, `creds.js` and fill in the placeholders with your actual Discord bot token, Guild and Channel IDs, and your user ID.

5. Start the bot:
   ```
   npm start
   ```

## Features
- **Real-time Alerts**: Immediate notifications for every new "Tzeva Adom" siren alert.
- **Multi-Channel Support**: Configurable to send alerts across various channels and servers.
- **Startup Notification**: Direct DM notifications to the owner upon bot startup.

## Contributing
Feel free to contribute and expand upon the bot's capabilities. However, please discuss major changes or feature additions through GitHub issues before creating pull requests.

## License
[GNU Affero General Public License v3 (AGPL-3.0)](https://choosealicense.com/licenses/agpl-3.0/)
