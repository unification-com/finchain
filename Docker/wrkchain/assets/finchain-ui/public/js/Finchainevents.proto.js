var ether = require('../finchain-oracle-service/src/ethereum.js');


ether.dis.watch(function (error,result) {
    if (!error){
        ticker1 = result.args._ticker1;
        ticker2 = result.args._ticker2;
        ticker3 = result.args._ticker3;
        price1 = result.args._price1;
        price2 = result.args._price2;
        price3 = result.args._price3;

        $("#oracle_1_ticker").text(ticker1);
        $('#oracle_1_price').text("idk");          
        $('#oracle_2_ticker').text(ticker2);
        $('#oracle_2_price').text(price2);
        $('#oracle_3_ticker').text(ticker3);
        $('#oracle_3_price').text(price3);

    }
  });