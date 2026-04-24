package com.dreamdevs.election.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private final byte[] secret;
    private final long voterExpiryMs;
    private final long adminExpiryMs;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Base64.Encoder B64 = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder B64D = Base64.getUrlDecoder();
    private static final String HEADER = Base64.getUrlEncoder().withoutPadding()
            .encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.voter-expiry-ms}") long voterExpiryMs,
            @Value("${jwt.admin-expiry-ms}") long adminExpiryMs) {
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.voterExpiryMs = voterExpiryMs;
        this.adminExpiryMs = adminExpiryMs;
    }

    public String generateVoterToken(String voterId) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", voterId);
        payload.put("role", "VOTER");
        return generate(payload, voterExpiryMs);
    }

    public String generateAdminToken() {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", "admin");
        payload.put("role", "ADMIN");
        return generate(payload, adminExpiryMs);
    }

    private String generate(Map<String, Object> payload, long expiryMs) {
        try {
            long now = System.currentTimeMillis() / 1000;
            payload.put("iat", now);
            payload.put("exp", now + expiryMs / 1000);
            String body = B64.encodeToString(objectMapper.writeValueAsBytes(payload));
            String sigInput = HEADER + "." + body;
            return sigInput + "." + B64.encodeToString(hmac(sigInput));
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate JWT", e);
        }
    }

    public Map<String, Object> parse(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) throw new JwtAuthException("Invalid token format.");

            String sigInput = parts[0] + "." + parts[1];
            if (!MessageDigest.isEqual(hmac(sigInput), B64D.decode(parts[2]))) {
                throw new JwtAuthException("Invalid token signature.");
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> claims = objectMapper.readValue(B64D.decode(parts[1]), Map.class);

            long exp = ((Number) claims.get("exp")).longValue();
            if (System.currentTimeMillis() / 1000 > exp) throw new JwtAuthException("Token has expired.");

            return claims;
        } catch (JwtAuthException e) {
            throw e;
        } catch (Exception e) {
            throw new JwtAuthException("Invalid token.");
        }
    }

    private byte[] hmac(String data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret, "HmacSHA256"));
        return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
    }

    public static class JwtAuthException extends RuntimeException {
        public JwtAuthException(String message) { super(message); }
    }
}
