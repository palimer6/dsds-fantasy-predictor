package net.grewind.dsds.manual;

import net.grewind.dsds.GameTime;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public class InitializeUserGuesses {
    public static List<UserGuess> initialize() {
        String content;
        try {
            content = Files.readString(Path.of("sheet-copy.txt"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        List<UserGuess> userGuesses = new ArrayList<>();
        List<String> lines = content.lines().toList();
        for (int i = 2; i < lines.size(); i++) {
            String line = lines.get(i);
            String[] cells = line.split("\t", -1);
            int entryNumber = Integer.parseInt(cells[0]);
            String userName = cells[2];
            long current = GameTime.parseTime(cells[4]);
            long guess1 = 0, guess2 = 0, guess3 = 0, guess4 = 0, guess5 = 0;
            for (int j = 37; j < cells.length; j += 2) {
                if (j == 37) {
                    guess1 = GameTime.parseTime(cells[j]);
                } else if (j == 39) {
                    guess2 = GameTime.parseTime(cells[j]);
                } else if (j == 41) {
                    guess3 = GameTime.parseTime(cells[j]);
                } else if (j == 43) {
                    guess4 = GameTime.parseTime(cells[j]);
                } else if (j == 45) {
                    guess5 = GameTime.parseTime(cells[j]);
                }
            }
            UserGuess userGuess = new UserGuess(entryNumber, userName, current, guess1, guess2, guess3, guess4, guess5);
            userGuesses.add(userGuess);
        }
        return userGuesses;
    }
}
