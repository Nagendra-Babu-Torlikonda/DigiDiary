package com.nagendra.Digidiary.repo;

import com.nagendra.Digidiary.entity.Password;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasswordRepo extends MongoRepository<Password, ObjectId> {
    List<Password> findAllByUserId(ObjectId userId);
}
