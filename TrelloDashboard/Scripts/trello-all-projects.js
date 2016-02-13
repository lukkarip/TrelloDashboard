/* 
See https://trello.com/docs for a list of available API URLs
The API development board is at https://trello.com/api
*/

$(document).ready(function () {

    var onAuthorize = function () {
        updateLoggedIn();
        $("#output_boards").empty();

        Trello.members.get("me", function (member) {
            $("#fullName").text(member.fullName);

            var $boards = $("<div>")
                .text("Loading Boards...")
                .appendTo("#output_boards");

            Trello.get("/organizations/medbitteamtesla1/boards", function (boards) {
                $boards.empty();
                $.each(boards, function (ix, board) {
                    var div_board_container = $("<div>");
                    var div_board = $("<div style='display: inline-block; padding: 0; width: 400px;'>");
                    $("<a>")
                    .attr({ href: board.url, target: "trello" })
                    .attr("data-id", board.id)
                    .addClass("card")
                    .text(board.name)
                    .appendTo(div_board);
                    div_board.appendTo(div_board_container);
                    div_board_container.appendTo($boards);

                    var tunnit = 0;
                    var regExp = /\(([^)]+)\)/;
                    var call = "/boards/" + board.id + "/cards" 
                    Trello.get(call, function (cards) {
                        $.each(cards, function (ix, card) {
                            var tuntimaara = regExp.exec(card.name);
                            if (tuntimaara) {
                                if (!isNaN(tuntimaara[1])) {
                                    var intTuntimaara = new Number(tuntimaara[1]);
                                    tunnit = tunnit + intTuntimaara;
                                }
                            }
                        });

                        var $projekti = $("a[data-id=\"" + board.id + "\"]");
                        var div_tunnit = $('<div style="display: inline-block; padding: 0;">');
                        $('<label>').text("Tunnit yhteensä: ").appendTo(div_tunnit);
                        $('<label>').text(tunnit).appendTo(div_tunnit);
                        div_tunnit.appendTo($projekti.parent().parent());
                    });


                });
            });
        });

    };

    var updateLoggedIn = function () {
        var isLoggedIn = Trello.authorized();
        $("#loggedout").toggle(!isLoggedIn);
        $("#loggedin").toggle(isLoggedIn);
    };

    var logout = function () {

        $('#output_boards').empty();
        $("#output_tunnit").empty();

        Trello.deauthorize();
        updateLoggedIn();
    };

    Trello.authorize({
        interactive: false,
        success: onAuthorize
    });

    $("#connectLink")
    .click(function () {
        Trello.authorize({
            type: "popup",
            success: onAuthorize
        })
    });

    $("#disconnect").click(logout);

});

