FROM node:16

# Set work directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json /app/
RUN npm install

# Copy project files
COPY . /app/

# Expose port
EXPOSE 3000

# Run React app
CMD ["npm", "start"]
