'use strict';

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
      this.hackers = obj.hackers;
      this.scores = obj.scores;
      this.avgScore = obj.avgScore;
      this.reward = obj.reward;
      // id
      // description
      // url
    } else {
      this.hackers = [];
      this.scores = [];
      this.avgScore = new BigNumber(0);
      this.reward = new BigNumber(0);
    }
  }
};

var Hackathon = function(obj) {
  this.parse(obj);
};

Hackathon.prototype = {
  toString: function() {
    return JSON.stringify(this);
  },

  parse: function(text) {
    if (text) {
      var obj = JSON.parse(text);
      this.id = obj.id;
      this.name = obj.name;
      this.desc = obj.desc;
      this.url = obj.url;
      this.teams = obj.teams;
      this.votes = obj.votes;
      this.rewardPool = obj.rewardPool;
      this.sponsors = obj.sponsors;
    } else {
      this.id = 0;
      this.name = '';
      this.desc = '';
      this.url = '';
      this.teams = [];
      this.votes = [];
      this.rewardPool = new BigNumber(0);
      this.sponsors = [];
    }
  }
};

var Vote = function(obj) {
  this.parse(obj);
};

Vote.prototype = {
  toString: function() {
    return JSON.stringify(this);
  },
  parse: function(text) {
    if (text) {
      var obj = JSON.parse(text);
      this.from = obj.from;
      this.hackthonId = obj.hackthonId;
      this.teamId = obj.teamId;
      this.value = obj.value;
    } else {
      this.from = '';
      this.hackthonId = 0;
      this.teamId = 0;
      this.value = new BigNumber(0);
    }
  }
};

var Sponsor = function(obj) {
  this.parse(obj);
};

Sponsor.prototype = {
  toString: function() {
    return JSON.stringify(this);
  },
  parse: function(text) {
    if (text) {
      var obj = JSON.parse(text);
      this.name = obj.name;
      this.contact = obj.contact;
      this.value = obj.value;
    } else {
      this.name = '';
      this.contact = '';
      this.value = new BigNumber(0);
    }
  }
};

var NebHackathonContract = function() {
  LocalContractStorage.defineMapProperties(this, {
    allHackers: {
      parse: function(value) {
        return new Hacker(value);
      },
      stringify: function(o) {
        return o.toString();
      }
    },
    allTeams: {
      parse: function(value) {
        return new Team(value);
      },
      stringify: function(o) {
        return o.toString();
      }
    },
    allHackathons: {
      parse: function(value) {
        return new Hackathon(value);
      },
      stringify: function(o) {
        return o.toString();
      }
    }
  });
  LocalContractStorage.defineProperties(this, {
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
