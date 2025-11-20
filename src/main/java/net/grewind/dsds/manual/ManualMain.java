package net.grewind.dsds.manual;

import net.grewind.dsds.GameTime;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.TimeUnit;

public class ManualMain {
    private static final long SECOND_GAP = TimeUnit.SECONDS.toSeconds(1);

    public static void main(String[] args) {
        List<UserGuess> userGuesses = InitializeUserGuesses.initialize();
//        Map<WinnerName, List<WinningTimes>> winners = new HashMap<>();
//        Map<Set<String>, Long> winnerCounts = new HashMap<>();
//        Map<WinnerName, List<Map.Entry<Long, Long>>> winningSegments = new HashMap<>();
        Map<Integer, List<Map.Entry<Long, Long>>> binaryWinnerSegments = new HashMap<>();
//        Set<WinnerName> winnerNames = new HashSet<>();
        long fullCount = 0;
        int lastWinner = 0;

        long min325 = userGuesses.stream().mapToLong(UserGuess::getGuess325).min().getAsLong();
        min325 = min325 - min325 % SECOND_GAP;
        long min328 = userGuesses.stream().mapToLong(UserGuess::getGuess328).min().getAsLong();
        min328 = min328 - min328 % SECOND_GAP;
        long min329 = userGuesses.stream().mapToLong(UserGuess::getGuess329).min().getAsLong();
        min329 = min329 - min329 % SECOND_GAP;

        long max325 = userGuesses.stream().mapToLong(UserGuess::getGuess325).max().getAsLong();
        max325 = max325 - max325 % SECOND_GAP + SECOND_GAP;
        long max328 = userGuesses.stream().mapToLong(UserGuess::getGuess328).max().getAsLong();
        max328 = max328 - max328 % SECOND_GAP + SECOND_GAP;
        long max329 = userGuesses.stream().mapToLong(UserGuess::getGuess329).max().getAsLong();
        max329 = max329 - max329 % SECOND_GAP + SECOND_GAP;

        long span325 = ((max325 + SECOND_GAP) - min325) / SECOND_GAP;
        long span328 = ((max328 + SECOND_GAP) - min328) / SECOND_GAP;
        long span329 = ((max329 + SECOND_GAP) - min329) / SECOND_GAP;

        for (long i325 = 0; i325 < span325; i325++) {
            long g325 = min325 + i325 * SECOND_GAP;
            printStuff(5, g325, min325, max325, SECOND_GAP);
            for (long i328 = 0; i328 < span328; i328++) {
                long g328 = min328 + i328 * SECOND_GAP;
                printStuff(4, g328, min328, max328, SECOND_GAP * 1000);
                for (long i329 = 0; i329 < span329; i329++) {
                    long g329 = min329 + i329 * SECOND_GAP;
                    long currentBest = Long.MAX_VALUE;
                    int winnerMap = 0;
                    for (UserGuess userGuess : userGuesses) {
                        long difference = userGuess.getCurrentDifference() +
                                Math.abs(g325 - userGuess.getGuess325()) +
                                Math.abs(g328 - userGuess.getGuess328()) +
                                Math.abs(g329 - userGuess.getGuess329());
                        if (currentBest > difference) {
                            currentBest = difference;
                            winnerMap = 0;
                            winnerMap |= (0b1 << (userGuess.getEntryNumber()));
                        } else if (currentBest == difference) {
                            winnerMap |= (0b1 << (userGuess.getEntryNumber()));
                        }
                    }
//                    if (true) {
//                        if (winnerSet.size() > 1) {
//                           if (winnerSet.size()> 2) {
//                                System.out.println("WOAH!!!");
//                                System.out.println(winnerSet);
//                                printStuff(325, g325, min325, max325, 1);
//                                printStuff(328, g328, min328, max328, 1);
//                                printStuff(329, g329, min329, max329, 1);
//                            }
//                            winnerCounts.merge(winnerSet, 1L, Long::sum);
//                            int oldSize = winnerNames.size();
//                            winnerNames.add(winnerSet);
//                            if (winnerNames.size() > oldSize) {
//                                System.out.println(winnerSet);
//                                printStuff(325, g325, min325, max325, 1);
//                                printStuff(328, g328, min328, max328, 1);
//                                printStuff(329, g329, min329, max329, 1);
//                            }
//                        }
//                        continue;
//                    }
                    if (lastWinner == 0) {
                        List<Map.Entry<Long, Long>> spans = new ArrayList<>();
//                        Map.Entry<Long, Long> span = Map.entry(fullCount, -1L);
                        Map.Entry<Long, Long> span = new AbstractMap.SimpleEntry<>(fullCount, -1L);
                        spans.add(span);
                        binaryWinnerSegments.put(winnerMap, spans);
                        lastWinner = winnerMap;
                    } else if (lastWinner != winnerMap) {
                        List<Map.Entry<Long, Long>> lastWinnerSpans = binaryWinnerSegments.get(lastWinner);
                        boolean hasOpen = false;
                        Map.Entry<Long, Long> openSpan = null;
                        for (Map.Entry<Long, Long> span : lastWinnerSpans) {
                            if (span.getValue() == -1) {
                                hasOpen = true;
                                openSpan = span;
                            }
                        }
                        if (hasOpen) {
                            openSpan.setValue(fullCount - 1);
                        } else {
                            throw new IllegalStateException();
                        }


                        List<Map.Entry<Long, Long>> spans;
                        if (binaryWinnerSegments.containsKey(winnerMap)) {
                            spans = binaryWinnerSegments.get(winnerMap);
                        } else {
                            spans = new ArrayList<>();
                            System.out.printf("New winner:%8x %n", winnerMap);
                        }

                        Map.Entry<Long, Long> span = new AbstractMap.SimpleEntry<>(fullCount, -1L);
                        spans.add(span);
                        binaryWinnerSegments.put(winnerMap, spans);


                        lastWinner = winnerMap;
                    } else {
                        debug();
                    }

                   /* if (winnerCounts.containsKey(winnerSet)) {
                        winnerCounts.put(winnerSet, winnerCounts.get(winnerSet) + 1);
                    } else {
                        winnerCounts.put(winnerSet, 1L);
//                                System.out.println("New winner: " + winnerSet);
                    }

                    */

                    /*if (winners.containsKey(winnerSet)) {
                        winners.get(winnerSet).add(new WinningTimes(g325, g328, g329));
                    } else {
                        List<WinningTimes> list = new ArrayList<>();
                        list.add(new WinningTimes(g325, g328, g329));
                        winners.put(winnerSet, list);
                        System.out.println("New winner: " + winnerSet);
                    }

                     */

                    fullCount++;
                }


            }
        }
//        if (true) {
//            System.out.println(winnerCounts);
//            return;
//        }
        long rows = binaryWinnerSegments.values().stream()
                .mapToLong(List::size).sum();
        System.out.println(rows);
        StringBuilder builder = new StringBuilder("winner;from;to");
        for (Map.Entry<Integer, List<Map.Entry<Long, Long>>> entry : binaryWinnerSegments.entrySet()) {
            for (Map.Entry<Long, Long> span : entry.getValue()) {
                builder.append("\n");
                builder.append(String.format("%8x", entry.getKey()))
                        .append(";").append(span.getKey()).append(";").append(span.getValue());
            }
        }
        try {
            Files.writeString(Path.of("paste-into-sheets.csv"), builder.toString());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static long lastPrint = System.currentTimeMillis();

    private static void printStuff(int num, long current, long min, long max, long gap) {
        if (current % gap == 0) {
            long now = System.currentTimeMillis();
            System.out.println(num + " " + current + "/" + max + " " + GameTime.secondsToHours(current) + "/" + GameTime.secondsToHours(max) + " " + ((current - min) * 100) / (max - min) + "% (" + (now - lastPrint) + "ms)");
            lastPrint = now;
        }
    }

    private static void debug() {
    }
}
