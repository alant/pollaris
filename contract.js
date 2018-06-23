'use strict';

//hacker

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
      this.hackername = obj.hackername;
      this.address = obj.address;
    } else {
      this.reputation = "";
      this.hackername = "";
      this.address = "";
    }
  }
};

// Team

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
      this.id = obj.id;
      this.teamName = obj.teamName;
      this.leader = obj.leader;
      this.hackers = obj.hackers;
      this.reward = obj.reward;
      this.description = obj.description;
      this.url = obj.url;
    } else {
      this.id = 0;
      this.teamName = "";
      this.leader = "";
      this.hackers = [];
      this.reward = new BigNumber(0);
      this.description = "";
      this.url = "";
    }
  }
};

// Hackathon

var Hackathon = function(obj) {
  this.parse(obj);
};

Hackathon.prototype = {
  toString: function() {
    return JSON.stringify(this);
  },

  parse: function(text) {
    if(text){
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

// Vote

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

// Sponsor

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

// Contract

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
    sayHack: '',
    curHackerId: 0,
    curTeamId: 0,
    curHackathonId: 0
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
    return result;
  },
  createHackathon: function(hackathonInfo) {
    var newHackathon = new Hackathon(hackathonInfo);
    this.allHackathons.set(newHackathon.id, newHackathon);
    var result = this.allHackathons;
    return result;
  },

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
  },

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
