#!/bin/bash

read -p "Enter URL: " laravelurl
laravelurl=${laravelurl%/}

# Append "/v1/api" to the URL
url_with_api="$laravelurl/api/v1"

# Full path to the .env file
env_file="$HOME/public_html/vuejs-laravel-frontend/frontend/.env"

# Update the .env file
sed -i "s/^API_URL_DEV=.*/API_URL_DEV=$url_with_api/" "$env_file"
sed -i "s/^API_URL=.*/API_URL=$url_with_api/" "$env_file"
