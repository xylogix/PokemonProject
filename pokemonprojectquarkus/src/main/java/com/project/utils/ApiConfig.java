package com.project.utils;

import io.smallrye.config.ConfigMapping;

@ConfigMapping(prefix = "api")
public interface ApiConfig {
    String baseUrl();
}
