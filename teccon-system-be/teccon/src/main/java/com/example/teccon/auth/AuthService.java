package com.example.teccon.auth;

import com.example.teccon.auth.security.JwtService;
import com.example.teccon.auth.zdto.LoginRequestDto;
import com.example.teccon.auth.zdto.LoginResponseDto;
import com.example.teccon.user.User;
import com.example.teccon.user.zout.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponseDto login(LoginRequestDto request) {

        User user = userRepository.findByLogin(request.user())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Senha inválida");
        }

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getLogin())
                .password(user.getPassword())
                .authorities(user.getRole().toString())
                .build();

        String token = jwtService.generateToken(userDetails);

        return new LoginResponseDto(token);
    }
}