package com.example.bizly.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {

                registry.addMapping("/bizly/**") // Aplica a todas las rutas que empiecen con /bizly
                        .allowedOrigins("http://localhost:4200") // El puerto de tu Angular
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos permitidos
                        .allowedHeaders("*") // Permitir todos los headers (Content-Type, Authorization, etc.)
                        .allowCredentials(true); // Permitir credenciales si fueran necesarias
            }
        };
    }
}