package net.grewind.dsds.manual;

import net.grewind.dsds.GameTime;

import java.util.*;
import java.util.concurrent.TimeUnit;

public class ManualMain {
    private static final long SECOND_GAP = TimeUnit.MINUTES.toSeconds(30);

    public static void main(String[] args) {
        List<UserGuess> userGuesses = InitializeUserGuesses.initialize();
        Map<WinnerName, List<WinningTimes>> winners = new HashMap<>();
        Map<Set<String>, Long> winnerCounts = new HashMap<>();

        long min1 = userGuesses.stream().mapToLong(UserGuess::getGuess1).min().getAsLong();
        min1 = min1 - min1 % SECOND_GAP;
        long min2 = userGuesses.stream().mapToLong(UserGuess::getGuess2).min().getAsLong();
        min2 = min2 - min2 % SECOND_GAP;
        long min3 = userGuesses.stream().mapToLong(UserGuess::getGuess3).min().getAsLong();
        min3 = min3 - min3 % SECOND_GAP;
        long min4 = userGuesses.stream().mapToLong(UserGuess::getGuess4).min().getAsLong();
        min4 = min4 - min4 % SECOND_GAP;
        long min5 = userGuesses.stream().mapToLong(UserGuess::getGuess5).min().getAsLong();
        min5 = min5 - min5 % SECOND_GAP;

        long max1 = userGuesses.stream().mapToLong(UserGuess::getGuess1).max().getAsLong();
        max1 = max1 - max1 % SECOND_GAP + SECOND_GAP;
        long max2 = userGuesses.stream().mapToLong(UserGuess::getGuess2).max().getAsLong();
        max2 = max2 - max2 % SECOND_GAP + SECOND_GAP;
        long max3 = userGuesses.stream().mapToLong(UserGuess::getGuess3).max().getAsLong();
        max3 = max3 - max3 % SECOND_GAP + SECOND_GAP;
        long max4 = userGuesses.stream().mapToLong(UserGuess::getGuess4).max().getAsLong();
        max4 = max4 - max4 % SECOND_GAP + SECOND_GAP;
        long max5 = userGuesses.stream().mapToLong(UserGuess::getGuess5).max().getAsLong();
        max5 = max5 - max5 % SECOND_GAP + SECOND_GAP;

        for (long g5 = min5; g5 <= max5; g5 += SECOND_GAP) {
            printStuff(5, g5, min5, max5, SECOND_GAP);
            for (long g4 = min4; g4 <= max4; g4 += SECOND_GAP) {
//                printStuff(4, g4,min4, max4, SECOND_GAP);
                for (long g3 = min3; g3 <= max3; g3 += SECOND_GAP) {
//                    printStuff(3, g3,min4, max3, SECOND_GAP * 10);
                    for (long g2 = min2; g2 <= max2; g2 += SECOND_GAP) {
//                        printStuff(2, g2,min2, max2, SECOND_GAP * 100);
//                        System.out.println(g2 + "/" + max2);
                        for (long g1 = min1; g1 <= max1; g1 += SECOND_GAP) {
                            long currentBest = Long.MAX_VALUE;
                            WinnerName winnerSet = new WinnerName();
                            for (UserGuess userGuess : userGuesses) {
                                long difference = userGuess.getCurrentDifference() +
                                        Math.abs(g1 - userGuess.getGuess1()) +
                                        Math.abs(g2 - userGuess.getGuess2()) +
                                        Math.abs(g3 - userGuess.getGuess3()) +
                                        Math.abs(g4 - userGuess.getGuess4()) +
                                        Math.abs(g5 - userGuess.getGuess5());
                                if (currentBest > difference) {
                                    currentBest = difference;
                                    winnerSet.clear();
                                    winnerSet.add(userGuess.getUserName());
                                } else if (currentBest == difference) {
                                    winnerSet.add(userGuess.getUserName());
                                }
                            }

                            if (winnerCounts.containsKey(winnerSet)) {
                                winnerCounts.put(winnerSet, winnerCounts.get(winnerSet) + 1);
                            } else {
                                winnerCounts.put(winnerSet, 1L);
//                                System.out.println("New winner: " + winnerSet);
                            }

                            if (winners.containsKey(winnerSet)) {
                                winners.get(winnerSet).add(new WinningTimes(g1, g2, g3, g4, g5));
                            } else {
                                List<WinningTimes> list = new ArrayList<>();
                                list.add(new WinningTimes(g1, g2, g3, g4, g5));
                                winners.put(winnerSet, list);
                                System.out.println("New winner: " + winnerSet);
                            }
                        }
                    }
                }
            }
        }

        System.out.println();
    }

    private static long lastPrint = System.currentTimeMillis();

    private static void printStuff(int num, long current, long min, long max, long gap) {
        if (current % gap == 0) {
            long now = System.currentTimeMillis();
            System.out.println(num + " " + current + "/" + max + " " + GameTime.secondsToHours(current) + "/" + GameTime.secondsToHours(max) + " " + ((current - min) * 100) / (max - min) + "% (" + (now - lastPrint) + "ms)");
            lastPrint = now;
        }
    }
}
