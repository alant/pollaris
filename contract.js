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
    if (text) {
      var obj = JSON.parse(text);
      this.reputation = obj.reputation;
      // name
      // contact
      // address []
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
};

module.exports = NebHackathonContract;
