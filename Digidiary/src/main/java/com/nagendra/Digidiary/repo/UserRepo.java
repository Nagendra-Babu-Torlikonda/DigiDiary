package com.nagendra.Digidiary.repo;

import com.nagendra.Digidiary.entity.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends MongoRepository<User, ObjectId> {
    public Optional<User> findByEmail(String mail);
    public Optional<User> findByEmailAndPassword(String email, String pass);
}
