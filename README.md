# Simple metric logging
Simple metric logging is a JS program dealing with sum calcs of log values over flotting time widows. In that instance, the current hour.

## Installation
node install via https://nodejs.org/en/download/

## Usage
```
$ git clone https://github.com/Aud123/simple-metric-logging.git
$ npm install
$ node server.js
```

## Test
### POST

```
curl --location --request POST 'http://localhost:3001/metrics/active_visitors' \
--header 'Content-Type: application/json' \
--data-raw '{ 
 "value": 45
}'
```
### GET
```
curl --location --request GET 'http://localhost:3001/metrics/active_visitors/sum'
```
