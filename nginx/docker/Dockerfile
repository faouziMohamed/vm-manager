FROM nginx:1-alpine

# Remove any existing config files
RUN rm /etc/nginx/conf.d/*

# Copy the config files
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
