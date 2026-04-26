package com.dreamdevs.election.config;

import com.dreamdevs.election.auth.RequireAdminFilter;
import com.dreamdevs.election.auth.RequireVoterFilter;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final RequireVoterFilter requireVoterFilter;
    private final RequireAdminFilter requireAdminFilter;

    public WebConfig(RequireVoterFilter requireVoterFilter, RequireAdminFilter requireAdminFilter) {
        this.requireVoterFilter = requireVoterFilter;
        this.requireAdminFilter = requireAdminFilter;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("Content-Type", "Authorization");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(requireVoterFilter)
                .addPathPatterns("/votes");
        registry.addInterceptor(requireAdminFilter)
                .addPathPatterns("/awards/**", "/voters/**");
    }
}
