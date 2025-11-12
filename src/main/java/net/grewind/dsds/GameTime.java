package net.grewind.dsds;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GameTime {
    private final long seconds;
    private static final Pattern TIME_PATTERN = Pattern.compile("^(\\d{1,2}):(\\d{2}):(\\d{2})$");

    public GameTime(long seconds) {
        this.seconds = seconds;
    }

    public static long parseTime(String time) {
        Matcher matcher = TIME_PATTERN.matcher(time);
        if (!matcher.find()) {
            throw new IllegalArgumentException("Invalid time format: " + time);
        }
        long hours = Long.parseLong(matcher.group(1));
        long minutes = Long.parseLong(matcher.group(2));
        long seconds = Long.parseLong(matcher.group(3));
        return hours * 3600 + minutes * 60 + seconds;
    }

    public static String secondsToHours(long seconds) {
        return String.format("%d:%02d:%02d", seconds / 3600, (seconds % 3600) / 60, (seconds % 60));
    }

    public long getSeconds() {
        return seconds;
    }

    public Duration getDuration() {
        return Duration.of(this.seconds, ChronoUnit.SECONDS);
    }

    @Override
    public String toString() {
        return "GameTime{" +
                "seconds=" + seconds +
                '}';
    }
}
