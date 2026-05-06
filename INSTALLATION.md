# INSTALLATION AND DEPLOYMENT MANUAL
## EDXIF PRO SYSTEM SETUP GUIDE

### 1 PRE REQUISITES
Before attempting to install the EDXIF PRO system ensure that the host environment meets the following technical requirements.

1. RUNTIME ENVIRONMENT
Node.js version 18.0.0 or higher must be installed.
npm version 9.0.0 or higher is required for package management.

2. BINARY DEPENDENCIES
ExifTool by Phil Harvey must be installed and accessible in the system path. This tool path is critical for the metadata writing operations.

3. OPERATING SYSTEM
The system is designed for high compatibility across Linux macOS and Windows environments.

### 2 INSTALLATION STEPS

1. REPOSITORY INITIALIZATION
Download the source code into a dedicated directory on your local machine or server.

2. PACKAGE INSTALLATION
Open a terminal in the project root and execute the command npm install. This will download all required libraries including React Vite Express and secondary processing utilities.

3. DIRECTORY PERMISSIONS
Ensure that the /tmp/uploads directory exists and has the necessary read and write permissions for the Node.js process. The system relies on this temporary buffer for file processing.

### 3 BUILDING FOR PRODUCTION

1. COMPILATION
Execute the command npm run build. This process will use Vite to compile the TypeScript source into optimized JavaScript and CSS.

2. ASSET VERIFICATION
Confirm that the dist directory contains all transformed assets including index.html and the bundled javascript files.

### 4 DEPLOYMENT MODES

1. STANDALONE SERVER
The application can be deployed as a standalone Node.js server. Run the command node server.ts to start the production listener.

2. CONTAINERIZED DEPLOYMENT
For cloud environments utilize the provided Dockerfile or container configuration to build an image. Ensure that the internal port 3000 is correctly mapped to the external gateway.

### 5 POST INSTALLATION VERIFICATION

1. CONNECTIVITY CHECK
Access the application via the designated URL and navigate to the health check endpoint at /api/metadata to verify backend responsiveness.

2. FUNCTIONAL TEST
Upload a standard JPEG file and verify that the technical descriptors are correctly extracted and displayed in the terminal interface.
