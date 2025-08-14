FROM node:20-alpine

WORKDIR /app

# Install required packages
RUN apk add --no-cache curl jq

# Copy initialization scripts
COPY init-forms.js /app/
COPY sample-forms.json /app/

# Install axios for HTTP requests
RUN npm init -y && npm install axios

# Run initialization script
CMD ["node", "init-forms.js"]


