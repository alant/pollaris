'use strict'

const NebPay = require('nebpay');
const HttpRequest = require('nebulas').HttpRequest;
const Wallet = require('nebulas');
const neb = new Wallet.Neb();

neb.setRequest(new HttpRequest('https://testnet.nebulas.io'));
var nebPay = new NebPay();
var gasLimit = 200000;
var gasPrice = 1000000;

function readCall(functionName, callArgs) {
  console.log("calling read function: " + functionName);
  // console.log('=> account: ' + fromWalletAddr);
  const readCall = {
    function: functionName,
    args: JSON.stringify(callArgs)
  };
  return new Promise(function(resolve, reject) {
    neb.api.getNebState().then((state) => {
    console.log('getstate returned: ' + JSON.stringify(state));
    neb.api
      .call(
        "n1JqiWKakmuymgXqCor9RxDnBkSiPbtmEjE",
        contractAddr,
        '0',
        '0',
        gasPrice,
        gasLimit,
        readCall
      )
      .then((resp) => {
        console.log('contract returned: ' + JSON.stringify(resp));
        if (resp.execute_err.length > 0) {
          throw new Error(resp.execute_err);
        } else {
          resolve(resp, 100, 'success');
        }
      });
    });
  });
}

function writeCall(value, functionName, callArgs) {
  console.log("calling write function: "+functionName);
  const writeCall = {
    function: functionName,
    args: JSON.stringify(callArgs)
  };
  var promise1 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 100, 'foo');
  });
  nebPay.call(contractAddr, value, writeCall.function, writeCall.args, {
    listener: (resp) => {
      console.log(`==> data return: ${JSON.stringify(resp)}`);
      if (JSON.stringify(resp) === 'Error: Transaction rejected by user') {
        console.log('=> transaction rejected');
        return;
      }
      $(document).get("https://pay.nebulas.io/api/testnet/pay/query?payId=" + resp, function (_resp) {
        console.log('=> pay.nebulas.io return: ' + JSON.stringify(_resp));
      });
    }
  });
}
