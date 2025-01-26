package org.example.tokentrackerbackend.api;

public class ApiAccessTimer {
    private long lastAccessTime = 0;
    private final long accessTimeDelay = 300;

    public synchronized void delay() {
        long currentTime = System.currentTimeMillis();
        long elapsedTime = currentTime - lastAccessTime;

        if (elapsedTime < accessTimeDelay) {
            try {
                Thread.sleep(accessTimeDelay - elapsedTime);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        lastAccessTime = System.currentTimeMillis();
    }
}
