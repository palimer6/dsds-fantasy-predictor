package net.grewind.dsds;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Set;
import java.util.StringJoiner;

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
}
