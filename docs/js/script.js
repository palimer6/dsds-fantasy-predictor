/**
 * A Player that has submitted guesses for this bracket.
 */
class Player {
    /**
     * @param {number} entryNumber The entry number of this player.
     * @param {string} userName The user name of this player.
     * @param {Object.<number, string>} guesses The map of guessed times this player gave for each game number.
     */
    constructor(entryNumber, userName, guesses) {
        /**
         * @member {number} entryNumber
         */
        this.entryNumber = entryNumber;
        /**  
         * @member {string} userName
        */
        this.userName = userName;
        /**
         * @member {Object.<number, string>} guesses
         */
        this.guesses = guesses;
        /**
         * @member {number} currentScore The score in seconds this player has achieved for the games that are in {@link ACTUAL_TIMES}.
         */
        this.currentScore = calculateScore(guesses);
        /**
         * @param {number} gameNumber
         * @returns {number} the amount of seconds this player guessed for the game with the given game number.
         */
        this.seconds = function (gameNumber) {
            return timeToSeconds(guesses[gameNumber]);
        };
    }
};

/**
 * The highest allowed number of rows of ranges.
 * @type {number}
 */
const MAX_RANGE_ROWS = 5;

/**
 * All possible number of ranges allowed in one row. These should not be changed as they correspond to bootstrap grid sizes.
 * @type {number[]} 
*/
const ROW_SIZES = [1, 2, 3, 4, 6, 12];

/**
 * Array of game numbers that are in {@link GAMES} but not in {@link ACTUAL_TIMES}, meaning they are yet to be finished.
 * @type {number[]}
 */
const UPCOMING_GAMES = function () {
    let upcomingList = [];
    for (const gameNumber in GAMES) {
        if (!(gameNumber in ACTUAL_TIMES)) {
            upcomingList.push(Number(gameNumber));
        }
    }
    return upcomingList;
}();

/**
 * The list of {@link Player}s that have submitted guesses for this bracket.
 * @type {Player[]}
 */
const PLAYERS = function () {
    let playerList = [];
    for (let rawPlayer of RAW_PLAYERS) {
        playerList.push(new Player(rawPlayer.entryNumber, rawPlayer.userName, rawPlayer.guesses));
    }
    return playerList;
}();

/**
 * Util
 * 
 * Converts a string of the format h:mm:ss into seconds.
 * @param {string} time
 * @returns {number} the amount of seconds in the given time string.
 */
function timeToSeconds(time) {
    let regex = /(\d{1,2}):(\d{2}):(\d{2})/g;
    let arr = regex.exec(time);
    return arr[1] * 3600 + arr[2] * 60 + arr[3] * 1;
};

/**
 * Util
 * 
 * Converts an amount of seconds into the format h:mm:ss.
 * @param {number} seconds
 * @returns {string} the time string equal to the given amount of seconds.
 */
function secondsToTime(seconds) {
    let sec = "" + seconds % 60;
    let min = "" + (Math.floor(seconds / 60)) % 60;
    let hour = Math.floor(seconds / 3600);
    return hour + ":" + (min.length < 2 ? "0" + min : min) + ":" + (sec.length < 2 ? "0" + sec : sec);
};

/**
 * Util
 * 
 * Calculates the score in seconds based on the differences between a map of guessed times and their times in {@link ACTUAL_TIMES}. Game numbers not in {@link ACTUAL_TIMES} are ignored.
 * @param {object} guesses Map of numbers to time strings representing the times a {@link Player} guessed for a given game number.
 * @returns {number} the score in seconds this set of guesses achieved compared to {@link ACTUAL_TIMES}.
 */
function calculateScore(guesses) {
    let score = 0;
    for (const gameNumber in guesses) {
        let guess = guesses[gameNumber];
        let actualTime = ACTUAL_TIMES[gameNumber];
        if (gameNumber in ACTUAL_TIMES) {
            score += Math.abs(timeToSeconds(actualTime) - timeToSeconds(guess));
        } else {
            continue;
        }
    }
    return score;
}

/**
 * UI Creation
 * 
 * Creates range inputs with labels for all games in {@link UPCOMING_GAMES}.
 */
function createRanges() {
    let chosenSize;
    for (const rowSize of ROW_SIZES) {
        if (rowSize * MAX_RANGE_ROWS >= UPCOMING_GAMES.length) {
            chosenSize = rowSize;
            break;
        }
    }
    let gridColSize = 12 / chosenSize;
    for (const gameNumber of UPCOMING_GAMES) {
        let rangeBlock =
            `<div class="d-flex flex-column col-12 col-lg-${gridColSize}">
                <p class="mb-1">Time: <span id="time${gameNumber}">&#x2012;:&#x2012;&#x2012;:&#x2012;&#x2012;</span></p>
                <div class="d-flex flex-grow-1 justify-content-between align-items-start">
                    <label for="range${gameNumber}" class="form-label">#${gameNumber} - ${GAMES[gameNumber]}</label>
                    <button id="reset${gameNumber}" class="btn btn-secondary btn-sm reset-button" data-game="${gameNumber}">Reset</button>
                </div>
                <input type="range" class="form-range time-range" id="range${gameNumber}" list="list${gameNumber}" data-game="${gameNumber}">
                <datalist id="list${gameNumber}"></datalist>
            </div>`;
        $('#gameRanges').append(rangeBlock);
    }
};

/**
 * UI Creation
 * 
 * Creates a list of checkboxes for all games in {@link UPCOMING_GAMES} to toggle wether they are displayed or not.
 */
function createDisplayChecks() {
    for (const gameNumber of UPCOMING_GAMES) {
        let displayCheck =
            `<div class="form-check">
                <input id="display${gameNumber}" class="form-check-input display-check" type="checkbox" data-game="${gameNumber}" checked>
                <label for="display${gameNumber}" class="form-check-label">Show #${gameNumber} - ${GAMES[gameNumber]}</label>
            </div>`;
        $('#colDisplayCard').append(displayCheck);
    }
};

/**
 * UI Creation
 * 
 * Creates 2 colspan headers for all games in {@link UPCOMING_GAMES}.
 */
function createGameHeaders() {
    let gameHeaders = '';
    for (const gameNumber of UPCOMING_GAMES) {
        gameHeaders = `${gameHeaders}<th class="header-${gameNumber} game-col game-col-${gameNumber}" colspan="2">#${gameNumber} - ${GAMES[gameNumber]}</th>`;
    }
    $('.header-current').after(gameHeaders);
};

/**
 * UI Creation
 * 
 * Takes the guess the given {@link Player} gave for the given game number and expands the min attribute of the corresponding range if it is lower than the current value.
 * @param {Player} player
 * @param {number} gameNumber
 */
function updateMin(player, gameNumber) {
    let value = player.seconds(gameNumber);
    let targetRange = $(`#range${gameNumber}`);
    if (targetRange.attr('min') === undefined || value < targetRange.attr('min')) {
        targetRange.attr('min', value);
    }
};

/**
 * UI Creation
 * 
 * Takes the guess the given {@link Player} gave for the given game number and expands the max attribute of the corresponding range if it is greater than the current value.
 * @param {Player} player
 * @param {number} gameNumber
 */
function updateMax(player, gameNumber) {
    let value = player.seconds(gameNumber);
    let targetRange = $(`#range${gameNumber}`);
    if (targetRange.attr('max') === undefined || value > targetRange.attr('max')) {
        targetRange.attr('max', value);
    }
};

/**
 * UI Creation
 * 
 * Adds an option tag to the corresponding datalist of the given game number for the corresponding guess the given {@link Player} gave.
 * This is used to give a marker to the game's range.
 * @param {Player} player
 * @param {number} gameNumber
 */
function addMarker(player, gameNumber) {
    let value = player.seconds(gameNumber);
    $(`#list${gameNumber}`).append(`<option value="${value}" label="${secondsToTime(value)}"></option>`);
};

/**
 * UI Creation
 * 
 * Creates a new row for the given {@link Player} with their data including their guess for all games in {@link UPCOMING_GAMES}.
 * @param {Player} player
 */
function createPlayerRow(player) {
    let rowBeginning =
        `<tr class="player-row" data-player="${player.entryNumber}">
            <td class="cell-rank text-end"></td>
            <!--td class="cell-entry text-end">${player.entryNumber}</td-->
            <td class="cell-user-name">${player.userName}</td>
            <td class="cell-total text-end">&#x2012;&#x2012;:&#x2012;&#x2012;:&#x2012;&#x2012;</td>
            <td class="cell-to-next text-end"></td>
            <td class="cell-current text-end" data-seconds="${player.currentScore}">${secondsToTime(player.currentScore)}</td>`;
    let rowGames = '';
    for (const gameNumber of UPCOMING_GAMES) {
        rowGames = `${rowGames}
            <td class="cell-guess cell-guess-${gameNumber} game-col game-col-${gameNumber} text-end">${player.guesses[gameNumber]}</td>
            <td class="cell-game cell-game-${gameNumber} game-col game-col-${gameNumber} text-end" data-game="${gameNumber}" data-seconds="0">&#x2012;:&#x2012;&#x2012;:&#x2012;&#x2012;</td>`;
    }
    let rowEnd = '<td class="cell-set">' +
        '<button class="set-button btn btn-secondary btn-sm">Set</button>' +
        '</td>' +
        '</tr>';
    $('#playerTableBody').append(rowBeginning + rowGames + rowEnd);
};

/**
 * UI Creation
 * 
 * Sets the minimum value of the range corresponding to the given game number to the seconds representation of the given time string.
 * 
 * This is used if a game is currently ongoing.
 * @param {number} gameNumber 
 * @param {string} time 
 */
function overwriteMin(gameNumber, time) {
    $(`#range${gameNumber}`).attr('min', timeToSeconds(time));
};

/**
 * UI Creation
 * 
 * Takes the values in the min and max attributes of the range corresponding to the given game number and sets its current value to their average.
 * @param {number} gameNumber
 */
function centerRange(gameNumber) {
    let min = Number($(`#range${gameNumber}`).attr('min'));
    let max = Number($(`#range${gameNumber}`).attr('max'));
    $(`#range${gameNumber}`).val(Math.round((min + max) / 2));
};

/**
 * UI Creation and Update
 * 
 * Takes the data-seconds attribute in the td tag with the given class in each row and sorts the table in ascending order based on it.
 * 
 * Taken from https://www.w3schools.com/howto/howto_js_sort_table.asp
 * @param {string} cellClass The class of the td tag which should have its data-seconds attribute be used for sorting. 'cell-total' is used in case nothing is given.
 */
function sortTable(cellClass = 'cell-total') {
    let switching = true;
    while (switching) {
        switching = false;
        let shouldSwitch = false;
        let i;
        let rows = $('#playerTableBody tr.player-row');
        for (i = 0; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            let currentTotal = Number(rows.eq(i).find(`td.${cellClass}`).attr('data-seconds'));
            let nextTotal = Number(rows.eq(i + 1).find(`td.${cellClass}`).attr('data-seconds'));

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

/**
 * Stores duplicate ranks from {@link updateRanks} for styling in {@link checkDuplicateRanks}.
 * @type {Set.<number>}
 */
let duplicateRanks = new Set();

/**
 * UI Creation and Update
 * 
 * Iterates through all rows in the table and sequentially adds their rank number.
 * If the data-seconds attribute of the cell with the given class holds the same value as the previous row, the same rank number is applied.
 * If all values are the same, all ranks are set to 0 using {@link unsetRanks}.
 * Also clears the current contents of {@link duplicateRanks} and adds all duplicate ranks to it.
 * Also fills the to-next column with the difference to the row above.
 * @param {string} checkClass The class of the td tag which should have its data-seconds attribute be used for duplicate score checking. 'cell-total' is used in case nothing is given.
 */
function updateRanks(checkClass = 'cell-total') {
    duplicateRanks.clear();
    let i = 1;
    let sameCount = 0;
    let lastTotal = -1;
    $('#playerTableBody tr.player-row').each(function () {
        let total = Number($(this).find(`td.${checkClass}`).attr('data-seconds'));
        if (total === lastTotal) {
            sameCount++;
            duplicateRanks.add(i - sameCount);
        } else {
            sameCount = 0;
        }
        if ((i - sameCount) > 1) {
            $(this).find('td.cell-to-next').attr('data-seconds', total - lastTotal).html(`+${secondsToTime(total - lastTotal)}`);
        } else {
            $(this).find('td.cell-to-next').attr('data-seconds', 0).html('');
        }
        lastTotal = total;
        $(this).find('td.cell-rank').attr('data-rank', i - sameCount).html(i - sameCount);
        i++;
    });
    if (sameCount === PLAYERS.length - 1) {
        unsetRanks();
    }
};

/**
 * Sets all ranks to 0.
 */
function unsetRanks() {
    $('#playerTableBody tr.player-row').each(function () {
        $(this).find('td.cell-rank').attr('data-rank', 0).html(0);
    });
};

/**
 * UI Creation and Update
 * 
 * Adds the 'duplicate-rank' class to all rows that have a rank that is stored in {@link duplicateRanks}.
 */
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

/**
 * UI Update
 * 
 * Takes the current value of the range for the given game number and writes its time string to the corresponding span.
 * @param {number} gameNumber the number to be appended to 'range' and 'time' to find the elements with the corresponding IDs
 */
function updateLabel(gameNumber) {
    let time = secondsToTime($(`#range${gameNumber}`).val());
    $(`#time${gameNumber}`).html(time);
};

/**
 * UI Update
 * 
 * Updates every {@link Player}'s score for the given game number based on the value of the game's range and their guess.
 * @param {number} gameNumber
 */
function updateScores(gameNumber) {
    let value = $(`#range${gameNumber}`).val();
    for (const player of PLAYERS) {
        let score = Math.abs(value - player.seconds(gameNumber));
        let target = $(`tr[data-player="${player.entryNumber}"] td.cell-game-${gameNumber}`);
        target.attr('data-seconds', score);
        target.html(secondsToTime(score));
    }
};

/**
 * UI Update
 * 
 * Updates every {@link Player}'s total score based on their current score and their scores for all upcoming games.
 */
function updateTotals() {
    $('.player-row').each(function (e) {
        let total = Number($(this).find('td.cell-current').attr('data-seconds'));
        for (const upcomingGame of UPCOMING_GAMES) {
            let score = Number($(this).find(`td.cell-game-${upcomingGame}`).attr('data-seconds'));
            total += score;
        }
        $(this).find('td.cell-total').attr('data-seconds', total).html(secondsToTime(total));
    });
};

/**
 * UI Update
 * 
 * Checks if the given jQuery element is or contains the target of the given {@link Event}.
 * @param {Event} event
 * @param {jQuery} element
 * @returns {boolean} whether the event's target is or is contained by the element.
 */
function isTarget(event, element) {
    return element.is(event.target) || element.has(event.target).length !== 0;
};

$(document).ready(function () {
    // UI Creation
    $('#commitHash').html(commitHash.substring(0, 8));
    $('#commitBranch').html(commitBranch);
    $('#commitTime').html(commitTime);
    createRanges();
    createDisplayChecks();
    createGameHeaders();
    for (const player of PLAYERS) {
        for (const gameNumber of UPCOMING_GAMES) {
            updateMin(player, gameNumber);
            updateMax(player, gameNumber);
            addMarker(player, gameNumber);
        }
        createPlayerRow(player);
    }

    // overwriteMin({gameNumber},{time});

    for (const gameNumber of UPCOMING_GAMES) {
        centerRange(gameNumber);
    }
    sortTable('cell-current');
    updateRanks('cell-current');
    checkDuplicateRanks();

    // If the table with all games is wider than the device, all games are automatically hidden.
    if ($('#playerTable').width() > $('body').width()) {
        $('.game-col').hide();
        $('.display-check').prop('checked', false);
        $('#displayAll').prop('checked', false);
    }

    // UI Updates

    /**
     * Updates labels and scores for the range's game and updates totals, sorting, ranks, and duplicate ranks for the whole table.
     */
    $('.time-range').on('input', function () {
        let gameNumber = $(this).attr('data-game');
        updateLabel(gameNumber);
        updateScores(gameNumber);
        updateTotals();
        sortTable();
        updateRanks();
        checkDuplicateRanks();
    });

    /**
     * Resets labels and scores for the range's game and updates totals, sorting, ranks, and duplicate ranks for the whole table.
     */
    $('.reset-button').on('click', function () {
        let gameNumber = Number($(this).attr('data-game'));
        $(`#time${gameNumber}`).html('&#x2012;:&#x2012;&#x2012;:&#x2012;&#x2012;');
        centerRange(gameNumber);
        for (const player of PLAYERS) {
            let target = $(`tr[data-player="${player.entryNumber}"] td.cell-game-${gameNumber}`);
            target.attr('data-seconds', 0);
            target.html('&#x2012;:&#x2012;&#x2012;:&#x2012;&#x2012;');
        }
        updateTotals();
        sortTable();
        updateRanks();
        checkDuplicateRanks();
    });

    /**
     * Sets the range values of all games to the guesses of this row's player.
     */
    $('tr.player-row td.cell-set .set-button').on('click', function (e) {
        let partialMode = e.shiftKey;
        let entryNumber = Number($(this).parent().parent().attr('data-player'));
        let skipGames = [];
        if (partialMode) {
            $('tr.player-row[data-player="' + entryNumber + '"] td.cell-game').each(function () {
                if (Number($(this).attr('data-seconds')) != 0) {
                    skipGames.push(Number($(this).attr('data-game')));
                }
            });
        }
        for (const player of PLAYERS) {
            if (player.entryNumber === entryNumber) {
                for (const gameNumber of UPCOMING_GAMES) {
                    if (partialMode && skipGames.includes(gameNumber)) {
                        continue;
                    }
                    $(`#range${gameNumber}`)
                        .val(player.seconds(gameNumber))
                        .trigger('input');
                }
                return;
            }
        }
    });

    /**
     * Adds the 'highlighted' class to this row.
     */
    $('tr.player-row td').on('click', function (e) {
        if (isTarget(e, $('tr.player-row td.cell-set .set-button'))) {
            return;
        }
        let isHighlighted = $(this).parent().hasClass('highlighted');
        if (isHighlighted) {
            $(this).parent().removeClass('highlighted');
        } else {
            $(this).parent().addClass('highlighted');
        }
    });

    /**
     * Whether the info box is currently shown.
     * @type {boolean}
     */
    let infoShown = false;
    
    /**
     * Whether the column display settings are currently shown.
     * @type {boolean}
     */
    let colDisplayShown = false;

    /**
     * Toggle the info box when the info button is clicked.
     */
    $('#infoButton').on('click', function (e) {
        if (infoShown) {
            hideInfo();
        } else {
            showInfo();
        }
    });

    /**
     * Toggle the column display settings when the col display is clicked.
     */
    $('#colDisplayButton').on('click', function (e) {
        if (colDisplayShown) {
            hideColDisplay();
        } else {
            showColDisplay();
        }
    });

    /**
     * Hide the info box if anywhere but the info box is clicked.
     */
    $(document).on('click', function (e) {
        if (!infoShown && !colDisplayShown) {
            return;
        }
        if (!isTarget(e, $('#infoButton')) && !isTarget(e, $('#infoCard'))) {
            hideInfo();
        }
        if (!isTarget(e, $('#colDisplayButton')) && !isTarget(e, $('#colDisplayCard'))) {
            hideColDisplay();
        }
    });

    /**
     * Show the info box and bind hiding the info box to the escape key.
     */
    function showInfo() {
        $('#infoCard').show(200);
        infoShown = true;
        $(document).on('keydown.escape_info', function (e) {
            if (e.key === 'Escape') {
                hideInfo();
            }
        });
    };

    /**
     * Hide the info box and unbind hiding the info box from the escape key.
     */
    function hideInfo() {
        $('#infoCard').hide(200);
        infoShown = false;
        $(document).unbind('keydown.escape_info');
    };

    /**
     * Show the column display settings and bind hiding them to the escape key.
     */
    function showColDisplay() {
        $('#colDisplayCard').show(200);
        colDisplayShown = true;
        $(document).on('keydown.escape_col_display', function (e) {
            if (e.key === 'Escape') {
                hideColDisplay();
            }
        });
    };

    /**
     * Hide the column display settings and unbind hiding them from the escape key.
     */
    function hideColDisplay() {
        $('#colDisplayCard').hide(200);
        colDisplayShown = false;
        $(document).unbind('keydown.escape_col_display');
    };

    /**
     * Show or hide a game column based on the display checkbox clicked.
     * Also change state of displayAll.
     */
    $('.display-check').on('change', function () {
        let gameNumber = Number($(this).attr('data-game'));
        if ($(this).prop('checked')) {
            $(`.game-col-${gameNumber}`).show();
        } else {
            $(`.game-col-${gameNumber}`).hide();
        }
        
        let checkedChecksCount = $('.display-check:checked').length;
        if (checkedChecksCount == 0) {
            $('#displayAll').prop('checked', false).prop('indeterminate', false);
        } else {
            let checksCount = $('.display-check').length;
            if (checkedChecksCount === checksCount) {
                $('#displayAll').prop('checked', true).prop('indeterminate', false);
            } else {
                $('#displayAll').prop('checked', false).prop('indeterminate', true);
            }
        }
    });

    /**
     * Checks and displays or unchecks and hides all game columns.
     */
    $('#displayAll').on('change', function () {
        if ($(this).prop('checked')) {
            $('.display-check').prop('checked', true);
            $(`.game-col`).show();
        } else {
            $('.display-check').prop('checked', false);
            $(`.game-col`).hide();
        }
    });
});
