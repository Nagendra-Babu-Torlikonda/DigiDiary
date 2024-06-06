package com.nagendra.Digidiary.controllers;

import com.nagendra.Digidiary.entity.Password;
import com.nagendra.Digidiary.repo.PasswordRepo;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/passwords")
public class PasswordController {

    @Autowired
    private PasswordRepo repo;

    @GetMapping("/getAllPasswords")
    public List<Password> getAll(){
        return repo.findAll();
    }

    @PostMapping("/addPassword")
    public ResponseEntity<?> addPassword(@RequestBody Password p){
        Password pass = repo.save(p);
        return ResponseEntity.ok(pass);
    }

    @GetMapping("/userPasswords/{userid}")
    public ResponseEntity<?> getPasswordsOfUser(@PathVariable String userid){
        ObjectId userObjectId = new ObjectId(userid);
        List<Password> list = repo.findAllByUserId(userObjectId);
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/deletePassword/{passwordId}")
    public ResponseEntity<?> deleteDiary(@PathVariable String passwordId){
        ObjectId passwordObjectId = new ObjectId(passwordId);
        repo.deleteById(passwordObjectId);
        return ResponseEntity.ok().build();
    }

}
