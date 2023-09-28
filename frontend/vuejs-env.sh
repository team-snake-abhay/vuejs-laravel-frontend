#!/bin/bash

read -p "Enter URL: " laravelurl

# Remove the trailing slash if it exists
laravelurl=${laravelurl%/}

# Append "/v1/api" to the URL
url_with_api="$laravelurl/api/v1"

# Update the .env file
# sed -i "s/^API_URL_DEV=.*/API_URL_DEV=$url_with_api/" .env
# sed -i "s/^API_URL=.*/API_URL=$url_with_api/" .env
