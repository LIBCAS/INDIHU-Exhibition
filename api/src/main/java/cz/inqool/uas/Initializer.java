package cz.inqool.uas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * Created by Michal on 18. 7. 2017.
 */
@SpringBootApplication
@ComponentScan(basePackages = "cz.inqool.uas")
public class Initializer {

    public static void main(String[] args){
        SpringApplication.run(Initializer.class, args);
    }
}
