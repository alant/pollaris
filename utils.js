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
  return new Promise((resolve, reject) => {
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
  console.log("calling write function: "+functionName);
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
      $(document).get("https://pay.nebulas.io/api/testnet/pay/query?payId=" + resp, function (_resp) {
        console.log('=> pay.nebulas.io return: ' + JSON.stringify(_resp));
      });
    }
  });
}

function pollTransactionStatus(txHash, maxRetry) {
  neb.api.getTransactionReceipt({txHash})
  .then(function(receipt) {
    if (receipt.status == 0) {
      postNotification('transaction '+txHash+'failed');
    } else if (receipt.status == 1) {
      postNotification('transaction '+txHash+'is successful');
    } else {
      if (maxRetry!=0) {
        // retry after 3 seconds
        setTimeOut(pollTransactionStatus(txHash, maxRetry - 1), 3000);
      }
      // stop retrying and do not post info
    }
  });
}

function postNotification(msg) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    return;
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(msg);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(msg);
      }
    });
  }
}
