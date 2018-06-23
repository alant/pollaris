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
      this.avgScore = obj.avgScore;
      this.reward = obj.reward;
      // id
      // description
      // url
    } else {
      this.players = [];
      this.scores = [];
      this.avgScore = new BigNumber(0);
      this.reward = new BigNumber(0);
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
      var obj = JSON.parse(text);
      this.hackername = obj.hackername;
      this.address = obj.address;
  }

  stringify: function (hacker) {
      return hacker.toString();
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
};

NebHackathonContract.prototype = {
  init: function() {
    this.sayHack = 'awesome hackathon';
  },
  get: function() {
    var result = this.sayHack;
    return result;
  },
  getTeamReward: function(_id) {
    var team = this.teams.get(_id);
    var result = team.reward;
    return;
  }

  createHacker: function(username, address) {
    if (username === "" || address === ""){
            throw new Error("empty username / address");
    }

    if (username.length > 64 || address.length > 64){
        throw new Error("username / address exceed limit length")
    }

    var hacker = this.hackers.get(username);
    if (hacker){
      throw new Error("hacker username has been occupied");
    }

    hacker = new Hacker();
    hacker.username = username;
    hacker.address = address;
    dictItem.value = value;
    this.hackers.put(username, hacker);
  }

  getHacker: function(username) {
    username = username.trim();
    if (username === "" ) {
        throw new Error("empty username")
    }
    var hacker = this.hackers.get(username);
    if (!hacker){
      throw new Error("hacker username has been occupied");
    }
    return hacker; 
  }
};

module.exports = NebHackathonContract;
