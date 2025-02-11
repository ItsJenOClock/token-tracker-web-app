package org.example.tokentrackerbackend.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Component
public class CardApiAccessor {
    private static final String API_URL = "https://api.scryfall.com/cards/search?q=(t:token+or+t:tolkien)&order=name&page={i}";
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final ApiAccessTimer apiAccessTimer;

    public CardApiAccessor(RestTemplate restTemplate, ObjectMapper objectMapper, ApiAccessTimer apiAccessTimer) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.apiAccessTimer = apiAccessTimer;
    }

    public List<CardTypeRecord> getFullTokenList() {
        List<CardTypeRecord> results = new ArrayList<>();
        String apiRequestString = API_URL;
        boolean hasMore = true;
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.ACCEPT, "*/*");
        headers.set(HttpHeaders.USER_AGENT, "Token-Tracker/0.2");
        HttpEntity<?> entity = new HttpEntity<>(headers);
        int page = 1;
        while (hasMore) {
            try {
                apiAccessTimer.waitForNextAccess();
                System.out.println(apiRequestString);
                ResponseEntity<String> response = restTemplate.exchange(apiRequestString, HttpMethod.GET, entity, String.class, page);

                if (response.getStatusCode() != HttpStatus.OK) {
                    throw new RuntimeException("Failed to fetch data from API: " + response.getStatusCode());
                }

                JsonNode jsonBody = objectMapper.readTree(response.getBody());

                if (!jsonBody.has("total_cards")) {
                    throw new RuntimeException("Error: size of array not found");
                }

                JsonNode tokenCollection = jsonBody.get("data");
                if (tokenCollection != null && tokenCollection.isArray()) {
                    for (JsonNode jsonElement : tokenCollection) {
                        String layout = jsonElement.get("layout").asText();
                        if ("double_faced_token".equals(layout) || "flip".equals(layout)) {
                            results.addAll(ScryfallJsonParser.scryfallJsonToCardTypeRecordDoubleFaced(jsonElement));
                        } else {
                            results.add(ScryfallJsonParser.scryfallJsonToCardTypeRecord(jsonElement));
                        }
                    }
                }

                hasMore = jsonBody.has("has_more") && jsonBody.get("has_more").asBoolean();
                if (hasMore) {
                    page++;
                }

            } catch (Exception e) {
                throw new RuntimeException("Error during API access", e);
            }
        }
        return results;
    }
}