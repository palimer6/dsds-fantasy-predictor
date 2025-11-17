package net.grewind.dsds.manual;

import java.util.HashSet;
import java.util.StringJoiner;

public class WinnerName extends HashSet<String> {
    @Override
    public String toString() {
        StringJoiner joiner = new StringJoiner(";","[","]");
        this.forEach(joiner::add);
        return joiner.toString();
    }
}
