
strada/
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   ├── database.js
│   │   ├── env.js
│   │   └── container.js
│   │
│   ├── shared/
│   │   ├── middlewares/
│   │   │   ├── authenticate.js
│   │   │   ├── authorize.js
│   │   │   └── errorHandler.js
│   │   ├── errors/
│   │   ├── utils/
│   │   └── validators/
│   │
│   ├── modules/
│   │   ├── identity/
│   │   │   ├── routes/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── models/
│   │   │   ├── validators/
│   │   │   └── index.js
│   │   │
│   │   ├── catalogue/
│   │   │   ├── routes/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── models/
│   │   │   ├── validators/
│   │   │   └── index.js
│   │   │
│   │   ├── reservations/
│   │   │   ├── routes/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── models/
│   │   │   ├── validators/
│   │   │   └── index.js
│   │   │
│   │   └── boarding/
│   │       ├── routes/
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── repositories/
│   │       ├── models/
│   │       ├── validators/
│   │       └── index.js
│   │
│   └── docs/
│       └── openapi.yaml
│
├── tests/
│   ├── integration/
│   └── helpers/
│
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md