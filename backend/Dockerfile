FROM node:14

# Create an application directory
RUN mkdir -p app

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json .


# Install node packages
RUN npm install 

# Copy our project directory (locally) in the current directory of our docker image (/app)
COPY . .


# Expose $PORT on container.
EXPOSE 4000

# Start the app
CMD ["npm","start"]
