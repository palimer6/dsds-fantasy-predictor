package net.grewind.dsds;

import java.util.Objects;

public class Game {
    private final int number;
    private final String name;

    public Game(int number, String name) {
        this.number = number;
        this.name = name;
    }

    public int getNumber() {
        return number;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return "Game{" +
                "number=" + number +
                ", name='" + name + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Game game = (Game) o;
        return number == game.number && Objects.equals(name, game.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(number, name);
    }
}
