#!/bin/bash

# Select the app to update
echo "What app are you updating?"
echo "1: client"
echo "2: server"
echo "3: All apps"
read -p "Enter app number: " site

cd /var/www/www.payfluencer.app

# Run the deploy commands
if [[ $site == 1 ]]; then
  rm -rf client

  cp -r PayfluencerApp/client ./
  cp .env.local ./client

  cd client
  pnpm install
  pnpm run build

  # No need for pm2 since nginx serves static files
  echo "Frontend built successfully and ready to be served by nginx"

  cd /var/www/www.payfluencer.app
elif [[ $site == 2 ]]; then
  rm -rf server

  cp -r PayfluencerApp/server ./
  cp .env ./server

  cd server
  pnpm install
  pnpm run build

  pm2 delete payfluencer-backend # remove old instance
  pnpm run deploy # create new instance

  pm2 status
  pm2 save
  cd /var/www/www.payfluencer.app
elif [[ $site == 3 ]]; then
  # Update server
  rm -rf server

  cp -r PayfluencerApp/server ./
  cp .env ./server

  cd server
  pnpm install
  pnpm run build

  pm2 delete payfluencer-backend # remove old instance
  pnpm run deploy # create new instance

  pm2 status
  pm2 save
  cd /var/www/www.payfluencer.app

  # Update client
  rm -rf client

  cp -r PayfluencerApp/client ./
  cp .env.local ./client

  cd client
  pnpm install
  pnpm run build

  # No need for pm2 since nginx serves static files
  echo "Frontend built successfully and ready to be served by nginx"

  cd /var/www/www.payfluencer.app
else
  echo "Invalid choice given"
  exit 1 # Exit if a wrong site has been selected
fi

echo "$site has been updated successfully"