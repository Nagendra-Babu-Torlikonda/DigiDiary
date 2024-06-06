package com.nagendra.Digidiary.repo;

import com.nagendra.Digidiary.entity.Expense;
import com.nagendra.Digidiary.entity.TransactionType;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepo extends MongoRepository<Expense, ObjectId> {
    public List<Expense> findAllByUserId(ObjectId userId);
    public List<Expense> findAllByUserIdAndTransactionType(ObjectId userId, TransactionType t);

}
