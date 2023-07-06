#!/bin/sh
npm install
sequelize db:migrate
npm run watch