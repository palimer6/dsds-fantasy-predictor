package net.grewind.dsds.manual;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class DrawImage {
    public static void main(String[] args) {
        List<UserGuess> userGuesses = InitializeUserGuesses.initialize();
        Map<WinnerName, List<WinningTimes>> winners = new HashMap<>();
        Map<Set<String>, Long> winnerCounts = new HashMap<>();
        Map<WinnerName, List<Map.Entry<Long, Long>>> winningSegments = new HashMap<>();
        long fullCount = 0;
        WinnerName lastWinner = null;

        long min1 = userGuesses.stream().mapToLong(UserGuess::getGuess325).min().getAsLong();
        long min2 = userGuesses.stream().mapToLong(UserGuess::getGuess329).min().getAsLong();

        long max1 = userGuesses.stream().mapToLong(UserGuess::getGuess325).max().getAsLong();
        long max2 = userGuesses.stream().mapToLong(UserGuess::getGuess329).max().getAsLong();

        long span1 = ((max1 + 1) - min1);
        long span2 = ((max2 + 1) - min2);

        BufferedImage image = new BufferedImage((int) span1, (int) span2, BufferedImage.TYPE_INT_ARGB);

        for (int i1 = 0; i1 < span1; i1++) {
            long g1 = min1 + i1;
            for (int i2 = 0; i2 < span2; i2++) {
                long g2 = min2 + i2;
                WinnerName winnerSet = new WinnerName();
                for (UserGuess userGuess : userGuesses) {
                    long currentBest = Long.MAX_VALUE;
                    long difference = userGuess.getCurrentDifference() +
                            Math.abs(g1 - userGuess.getGuess325()) +
                            Math.abs(g2 - userGuess.getGuess329());
                    if (currentBest > difference) {
                        currentBest = difference;
                        winnerSet.clear();
                        winnerSet.add(userGuess.getUserName());
                    } else if (currentBest == difference) {
                        winnerSet.add(userGuess.getUserName());
                    }
                }

                int color = switch (winnerSet.toString()) {
                    case "zambrini213" -> 0x800000;
                    case "palimer6" -> 0x9a6324;
                    case "IllegallySam" -> 0x808000;
                    case "galaxy178" -> 0x469990;
                    case "teddyras" -> 0x000075;
                    case "ECGreem" -> 0xe6194b;
                    case "positiveiona" -> 0xf58231;
                    case "Awe / awestrikernova" -> 0xffe119;
                    case "WickBRSTM" -> 0xbfef45;
                    case "driabwb " -> 0x3cb44b;
                    case "Naked_Tonberry" -> 0x42d4f4;
                    default -> throw new IllegalArgumentException();
                };
                image.setRGB(i1, i2, color);
            }
        }
        System.out.println();
    }
}
