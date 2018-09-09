# Pokemon Go Gym Mapper Discord Bot

## Introduction

This Discord bot provides Google Maps links to Pokemon Go gyms. It maintains a local sqlite3 database, which is populated manually with the names and coordinates of gyms in the area of interest. 

## Commands

- `+map exactGymNameWithSpaces` to get a Google Maps URL to the gym. The gym name must be an exact match with spaces but is insensitive to capitalization. If more than one gym matches the name, all matches will be returned. Also works with `+where` and `+whereis`. e.g. `+map doughnut fountain`

## Setup and Deploy

- Currently this runs on a local node.js server. Run `npm install` in the root directory. Then `node app.js` to start the bot.

## Credits

This bot uses some code from the following (MIT-licensed code):

https://gist.github.com/eslachance/3349734a98d30011bb202f47342601d3

https://anidiots.guide/
