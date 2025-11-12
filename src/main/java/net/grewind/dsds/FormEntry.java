package net.grewind.dsds;

import java.util.Map;

public class FormEntry {
    private final int entryNumber;
    private final String username;
    private final Map<Game, Long> guesses;

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

    @Override
    public String toString() {
        return "FormEntry{" +
                "entryNumber=" + entryNumber +
                ", username='" + username + '\'' +
                '}';
    }
}
