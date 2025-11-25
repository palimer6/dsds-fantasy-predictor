/**
 * Map that assigns game titles to game numbers.
 * @type {Object.<number, string>}
 */
const GAMES = {
    309: "My Baby Girl",
    310: "Toon-Doku",
    311: "Crash: Mind Over Mutant",
    312: "DK: Jungle Climber",
    313: "Lux-Pain",
    314: "Bleach: The Blade of Fate",
    315: "Princess Debut",
    316: "Poptropica Adventures",
    317: "Silly Bandz",
    318: "Warioware D.I.Y.",
    319: "Touch The Dead",
    320: "Diamond Trust of London",
    321: "Final Fantasy Crystal Chronicles: Echoes of Time",
    322: "Jackass: The Game",
    323: "Dreamworks Madagascar: Escape 2 Africa",
    324: "Spider-Man 2",
    325: "Spyro: Shadow Legacy",
    326: "Super Collapse 3",
    327: "Nostalgia",
    328: "Dragon Ball Z: Attack of the Saiyans",
    329: "Exit DS"
};

/**
 * Map that assigns the time strings of the actual times that were taken to beat a game to game numbers.
 * @type {Object.<number, string>}
 */
const ACTUAL_TIMES = {
    309: "1:01:58",
    310: "1:36:42",
    311: "5:42:15",
    312: "7:16:31",
    313: "29:04:11",
    314: "1:37:00",
    315: "4:42:13",
    316: "2:18:48",
    317: "1:11:07",
    318: "5:02:16",
    319: "2:12:25",
    320: "0:25:53",
    321: "12:27:56",
    322: "4:31:04",
    323: "2:22:44",
    324: "4:10:38",
    326: "7:41:09",
    327: "26:27:49",
    328: "27:15:54"
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
            upcomingList.push(gameNumber);
        }
    }
    return upcomingList;
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
 * The list of {@link Player}s that have submitted guesses for this bracket.
 * @type {Player[]}
 */
let players = [];
players.push(new Player(1, "pmcTRILOGY", { 309: "1:30:00", 310: "1:00:00", 311: "4:30:00", 312: "4:00:00", 313: "15:00:00", 314: "1:00:00", 315: "4:00:00", 316: "0:50:00", 317: "1:30:00", 318: "2:45:00", 319: "2:15:00", 320: "0:45:00", 321: "10:00:00", 322: "2:05:00", 323: "1:30:00", 324: "1:45:00", 325: "4:00:00", 326: "6:00:00", 327: "24:00:00", 328: "22:00:00", 329: "25:00:00" }));
players.push(new Player(2, "Inestimate", { 309: "2:53:12", 310: "0:25:47", 311: "5:06:15", 312: "4:52:01", 313: "18:11:14", 314: "3:30:00", 315: "2:00:54", 316: "0:46:46", 317: "1:30:55", 318: "5:33:24", 319: "2:31:00", 320: "17:55:11", 321: "11:11:11", 322: "2:45:42", 323: "4:50:00", 324: "2:00:00", 325: "4:27:00", 326: "5:57:55", 327: "28:35:16", 328: "27:27:27", 329: "28:05:00" }));
players.push(new Player(3, "ShockingX", { 309: "1:38:03", 310: "1:38:04", 311: "4:38:05", 312: "5:02:38", 313: "19:24:38", 314: "0:55:38", 315: "2:38:18", 316: "0:20:38", 317: "1:02:38", 318: "5:38:38", 319: "2:02:38", 320: "48:38:28", 321: "15:09:38", 322: "1:38:38", 323: "1:15:38", 324: "1:12:38", 325: "5:01:38", 326: "7:38:38", 327: "30:38:38", 328: "25:29:38", 329: "19:38:00" }));
players.push(new Player(4, "zambrini213", { 309: "4:00:00", 310: "3:10:00", 311: "4:20:00", 312: "4:30:00", 313: "20:00:00", 314: "3:41:00", 315: "4:28:00", 316: "1:10:00", 317: "1:30:00", 318: "4:00:00", 319: "2:25:00", 320: "0:20:00", 321: "10:56:00", 322: "2:00:00", 323: "2:30:00", 324: "2:40:00", 325: "4:40:00", 326: "10:37:00", 327: "27:00:00", 328: "24:20:00", 329: "32:35:00" }));
players.push(new Player(5, "JamieTheBnnuy", { 309: "2:45:53", 310: "0:30:30", 311: "6:21:54", 312: "5:41:01", 313: "21:38:19", 314: "2:51:00", 315: "2:01:36", 316: "1:37:41", 317: "2:31:50", 318: "4:30:41", 319: "2:21:22", 320: "1:42:00", 321: "10:44:34", 322: "3:31:29", 323: "3:01:58", 324: "2:00:41", 325: "4:31:02", 326: "13:31:01", 327: "19:01:27", 328: "27:01:45", 329: "29:31:31" }));
players.push(new Player(6, "Piranhamoe", { 309: "2:35:00", 310: "0:35:00", 311: "4:00:00", 312: "3:45:00", 313: "15:45:00", 314: "1:00:00", 315: "2:00:00", 316: "0:25:00", 317: "1:00:00", 318: "2:25:00", 319: "1:50:00", 320: "0:35:00", 321: "6:00:00", 322: "2:00:00", 323: "2:00:00", 324: "1:30:00", 325: "4:15:00", 326: "3:30:00", 327: "18:00:00", 328: "18:00:00", 329: "20:00:00" }));
players.push(new Player(7, "teddyras", { 309: "2:30:00", 310: "0:45:00", 311: "3:45:00", 312: "4:00:00", 313: "21:00:00", 314: "2:00:00", 315: "2:15:00", 316: "0:25:00", 317: "1:00:00", 318: "4:00:00", 319: "1:15:00", 320: "0:15:00", 321: "11:00:00", 322: "1:45:00", 323: "2:00:00", 324: "1:30:00", 325: "4:00:00", 326: "7:00:00", 327: "30:00:00", 328: "26:00:00", 329: "40:00:00" }));
players.push(new Player(8, "ECGreem", { 309: "4:25:00", 310: "1:04:09", 311: "5:00:00", 312: "4:40:00", 313: "18:20:22", 314: "1:30:00", 315: "3:59:59", 316: "1:30:15", 317: "1:50:50", 318: "3:12:48", 319: "1:51:51", 320: "2:03:05", 321: "14:00:00", 322: "2:04:08", 323: "3:09:27", 324: "1:23:45", 325: "4:25:36", 326: "7:00:00", 327: "24:24:24", 328: "21:22:23", 329: "23:59:59" }));
players.push(new Player(9, "Naked_Tonberry", { 309: "2:30:00", 310: "2:00:00", 311: "5:15:00", 312: "5:00:00", 313: "15:00:00", 314: "2:00:00", 315: "1:30:00", 316: "0:40:00", 317: "1:15:00", 318: "3:30:00", 319: "2:15:00", 320: "0:30:00", 321: "8:00:00", 322: "2:15:00", 323: "3:00:00", 324: "1:50:00", 325: "4:00:00", 326: "7:00:00", 327: "30:00:00", 328: "20:00:00", 329: "15:00:00" }));
players.push(new Player(10, "Awe / awestrikernova", { 309: "3:15:00", 310: "1:23:45", 311: "5:50:50", 312: "4:45:00", 313: "22:30:30", 314: "3:50:55", 315: "7:00:00", 316: "0:58:00", 317: "1:37:00", 318: "2:48:00", 319: "1:54:00", 320: "0:05:00", 321: "15:12:00", 322: "1:45:00", 323: "4:46:00", 324: "2:01:00", 325: "4:40:00", 326: "7:00:00", 327: "22:24:00", 328: "23:00:00", 329: "20:00:00" }));
players.push(new Player(11, "Why_am_i_here44 ", { 309: "4:23:41", 310: "3:57:04", 311: "5:21:06", 312: "5:12:36", 313: "18:05:52", 314: "3:43:57", 315: "4:38:46", 316: "1:23:55", 317: "1:43:10", 318: "3:18:08", 319: "2:48:12", 320: "9:23:31", 321: "14:55:22", 322: "2:12:47", 323: "3:59:31", 324: "2:01:22", 325: "4:55:23", 326: "6:42:16", 327: "24:52:21", 328: "25:42:51", 329: "26:31:12" }));
players.push(new Player(12, "ogNdrahciR", { 309: "2:45:00", 310: "2:00:00", 311: "4:30:00", 312: "5:00:00", 313: "20:00:00", 314: "1:30:00", 315: "5:30:00", 316: "1:00:00", 317: "2:00:00", 318: "5:00:00", 319: "2:00:00", 320: "8:00:00", 321: "18:00:00", 322: "3:00:00", 323: "3:00:00", 324: "2:00:00", 325: "5:30:00", 326: "4:00:00", 327: "30:00:00", 328: "32:00:00", 329: "20:00:00" }));
players.push(new Player(13, "galaxy178", { 309: "2:00:00", 310: "0:30:00", 311: "5:30:00", 312: "5:20:00", 313: "16:50:00", 314: "3:00:00", 315: "4:00:00", 316: "1:50:00", 317: "1:45:00", 318: "2:55:00", 319: "2:50:00", 320: "1:00:00", 321: "14:00:00", 322: "2:50:00", 323: "5:00:00", 324: "2:15:00", 325: "4:45:00", 326: "7:00:00", 327: "24:00:00", 328: "23:00:00", 329: "2:00:00" }));
players.push(new Player(14, "IllegallySam", { 309: "3:53:12", 310: "0:28:33", 311: "6:01:56", 312: "5:45:31", 313: "18:05:05", 314: "3:18:44", 315: "4:44:44", 316: "0:51:34", 317: "1:41:09", 318: "3:51:23", 319: "2:37:18", 320: "2:48:21", 321: "15:41:23", 322: "3:23:41", 323: "4:56:02", 324: "3:27:41", 325: "4:46:11", 326: "7:38:07", 327: "27:40:10", 328: "25:19:00", 329: "28:10:31" }));
players.push(new Player(15, "TheJewker", { 309: "4:00:00", 310: "0:40:00", 311: "4:45:00", 312: "4:55:00", 313: "15:45:00", 314: "1:30:00", 315: "3:33:00", 316: "0:25:00", 317: "1:40:00", 318: "6:00:00", 319: "2:10:00", 320: "8:20:00", 321: "10:42:00", 322: "4:20:00", 323: "2:45:00", 324: "2:22:00", 325: "4:40:00", 326: "6:00:00", 327: "30:00:00", 328: "26:00:00", 329: "7:00:00" }));
players.push(new Player(16, "Cosmic_Flora", { 309: "3:32:00", 310: "2:12:00", 311: "5:55:00", 312: "5:22:00", 313: "17:46:00", 314: "1:56:00", 315: "2:22:00", 316: "1:48:00", 317: "1:47:00", 318: "3:29:00", 319: "1:57:00", 320: "9:38:00", 321: "15:15:00", 322: "2:37:00", 323: "2:18:00", 324: "1:59:00", 325: "4:34:00", 326: "10:28:00", 327: "29:29:00", 328: "25:25:00", 329: "26:37:00" }));
players.push(new Player(17, "Toadat", { 309: "3:03:03", 310: "2:02:02", 311: "4:44:44", 312: "4:20:00", 313: "18:19:20", 314: "3:13:13", 315: "3:33:33", 316: "1:23:45", 317: "1:40:00", 318: "3:03:03", 319: "2:12:34", 320: "1:23:45", 321: "14:14:14", 322: "2:12:22", 323: "2:34:56", 324: "1:41:09", 325: "4:21:09", 326: "5:43:21", 327: "22:23:24", 328: "24:24:24", 329: "22:22:22" }));
players.push(new Player(18, "wonderj13", { 309: "0:30:00", 310: "0:30:00", 311: "4:00:00", 312: "3:00:00", 313: "14:00:00", 314: "1:05:00", 315: "0:49:59", 316: "0:15:00", 317: "2:00:01", 318: "5:00:00", 319: "1:15:00", 320: "0:25:00", 321: "15:00:01", 322: "2:30:01", 323: "3:30:00", 324: "3:00:01", 325: "3:59:59", 326: "1:05:00", 327: "23:59:59", 328: "16:30:01", 329: "12:30:01" }));
players.push(new Player(19, "palimer6", { 309: "2:52:23", 310: "2:31:21", 311: "4:38:46", 312: "4:54:22", 313: "18:02:20", 314: "2:33:22", 315: "5:07:02", 316: "1:47:35", 317: "1:57:57", 318: "4:05:07", 319: "2:15:10", 320: "3:47:56", 321: "12:57:43", 322: "2:21:02", 323: "2:17:22", 324: "1:50:00", 325: "4:31:27", 326: "5:22:12", 327: "26:02:01", 328: "27:15:08", 329: "21:17:59" }));
players.push(new Player(20, "positiveiona", { 309: "5:42:42", 310: "2:15:00", 311: "3:58:13", 312: "5:05:05", 313: "21:00:12", 314: "3:59:59", 315: "4:04:00", 316: "0:45:45", 317: "2:34:56", 318: "4:40:00", 319: "2:00:00", 320: "3:15:00", 321: "11:12:13", 322: "2:30:00", 323: "3:21:23", 324: "1:40:27", 325: "6:00:00", 326: "7:07:07", 327: "27:08:01", 328: "23:49:00", 329: "30:30:30" }));
players.push(new Player(21, "driabwb ", { 309: "2:30:00", 310: "1:45:00", 311: "7:25:00", 312: "7:35:00", 313: "30:14:00", 314: "2:45:00", 315: "4:45:00", 316: "2:45:00", 317: "2:00:00", 318: "5:27:00", 319: "2:30:00", 320: "2:45:00", 321: "22:25:00", 322: "4:45:00", 323: "7:33:00", 324: "3:13:00", 325: "6:24:00", 326: "7:55:00", 327: "36:12:00", 328: "30:01:00", 329: "32:23:00" }));
players.push(new Player(22, "xenocythe", { 309: "1:59:58", 310: "0:57:34", 311: "4:44:58", 312: "4:01:02", 313: "15:32:38", 314: "4:00:02", 315: "4:35:30", 316: "1:43:35", 317: "1:35:24", 318: "1:54:55", 319: "2:04:20", 320: "1:36:09", 321: "9:30:00", 322: "3:10:02", 323: "2:59:26", 324: "1:59:20", 325: "5:07:19", 326: "6:00:00", 327: "21:30:02", 328: "24:13:37", 329: "29:03:29" }));
players.push(new Player(23, "JoshPrep", { 309: "2:45:35", 310: "45:00:00", 311: "6:10:00", 312: "5:45:00", 313: "17:00:00", 314: "2:25:25", 315: "3:30:15", 316: "1:30:25", 317: "1:05:46", 318: "2:45:15", 319: "2:30:45", 320: "20:00:00", 321: "15:30:15", 322: "2:00:00", 323: "2:45:30", 324: "1:50:15", 325: "3:30:15", 326: "7:00:15", 327: "27:45:30", 328: "25:45:59", 329: "27:00:35" }));
players.push(new Player(24, "FurretTurret", { 309: "3:47:52", 310: "0:27:27", 311: "3:59:59", 312: "3:45:00", 313: "17:34:56", 314: "2:24:00", 315: "2:38:38", 316: "0:39:39", 317: "1:18:00", 318: "2:39:00", 319: "2:02:02", 320: "0:47:47", 321: "11:11:11", 322: "2:34:00", 323: "2:22:22", 324: "2:22:22", 325: "4:19:59", 326: "5:15:15", 327: "27:27:27", 328: "22:22:22", 329: "3:02:42" }));
players.push(new Player(25, "Lan990", { 309: "4:00:00", 310: "2:50:00", 311: "6:00:00", 312: "6:20:00", 313: "19:00:00", 314: "5:10:00", 315: "5:00:00", 316: "2:30:00", 317: "1:00:00", 318: "2:30:00", 319: "2:45:00", 320: "0:30:00", 321: "16:00:00", 322: "1:30:00", 323: "5:00:00", 324: "2:00:00", 325: "5:30:00", 326: "3:00:00", 327: "29:00:00", 328: "25:00:00", 329: "5:00:00" }));
players.push(new Player(26, "WickBRSTM", { 309: "3:09:02", 310: "1:31:42", 311: "5:07:58", 312: "4:48:48", 313: "18:18:17", 314: "1:52:05", 315: "4:29:46", 316: "1:01:29", 317: "1:49:42", 318: "3:28:21", 319: "3:00:01", 320: "4:34:23", 321: "10:32:11", 322: "2:34:17", 323: "3:41:22", 324: "1:39:12", 325: "3:52:30", 326: "7:07:07", 327: "23:13:03", 328: "23:48:59", 329: "20:00:00" }));
players.push(new Player(27, "Asmodemus0", { 309: "1:45:23", 310: "1:23:45", 311: "3:53:10", 312: "4:00:00", 313: "15:25:31", 314: "1:15:04", 315: "3:41:31", 316: "1:58:01", 317: "1:12:12", 318: "2:25:01", 319: "1:51:12", 320: "1:01:01", 321: "8:23:51", 322: "2:51:12", 323: "1:13:44", 324: "1:57:29", 325: "4:30:01", 326: "3:02:38", 327: "20:31:31", 328: "19:41:56", 329: "15:41:11" }));
players.push(new Player(28, "kiYubEE", { 309: "2:15:36", 310: "0:52:48", 311: "4:21:09", 312: "4:44:44", 313: "19:06:09", 314: "1:37:10", 315: "1:10:37", 316: "0:57:34", 317: "1:47:22", 318: "3:33:33", 319: "2:39:57", 320: "7:53:09", 321: "8:00:08", 322: "2:55:43", 323: "3:07:07", 324: "1:39:04", 325: "4:44:44", 326: "3:33:33", 327: "27:27:27", 328: "25:12:25", 329: "26:52:21" }));

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
    let slices = [];
    let sliceStart = 0;
    while (sliceStart < UPCOMING_GAMES.length) {
        slices.push(UPCOMING_GAMES.slice(sliceStart, sliceStart + chosenSize));
        sliceStart += chosenSize;
    }
    for (const slice of slices) {
        let timeRow = '<div class="row">';
        let titleRow = '<div class="row">';
        let rangeRow = '<div class="row">';
        for (const gameNumber of slice) {
            timeRow = `${timeRow}
                <div class="col-${gridColSize}">
                    <span id="time${gameNumber}"></span>
                </div>`;
            titleRow = `${titleRow}
                <div class="col-${gridColSize}">
                    <label for="range${gameNumber}" class="form-label">#${gameNumber} - ${GAMES[gameNumber]}</label>
                </div>`;
            rangeRow = `${rangeRow}
                <div class="col-${gridColSize}">
                    <input type="range" class="form-range time-range" id="range${gameNumber}" list="list${gameNumber}" data-game="${gameNumber}">
                    <datalist id="list${gameNumber}"></datalist>
                </div>`;
        }
        timeRow = `${timeRow}</div>`;
        titleRow = `${titleRow}</div>`;
        rangeRow = `${rangeRow}</div>`;
        $('#gameRanges').append(timeRow + titleRow + rangeRow);
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
        gameHeaders = `${gameHeaders}<th class="header-${gameNumber}" colspan="2">#${gameNumber} - ${GAMES[gameNumber]}</th>`;
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
            <td class="cell-total text-end">00:00:00</td>
            <td class="cell-to-next text-end"></td>
            <td class="cell-current text-end" data-seconds="${player.currentScore}">${secondsToTime(player.currentScore)}</td>`;
    let rowGames = '';
    for (const gameNumber of UPCOMING_GAMES) {
        rowGames = `${rowGames}
            <td class="cell-guess-${gameNumber} text-end">${player.guesses[gameNumber]}</td>
            <td class="cell-game-${gameNumber} text-end">0:00:00</td>`;
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
 * Takes the values in the min and max attributes of the range corresponding to the given game number and calculates the average of the two.
 * @param {number} gameNumber
 * @returns {number} The average of the min and max attributes of the range corresponding to the given game number.
 */
function getRangeMiddle(gameNumber) {
    let min = Number($(`#range${gameNumber}`).attr('min'));
    let max = Number($(`#range${gameNumber}`).attr('max'));
    return Math.round((min + max) / 2);
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
 * Also clears the current contents of {@link duplicateRanks} and adds all duplicate ranks to it.
 * @param {string} checkClass The class of the td tag which should have its data-seconds attribute be used for duplicate score checking. 'cell-total' is used in case nothing is given.
 */
function updateRanks(checkClass = 'cell-total') {
    duplicateRanks.clear();
    let i = 1;
    let sameCount = 0;
    let lastTotal = 0;
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
    for (const player of players) {
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

$(document).ready(function () {
    // UI Creation
    createRanges();
    createGameHeaders();
    for (const player of players) {
        for (const gameNumber of UPCOMING_GAMES) {
            updateMin(player, gameNumber);
            updateMax(player, gameNumber);
            addMarker(player, gameNumber);
        }
        createPlayerRow(player);
    }
    //    $('#range325').val(13950).trigger('input');
    //    $('#range328').val(80650).trigger('input');
    //    $('#range329').val(42755).trigger('input');
    for (const gameNumber of UPCOMING_GAMES) {
        $(`#range${gameNumber}`).val(getRangeMiddle(gameNumber));
    }
    sortTable('cell-current');
    updateRanks('cell-current');
    checkDuplicateRanks();

    // UI Updates
    /**
     * Whether no input has been taken thus far.
     * @type {boolean}
     */
    let firstInput = true;

    /**
     * Updates labels, scores, and totals for every game if {@link firstInput} is true.
     */
    $('.time-range').on('input', function () {
        if (firstInput) {
            firstInput = false;
            for (let gameNumber of UPCOMING_GAMES) {
                updateLabel(gameNumber);
                updateScores(gameNumber);
            }
            updateTotals();
        }
    });

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
     * Sets the range values of all games to the guesses of this row's player.
     */
    $('tr.player-row td.cell-set .set-button').on('click', function (e) {
        e.stopPropagation();
        let entryNumber = Number($(this).parent().parent().attr('data-player'));
        for (const player of players) {
            if (player.entryNumber === entryNumber) {
                for (const gameNumber of UPCOMING_GAMES) {
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
    $('tr.player-row td').on('click', function () {
        let isHighlighted = $(this).parent().hasClass('highlighted');
        if (isHighlighted) {
            $(this).parent().removeClass('highlighted');
        } else {
            $(this).parent().addClass('highlighted');
        }
    });
});