function PlayoffMins() {
  var self = this;

  self.fetch = function() {
    $.ajax({
      url: "https://www.kimonolabs.com/api/9eduwfmk?apikey=iI1r2CpfHwa772QYj6oPpLkq0ixGD8Oy",
      crossDomain: true,
      dataType: "jsonp",
      success: function (data) {
        $(".update").html(data.thisversionrun.slice(0, -14));
        var results = data["results"]["collection1"];
        results = results.sort(function(a,b) {
          return parseInt(b["MinutesPlayed"]) - parseInt(a["MinutesPlayed"]);
        })
        self.populate(results);
      }
    })
  };

  self.TEAM_COLORS = {
    "ATL" : ["#FF0000", "#000080", "#C0C0C0"],
    "CHI" : ["#D4001F", "#000000"],
    "CLE" : ["#860038", "#FDBB30", "#002D62"],
    "GSW" : ["#04529C", "#FFCC33"],
    "HOU" : ["#CE1138", "#CCCCCC", "#000000"],
    "LAC" : ["#EE2944", "#146AA2"],
    "MEM" : ["#001F70", "#7399C6", "#BED4E9", "#FDB927"],
    "WAS" : ["#002B5C", "#E31837", "#C4CDD4"]
  }

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

      var minBorder = "solid 2px " + colors[0];
      var ptsBorder = "solid 2px " + colors[1];


      $li.append("<p class='mins'>MP: " + playerMins + "</p>");
      $li.find('.mins').css("border", minBorder);
      $li.append("<p class='pts'>TP: " + player.Points + "</p>");
      $li.find('.pts').css("border",ptsBorder);


      var minsRadius = Math.sqrt(playerMins) * 5;
      var ptsRadius = Math.sqrt(playerPts) * 5;

      if (playerMins < playerPts) {
        console.log(player.Name.text, playerMins, playerPts)
      }


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
    // context.strokeStyle = colors[(statIdx-1)*-1];
    // context.stroke();
  }

  self.fetch();

};

PlayoffMins();
