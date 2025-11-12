package net.grewind.dsds;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.function.Predicate;

public class SaveUtil {
    public static void saveProgress(List<WinningStatistic> winningStatistics) {
        StringJoiner lineJoiner = new StringJoiner("\n");
        StringJoiner headerJoiner = new StringJoiner(";");
        headerJoiner.add("winner");
        Set<Game> games = winningStatistics.getFirst().getMin().keySet();
        for (Game game : games) {
            headerJoiner.add(String.valueOf(game.getNumber()));
        }
        lineJoiner.add(headerJoiner.toString());

        for (WinningStatistic winningStatistic : winningStatistics) {
            StringJoiner rowJoiner = new StringJoiner(";");
            rowJoiner.add(winningStatistic.getWinner());
            for (Game game : games) {
                String minMaxString = winningStatistic.getMin().get(game) + "-" + winningStatistic.getMax().get(game);
                rowJoiner.add(minMaxString);
            }
            lineJoiner.add(rowJoiner.toString());
        }
        try {
            Files.writeString(Path.of("results.csv"), lineJoiner.toString());
        } catch (IOException e) {
            String content = lineJoiner.toString();
            System.out.println(content);
            throw new RuntimeException(e);
        }
    }

    public static List<WinningStatistic> loadProgress(Set<Game> games) {
        String content;
        try {
            content = Files.readString(Path.of("results.csv"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        List<String> lines = content.lines().toList();
        Map<Integer, Game> gameIndices = new TreeMap<>();
        String[] headerCells = lines.get(0).split(";", -1);
        for (int i = 1; i < headerCells.length; i++) {
            int gameNumber = Integer.parseInt(headerCells[i]);
            Game game = games.stream().filter(game1 -> game1.getNumber() == gameNumber).findAny().get();
            gameIndices.put(i, game);
        }
        List<WinningStatistic> winningStatistics = new ArrayList<>();
        for (int i = 1; i < lines.size(); i++) {
            String line = lines.get(i);
            String[] cells = line.split(";", -1);
            String winner = cells[0];
            Map<Game, Long> min = new TreeMap<>();
            Map<Game, Long> max = new TreeMap<>();
            for (int j = 1; j < cells.length; j++) {
                String[] extremes = cells[j].split("-", -1);
                min.put(gameIndices.get(j), Long.valueOf(extremes[0]));
                max.put(gameIndices.get(j), Long.valueOf(extremes[1]));
            }
            WinningStatistic winningStatistic = new WinningStatistic(winner, min, max);
            winningStatistics.add(winningStatistic);
        }
        return winningStatistics;
    }
}
