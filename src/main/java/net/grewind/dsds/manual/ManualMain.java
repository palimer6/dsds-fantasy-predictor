package net.grewind.dsds.manual;

import net.grewind.dsds.GameTime;

import java.util.*;

public class ManualMain {
    public static void main(String[] args) {
        List<UserGuess> userGuesses = InitializeUserGuesses.initialize();
        Map<Set<String>, List<List<Long>>> winners = new HashMap<>();
        Map<Set<String>, Long> winnerCounts = new HashMap<>();

        long min1 = userGuesses.stream().mapToLong(UserGuess::getGuess1).min().getAsLong();
        long min2 = userGuesses.stream().mapToLong(UserGuess::getGuess2).min().getAsLong();
        long min3 = userGuesses.stream().mapToLong(UserGuess::getGuess3).min().getAsLong();
        long min4 = userGuesses.stream().mapToLong(UserGuess::getGuess4).min().getAsLong();
        long min5 = userGuesses.stream().mapToLong(UserGuess::getGuess5).min().getAsLong();

        long max1 = userGuesses.stream().mapToLong(UserGuess::getGuess1).max().getAsLong();
        long max2 = userGuesses.stream().mapToLong(UserGuess::getGuess2).max().getAsLong();
        long max3 = userGuesses.stream().mapToLong(UserGuess::getGuess3).max().getAsLong();
        long max4 = userGuesses.stream().mapToLong(UserGuess::getGuess4).max().getAsLong();
        long max5 = userGuesses.stream().mapToLong(UserGuess::getGuess5).max().getAsLong();

        for (long g5 = min5; g5 <= max5; g5++) {
            printStuff(5, g5, max5, 1);
            for (long g4 = min4; g4 <= max4; g4++) {
                printStuff(4, g4, max4, 1);
                for (long g3 = min3; g3 <= max3; g3++) {
                    printStuff(3, g3, max3, 1);
                    for (long g2 = min2; g2 <= max2; g2++) {
                        printStuff(2, g2, max2, 100);
//                        System.out.println(g2 + "/" + max2);
                        for (long g1 = min1; g1 <= max1; g1++) {
                            long currentBest = Long.MAX_VALUE;
                            Set<String> winnerSet = new HashSet<>();
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
                                System.out.println("New winner: " + winnerSet);
                            }

//                            if (winners.containsKey(winnerSet)) {
//                                winners.get(winnerSet).add(List.of(g1, g2, g3, g4, g5));
//                            } else {
//                                List<List<Long>> list = new ArrayList<>();
//                                list.add(List.of(g1, g2, g3, g4, g5));
//                                winners.put(winnerSet, list);
//                                System.out.println("New winner: " + winnerSet);
//                            }
                        }
                    }
                }
            }
        }

        System.out.println();
    }

    private static long lastPrint = System.currentTimeMillis();
    private static void printStuff(int num, long current, long max, int gap) {
        if (current % gap == 0) {
            long now = System.currentTimeMillis();
            System.out.println(num + " " + current + "/" + max + " " + GameTime.secondsToHours(current) + "/" + GameTime.secondsToHours(max) + " " + (current * 100) / max + "% (" + (now - lastPrint) + "ms)");
            lastPrint = now;
        }
    }
}
