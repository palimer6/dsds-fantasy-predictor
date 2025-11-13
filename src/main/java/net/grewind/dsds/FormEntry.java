package net.grewind.dsds;

import java.util.Map;

public class FormEntry implements Comparable<FormEntry> {
    private final int entryNumber;
    private final String username;
    private final Map<Game, Long> guesses;
    private long difference;

    public FormEntry(int entryNumber, String username, Map<Game, Long> guesses) {
        this.entryNumber = entryNumber;
        this.username = username;
        this.guesses = guesses;
    }

    public int getEntryNumber() {
        return entryNumber;
    }

    public String getUsername() {
        return username;
    }

    public Map<Game, Long> getGuesses() {
        return guesses;
    }

    public long getDifference() {
        return difference;
    }

    public void setDifference(long difference) {
        this.difference = difference;
    }

    @Override
    public String toString() {
        return "FormEntry{" +
                "entryNumber=" + entryNumber +
                ", username='" + username + '\'' +
                ", guesses=" + guesses +
                ", difference=" + difference +
                '}';
    }

    @Override
    public int compareTo(FormEntry o) {
        int standing = Long.compare(this.difference, o.difference);
        if (standing != 0) {
            return standing;
        }
        return Integer.compare(this.entryNumber, o.entryNumber);
    }
}
