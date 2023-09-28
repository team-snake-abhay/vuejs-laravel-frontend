#!/bin/bash

read -p "Enter URL: " laravelurl

# Remove the trailing slash if it exists
laravelurl=${laravelurl%/}

# Append "/v1/api" to the URL
url_with_api="$laravelurl/api/v1"

# Update the .env file
# sed -i "s/^APP_URL=.*/APP_URL=$url_with_api/" .env
# sed -i "s/^APP_URL_ID=.*/APP_URL_ID=$url_with_api/" .env

echo "Updated .env file with URL: $url_with_api"
