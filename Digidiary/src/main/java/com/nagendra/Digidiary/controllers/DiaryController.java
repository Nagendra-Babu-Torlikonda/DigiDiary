package com.nagendra.Digidiary.controllers;

import com.nagendra.Digidiary.entity.Diary;
import com.nagendra.Digidiary.repo.DiaryRepo;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/diary")
@CrossOrigin
public class DiaryController {

    @Autowired
    private DiaryRepo repo;

    @GetMapping("/userDiaries/{userId}")
    public ResponseEntity<?> getAllUserDiaries(@PathVariable String userId){
        ObjectId userObjectId = new ObjectId(userId);
        List<Diary> list = repo.findAllByUserId(userObjectId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("getAllDiaries")
    public List<Diary> getAll(){
        return repo.findAll();
    }

    @PostMapping("/addDiary")
    public ResponseEntity<?> addDiary(@RequestBody Diary d){
        Diary dry = repo.save(d);
        return ResponseEntity.ok(dry);
    }

    @DeleteMapping("/deleteDiary/{diaryId}")
    public ResponseEntity<?> deleteDiary(@PathVariable String diaryId){
        ObjectId diaryObjectId = new ObjectId(diaryId);
        repo.deleteById(diaryObjectId);
        return ResponseEntity.ok().build();
    }
}
