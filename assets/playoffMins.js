function PlayoffMins() {
  var self = this;

  self.allPlayers = null;
  self.currentPlayers = null;
  self.maxMins = 400;
  self.currentStat = "mins";
  self.activeTeams = ["CLE", "GSW"];

  self.TEAM_COLORS = {
    "ATL" : ["#FF0000", "#000080", "#C0C0C0"],
    "BOS" : ["#009E60", "#000000"],
    "BRK" : ["#000000", "#FFFFFF"],
    "CHI" : ["#D4001F", "#000000"],
    "CLE" : ["#860038", "#FDBB30", "#002D62"],
    "DAL" : ["#0b60AD", "#072156", "#A9A9A9"],
    "GSW" : ["#04529C", "#FFCC33"],
    "HOU" : ["#CE1138", "#CCCCCC", "#000000"],
    "LAC" : ["#EE2944", "#146AA2"],
    "MEM" : ["#001F70", "#7399C6", "#BED4E9", "#FDB927"],
    "MIL" : ["#003614", "#E32636", "#C0C0C0"],
    "NOP" : ["#002B5C", "#B4975A", "#E31836"],
    "POR" : ["#F0163A", "#B6BFBF", "#000000"],
    "SAS" : ["#000000", "#BEC8C9"],
    "TOR" : ["#B31B1B", "#000000", "#708090"],
    "WAS" : ["#002B5C", "#E31837", "#C4CDD4"]
  };

  self.fetch = function() {
    $.ajax({
      url: "https://www.kimonolabs.com/api/9eduwfmk?apikey=iI1r2CpfHwa772QYj6oPpLkq0ixGD8Oy",
      crossDomain: true,
      dataType: "jsonp",
      success: function (data) {
        $(".update").html(data.thisversionrun.slice(0, -23));
        var results = data["results"]["collection1"];
        results = results.sort(function(a,b) {
          return parseInt(b["MinutesPlayed"]) - parseInt(a["MinutesPlayed"]);
        })
        self.allPlayers = results;
        self.currentPlayers = results;
        self.maxMins = parseInt(results[0].MinutesPlayed);
        self.populate(results);
      }
    })
  };

  self.populate = function(data) {
    var $list = $(".player-list");
    $list.empty();
    var id = 0;

    data.forEach( function(player) {
      $list.append("<li class='player' id=" + id + "><a target='_blank' href='" +
        player.Name.href + "'>" + player.Name.text + "</a>" +
        " (<a target='_blank' href='" + player.Team.href + "'>" +
        player.Team.text + "</a>)</li>");

      var $li = $("#" + id);
      var playerMins = parseInt(player.MinutesPlayed);
      var playerPts = parseInt(player.Points);
      var colors = self.TEAM_COLORS[player.Team.text] || ["#CCCCCC", "#AAAAAA"];

      $li.append("<p class='mins'>MP: " + playerMins + "</p>");
      $li.find('.mins').css("border", "solid 2px " + colors[0]);

      $li.append("<p class='pts'>TP: " + player.Points + "</p>");
      $li.find('.pts').css("border","solid 2px " + colors[1]);

      // Circle radii adjusted so largest possible circle never too big
      var radiiConstant = 125 / Math.sqrt(self.maxMins);

      var minsRadius = Math.sqrt(playerMins) * radiiConstant;
      var ptsRadius = Math.sqrt(playerPts) * radiiConstant;

      self.makeCircle(id, minsRadius, colors, "mins");
      self.makeCircle(id, ptsRadius, colors, "pts");
      id += 1;
    })
  };

  self.makeCircle = function(id, radius, colors, stat) {
    var statIdx = stat === "mins" ? 0 : 1;
    var $element = $("#" + id);
    if (statIdx === 0) {
      $element.append("<canvas width='300' height='250'></canvas>");
    }
    var canvas = $("#" + id + " canvas")[0];
    var context = canvas.getContext('2d');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = colors[statIdx];
    context.fill();
    context.lineWidth = 5;
  };

  self.filterByTeam = function() {
    $("select.teamFilter").change(function(event) {
      var team = event.target.value;
      if (team === "all") {
        self.populate(self.allPlayers)
      } else if (team === "active") {
        var filteredPlayers = self.allPlayers.filter(function(player) {
          return self.activeTeams.indexOf(player.Team.text) !== -1;
        })
        self.currentPlayers = filteredPlayers;
        self.populate(filteredPlayers)
      } else {
        var filteredPlayers = self.allPlayers.filter(function(player) {
          return player.Team.text === team;
        })
        self.currentPlayers = filteredPlayers;
        self.populate(filteredPlayers)
      }
    });
  };

  self.sortByStat = function() {
    $("select.statSort").change(function(event) {
      var stat = event.target.value === "mins" ? "MinutesPlayed" : "Points";

      self.currentPlayers = self.currentPlayers.sort(function(a,b) {
        return parseInt(b[stat]) - parseInt(a[stat]);
      })

      self.populate(self.currentPlayers)
      self.currentStat = stat;
    })
  };

  self.fetch();
  self.filterByTeam();
  self.sortByStat();
};

PlayoffMins();
