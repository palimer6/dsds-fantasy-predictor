package net.grewind.dsds.manual;

import net.grewind.dsds.GameTime;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class WinningTimes extends ArrayList<Long> {

    public WinningTimes(long g325, long g328, long g329) {
        super(List.of(g325, g328, g329));
    }

    @Override
    public String toString() {
        Iterator<Long> it = iterator();
        if (!it.hasNext())
            return "[]";

        StringBuilder sb = new StringBuilder();
        sb.append('[');
        for (; ; ) {
            Long e = it.next();
            sb.append(GameTime.secondsToHours(e));
            if (!it.hasNext())
                return sb.append(']').toString();
            sb.append(',').append(' ');
        }
    }
}
