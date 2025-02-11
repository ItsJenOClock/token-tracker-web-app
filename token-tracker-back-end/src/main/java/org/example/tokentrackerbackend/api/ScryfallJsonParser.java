package org.example.tokentrackerbackend.api;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.List;

public class ScryfallJsonParser {
    public static CardTypeRecord scryfallJsonToCardTypeRecord(JsonNode jsonElement) {
        String oracleId = jsonElement.get("oracle_id").asText();
        String name = jsonElement.get("name").asText();
        String typeLine = jsonElement.get("type_line").asText();
        String oracleText = jsonElement.get("oracle_text").asText();
        String power = jsonElement.has("power") ? jsonElement.get("power").asText() : null;
        String toughness = jsonElement.has("toughness") ? jsonElement.get("toughness").asText() : null;
        String imageUri = jsonElement.has("image_uris") ? jsonElement.get("image_uris").get("normal").asText() : null;
        String artist = jsonElement.get("artist").asText();
        return new CardTypeRecord(oracleId, 0, name, typeLine, oracleText, power, toughness, imageUri, artist);
    }

    public static List < CardTypeRecord > scryfallJsonToCardTypeRecordDoubleFaced(JsonNode jsonElement) {
        String oracleId = jsonElement.get("oracle_id").asText();
        JsonNode contentsFront = jsonElement.get("card_faces").get(0);
        JsonNode contentsBack = jsonElement.get("card_faces").get(1);

        CardTypeRecord recordFront = new CardTypeRecord(
                oracleId,
                0,
                contentsFront.get("name").asText(),
                contentsFront.get("type_line").asText(),
                contentsFront.get("oracle_text").asText(),
                contentsFront.has("power") ? contentsFront.get("power").asText() : null,
                contentsFront.has("toughness") ? contentsFront.get("toughness").asText() : null,
                contentsFront.has("image_uris") ? contentsFront.get("image_uris").get("normal").asText() : null,
                contentsFront.get("artist").asText()
        );

        CardTypeRecord recordBack = new CardTypeRecord(
                oracleId,
                1,
                contentsBack.get("name").asText(),
                contentsBack.get("type_line").asText(),
                contentsBack.get("oracle_text").asText(),
                contentsBack.has("power") ? contentsBack.get("power").asText() : null,
                contentsBack.has("toughness") ? contentsBack.get("toughness").asText() : null,
                contentsBack.has("image_uris") ? contentsBack.get("image_uris").get("normal").asText() : null,
                contentsBack.get("artist").asText()
        );

        return List.of(recordFront, recordBack);
    }
}