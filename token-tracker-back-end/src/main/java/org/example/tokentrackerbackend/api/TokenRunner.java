package org.example.tokentrackerbackend.api;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class TokenRunner implements CommandLineRunner {

    private final CardApiAccessor cardApiAccessor;

    public TokenRunner(CardApiAccessor cardApiAccessor) {
        this.cardApiAccessor = cardApiAccessor;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Fetching tokens from Scryfall...");
        List<CardTypeRecord> tokenList = cardApiAccessor.getFullTokenList();
        System.out.println("Number of tokens retrieved: " + tokenList.size());
    }
}
