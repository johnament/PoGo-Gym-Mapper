# Pokemon Go Gym Mapper Discord Bot

## Introduction

This Discord bot provides Google Maps links to Pokemon Go gyms. It maintains a local sqlite3 database, which is populated manually with the names and coordinates of gyms in the area of interest. 

## Commands

- `+map exactGymNameWithSpaces` to get a Google Maps URL to the gym. The gym name must be an exact match but is not sensitive to capitalization. If there are more than one gym that match the name, all matches will be returned. Also works with `+whereis` and `+whereis`. e.g. `+map doughnut fountain`

## Setup and Deploy

- Currently this runs on a local node.js server. Run `npm install` in the root directory. Then `node app.js` to start the bot.

- To add the bot to your server, go to:
https://discordapp.com/oauth2/authorize?client_id=488348831927369744&scope=bot

## Credits

This bot uses some code from the following (MIT-licensed code):

https://gist.github.com/eslachance/3349734a98d30011bb202f47342601d3

https://anidiots.guide/getting-started/your_basic_bot.html
