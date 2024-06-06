package com.nagendra.Digidiary.controllers;

import com.nagendra.Digidiary.entity.LoginRequest;
import com.nagendra.Digidiary.entity.User;
import com.nagendra.Digidiary.repo.UserRepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {

    @Autowired
    private UserRepo repo;

    @Autowired
    JavaMailSender sender;

    @PostMapping("/addUser")
    public ResponseEntity<?> addUser(@RequestBody User u){
        User user =  repo.findByEmail(u.getEmail().trim()).orElse(null);
        if(user != null )
            return ResponseEntity.status(404).body("Email already exists");
        else {
            repo.save(u);
            return ResponseEntity.ok(user);
        }
    }

    @PostMapping("/userLogin")
    public ResponseEntity<?> userLogin(@RequestBody LoginRequest loginRequest){
        User u = repo.findByEmailAndPassword(loginRequest.getEmail(), loginRequest.getPassword()).orElse(null);
        if(u != null)
            return ResponseEntity.ok(u);
        else
            return ResponseEntity.status(401).body("Invalid Email or Password");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // Implement your logout logic here, e.g., invalidating the session
        request.getSession().invalidate();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgotPassword")
    public ResponseEntity<?> forgotPassword(@RequestBody String email){
        String decodedString = URLDecoder.decode(email.substring(0,email.length() - 1), StandardCharsets.UTF_8);
        User user =  repo.findByEmail(decodedString).orElse(null);
        if(user != null) {
            long otp = Long.parseLong(generateOtp(6));
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(decodedString);
            message.setSubject("For Confiramation");
            message.setText(otp + " is the OTP(One Time Password) to login");
            sender.send(message);
            return ResponseEntity.ok(otp);
        }
        else{
            return ResponseEntity.status(404).body("email not found");
        }
    }

    @PostMapping("/newPassword")
    public ResponseEntity<?> setNewPassword(@RequestBody LoginRequest lr){
        User u = repo.findByEmail(lr.getEmail()).orElse(null);
        u.setPassword(lr.getPassword());
        return ResponseEntity.ok(repo.save(u));
    }

    private String generateOtp(int l) {
        String nums = "0123456789";
        String otp = "";
        Random r = new Random();
        for(int i = 0; i < l; i++)
            otp += nums.charAt(r.nextInt(nums.length()));
        return otp;
    }
}
