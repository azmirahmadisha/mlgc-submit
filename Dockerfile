# Use the official Node.js image.
FROM node:18

ENV MODEL_URL='https://storage.googleapis.com/model_mlgc_dicoding/model.json'
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST 0.0.0.0

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN npm install 

# Copy local code to the container image.
COPY . .

RUN npm rebuild @tensorflow/tfjs-node --build-from-source 

# Run the web service on container startup.
CMD [ "npm", "start" ]
