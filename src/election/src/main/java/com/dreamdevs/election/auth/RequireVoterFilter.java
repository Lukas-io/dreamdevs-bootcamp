package com.dreamdevs.election.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;

@Component
public class RequireVoterFilter implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    public RequireVoterFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String auth = request.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Voter authentication required.");
            return false;
        }
        try {
            Map<String, Object> claims = jwtUtil.parse(auth.substring(7));
            if (!"VOTER".equals(claims.get("role"))) {
                response.sendError(HttpStatus.FORBIDDEN.value(), "Voter token required.");
                return false;
            }
            request.setAttribute("jwtClaims", claims);
            return true;
        } catch (JwtUtil.JwtAuthException e) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), e.getMessage());
            return false;
        }
    }
}
