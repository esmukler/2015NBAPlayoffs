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
      $li.append("<p>MP: " + player.MinutesPlayed + "</p>");
      $li.append("<p>TP: " + player.Points + "</p>");


      var lineHeight = parseInt(player.MinutesPlayed) / 4;
      lineHeight = lineHeight > 1 ? lineHeight : 1;

      var colors = self.TEAM_COLORS[player.Team.text] || ["#CCCCCC", "#000000"];

      self.makeCircle(id, lineHeight, colors);
      id += 1;
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

  self.makeCircle = function(id, lineHeight, colors) {
    var $element = $("#" + id);
    $element.append("<canvas width='300' height='250'></canvas>");
    var canvas = $("#" + id + " canvas")[0];
    var context = canvas.getContext('2d');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = lineHeight;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = colors[0];
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = colors[1];
    context.stroke();
  }

  self.fetch();

};

PlayoffMins();
