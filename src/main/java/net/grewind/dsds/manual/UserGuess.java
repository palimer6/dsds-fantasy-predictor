package net.grewind.dsds.manual;

public class UserGuess {
    private final int entryNumber;
    private final String userName;
    private final long currentDifference;
    private final long guess325;
    private final long guess328;
    private final long guess329;

    public UserGuess(int entryNumber, String userName, long currentDifference, long guess325, long guess328, long guess329) {
        this.entryNumber = entryNumber;
        this.userName = userName;
        this.currentDifference = currentDifference;
        this.guess325 = guess325;
        this.guess328 = guess328;
        this.guess329 = guess329;
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

    public long getGuess325() {
        return guess325;
    }

    public long getGuess328() {
        return guess328;
    }

    public long getGuess329() {
        return guess329;
    }
}
