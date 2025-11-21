function timeToSeconds(time) {
    let regex = /(\d{1,2}):(\d{2}):(\d{2})/g;
    let arr = regex.exec(time);
    return arr[1] * 3600 + arr[2] * 60 + arr[3] * 1;
};

function secondsToTime(seconds) {
    let sec = "" + seconds % 60;
    let min = "" + (Math.floor(seconds / 60)) % 60;
    let hour = Math.floor(seconds / 3600);
    return hour + ":" + (min.length < 2 ? "0" + min : min) + ":" + (sec.length < 2 ? "0" + sec : sec);
};

function updateLabel(value, timeSpan) {
    let time = secondsToTime(value);
    timeSpan.html(time);
};

function updateMin(value, targetRange) {
    console.log("min", value, targetRange);
    if (targetRange.attr('min') === undefined || value < targetRange.attr('min')) {
        targetRange.attr('min', value);
    }
};

function updateMax(value, targetRange) {
    console.log("max", value, targetRange);
    if (targetRange.attr('max') === undefined || value > targetRange.attr('max')) {
        targetRange.attr('max', value);
    }
};

function addMarker(value, userName, datalist) {
    datalist.append('<option value="' + value + '" label="' + secondsToTime(value) + '"></option>');
};

function addRow(player) {
    $('#playerTableBody').append(
        '<tr class="player-row" data-player="' + player.entryNumber + '">' +
		'<td class="cell-rank text-end"></td>' +
		'<!--td class="cell-entry text-end">' + player.entryNumber + '</td-->' +
		'<td class="cell-user-name">' + player.userName + '</td>' +
		'<td class="cell-total text-end"></td>' +
		'<td class="cell-current text-end" data-seconds="' + player.currentSeconds() + '">' + player.current + '</td>' +
		'<td class="cell-guess-325 text-end">' + player.guess325 + '</td>' +
		'<td class="cell-game-325 text-end"></td>' +
		'<td class="cell-guess-328 text-end">' + player.guess328 + '</td>' +
		'<td class="cell-game-328 text-end"></td>' +
		'<td class="cell-guess-329 text-end">' + player.guess329 + '</td>' +
		'<td class="cell-game-329 text-end"></td>' +
		'<td class="cell-set"><button class="set-button btn btn-secondary btn-sm">Set</button></td>' +
		'</tr>');
};

function updateScores(game, propagate = true) {
	let value = $('#range' + game).val();
	for (const player of players) {
		let method = player['seconds' + game];
		let methodReturn = player['seconds' + game]();
		let score = Math.abs(value - methodReturn);
		let target = $('tr[data-player="' + player.entryNumber + '"] td.cell-game-' + game);
		target.attr('data-seconds', score);
		target.html(secondsToTime(score));
	}
};

function updateTotals() {
    $('.player-row').each(function(e) {
        let current = Number($(this).find('td.cell-current').attr('data-seconds'));
        let g325 = Number($(this).find('td.cell-game-325').attr('data-seconds'));
        let g328 = Number($(this).find('td.cell-game-328').attr('data-seconds'));
        let g329 = Number($(this).find('td.cell-game-329').attr('data-seconds'));
        let total = current + g325 + g328 + g329;
        $(this).find('td.cell-total').attr('data-seconds', total).html(secondsToTime(total));
    });
};

function sortTable() {
    let switching = true;
    while (switching) {
        switching = false;
        let shouldSwitch = false;
        let i;
        let rows = $('#playerTableBody tr.player-row');
        for (i = 0; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            let currentTotal = Number(rows.eq(i).find('td.cell-total').attr('data-seconds'));
            let nextTotal = Number(rows.eq(i + 1).find('td.cell-total').attr('data-seconds'));

            if (currentTotal > nextTotal) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows.eq(i).before(rows.eq(i + 1));
            switching = true;
        }
    }
};

let duplicateRanks = new Set();

function updateRanks() {
    duplicateRanks.clear();
    let i = 1;
    let sameCount = 0;
    let lastTotal = 0;
    $('#playerTableBody tr.player-row').each(function () {
        let total = Number($(this).find('td.cell-total').attr('data-seconds'));
        if (total === lastTotal) {
            sameCount++;
            duplicateRanks.add(i - sameCount);
        } else {
            sameCount = 0;
        }
        lastTotal = total;
        $(this).find('td.cell-rank').attr('data-rank', i - sameCount).html(i - sameCount);
        i++;
    });
};

function checkDuplicateRanks() {
    $('#playerTableBody tr.player-row').removeClass('duplicate-rank');
    if (duplicateRanks.size === 0) {
        return;
    }
    $('#playerTableBody tr.player-row').each(function () {
        let rank = Number($(this).find('td.cell-rank').attr('data-rank'));
        if (duplicateRanks.has(rank)) {
            $(this).addClass('duplicate-rank');
        }
    });
};

function Player(entryNumber, userName, current, guess325, guess328, guess329) {
    this.entryNumber = entryNumber;
    this.userName = userName;
    this.current = current;
    this.guess325 = guess325;
    this.guess328 = guess328;
    this.guess329 = guess329;
    this.currentSeconds = function() {
        return timeToSeconds(this.current);
    };
    this.seconds325 = function() {
        return timeToSeconds(this.guess325);
    };
    this.seconds328 = function() {
        return timeToSeconds(this.guess328);
    };
    this.seconds329 = function() {
        return timeToSeconds(this.guess329);
    };
};

let players = [];
players.push(new Player(1, "pmcTRILOGY", "37:44:53", "4:00:00", "22:00:00", "25:00:00"));
players.push(new Player(2, "Inestimate", "53:11:28", "4:27:00", "27:27:27", "28:05:00"));
players.push(new Player(3, "ShockingX", "81:18:17", "5:01:38", "25:29:38", "19:38:00"));
players.push(new Player(4, "zambrini213", "31:59:51", "4:40:00", "24:20:00", "32:35:00"));
players.push(new Player(5, "JamieTheBnnuy", "39:12:36", "4:31:02", "27:01:45", "29:31:31"));
players.push(new Player(6, "Piranhamoe", "54:21:57", "4:15:00", "18:00:00", "20:00:00"));
players.push(new Player(7, "teddyras", "34:14:05", "4:00:00", "26:00:00", "40:00:00"));
players.push(new Player(8, "ECGreem", "34:20:04", "4:25:36", "21:22:23", "23:59:59"));
players.push(new Player(9, "Naked_Tonberry", "39:31:23", "4:00:00", "20:00:00", "15:00:00"));
players.push(new Player(10, "Awe / awestrikernova", "35:39:43", "4:40:00", "23:00:00", "20:00:00"));
players.push(new Player(11, "Why_am_i_here44 ", "45:06:28", "4:55:23", "25:42:51", "26:31:12"));
players.push(new Player(12, "ogNdrahciR", "42:34:55", "5:30:00", "32:00:00", "20:00:00"));
players.push(new Player(13, "galaxy178", "33:49:33", "4:45:00", "23:00:00", "2:00:00"));
players.push(new Player(14, "IllegallySam", "33:21:23", "4:46:11", "25:19:00", "28:10:31"));
players.push(new Player(15, "TheJewker", "42:27:05", "4:40:00", "26:00:00", "7:00:00"));
players.push(new Player(16, "Cosmic_Flora", "44:03:01", "4:34:00", "25:25:00", "26:37:00"));
players.push(new Player(17, "Toadat", "37:00:15", "4:21:09", "24:24:24", "22:22:22"));
players.push(new Player(18, "wonderj13", "46:54:07", "3:59:59", "16:30:01", "12:30:01"));
players.push(new Player(19, "palimer6", "32:04:18", "4:31:27", "27:15:08", "21:17:59"));
players.push(new Player(20, "positiveiona", "34:40:12", "6:00:00", "23:49:00", "30:30:30"));
players.push(new Player(21, "driabwb ", "36:31:37", "6:24:00", "30:01:00", "32:23:00"));
players.push(new Player(22, "xenocythe", "41:02:18", "5:07:19", "24:13:37", "29:03:29"));
players.push(new Player(23, "JoshPrep", "94:29:04", "3:30:15", "25:45:59", "27:00:35"));
players.push(new Player(24, "FurretTurret", "36:38:20", "4:19:59", "22:22:22", "3:02:42"));
players.push(new Player(25, "Lan990", "41:26:13", "5:30:00", "25:00:00", "5:00:00"));
players.push(new Player(26, "WickBRSTM", "36:24:49", "3:52:30", "23:48:59", "20:00:00"));
players.push(new Player(27, "Asmodemus0", "44:39:39", "4:30:01", "19:41:56", "15:41:11"));
players.push(new Player(28, "kiYubEE", "45:07:33", "4:44:44", "25:12:25", "26:52:21"));

$(document).ready(function() {
    for (const player of players) {
        updateMin(player.seconds325(), $('#range325'));
        updateMax(player.seconds325(), $('#range325'));
        addMarker(player.seconds325(), player.userName, $('#list325'));
        updateMin(player.seconds328(), $('#range328'));
        updateMax(player.seconds328(), $('#range328'));
        addMarker(player.seconds328(), player.userName, $('#list328'));
        updateMin(player.seconds329(), $('#range329'));
        updateMax(player.seconds329(), $('#range329'));
        addMarker(player.seconds329(), player.userName, $('#list329'));
        addRow(player);
    }
    updateLabel($('#range325').val(), $('#time325'));
    updateLabel($('#range328').val(), $('#time328'));
    updateLabel($('#range329').val(), $('#time329'));
	updateScores('325', false);
	updateScores('328', false);
	updateScores('329', false);
	updateTotals();
	sortTable();
	updateRanks();
	checkDuplicateRanks();

    $('#range325').on('input', function() {
        updateLabel($(this).val(), $('#time325'));
		updateScores('325');
		updateTotals();
		sortTable();
		updateRanks();
		checkDuplicateRanks();
    });

    $('#range328').on('input', function() {
        updateLabel($(this).val(), $('#time328'));
		updateScores('328');
		updateTotals();
        sortTable();
        updateRanks();
        checkDuplicateRanks();
    });

    $('#range329').on('input', function() {
        updateLabel($(this).val(), $('#time329'));
		updateScores('329');
		updateTotals();
        sortTable();
        updateRanks();
        checkDuplicateRanks();
    });

    $('tr.player-row td.cell-set .set-button').on('click', function(e) {
        e.stopPropagation();
        let entryNumber = Number($(this).parent().parent().attr('data-player'));
        for (const player of players) {
            if (player.entryNumber === entryNumber) {
                $('#range325').val(player.seconds325()).trigger('input');
                $('#range328').val(player.seconds328()).trigger('input');
                $('#range329').val(player.seconds329()).trigger('input');
                return;
            }
        }
    });

    $('tr.player-row td').on('click', function() {
        let isHighlighted = $(this).parent().hasClass('highlighted');
        if (isHighlighted) {
            $(this).parent().removeClass('highlighted');
        } else {
            $(this).parent().addClass('highlighted');
        }
    });

//    $('#range325').val(13950).trigger('input');
//    $('#range328').val(80650).trigger('input');
//    $('#range329').val(42755).trigger('input');
});