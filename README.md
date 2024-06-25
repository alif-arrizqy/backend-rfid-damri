# Bus Travel System

bus travel system using RFID Card

## Installation

clone this project

```
    git clone https://github.com/alif-arrizqy/backend-rfid-damri.git
```

copy env
```
    cp .env.example .env
```



## Running Tests

Install packages

```bash
    npm Install
```

To run project, run the following command

```bash
  npm run dev
```

## Endpoint
- /card
  - `POST` add temporary card
  - `POST /region` counter a region
  - `GET` get temporary card
- /users
  - `POST` create new user
  - `GET ?page=1&limit=10&search=name` get user with name
- /users/id
  - `GET /id` show user by id
  - `PUT /id` update user by id
  - `DELETE /id` delete user by id
- /travel
  - `POST /departure` add depature user
  - `POST /destination` add destination user
  - `GET /travel-history?page=1&limit=10&search=id` get all travel history from user id
  - `GET /travel-history/cardId` get all travel history by card ID
  - `GET /travel-realtime/cardId` get realtime travel data
- /auth
  - `POST /login` using email and password
  - `POST /check-email` check email user
  - `POST /refresh-token` get new token