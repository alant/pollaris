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
      this.username = obj.username;
      this.address = obj.address;
    } else {
      this.reputation = '';
      this.username = '';
      this.address = '';
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
      this.voteNum = obj.voteNum;
    } else {
      this.id = 0;
      this.teamName = '';
      this.leader = '';
      this.hackers = [];
      this.reward = new BigNumber(0);
      this.description = '';
      this.url = '';
      this.voteNum = new BigNumber(0);
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
      this.hackathonId = obj.hackathonId;
      this.teamId = obj.teamId;
      this.value = obj.value;
      this.reward = obj.reward;
    } else {
      this.from = '';
      this.hackathonId = 0;
      this.teamId = 0;
      this.value = new BigNumber(0);
      this.reward = new BigNumber(0);
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
    if (text) {
      var obj = JSON.parse(text);
      this.id = obj.id;
      this.name = obj.name;
      this.desc = obj.desc;
      this.url = obj.url;
      this.votes = obj.votes;
      this.rewardPool = obj.rewardPool;
      this.sponsors = obj.sponsors;
      this.isFinished = false;
      this.result = obj.result;
      this.allTeams = obj.allTeams;
      this.curTeamId = obj.curTeamId;
    } else {
      this.id = 0;
      this.name = '';
      this.desc = '';
      this.url = '';
      this.votes = [];
      this.rewardPool = new BigNumber(0);
      this.sponsors = [];
      this.isFinished = false;
      this.result = '';
      this.allTeams = [];
      this.curTeamId = 0;
    }
  },

  getTeam: function(_id) {
    var team = this.allTeams.get(_id);
    return team;
  },

  changeTeamLeader: function(_id, _leader) {
    var from = Blockchain.transaction.from;
    var team = this.allTeams[_id];
    var oldLeader = team.leader;
    if (from !== oldLeader) {
      throw new Error('changeTeamLeader: only leader can');
    }
    team.leader = _leader;
    this.allTeams[_curId] = team;
  },

  changeTeamName: function(_id, _name) {
    var from = Blockchain.transaction.from;
    var team = this.allTeams[_id];
    if (from !== team.leader) {
      throw new Error('changeTeamName: only leader can');
    }
    team.name = _name;
    this.allTeams[_curId] = team;
  },

  changeTeamDesc: function(_id, _desc) {
    var from = Blockchain.transaction.from;
    var team = this.allTeams[_id];
    if (from !== team.leader) {
      throw new Error('changeTeamDesc: only leader can');
    }
    team.desc = _desc;
    this.allTeams[_curId] = team;
  },

  changeTeamUrl: function(_id, _url) {
    var from = Blockchain.transaction.from;
    var team = this.allTeams[_id];
    if (from !== team.leader) {
      throw new Error('changeTeamUrl: only leader can');
    }
    team.url = _url;
    this.allTeams[_curId] = team;
  },

  getTeamReward: function(_id) {
    var team = this.allTeams[_id];
    var result = team.reward;
    return result;
  },

  getAllTeams: function() {
    return this.allTeams;
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
    curTeamId: 0,
    curHackathonId: 0,
    listOfAllHackerUsernames: {
      parse: function(value) {
        return JSON.parse(value);
      },
      stringify: function(o) {
        return JSON.stringify(o);
      }
    }
  });
};

NebHackathonContract.prototype = {
  init: function() {
    this.sayHack = 'awesome hackathon';
    this.curTeamId = 0;
    this.curHackerId = 0;
    this.curHackathonId = 0;
    this.listOfAllTeamIds = [];
    this.listOfAllHackerUsernames = [];
  },

  // status getters

  get: function() {
    var result = this.sayHack;
    return result;
  },

  getTeamRewardFromCurrentHackathon: function(_id) {
    var hackathon = this.allHackathons.get(_hackathon_id);
    var result = hackathon.allTeams[_id].reward;
    return result;
  },

  getTeamReward: function(_id, _hackathon_id) {
    var hackathon = this.allHackathons.get(_hackathon_id);
    var result = hackathon.allTeams[_id].reward;
    return result;
  },

  getAllTeamsBasedOnHackathonId: function(_hackathon_id) {
    var hackathon = this.allHackathons.get(_hackathon_id);
    if (!hackathon) {
      throw new Error('no hackathon');
    }

    if (!hackathon.allTeams) {
      throw new Error('no hackathon.allTeams');
    }

    return hackathon.allTeams;
  },

  // hackathon API
  getDebugInfo: function() {
    return this;
  },
  getAllHackathon: function() {
    return this.allHackathons;
  },
  getHackathon: function(_id) {
    var result = this.allHackathons.get(_id);
    return result;
  },
  getAllHackers: function() {
    return this.allHackers;
  },

  createHackathon: function(_name, _desc, _url) {
    var newHackathon = new Hackathon();
    newHackathon.name = _name;
    newHackathon.desc = _desc;
    newHackathon.url = _url;
    var curId = parseInt(this.curHackathonId);
    newHackathon.id = curId;
    this.allHackathons.set(newHackathon.id, newHackathon);
    this.curHackathonId = curId + 1;
  },

  getCurHackathonId: function() {
    return this.curHackathonId;
  },

  createHacker: function(username, address) {
    if (username === '' || address === '') {
      throw new Error('empty username / address');
    }

    if (username.length > 64 || address.length > 64) {
      throw new Error('username / address exceed limit length');
    }

    var hacker = this.allHackers.get(username);
    if (hacker) {
      console.log('got this item');
      throw new Error('hacker username has been occupied');
    } else {
      console.log("didn't this item");
    }

    hacker = new Hacker();
    hacker.username = username;
    hacker.address = address;
    console.log(
      'before put hacker. created name: ' +
        hacker.username +
        'address: ' +
        hacker.address
    );
    this.allHackers.put(username, hacker);
    var hacker2 = this.allHackers.get(username);
    console.log(
      'after put hacker2. created name: ' +
        hacker2.username +
        'address: ' +
        hacker2.address
    );
    var list = this.listOfAllHackerUsernames;
    list.push(username);
    this.listOfAllHackerUsernames = list;
  },

  vote: function(teamId, hackathon_id) {
    var from = Blockchain.transaction.from;
    var value = Blockchain.transaction.value;

    var vote = new Vote();
    vote.from = from;
    vote.hackathonId = hackathon_id;
    vote.teamId = teamId;
    vote.value = value;

    var hackathon = this.allHackathons.get(hackathon_id);
    if (hackathon.isFinished) {
      throw new Error('can not vote finished hackathon');
    }
    hackathon.votes.push(vote);
    value = new BigNumber(value);
    var _rewardPool = new BigNumber(hackathon.rewardPool);
    hackathon.rewardPool = _rewardPool.add(value);
    hackathon.allTeams[teamId].voteNum = new BigNumber(
      hackathon.allTeams[teamId].voteNum
    ).add(new BigNumber(value));

    this.allHackathons.set(hackathon.id, hackathon);
  },

  getHacker: function(username) {
    var hacker = this.allHackers.get(username);
    if (hacker) {
      console.log(
        'created name: ' + hacker.username + 'address: ' + hacker.address
      );
    } else {
      console.log('fail to get item ' + username);
    }
    return hacker;
  },
  getAllHackerUsernames: function() {
    return this.listOfAllHackerUsernames;
  },

  createTeamForHackathon: function(_name, _desc, _url, _hackathon_id) {
    var hackathon = this.allHackathons.get(_hackathon_id);
    if (!hackathon) {
      console.log('fail to get hackathon ' + _hackathon_id);
    }
    var from = Blockchain.transaction.from;
    var hacker = this.allHackers.get(from);
    if (!hacker) {
      hacker = new Hacker();
      hacker.address = from;
      this.allHackers.put(from, hacker);
    }

    var team = new Team();
    team.teamName = _name;
    team.desc = _desc;
    team.url = _url;
    team.leader = from;
    team.hackers = [].push(hacker);

    var _curId = hackathon.curTeamId;
    team.id = _curId;
    console.log('team: ' + hackathon.allTeams);
    var allteams = hackathon.allTeams;
    allteams.push(team);
    console.log('team: ' + team);
    console.log('team: ' + hackathon.allTeams);

    hackathon.curTeamId = _curId + 1;

    this.allHackathons.set(hackathon.id, hackathon);
  },

  changeTeamLeader: function(_team_id, _hackathon_id, _leader) {
    var hackathon = this.allHackathons.get(_hackathon_id);
    var from = Blockchain.transaction.from;
    var team = hackathon.allTeams[_team_id];
    var oldLeader = team.leader;
    if (from !== oldLeader) {
      throw new Error('changeTeamLeader: only leader can');
    }
    team.leader = _leader;
    hackathon.allTeams[_team_id] = team;
    this.allHackathons.set(hackathon.id, hackathon);
  },

  finishHackathon: function(_hackathon_id) {
    var hackathon = this.allHackathons.get(_hackathon_id);

    if (hackathon.allTeams.length < 3) {
      return 'less then 3 teams fail to finish hackathon';
    }

    hackathon.isFinished = true;
    // find the winner team
    var compareFunc = function compare(a, b) {
      // bigger number go up. this is reverse of converntional sort where bigger number go down
      if ((new BigNumber(a.voteNum)).lt(new BigNumber(b.voteNum))) return 1;
      if ((new BigNumber(a.voteNum)).gt(new BigNumber(b.voteNum))) return -1;
      return 0;
    }
    hackathon.allTeams.sort(compareFunc);
    var base = (new BigNumber(hackathon.rewardPool)).div(100);
    hackathon.allTeams[0].reward = base.mul(60);
    hackathon.allTeams[1].reward = base.mul(30);
    hackathon.allTeams[2].reward = base.mul(10);

    var result = [
      hackathon.allTeams[0],
      hackathon.allTeams[1],
      hackathon.allTeams[2]
    ];
    // calculate the reward
    hackathon.result = result;

    this.allHackathons.set(hackathon.id, hackathon);
    return result;
  },

  withDraw: function(_teamId, _hackathon_id) {
    var from = Blockchain.transaction.from;
    if (_teamId > 2) {
      throw new Error('only top 3 teams can withdraw');
    }
    var hackathon = this.allHackathons.get(_hackathon_id);
    var leader = hackathon.allTeams[_teamId].leader;
    if (from !== leader) {
      throw new Error('only leader can withdraw');
    }
    var awardValue = new BigNumber(hackathon.allTeams[_teamId].reward);
    awardValue = awardValue.floor();
    if (awardValue.gt(new BigNumber(0))) {
      var result = Blockchain.transfer(from, awardValue);
      if (!result) {
        throw new Error('Reward error.');
      } else {
        hackathon.allTeams[_teamId].reward = new BigNumber(0);
        this.allHackathons.set(_hackathon_id, hackathon);
      }
    } else {
      throw new Error('reward is zero');
    }
  },

  getHackathonResult: function(_hackathon_id) {
    var hackathon = this.allHackathons.get(_hackathon_id);
    if (!hackathon.isFinished) {
      throw new Error('can not fetch result from on going hackathon');
    }
    return hackathon.result;
  },

  getHackathonTeamFromHackathonId: function(_team_id, _hackathon_id) {
    var hackathon = this.allHackathons.get(_hackathon_id);
    return hackathon.allTeams.get(_team_id);
  }
};

module.exports = NebHackathonContract;
