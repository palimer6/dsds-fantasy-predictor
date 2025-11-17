package net.grewind.dsds.manual;

import net.grewind.dsds.GameTime;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class WinningTimes extends ArrayList<Long> {

    public WinningTimes(long g1, long g2, long g3, long g4, long g5) {
        super(List.of(g1, g2, g3, g4, g5));
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
