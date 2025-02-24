# jwt-api

# Below is the structure of project folder 

jwt-api/
│── .github/              # GitHub Actions workflows
│   ├── workflows/        # Contains CI/CD pipeline configurations
│   │   ├── main_jwt-api.yml    # GitHub Actions workflow for deploying to Azure Functions
│
│── hello/                # Contains the "hello" function (JWT validation)
│   ├── function.json     # Defines bindings for "hello"
│   ├── index.js          # Contains the code for token validation
│
│── login/                # Contains the "login" function (JWT generation)
│   ├── function.json     # Defines bindings for "login"
│   ├── index.js          # Contains the code for login and JWT creation
│
│── host.json             # Global Azure Function settings
│── local.settings.json   # Local environment settings (e.g., JWT_SECRET)
│── node_modules/         # Installed dependencies
│── package.json          # Dependencies and scripts
│── package-lock.json     # Dependency versions
│── README.md             # Documentation

# Function App (jwt-api) contains two functions:

/api/login → Generates a JWT token

/api/hello → Validates the JWT token & returns a response

login function (for user authentication and JWT generation)
hello function (for token validation and returning a greeting)

# Each function has its own directory (login/ and hello/), and both contain:

index.js → The main function logic
function.json → Azure Function metadata (binding configurations)

# Here is how you need to use this app : 
User Logs In (POST /api/login)
Triggered function: login/index.js

# Flow:
User sends a POST request to /api/login in Postman.
Azure Function App routes the request to login/index.js.
login/index.js:
Reads the username from the request body.
Uses jsonwebtoken to generate a JWT token.
Sends the JWT token in the response.


# User Calls Protected Route (GET /api/hello)
Triggered function: hello/index.js

# Flow:
User sends a GET request to /api/hello, passing the JWT token in the Authorization header.
Azure Function App routes the request to hello/index.js.
hello/index.js:
Extracts the token from the header.
Verifies it using jsonwebtoken.
If valid, returns "Hello, {username}!".
If invalid/missing, returns "Access Denied".


# CICD Github action explainiation .

# Workflow Trigger : 
Triggered on Pushes to the main branch. Manual runs via workflow_dispatch.

# Build Job

1. Checkout Repository : using  actions/checkout@v4 to clone the repository
2. Setup Node.js Environment : using actions/setup-node@v3 to set up Node.js version 20.x
3. Install below Dependencies & Run Tests
    Runs npm install to install dependencies.
    Runs npm run build (if a build script exists).
    Runs npm run test (if test scripts exist)
4. Zips the entire project into release.zip for deployment
5. Uploads and Stores release.zip in GitHub Actions for later use

# Deploy Job

1. Download and Fetches the release.zip artifact from the previous job
2. Extracts release.zip to prepare for deployment
3. Log in into azure using azure/login@v2 with secrets for client ID, tenant ID, and subscription ID. These values are defined secrete variable in githubactions settings
    Note : I created function app manually in azure portal along with service princible
4. Sets JWT_SECRET in Azure , and secrete is defined github actions secret variable secion
5. Deploys node js ap to  Function App using  Azure/functions-action@v1 to deploy the application to Azure Functions

# Application diagram is added in repository .png is the file name under main folder


# How to test it ?

The app is live in azure cloud in a function app setup which is usinf node.js 18.x version as runtime environment

# Using postman

1. Set request type to POST.
2. Use the URL - http://localhost:7071/api/login
3. Go to the Body option use below json for user name or you can change the username as you wish. and select the JSON in body type
    {
    "username": "akash"
    }
4. Hit send button , and you should be getting a respone like below, which is a token generated  by /api/login function

    {
    "token": "eyJhbGciOiJIUzI1NiIsInR..."
    }

5. Open another tab in postman and set the request type to GET .
6. Use the URL - https://jwt-api.azurewebsites.net/api/hello
7. Go to headers tab in postman , add a new header with Key "Authorization" and Bearer <followed  by token> like below. Paste the token generated in above steps.
8. Hit send buttion,  you should be recieving a message like below in the postman reponse section.
    {
    "message": "Hello, akash!"
    }

If the token is invalid you will get access denied in response 

# Using Curl

1. Open terminal hit enter to below command . You can change the user name as per your wish.
    curl -X POST "http://localhost:7071/api/login" -H "Content-Type: application/json" -d '{"username": "akash"}'
2. You will get a response along with token and copy the token from response

3. Run the following command, replacing <TOKEN> with your actual JWT token generated in previous step
    curl -X GET "http://localhost:7071/api/hello" -H "Authorization: Bearer <TOKEN>"
4. You should be seeing a response in your terminal along with message Hello <followed by username>.


# How azure function app is handling the requests ?

Azure Functions has an internal HTTP handler that listens for incoming requests and routes them based on the function.json configuration.

The Function App endpoint is typically: https://jwt-api.azurewebsites.net/api/{functionName}

The Azure Function identifies the correct function based on the URL:
/api/login → Calls login/index.js
/api/hello → Calls hello/index.js


Azure Functions uses the Function Host Process to execute your JavaScript code inside index.js:

# login/index.js (For Token Generation)

1. Reads request body.
2. Generates a JWT token using jsonwebtoken package.
3. sSends token back in the response.

# hello/index.js (For Token Validation)

1. Extracts Authorization header.
2. Verifies the token.
3. If valid → Returns the Hello message.


#### end of it ###

Note: Please use edit mode in github repository if you do not get  comfort veiw of document . Also i am not using any branching strategy here, directly commitming my changes to main branch.





