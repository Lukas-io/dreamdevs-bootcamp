package com.dreamdevs.election.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;

@Component
public class RequireAdminFilter implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    public RequireAdminFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if ("GET".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        String auth = request.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Admin authentication required.");
            return false;
        }
        try {
            Map<String, Object> claims = jwtUtil.parse(auth.substring(7));
            if (!"ADMIN".equals(claims.get("role"))) {
                response.sendError(HttpStatus.FORBIDDEN.value(), "Admin token required.");
                return false;
            }
            return true;
        } catch (JwtUtil.JwtAuthException e) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), e.getMessage());
            return false;
        }
    }
}
