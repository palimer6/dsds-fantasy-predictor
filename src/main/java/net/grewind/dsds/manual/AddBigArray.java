package net.grewind.dsds.manual;

import java.util.List;
import java.util.concurrent.TimeUnit;

public class AddBigArray {
    private static final long SECOND_GAP = TimeUnit.SECONDS.toSeconds(30);

    public static void main(String[] args) {
        List<UserGuess> userGuesses = InitializeUserGuesses.initialize();
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

        long cells = (max329-min329) * (max328-min328) * (max325-min325);
        int span325 = (int) (((max325 + SECOND_GAP) - min325) / SECOND_GAP);
        int span328 = (int) (((max328 + SECOND_GAP) - min328) / SECOND_GAP);
        int span329 = (int) (((max329 + SECOND_GAP) - min329) / SECOND_GAP);
        byte[][][] winners = new byte[span325][span328][span329];
        System.out.println();
    }
}
