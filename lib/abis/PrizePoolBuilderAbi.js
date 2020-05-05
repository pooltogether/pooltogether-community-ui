export default [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "prizePool",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "prizeStrategy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "interestPool",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "collateral",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "ticket",
        "type": "address"
      }
    ],
    "name": "PrizePoolCreated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "controlledTokenFactory",
    "outputs": [
      {
        "internalType": "contract ControlledTokenFactory",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract CTokenInterface",
        "name": "cToken",
        "type": "address"
      },
      {
        "internalType": "contract PrizeStrategyInterface",
        "name": "_prizeStrategy",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_collateralName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_collateralSymbol",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_ticketName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_ticketSymbol",
        "type": "string"
      }
    ],
    "name": "createPrizePool",
    "outputs": [
      {
        "internalType": "contract PrizePool",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract InterestPoolFactory",
        "name": "_interestPoolFactory",
        "type": "address"
      },
      {
        "internalType": "contract PrizePoolFactory",
        "name": "_prizePoolFactory",
        "type": "address"
      },
      {
        "internalType": "contract TicketFactory",
        "name": "_ticketFactory",
        "type": "address"
      },
      {
        "internalType": "contract ControlledTokenFactory",
        "name": "_controlledTokenFactory",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "interestPoolFactory",
    "outputs": [
      {
        "internalType": "contract InterestPoolFactory",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "prizePoolFactory",
    "outputs": [
      {
        "internalType": "contract PrizePoolFactory",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ticketFactory",
    "outputs": [
      {
        "internalType": "contract TicketFactory",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]