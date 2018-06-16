/*
 * This function transforms the scores:ranking message from the fllscoring service
 * To a message that can be accepted by the table module in the displaySystem service.
 */
"use strict";
exports.__esModule = true;
var mhub_1 = require("mhub");
var RANK = "Rank";
var ROUND = "Round";
var NUMBER = "No.";
var NAME = "Name";
var TOP = "Highest";
function roundsArray(rounds) {
    var arr = [];
    for (var i = 0; i < rounds; i++) {
        arr.push(ROUND + ' ' + (i + 1));
    }
    return arr;
}
function default_1(msg) {
    var rounds = roundsArray(msg.data.stage.rounds);
    var data = {
        header: [RANK, NUMBER, NAME, TOP].concat(rounds),
        data: msg.data.ranking.map(function (rank, index) {
            var scores = rank.scores.map(function (score) { return score || 0; });
            return [index, rank.team.number, rank.team.name, rank.highest].concat(scores);
        })
    };
    return new mhub_1.Message('table:setData', data);
}
exports["default"] = default_1;
