package com.cloudtrip.hotelservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI hotelServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hotel Service API")
                        .description("Manages hotel inventory, search and availability.")
                        .version("v1.0")
                        .contact(new Contact().name("CloudTrip Team")));
    }
}
