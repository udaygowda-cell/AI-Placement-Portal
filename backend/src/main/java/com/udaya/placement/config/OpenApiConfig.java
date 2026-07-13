package com.udaya.placement.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.*;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger/OpenAPI documentation configuration.
 * Access at: http://localhost:8080/api/swagger-ui.html
 */
@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "AI Placement Preparation Portal API",
        version = "1.0.0",
        description = "REST API for the AI-powered placement preparation platform",
        contact = @Contact(
            name = "Udaya Kumar K J",
            url = "https://github.com/udaygowda-cell",
            email = "udayakumar@example.com"
        ),
        license = @License(name = "MIT License")
    ),
    servers = {
        @Server(url = "http://localhost:8080/api", description = "Local Development Server")
    }
)
@SecurityScheme(
    name = "bearerAuth",
    description = "JWT Bearer Authentication. Enter token as: Bearer {token}",
    scheme = "bearer",
    type = SecuritySchemeType.HTTP,
    bearerFormat = "JWT",
    in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {}
