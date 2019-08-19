# WRKChain Block Validator

The WRKChain Block Validator is a simple tool which can be run on any computer. It offers a simple UI
which can be used to validate a WRKChain's block hashes committed to its WRKCHain Root Smart Contract
counterpart on the UND Mainchain.

## Running

### Prerequisites

Node.js and `npm` are required. Details on installing them for your system can be fount at <https://nodejs.org/en/>

### Install dependencies

First, install the dependencies:

```bash
npm install
```

### Configure

Copy the `example.env`, and edit the values for your WRKChain:

```bash
cp example.env .env
```

The variables are as follows:

`MAINCHAIN_EXPLORER_URL`: The URL for the **UND Mainchain** Block Explorer  
`MAINCHAIN_WEB3_PROVIDER_URL`: The Web3 Provider URL for the **UND Mainchain**  
`WRKCHAIN_NAME`: The name of your WRKChain  
`WRKCHAIN_NETWORK_ID`: **Your WRKChain** network ID  
`WRKCHAIN_ROOT_WRITE_TIMEOUT`: Frequency **your WRKChain Oracle** writes hashes to the WRKCHain Root Smart Contract, in seconds  
`WRKCHAIN_WEB3_PROVIDER_URL`: The Web3 Provider URL for **your WRKChain**  
`WRKCHAIN_VALIDATOR_SERVICE_PORT`: Port on which you would like this server to run. Optional - default is port 4040

### Run

Once the `.env` is configured, run:

```bash
npm start
```

You will be able to access the UI via <http://localhost:4040>
