package com.dreamdevs.election.auth;

import com.dreamdevs.election.exception.ElectionException;
import com.dreamdevs.election.model.Voter;
import com.dreamdevs.election.service.VoterService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final VoterService voterService;
    private final JwtUtil jwtUtil;
    private final String adminUsername;
    private final String adminPassword;

    public AuthController(
            VoterService voterService,
            JwtUtil jwtUtil,
            @Value("${admin.username}") String adminUsername,
            @Value("${admin.password}") String adminPassword) {
        this.voterService = voterService;
        this.jwtUtil = jwtUtil;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> signup(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String studentId = body.get("studentId");
        String password = body.get("password");
        String imageUrl = body.get("imageUrl");

        if (name == null || name.isBlank()) throw new ElectionException("Name is required.");
        if (studentId == null || studentId.isBlank()) throw new ElectionException("Student ID is required.");
        if (password == null || password.length() < 4) throw new ElectionException("Password must be at least 4 characters.");

        Voter voter = voterService.signup(name.trim(), studentId.trim(), password, imageUrl);
        String token = jwtUtil.generateVoterToken(voter.getId());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("token", token);
        result.put("voter", voter);
        return result;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        Voter voter = voterService.login(body.get("studentId"), body.get("password"));
        String token = jwtUtil.generateVoterToken(voter.getId());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("token", token);
        result.put("voter", voter);
        return result;
    }

    @PostMapping("/admin/login")
    public Map<String, Object> adminLogin(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (!adminUsername.equals(username) || !adminPassword.equals(password)) {
            throw new ElectionException("Invalid admin credentials.");
        }

        return Map.of("token", jwtUtil.generateAdminToken());
    }
}
