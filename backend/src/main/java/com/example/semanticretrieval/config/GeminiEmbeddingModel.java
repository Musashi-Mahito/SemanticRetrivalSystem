package com.example.semanticretrieval.config;

import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.Embedding;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingRequest;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.ai.embedding.EmbeddingResponseMetadata;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Primary
public class GeminiEmbeddingModel implements EmbeddingModel {

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${spring.ai.openai.api-key}")
    private String apiKey;

    @Value("${spring.ai.openai.base-url}")
    private String baseUrl;

    @Value("${spring.ai.openai.embedding.options.model:gemini-embedding-001}")
    private String modelName;

    @Override
    public EmbeddingResponse call(EmbeddingRequest request) {
        try {
            List<String> inputs = request.getInstructions();

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", modelName);
            requestBody.put("input", inputs);

            String jsonRequest = objectMapper.writeValueAsString(requestBody);

            String cleanUrl = baseUrl;
            if (!cleanUrl.endsWith("/")) {
                cleanUrl += "/";
            }
            URI uri = URI.create(cleanUrl + "embeddings");

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(uri)
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonRequest))
                    .build();

            HttpResponse<String> httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (httpResponse.statusCode() != 200) {
                throw new RuntimeException("Failed to get embeddings from Gemini API: Status="
                        + httpResponse.statusCode() + " Body=" + httpResponse.body());
            }

            Map<String, Object> responseMap = objectMapper.readValue(httpResponse.body(), Map.class);
            List<Map<String, Object>> data = (List<Map<String, Object>>) responseMap.get("data");

            List<Embedding> embeddings = new ArrayList<>();
            for (int i = 0; i < data.size(); i++) {
                Map<String, Object> item = data.get(i);
                int index = i;
                if (item.containsKey("index") && item.get("index") != null) {
                    index = ((Number) item.get("index")).intValue();
                }

                List<Number> vectorList = (List<Number>) item.get("embedding");

                List<Double> doubleVector = new ArrayList<>();
                for (Number val : vectorList) {
                    doubleVector.add(val.doubleValue());
                }

                embeddings.add(new Embedding(doubleVector, index));
            }

            EmbeddingResponseMetadata metadata = new EmbeddingResponseMetadata();

            return new EmbeddingResponse(embeddings, metadata);

        } catch (Exception e) {
            throw new RuntimeException("Error during embedding generation", e);
        }
    }

    @Override
    public List<Double> embed(Document document) {
        return embed(document.getContent());
    }

    @Override
    public List<Double> embed(String text) {
        EmbeddingResponse response = call(new EmbeddingRequest(List.of(text), null));
        return response.getResults().get(0).getOutput();
    }
}
