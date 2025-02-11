package org.example.tokentrackerbackend.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.client.RestTemplate;

import java.util.List;

public class StandaloneCardTester {
    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();
        ObjectMapper objectMapper = new ObjectMapper();
        ApiAccessTimer apiAccessTimer = new ApiAccessTimer();
        CardApiAccessor accessor = new CardApiAccessor(restTemplate, objectMapper, apiAccessTimer);
        List<CardTypeRecord> cardTypeRecordList = accessor.getFullTokenList();
        System.out.println("Number of records: " + cardTypeRecordList.size());
    }
}