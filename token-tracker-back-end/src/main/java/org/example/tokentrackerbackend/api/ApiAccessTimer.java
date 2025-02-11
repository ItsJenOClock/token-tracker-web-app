package org.example.tokentrackerbackend.api;

import org.springframework.stereotype.Component;

@Component
public class ApiAccessTimer {
    private long lastAccessTime = 0;
    private long accessTimeDelay = 100L;

    public void waitForNextAccess() throws InterruptedException {
        long currentTime = System.currentTimeMillis();
        long waitTime = lastAccessTime + accessTimeDelay - currentTime;
        if (waitTime > 0) {
            Thread.sleep(waitTime);
        }
        lastAccessTime = System.currentTimeMillis();
    }
}