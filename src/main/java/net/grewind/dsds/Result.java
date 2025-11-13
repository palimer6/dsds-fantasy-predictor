package net.grewind.dsds;

import java.util.SortedSet;

public class Result {
    private final SortedSet<FormEntry> standings;

    public Result(SortedSet<FormEntry> standings) {
        this.standings = standings;
    }

    public SortedSet<FormEntry> getStandings() {
        return standings;
    }

    public String getWinner() {
        return this.standings.getFirst().getUsername();
    }
}
