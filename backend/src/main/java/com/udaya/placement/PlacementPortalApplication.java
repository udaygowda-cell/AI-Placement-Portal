package com.udaya.placement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main entry point for the AI Placement Preparation Portal
 * Author: Udaya Kumar K J
 * GitHub: https://github.com/udaygowda-cell
 * LinkedIn: https://www.linkedin.com/in/udaya-kumar-k-j-26b120320
 */
@SpringBootApplication
@EnableJpaAuditing
public class PlacementPortalApplication {
    public static void main(String[] args) {
        SpringApplication.run(PlacementPortalApplication.class, args);
        System.out.println("====================================================");
        System.out.println("  AI Placement Preparation Portal - STARTED");
        System.out.println("  Swagger UI: http://localhost:8080/api/swagger-ui.html");
        System.out.println("  Author: Udaya Kumar K J");
        System.out.println("====================================================");
    }
}
