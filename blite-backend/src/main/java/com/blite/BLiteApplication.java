package com.blite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class BLiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(BLiteApplication.class, args);
    }

}
