package net.grewind.dsds.manual;

public class UserGuess {
    private final int entryNumber;
    private final String userName;
    private final long currentDifference;
    private final long guess1;
    private final long guess2;
    private final long guess3;
    private final long guess4;
    private final long guess5;

    public UserGuess(int entryNumber, String userName, long currentDifference, long guess1, long guess2, long guess3, long guess4, long guess5) {
        this.entryNumber = entryNumber;
        this.userName = userName;
        this.currentDifference = currentDifference;
        this.guess1 = guess1;
        this.guess2 = guess2;
        this.guess3 = guess3;
        this.guess4 = guess4;
        this.guess5 = guess5;
    }

    public int getEntryNumber() {
        return entryNumber;
    }

    public String getUserName() {
        return userName;
    }

    public long getCurrentDifference() {
        return currentDifference;
    }

    public long getGuess1() {
        return guess1;
    }

    public long getGuess2() {
        return guess2;
    }

    public long getGuess3() {
        return guess3;
    }

    public long getGuess4() {
        return guess4;
    }

    public long getGuess5() {
        return guess5;
    }
}
