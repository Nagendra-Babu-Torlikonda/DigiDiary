package com.nagendra.Digidiary.controllers;

import com.nagendra.Digidiary.entity.Expense;
import com.nagendra.Digidiary.entity.TransactionType;
import com.nagendra.Digidiary.repo.ExpenseRepo;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expense")
@CrossOrigin
public class ExpenseController {

    @Autowired
    private ExpenseRepo repo;

    @GetMapping("/userExpenses/{userid}")
    public ResponseEntity<?> getAllUserExpenses(@PathVariable String userid){
        ObjectId userObjectId = new ObjectId(userid);
        List<Expense> l = repo.findAllByUserId(userObjectId);
        return ResponseEntity.ok(l);
    }

    @GetMapping("/userExpenses/{userid}/{type}")
    public ResponseEntity<?> getAllUserExpenses(@PathVariable String userid, @PathVariable String type){
        ObjectId userObjectId = new ObjectId(userid);
        TransactionType transactionType = TransactionType.valueOf(type);
        List<Expense> l = repo.findAllByUserIdAndTransactionType(userObjectId,transactionType);
        return ResponseEntity.ok(l);
    }

    @PostMapping("/addExpense")
    public ResponseEntity<?> addExpense(@RequestBody Expense e){
        Expense expense = repo.save(e);
        return ResponseEntity.ok(expense);
    }

    @DeleteMapping("/deleteExpense/{expenseId}")
    public ResponseEntity<?> deleteDiary(@PathVariable String expenseId){
        ObjectId expenseObjectId = new ObjectId(expenseId);
        repo.deleteById(expenseObjectId);
        return ResponseEntity.ok().build();
    }
}
