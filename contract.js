'use strict';

var Team = function(obj) {
  this.parse(obj);
};

Team.prototype = {
  toString: function() {
    return JSON.stringify(this);
  },

  parse: function(text) {
    if (text) {
      var obj = JSON.parse(text);
      this.players = obj.players;
      this.scores = obj.scores;
      this.rewardPool = obj.rewardPool;
      this.approvals = obj.approvals;
      this.gameOver = obj.gameOver;
      this.timeStamp = Obj.timeStamp;
    } else {
      this.players = [];
      this.scores = [];
      this.rewardPool = new BigNumber(0);
      this.approvals = [];
      this.gameOver = '0';// 0 game is still live, 1 game is over, 2 contestants approve, 3 contestants do not approve
      this.timeStamp = '0'; // 24 hours auto approval
    }
  }
};


var Hacker = function(obj) {
  this.parse(obj);
};

Hacker.prototype = {
  toString: function() {
    return JSON.stringify(this);
  },

  parse: function(text) {
    if (text) {
      var obj = JSON.parse(text);
      this.reputation = obj.reputation;
    } else {
      this.reputation = 3; // initial reputation after 3 strikes you're 0 then it's bad
    }
  }
};

var NebHackathonContract = function() {
  LocalContractStorage.defineMapProperties(this, {
    teams: {
      parse: function(value) {
        return new Team(value);
      },
      stringify: function(o) {
        return o.toString();
      }
    },
    hackers: {
      parse: function(value) {
        return new Hacker(value);
      },
      stringify: function(o) {
        return o.toString();
      }
    }
  });
  LocalContractStorage.defineProperties(this, {
    depositRequirement: 0,
    totalShortnameCount: 0,
    sayHack: ''
  });
}

NebHackathonContract.prototype = {
  init: function() {
     this.sayHack = 'awesome hackathon';
  },
  get: function() {
    var result = this.sayHack;
    return result;
  }
};

module.exports = NebHackathonContract;