'use strict';

const NebPay = require('nebpay');
const HttpRequest = require('nebulas').HttpRequest;
const Wallet = require('nebulas');
const neb = new Wallet.Neb();

// neb.setRequest(new HttpRequest('http://localhost:8685'));
neb.setRequest(new HttpRequest('https://testnet.nebulas.io'));
var nebPay = new NebPay();
var gasLimit = 200000;
var gasPrice = 1000000;

function readCall(functionName, callArgs) {
  console.log('calling read function: ' + functionName);
  // console.log('=> account: ' + fromWalletAddr);
  const readCall = {
    function: functionName,
    args: JSON.stringify(callArgs)
  };
  return new Promise((resolve, reject) => {
    neb.api.getNebState().then((state) => {
      console.log('getstate returned: ' + JSON.stringify(state));
      neb.api
        .call(
          'n1JqiWKakmuymgXqCor9RxDnBkSiPbtmEjE',
          contractAddr,
          '0',
          '0',
          gasPrice,
          gasLimit,
          readCall
        )
        .then((resp) => {
          console.log('==> contract returned: ' + JSON.stringify(resp));
          resolve(resp, 100, 'success');
          if (resp.execute_err.length > 0) {
            console.log('execute_error: ' + JSON.stringify(resp));
          }
        });
    });
  });
}

function writeCall(value, functionName, callArgs) {
  console.log('calling write function: ' + functionName);
  const writeCall = {
    function: functionName,
    args: JSON.stringify(callArgs)
  };
  nebPay.call(contractAddr, value, writeCall.function, writeCall.args, {
    listener: (resp) => {
      console.log(`==> data return: ${JSON.stringify(resp)}`);
      if (JSON.stringify(resp) === 'Error: Transaction rejected by user') {
        console.log('=> transaction rejected');
        return;
      }
      pollTransactionStatus(resp.txhash, 15);
    }
  });
}
