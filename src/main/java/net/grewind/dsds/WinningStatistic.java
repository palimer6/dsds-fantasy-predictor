package net.grewind.dsds;

import java.util.Map;
import java.util.StringJoiner;
import java.util.TreeMap;

public class WinningStatistic {

    private final String winner;
    private final Map<Game, Long> min = new TreeMap<>();
    private final Map<Game, Long> max = new TreeMap<>();

    public WinningStatistic(String winner, Map<Game, Long> checks) {
        this.winner = winner;
        checks.forEach((game, aLong) -> {
            min.put(game, aLong);
            max.put(game, aLong);
        });
    }

    public String getWinner() {
        return winner;
    }

    public Map<Game, Long> getMin() {
        return min;
    }

    public Map<Game, Long> getMax() {
        return max;
    }

    @Override
    public String toString() {
        StringJoiner joiner = new StringJoiner(",");
        min.keySet().forEach(game -> joiner.add(game.getNumber() + " " + min.get(game) + "-" + max.get(game)));
        return "winner: " + winner + ";" + joiner;
    }

}
