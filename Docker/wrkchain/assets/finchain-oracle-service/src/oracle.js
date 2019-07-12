/* 
Sources to pull from:

https://www.alphavantage.co/documentation/
https://rapidapi.com/category/Finance
https://www.programmableweb.com/news/96-stocks-apis-bloomberg-nasdaq-and-etrade/2013/05/22

alphavantage API key: PC5LQPAGBFVN0E07
worldtradingdata API key: gA38Z0zV0GKDoNKNxFqb82sWYSarX7bNvcrTm0mC0irfnEfYdr8fm1qa7ID4

*/

require("dotenv").config();

var request = require('request');

var symbols = ['ATVI','ADBE', 'AMD', 'ALXN','ALGN','GOOGL','GOOG','AMZN','AAL','AMGN','ADI','AAPL','AMAT','ASML',
    'ADSK','ADP', 'BIDU','BIIB','BMRN',	'BKNG',	'AVGO',	'CDNS','CELG','CERN','CHTR','CHKP','CTAS','CSCO','CTXS',
    'CTSH',	'CMCSA','COST','CSX','CTRP','DLTR','EBAY','EA','EXPE','FB',	'FAST',	'FISV',	'FOX','FOXA','GILD','HAS',
    'HSIC',	'IDXX',	'ILMN','INCY',	'INTC',	'INTU',	'ISRG',	'JBHT',	'JD','KLAC','LRCX','LBTYA',	'LBTYK','LULU',
    'MAR','MXIM','MELI','MCHP',	'MU','MSFT','MDLZ','MNST','MYL','NTAP',	'NTES','NFLX','NVDA','NXPI','ORLY',
    'PCAR','PAYX','PYPL','PEP','QCOM','REGN','ROST','SIRI','SWKS','SBUX','SYMC','SNPS','TMUS','TTWO','TSLA',
    'TXN','KHC','ULTA','UAL','VRSN','VRSK',	'VRTX',	'WBA','WDAY','WDC','WLTW','WYNN','XEL','XLNX'];

function alphaVantageApi() {

    var alpha_key = 'PC5LQPAGBFVN0E07';
    var alpha_uri = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+symbols[0]+'&interval=60min&apikey='+alpha_key;

    request.get(alpha_uri, function (error, response, body) {
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    if (error) console.log('error:', error); // Print the error if one occurred
    else {  
        var myJson = JSON.parse(body);
        var price = myJson["Time Series (60min)"];
        for (x in price){
            console.log(price[x]['4. close']); //print JSON body
        }   
    }
  });
}

function worldTradingDataApi() {
    var world_key = 'PC5LQPAGBFVN0E07';
    var world_uri = 'https://api.worldtradingdata.com/api/v1/stock?symbol='+symbols[0]+'&api_token='+world_key;

    request.get(world_uri, function (error, response, body) {
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    if (error) console.log('error:', error); // Print the error if one occurred
    else {  
        var myJson = JSON.parse(body);
        var price = myJson["Time Series (60min)"];
        for (x in price){
            console.log(price[x]['4. close']); //print JSON body
        }   
    }
  });

}
/*

const parseData = (body) => {
  return new Promise((resolve, reject) => {
    let weatherDescription, temperature, humidity, visibility, pressure, sunrise, sunset;
    try {
      let weather = '{' +
        '"description": "' + body.weather[0].description.toString() + '",' +
        '"icon": "' + body.weather[0].icon.toString() + '",' +
        '"id": "' + body.weather[0].id.toString() + '",' +
        '"main": "' + body.weather[0].main.toString() + '",' +
        '"location": "' + body.name.toString() + '",' +
        '"country": "' + body.sys.country.toString() + '"' +
      '}';
      console.log(weather);
      weatherDescription = weather;
      temperature = body.main.temp.toString();
      humidity = body.main.humidity.toString();
      visibility = body.visibility.toString();
      pressure = body.main.pressure.toString();
      sunrise = body.sys.sunrise.toString();
      sunset = (body.sys.sunset || 0).toString();
    } catch(error) {
      reject(error);
      return;
    }
    resolve({ weatherDescription, temperature, humidity, visibility, pressure, sunrise, sunset });
  });
};


setTimeout(); //useful for continually executing a piece of code on an interval
*/