# gcore_backend_analytics
Requirments
```
1. Node 16x
2. Docker 20.10.5(optional)
3. docker-compose 1.25.0(optional)
4. sequelize 
5. pg
```

Running migrations
```
npm i -g sequelize-cli
npm i -g pg
sequelize db:migrate  
```

Running as docker container
```
docker-compose up
```

Running locally
```
npm install
npm run watch
```

Creating production build
```
npm run build
```
Serving prodcution build requires
```
1. Copy .sequlizerc .env node_modules package.json config folder to build.
2. run npm run serve
```
# Useful migration commands.

```
sequelize db:migrate                          Run pending migrations
sequelize db:migrate:schema:timestamps:add    Update migration table to have timestamps
sequelize db:migrate:status                   List the status of all migrations
sequelize db:migrate:undo                     Reverts a migration
sequelize db:migrate:undo:all                 Revert all migrations ran
sequelize db:seed                             Run specified seeder
sequelize db:seed:undo                        Deletes data from the database
sequelize db:seed:all                         Run every seeder
sequelize db:seed:undo:all                    Deletes data from the database
sequelize db:create                          Create database specified by configuration
sequelize db:drop                            Drop database specified by configuration
sequelize init                               Initializes project
sequelize init:config                        Initializes configuration
sequelize init:migrations                    Initializes migrations
sequelize init:models                        Initializes models
sequelize init:seeders                       Initializes seeders
sequelize migration:generate                 Generates a new migration file
sequelize migration:create                   Generates a new migration file
sequelize model:generate                     Generates a model and its migration
sequelize model:create                       Generates a model and its migration
sequelize seed:generate                      Generates a new seed file
sequelize seed:create                        Generates a new seed file
```
</details>

# Installing docker and docker compose.
<details>
  <summary>Steps for installing docker.</summary>
  
  ```
    1. Update the apt package index and install packages to allow apt to use a repository over HTTPS:

```bash
sudo apt-get update

sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

2. Add Docker’s official GPG key:

```bash
 curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
 ```

3. Use the following command to set up the stable repository. To add the nightly or test repository, add the word nightly or test (or both) after the word stable in the commands below.

```bash
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

4. Update the apt package index, and install the latest version of Docker Engine and containerd, or go to the next step to install a specific version:

```bash
 sudo apt-get update
 sudo apt-get install docker-ce docker-ce-cli containerd.io
 ```

 **Install Docker Compose on Linux System**
1. Run this command to download the current stable release of Docker Compose:

```bash
 sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

2. Apply executable permissions to the binary:

```bash
sudo chmod +x /usr/local/bin/docker-compose
```

3. Test the installation.
```bash
docker-compose --version
```

</details>