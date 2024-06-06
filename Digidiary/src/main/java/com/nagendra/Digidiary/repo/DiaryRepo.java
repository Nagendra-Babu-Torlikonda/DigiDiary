package com.nagendra.Digidiary.repo;

import com.nagendra.Digidiary.entity.Diary;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiaryRepo extends MongoRepository<Diary, ObjectId> {
    public List<Diary> findAllByUserId(ObjectId userid);
}
