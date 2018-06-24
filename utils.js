'use strict'

const NebPay = require('nebpay');
const HttpRequest = require('nebulas').HttpRequest;
const Wallet = require('nebulas');
const neb = new Wallet.Neb();
neb.setRequest(new HttpRequest('http://localhost:8685'));
var nebPay = new NebPay();
var gasLimit = 200000;
var gasPrice = 1000000;

function readCall(functionName, callArgs, fromWalletAddr, toContractAddr) {
  if (!fromWalletAddr) {
    fromWalletAddr = new Wallet.Account(
      '249e8e7a8ca2db4cbe29e2f2f42a2b2740b35408e36f26ed7a1c2561abcd3799'
    ).getAddressString();
  }
  console.log("calling read function: "+readFunctionName);
  console.log('=> account: ' + fromWalletAddr);
  const readCall = {
    function: functionName,
    args: callArgs
  };

  neb.api.getNebState().then((state) => {
    console.log('getstate returned: ' + JSON.stringify(state));
    neb.api
      .call(
        fromWalletAddr,
        toContractAddr,
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
        }
      });
  });
}

function writeCall(functionName, callArgs, fromWalletAddr, toContractAddr) {
  if (!fromWalletAddr) {
    fromWalletAddr = new Wallet.Account(
      '249e8e7a8ca2db4cbe29e2f2f42a2b2740b35408e36f26ed7a1c2561abcd3799'
    ).getAddressString();
  }
  console.log("calling write function: "+functionName);
  console.log('=> account: ' + fromWalletAddr);
  const writeCall = {
    function: functionName,
    args: callArgs
  };
  nebPay.call(toContractAddr, '0', writeCall.function, writeCall.args, {
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
