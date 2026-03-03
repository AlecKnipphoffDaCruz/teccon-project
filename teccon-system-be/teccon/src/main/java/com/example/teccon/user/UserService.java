package com.example.teccon.user;

import com.example.teccon.user.zout.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public String createUser(User user) {
        try {
            userRepository.save(user);
            System.out.println("User de nome: " + user.getName() + "criado com sucesso");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Sucess";
    }

    @Transactional
    public String editUser(User user) {
        try {
            userRepository.save(user);
            System.out.println("User de nome: " + user.getName() + "editado com sucesso");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Sucess";
    }

    @Transactional
    public String logicDeleteUser(UUID uuid) {
        try {
            User user = userRepository.findById(uuid).get();
            user.setIsActive(false);
            userRepository.save(user);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Sucess";
    }
    @Transactional
    public String logicActiveUser(UUID uuid) {
        try {
            User user = userRepository.findById(uuid).get();
            user.setIsActive(true);
            userRepository.save(user);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Sucess";
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id).get();
    }
    public User getByLogin(String login) {
        return userRepository.findByLogin(login).get();
    }
}

