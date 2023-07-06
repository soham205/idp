#!/bin/bash
#sudo kill -9 `sudo lsof -t -i:3000`
#sudo kill -9 $(sudo lsof -t -i:3000)
#sudo lsof -t -i:3000 | echo
#os.system("fuser -k 3000/tcp");
# sequelize db:migrate:undo:all
# sequelize db:migrate
# sequelize db:seed:all
rm -rf build
npm run build
rm -rf ../build
cp -R build ../
cp -R node_modules ../build/
cp -R config ../build/
cp -R migrations ../build/
.
cp .env ../build/
cp .sequelizerc ../build/
cd ../build
sequelize db:migrate
node -r dotenv/config server.js