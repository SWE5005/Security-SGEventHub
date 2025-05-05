package edu.nus.microservice.auth_manager.component;

import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EncryptionMigrationRunner implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    private final EncryptAttributeConverter converter = new EncryptAttributeConverter();

    @Override
    public void run(String... args) throws Exception {
        List<UserInfoEntity> users = userRepository.findAll();
        for (UserInfoEntity user : users) {
            // Check if already encrypted (very basic check)
            if (!isEncrypted(user.getEmailAddress())) {
                user.setEmailAddress(converter.convertToDatabaseColumn(user.getEmailAddress()));
            }
            userRepository.save(user); // triggers JPA update
        }
        System.out.println("Migration complete.");
    }

    private boolean isEncrypted(String value) {
        return value != null && value.matches("^[A-Za-z0-9+/=]{24,}$"); // rough base64 check
    }
}
