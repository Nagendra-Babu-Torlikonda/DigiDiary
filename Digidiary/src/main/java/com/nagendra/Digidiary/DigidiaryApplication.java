package com.nagendra.Digidiary;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class DigidiaryApplication {

	public static void main(String[] args) {
		SpringApplication.run(DigidiaryApplication.class, args);
		System.out.println("hello world");
	}

}
