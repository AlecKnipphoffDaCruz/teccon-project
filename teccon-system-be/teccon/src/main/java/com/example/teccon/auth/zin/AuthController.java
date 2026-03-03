package com.example.teccon.auth.zin;

import com.example.teccon.auth.AuthService;
import com.example.teccon.auth.zdto.LoginRequestDto;
import com.example.teccon.auth.zdto.LoginResponseDto;
import com.example.teccon.user.User;
import com.example.teccon.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private UserService userService;

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto request) {
        return ResponseEntity.ok(authService.login(request));
    }
    @PostMapping("/create/user")
    public ResponseEntity<String> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }
    @PutMapping("/edit/user")
    public ResponseEntity<String> editUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.editUser(user));
    }
    @PutMapping("/delete/user/id")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.logicDeleteUser(id));
    }
}