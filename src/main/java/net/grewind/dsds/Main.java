package net.grewind.dsds;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class Main {
    private static final double MAX_CALC_MODIFIER = 1;
    private static final double MIN_CALC_MODIFIER = 1;

    public static void main(String[] args) {
        FormEntry shasta = getOfficialTimes();
        List<FormEntry> guesses = getGuesses();
        Set<Game> exclude = shasta.getGuesses().keySet();
        Map<Game, Long> maxCalculationTimes = getMaxCalculationTimes(guesses, exclude);
        Map<Game, Long> minCalculationTimes = getMinCalculationTimes(guesses, exclude);
        List<WinningStatistic> winningStatistics = new ArrayList<>();

        Game game325 = maxCalculationTimes.keySet().stream().filter(game -> game.getNumber() == 325).findFirst().get();
        Game game326 = maxCalculationTimes.keySet().stream().filter(game -> game.getNumber() == 326).findFirst().get();
        Game game327 = maxCalculationTimes.keySet().stream().filter(game -> game.getNumber() == 327).findFirst().get();
        Game game328 = maxCalculationTimes.keySet().stream().filter(game -> game.getNumber() == 328).findFirst().get();
        Game game329 = maxCalculationTimes.keySet().stream().filter(game -> game.getNumber() == 329).findFirst().get();

        long max325 = maxCalculationTimes.get(game325);
        long max326 = maxCalculationTimes.get(game326);
        long max327 = maxCalculationTimes.get(game327);
        long max328 = maxCalculationTimes.get(game328);
        long max329 = maxCalculationTimes.get(game329);

        for (long g329 = minCalculationTimes.get(game329); g329 < max329; g329++) {
            printStuff(329, g329, max329, 1);
            for (long g328 = minCalculationTimes.get(game328); g328 < max328; g328++) {
                printStuff(328, g328, max328, 1);
                for (long g327 = 60437; g327 < max327; g327++) {
                    printStuff(327, g327, max327, 1);
                    for (long g326 = minCalculationTimes.get(game326); g326 < max326; g326++) {
                        printStuff(326, g326, max326, 10);
                        for (long g325 = minCalculationTimes.get(game325); g325 < max325; g325++) {
                            Map<Game, Long> officialResults = new LinkedHashMap<>(shasta.getGuesses());
                            Map<Game, Long> checks = Map.of(game325, g325, game326, g326, game327, g327, game328, g328, game329, g329);
                            officialResults.putAll(checks);


                            Result result = getResult(guesses, new FormEntry(-1, "Calc", officialResults));
                            String winner = result.getRanking().get(0);

                            boolean addNew = true;
                            for (WinningStatistic winningStatistic : winningStatistics) {
                                if (!winningStatistic.getWinner().equals(winner)) {
                                    continue;
                                }
                                boolean closeToBounds = true;
                                int oneOffs = 0;
                                Game oneOffGame = null;
                                String oneOffResult = null;
                                int validCount = 0;
//                                if (g325 == 1 && g326 == 1) {
//                                    debug();
//                                }
                                for (Game game : checks.keySet()) {
                                    long min = winningStatistic.getMin().get(game);
                                    long max = winningStatistic.getMax().get(game);
                                    long gameTime = checks.get(game);
                                    if (min - gameTime > 1 || max - gameTime < -1) {
                                        closeToBounds = false;
                                        break;
                                    } else if (min <= gameTime && max >= gameTime) {
                                        validCount++;
                                        continue;
                                    } else if (min - gameTime == 1) {
                                        oneOffs++;
                                        oneOffGame = game;
                                        oneOffResult = "min";
//                                        validCount++;
                                    } else if (max - gameTime == -1) {
                                        oneOffs++;
                                        oneOffGame = game;
                                        oneOffResult = "max";
//                                        validCount++;
                                    }
                                    if (oneOffs > 1) {
                                        break;
                                    }
                                }
                                if (!closeToBounds || oneOffs > 1) {
                                    continue;
                                } else if (oneOffs == 1) {
                                    if ("min".equals(oneOffResult)) {
                                        winningStatistic.getMin().put(oneOffGame, checks.get(oneOffGame));
                                        addNew = false;
                                        break;
                                    } else if ("max".equals(oneOffResult)) {
                                        winningStatistic.getMax().put(oneOffGame, checks.get(oneOffGame));
                                        addNew = false;
                                        break;
                                    }
                                } else if (validCount == 5) {
                                    addNew = false;
                                } else {
                                    debug();
                                }
                            }
                            if (addNew) {
                                winningStatistics.add(new WinningStatistic(winner, checks));
                            } else {
                                debug();
                            }
                            boolean endHere = false;
                            if (endHere) {
                                SaveUtil.saveProgress(winningStatistics);
                            }

                            debug();
                        }
                    }
                }
            }
        }


        Map<FormEntry, Long> standings = new HashMap<>();
        for (FormEntry guess : guesses) {
            guess.getGuesses().forEach((game, gameTime) -> {
                Long official = shasta.getGuesses().get(game);
                if (official == null) {
                    return;
                }
                long abs = Math.abs(gameTime - official);
                standings.merge(guess, abs, Long::sum);
            });
        }
        Map<FormEntry, Long> standingsCopy = new HashMap<>(standings);
        List<String> ranking = new ArrayList<>();
        while (!standingsCopy.isEmpty()) {
            Map.Entry<FormEntry, Long> best = standingsCopy.entrySet().stream()
                    .reduce((e1, e2) -> e1.getValue() < e2.getValue() ? e1 : e2).get();
            ranking.add(best.getKey().getUsername());
            standingsCopy.remove(best.getKey());
        }
        System.out.println();
    }

    private static FormEntry getOfficialTimes() {
        String content;
        try {
            content = Files.readString(Path.of("sheet-copy.txt"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        List<String> lines = content.lines().toList();
        String shastaLine = lines.get(0);
        String headersLine = lines.get(1);
        String[] headers = headersLine.split("\t", -1);
        String[] shastas = shastaLine.split("\t", -1);
        List<Game> games = new ArrayList<>();
        Map<Game, Long> shastaTimes = new LinkedHashMap<>();

        for (int i = 5; i < headers.length; i += 2) {
            String gameString = headers[i];
            Pattern pattern = Pattern.compile("^#(\\d{3}) - (.*?)$");
            Matcher matcher = pattern.matcher(gameString);
            if (!matcher.find()) throw new IllegalStateException();
            Game game = new Game(Integer.parseInt(matcher.group(1)), matcher.group(2));
            games.add(game);

            if (i > shastas.length) {
                continue;
            }
            String timeString = shastas[i];
            shastaTimes.put(game, GameTime.parseTime(timeString));
        }

        return new FormEntry(0, "Mr_Shasta", shastaTimes);
    }

    private static List<FormEntry> getGuesses() {
        String content;
        try {
            content = Files.readString(Path.of("sheet-copy.txt"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        List<String> lines = content.lines().toList();
        String headersLine = lines.get(1);
        String[] headers = headersLine.split("\t", -1);
        List<Game> games = new ArrayList<>();

        for (int i = 5; i < headers.length; i += 2) {
            String gameString = headers[i];
            Pattern pattern = Pattern.compile("^#(\\d{3}) - (.*?)$");
            Matcher matcher = pattern.matcher(gameString);
            if (!matcher.find()) throw new IllegalStateException();
            Game game = new Game(Integer.parseInt(matcher.group(1)), matcher.group(2));
            games.add(game);
        }


        List<FormEntry> entries = new ArrayList<>();

        for (int i = 2; i < lines.size(); i++) {
            Map<Game, Long> guesses = new LinkedHashMap<>();

            int gameCounter = 0;
            String line = lines.get(i);
            String[] cells = line.split("\t", -1);
            int entryNumber = Integer.parseInt(cells[0]);
            String username = cells[2];
            for (int j = 5; j < cells.length; j += 2) {
                guesses.put(games.get(gameCounter), GameTime.parseTime(cells[j]));
                gameCounter++;
            }

            entries.add(new FormEntry(entryNumber, username, guesses));
        }

        return entries;
    }

    private static Map<Game, Long> getMaxCalculationTimes(List<FormEntry> entries, Collection<Game> exclude) {
        Map<Game, Long> maxCalculationTimes = new TreeMap<>();
        for (FormEntry guess : entries) {
            Map<Game, Long> guesses = guess.getGuesses();
            for (Game game : guesses.keySet()) {
                if (exclude.contains(game)) {
                    continue;
                }
                if (maxCalculationTimes.containsKey(game)) {
                    if (maxCalculationTimes.get(game) < guesses.get(game)) {
                        maxCalculationTimes.put(game, guesses.get(game));
                    }
                } else {
                    maxCalculationTimes.put(game, guesses.get(game));
                }
            }
        }
        for (Game game : maxCalculationTimes.keySet()) {
            maxCalculationTimes.put(game, (long) (maxCalculationTimes.get(game) * MAX_CALC_MODIFIER));
        }
        return maxCalculationTimes;
    }

    private static Map<Game, Long> getMinCalculationTimes(List<FormEntry> entries, Collection<Game> exclude) {
        Map<Game, Long> minCalculationTimes = new TreeMap<>();
        for (FormEntry guess : entries) {
            Map<Game, Long> guesses = guess.getGuesses();
            for (Game game : guesses.keySet()) {
                if (exclude.contains(game)) {
                    continue;
                }
                if (minCalculationTimes.containsKey(game)) {
                    if (minCalculationTimes.get(game) > guesses.get(game)) {
                        minCalculationTimes.put(game, guesses.get(game));
                    }
                } else {
                    minCalculationTimes.put(game, guesses.get(game));
                }
            }
        }
        for (Game game : minCalculationTimes.keySet()) {
            minCalculationTimes.put(game, (long) (minCalculationTimes.get(game) * MIN_CALC_MODIFIER));
        }
        return minCalculationTimes;
    }

    private static Result getResult(List<FormEntry> entries, FormEntry officialEntry) {
        Map<FormEntry, Long> standings = new HashMap<>();
        for (FormEntry entry : entries) {
            entry.getGuesses().forEach((game, gameTime) -> {
                Long official = officialEntry.getGuesses().get(game);
                if (official == null) {
                    return;
                }
                long abs = Math.abs(gameTime - official);
                standings.merge(entry, abs, Long::sum);
            });
        }
        Map<FormEntry, Long> standingsCopy = new HashMap<>(standings);
        List<String> ranking = new ArrayList<>();
        while (!standingsCopy.isEmpty()) {
            Map.Entry<FormEntry, Long> best = standingsCopy.entrySet().stream()
                    .reduce((e1, e2) -> e1.getValue() < e2.getValue() ? e1 : e2).get();
            ranking.add(best.getKey().getUsername());
            standingsCopy.remove(best.getKey());
        }

        return new Result(standings, ranking);
    }

    private static void printStuff(int num, long current, long max, int gap) {
        if (current % gap == 0) {
            System.out.println(num + " " + GameTime.secondsToHours(current) + "/" + GameTime.secondsToHours(max) + " " + (current * 100) / max + "%");
        }
    }

    private static void debug() {

    }
}