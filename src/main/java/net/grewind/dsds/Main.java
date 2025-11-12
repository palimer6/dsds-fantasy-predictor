package net.grewind.dsds;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class Main {
    public static void main(String[] args) {
        FormEntry shasta = getOfficialTimes();
        List<FormEntry> guesses = getGuesses();
        Set<Game> exclude = shasta.getGuesses().keySet();
        Map<Game, Long> maxCalculationTimes = getMaxCalculationTimes(guesses, exclude);



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
        Map<Game, Long> maxCalculationTimes = new HashMap<>();
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
            maxCalculationTimes.put(game, (long) (maxCalculationTimes.get(game) * 1.5));
        }
        return maxCalculationTimes;
    }


}