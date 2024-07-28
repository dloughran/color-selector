FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
#COPY src/package*.json ./
#COPY ../src/package*.json ./
COPY ../src/package*.json .
# Install dependencies
RUN npm install express multer cors

# Copy only necessary files
COPY ../src .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]

# SOME EXPLANATIONS
# The project folder structure is this...
# color-selector
# |--docker
#    |--.dockerignore
#    |--docker-compose.yml
#    |--Dockerfile
# |--src
#    |--node-modules
#    |--public
#       |--index.html
#       |--script.js
#       |--styles.css
#    |--uploads
# |--index.js
# |--package.json
#
# I want to issue the image-build command 'docker image build -t color-selector .' (or a 'docker compose up') 'docker' folder.
#
# Because my 'Dockerfile' is in the 'docker' folder, any COPY operations must take this into account and specify paths relative to the 'docker' folder.
# The COPY operations in this file do so by prefixing the source-paths with '..', which is like saying, "start at the parent of the current folder."
# You can also think of it as issuing the command "cd.." prior to doing the COPY.
# So, the 'COPY ../src/package*.json .' and 'COPY ../src .' are both correct in relation to the 'docker' folder, which is from where the 'docker image build' is being run.
# 
# To clarify the 'COPY' syntax: COPY [HOST SOURCE PATH] [CONTAINER DESTINATION PATH]
# The [HOST SOURCE PATH] is relative to the folder the 'image build' or 'compose up' command is run from.
# the [CONTAINER DESTINATION PATH] is relative to the container path set in the WORKDIR entry ('/usr/src/app') of this Dockerfile
# So, 
#  '../src/package*.json' is the correct HOST SOURCE PATH in relation to the 'docker'.
#  '.' is the correct CONTAINER DESTINATION PATH in relation to the WORKDIR (. = current directory)