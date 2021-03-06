﻿/* 
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
                    var div_board = $("<div>");
                    $("<a>")
                    .attr({ href: board.url, target: "trello" })
                    .attr("data-id", board.id)
                    .addClass("card")
                    .text(board.name)
                    .appendTo(div_board);
                    $("<a>")
                    .addClass("btn btn-default")
                    .text("-->")
                    .on("click", function () {
                        var tunnit = 0;
                        var regExp = /\(([^)]+)\)/;
                        var board_id = $(this).prev().data("id");
                        var call = "/boards/" + board_id + "/cards"
                        Trello.get(call, function (cards) {
                            $('#output_taskit').empty();
                            $("#output_tunnit").empty();
                            $.each(cards, function (ix, card) {
                                var div_board = $("<div>");
                                $("<a>")
                                .attr({ href: card.url, target: "trello" })
                                .attr("data-id", card.id)
                                .addClass("card")
                                .text(card.name)
                                .appendTo(div_board);
                                div_board.appendTo($("#output_taskit"));
                                var tuntimaara = regExp.exec(card.name);
                                if (tuntimaara) {
                                    if (!isNaN(tuntimaara[1])) {
                                        var intTuntimaara = new Number(tuntimaara[1]);
                                        tunnit = tunnit + intTuntimaara;
                                    }
                                }
                            });
                            $('<label>').text("Tunnit yhteensä: ").appendTo($("#output_tunnit"));
                            $('<label>').text(tunnit).appendTo($("#output_tunnit"));
                        });

                    })
                    .appendTo(div_board)

                    div_board.appendTo($boards);
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
        $('#output_taskit').empty();
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