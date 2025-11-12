package net.grewind.dsds;

import java.util.List;
import java.util.Map;

public class Result {
    private final Map<FormEntry, Long> standings;
    private final List<String> ranking;

    public Result(Map<FormEntry, Long> standings, List<String> ranking) {
        this.standings = standings;
        this.ranking = ranking;
    }

    public Map<FormEntry, Long> getStandings() {
        return standings;
    }

    public List<String> getRanking() {
        return ranking;
    }
}
