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
            long guess325 = 0, guess2 = 0, guess3 = 0, guess328 = 0, guess329 = 0;
            for (int j = 37; j < cells.length; j += 2) {
                if (j == 37) {
                    guess325 = GameTime.parseTime(cells[j]);
                } else if (j == 43) {
                    guess328 = GameTime.parseTime(cells[j]);
                } else if (j == 45) {
                    guess329 = GameTime.parseTime(cells[j]);
                }
            }
            UserGuess userGuess = new UserGuess(entryNumber, userName, current, guess325, guess328, guess329);
            userGuesses.add(userGuess);
        }
        return userGuesses;
    }
}
