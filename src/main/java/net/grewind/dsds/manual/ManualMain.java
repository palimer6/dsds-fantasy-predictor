package net.grewind.dsds.manual;

import net.grewind.dsds.GameTime;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.TimeUnit;

public class ManualMain {
    private static final long SECOND_GAP = TimeUnit.MINUTES.toSeconds(3);

    public static void main(String[] args) {
        List<UserGuess> userGuesses = InitializeUserGuesses.initialize();
        Map<WinnerName, List<WinningTimes>> winners = new HashMap<>();
        Map<Set<String>, Long> winnerCounts = new HashMap<>();
        Map<WinnerName, List<Map.Entry<Long, Long>>> winningSegments = new HashMap<>();
        long fullCount = 0;
        WinnerName lastWinner = null;

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

        for (long g329 = min329; g329 <= max329; g329 += SECOND_GAP) {
            printStuff(5, g329, min329, max329, SECOND_GAP);
            for (long g328 = min328; g328 <= max328; g328 += SECOND_GAP) {
//                printStuff(4, g328, min328, max328, SECOND_GAP);
                for (long g325 = min325; g325 <= max325; g325 += SECOND_GAP) {
                    long currentBest = Long.MAX_VALUE;
                    WinnerName winnerSet = new WinnerName();
                    for (UserGuess userGuess : userGuesses) {
                        long difference = userGuess.getCurrentDifference() +
                                Math.abs(g325 - userGuess.getGuess325()) +
                                Math.abs(g328 - userGuess.getGuess328()) +
                                Math.abs(g329 - userGuess.getGuess329());
                        if (currentBest > difference) {
                            currentBest = difference;
                            winnerSet.clear();
                            winnerSet.add(userGuess.getUserName());
                        } else if (currentBest == difference) {
                            winnerSet.add(userGuess.getUserName());
                        }
                    }

                    if (lastWinner == null) {
                        List<Map.Entry<Long, Long>> spans = new ArrayList<>();
//                        Map.Entry<Long, Long> span = Map.entry(fullCount, -1L);
                        Map.Entry<Long, Long> span = new AbstractMap.SimpleEntry<>(fullCount, -1L);
                        spans.add(span);
                        winningSegments.put(winnerSet, spans);
                        lastWinner = winnerSet;
                    } else if (!lastWinner.equals(winnerSet)) {
                        List<Map.Entry<Long, Long>> lastWinnerSpans = winningSegments.get(lastWinner);
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
                        if (winningSegments.containsKey(winnerSet)) {
                            spans = winningSegments.get(winnerSet);
                        } else {
                            spans = new ArrayList<>();
                        }

                        Map.Entry<Long, Long> span = new AbstractMap.SimpleEntry<>(fullCount, -1L);
                        spans.add(span);
                        winningSegments.put(winnerSet, spans);


                        lastWinner = winnerSet;
                    } else {
                        System.out.print("");
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
        long rows = winningSegments.values().stream()
                .mapToLong(List::size).sum();
        System.out.println(rows);
        StringBuilder builder = new StringBuilder("winner\tfrom\tto");
        for (Map.Entry<WinnerName, List<Map.Entry<Long, Long>>> entry : winningSegments.entrySet()) {
            for (Map.Entry<Long, Long> span : entry.getValue()) {
                builder.append("\n");
                builder.append(entry.getKey()).append("\t").append(span.getKey()).append("\t").append(span.getValue());
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
}
