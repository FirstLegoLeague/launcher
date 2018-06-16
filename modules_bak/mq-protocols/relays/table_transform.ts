/*
 * This function transforms the scores:ranking message from the fllscoring service
 * To a message that can be accepted by the table module in the displaySystem service.
 */
"use strict";

import { Message } from "mhub";

const RANK = "Rank";
const ROUND = "Round";
const NUMBER = "No.";
const NAME = "Name";
const TOP = "Highest";

function roundsArray(rounds: number): string[] {
	let arr = [];
	for(let i = 0; i < rounds; i++) {
		arr.push(ROUND + ' ' + (i+1));
	}
	return arr;
}

export default function(msg: Message): void|Message|Message[]|Promise<Message> {
	let rounds = roundsArray(msg.data.stage.rounds);

	let data = {
		header: [RANK, NUMBER, NAME, TOP].concat(rounds),
		data: msg.data.ranking.map(function(rank, index) {
			var scores = rank.scores.map((score) => score || 0);
			return [rank.rank, rank.team.number, rank.team.name, rank.highest].concat(scores);
		})
	};

	return new Message('table:setData', data);
}