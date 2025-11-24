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
    if (targetRange.attr('min') === undefined || value < targetRange.attr('min')) {
        targetRange.attr('min', value);
    }
};

function updateMax(value, targetRange) {
    if (targetRange.attr('max') === undefined || value > targetRange.attr('max')) {
        targetRange.attr('max', value);
    }
};

function getRangeMiddle(game) {
    let min = Number($('#range' + game).attr('min'));
    let max = Number($('#range' + game).attr('max'));
    return Math.round((min + max) / 2);
}

function addMarker(value, userName, datalist) {
    datalist.append('<option value="' + value + '" label="' + secondsToTime(value) + '"></option>');
};

function addRow(player) {
    $('#playerTableBody').append(
        '<tr class="player-row" data-player="' + player.entryNumber + '">' +
		'<td class="cell-rank text-end"></td>' +
		'<!--td class="cell-entry text-end">' + player.entryNumber + '</td-->' +
		'<td class="cell-user-name">' + player.userName + '</td>' +
		'<td class="cell-total text-end">00:00:00</td>' +
		'<td class="cell-to-next text-end"></td>' +
		'<td class="cell-current text-end" data-seconds="' + player.currentSeconds() + '">' + player.current + '</td>' +
		'<td class="cell-guess-325 text-end">' + player.guess325 + '</td>' +
		'<td class="cell-game-325 text-end">0:00:00</td>' +
		'<td class="cell-guess-329 text-end">' + player.guess329 + '</td>' +
		'<td class="cell-game-329 text-end">0:00:00</td>' +
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
        let g329 = Number($(this).find('td.cell-game-329').attr('data-seconds'));
        let total = current + g325 + g329;
        $(this).find('td.cell-total').attr('data-seconds', total).html(secondsToTime(total));
    });
};

function sortTable(cellClass = 'cell-total') {
    let switching = true;
    while (switching) {
        switching = false;
        let shouldSwitch = false;
        let i;
        let rows = $('#playerTableBody tr.player-row');
        for (i = 0; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            let currentTotal = Number(rows.eq(i).find('td.' + cellClass).attr('data-seconds'));
            let nextTotal = Number(rows.eq(i + 1).find('td.' + cellClass).attr('data-seconds'));

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

function updateRanks(checkClass = 'cell-total') {
    duplicateRanks.clear();
    let i = 1;
    let sameCount = 0;
    let lastTotal = 0;
    $('#playerTableBody tr.player-row').each(function () {
        let total = Number($(this).find('td.' + checkClass).attr('data-seconds'));
        if (total === lastTotal) {
            sameCount++;
            duplicateRanks.add(i - sameCount);
        } else {
            sameCount = 0;
        }
        if ((i - sameCount) > 1) {
            $(this).find('td.cell-to-next').attr('data-seconds', total - lastTotal).html('+' + secondsToTime(total - lastTotal));
        } else {
            $(this).find('td.cell-to-next').attr('data-seconds', 0).html('');
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

function Player(entryNumber, userName, current, guess325, guess329) {
    this.entryNumber = entryNumber;
    this.userName = userName;
    this.current = current;
    this.guess325 = guess325;
    this.guess329 = guess329;
    this.currentSeconds = function() {
        return timeToSeconds(this.current);
    };
    this.seconds325 = function() {
        return timeToSeconds(this.guess325);
    };
    this.seconds329 = function() {
        return timeToSeconds(this.guess329);
    };
};

let players = [];
players.push(new Player(1, "pmcTRILOGY", "43:00:47", "4:00:00", "25:00:00"));
players.push(new Player(2, "Inestimate", "53:23:01", "4:27:00", "28:05:00"));
players.push(new Player(3, "ShockingX", "83:04:33", "5:01:38", "19:38:00"));
players.push(new Player(4, "zambrini213", "34:55:45", "4:40:00", "32:35:00"));
players.push(new Player(5, "JamieTheBnnuy", "39:26:45", "4:31:02", "29:31:31"));
players.push(new Player(6, "Piranhamoe", "63:37:51", "4:15:00", "20:00:00"));
players.push(new Player(7, "teddyras", "35:29:59", "4:00:00", "40:00:00"));
players.push(new Player(8, "ECGreem", "40:13:35", "4:25:36", "23:59:59"));
players.push(new Player(9, "Naked_Tonberry", "46:47:17", "4:00:00", "15:00:00"));
players.push(new Player(10, "Awe / awestrikernova", "39:55:37", "4:40:00", "20:00:00"));
players.push(new Player(11, "Why_am_i_here44 ", "46:39:31", "4:55:23", "26:31:12"));
players.push(new Player(12, "ogNdrahciR", "47:19:01", "5:30:00", "20:00:00"));
players.push(new Player(13, "galaxy178", "38:05:27", "4:45:00", "2:00:00"));
players.push(new Player(14, "IllegallySam", "35:18:17", "4:46:11", "28:10:31"));
players.push(new Player(15, "TheJewker", "43:42:59", "4:40:00", "7:00:00"));
players.push(new Player(16, "Cosmic_Flora", "45:53:55", "4:34:00", "26:37:00"));
players.push(new Player(17, "Toadat", "39:51:45", "4:21:09", "22:22:22"));
players.push(new Player(18, "wonderj13", "57:40:00", "3:59:59", "12:30:01"));
players.push(new Player(19, "palimer6", "32:05:04", "4:31:27", "21:17:59"));
players.push(new Player(20, "positiveiona", "38:07:06", "6:00:00", "30:30:30"));
players.push(new Player(21, "driabwb ", "39:16:43", "6:24:00", "32:23:00"));
players.push(new Player(22, "xenocythe", "44:04:35", "5:07:19", "29:03:29"));
players.push(new Player(23, "JoshPrep", "95:58:59", "3:30:15", "27:00:35"));
players.push(new Player(24, "FurretTurret", "41:31:52", "4:19:59", "3:02:42"));
players.push(new Player(25, "Lan990", "43:42:07", "5:30:00", "5:00:00"));
players.push(new Player(26, "WickBRSTM", "39:51:44", "3:52:30", "20:00:00"));
players.push(new Player(27, "Asmodemus0", "52:13:37", "4:30:01", "15:41:11"));
players.push(new Player(28, "kiYubEE", "47:11:02", "4:44:44", "26:52:21"));

$(document).ready(function() {
    for (const player of players) {
        updateMin(player.seconds325(), $('#range325'));
        updateMax(player.seconds325(), $('#range325'));
        addMarker(player.seconds325(), player.userName, $('#list325'));
        updateMin(player.seconds329(), $('#range329'));
        updateMax(player.seconds329(), $('#range329'));
        addMarker(player.seconds329(), player.userName, $('#list329'));
        addRow(player);
    }
//    $('#range325').val(13950).trigger('input');
//    $('#range328').val(80650).trigger('input');
//    $('#range329').val(42755).trigger('input');
    $('#range325').val(getRangeMiddle(325));
    $('#range329').val(getRangeMiddle(329));
    sortTable('cell-current');
    updateRanks('cell-current');
    checkDuplicateRanks();

    let firstInput = true;
    $('.time-range').on('input', function() {
        if (firstInput) {
            firstInput = false;
            updateLabel($('#range325').val(), $('#time325'));
            updateLabel($('#range329').val(), $('#time329'));
            updateScores('325', false);
            updateScores('329', false);
            updateTotals();
        }
    });


    $('#range325').on('input', function() {
        updateLabel($(this).val(), $('#time325'));
		updateScores('325');
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
});