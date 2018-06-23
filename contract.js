'use strict';

Game.prototype = {
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

var Game = function(obj) {
  this.parse(obj);
};

Player.prototype = {
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

var Player = function(obj) {
  this.parse(obj);
};

var NebArenaContract = function() {
  LocalContractStorage.defineMapProperties(this, {
    games: {
      parse: function(value) {
        return new Game(value);
      },
      stringify: function(o) {
        return o.toString();
      }
    },
    players: {
      parse: function(value) {
        return new Player(value);
      },
      stringify: function(o) {
        return o.toString();
      }
    }
  });
  LocalContractStorage.defineProperties(this, {
    depositRequirement: 0,
    totalShortnameCount: 0,
    arbitrator: ''
  });


NebArenaContract.prototype = {
  init: function() {},
  get: function(shortname) {
    var shortnameEntity = this.repo.get(shortname);
    return shortnameEntity;
  },
  getAll: function() {
    var from = Blockchain.transaction.from;
    var shortnameList = this.ownerList.get(from);
    return shortnameList;
  },
  getCount: function() {
    return this.totalShortnameCount;
  }
};

module.exports = NebArenaContract;
