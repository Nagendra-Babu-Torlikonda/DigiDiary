package com.nagendra.Digidiary.entity;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.nagendra.Digidiary.config.ObjectIdDeserializer;
import com.nagendra.Digidiary.config.ObjectIdSerializer;
import jakarta.persistence.Id;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "diary")
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Diary {

    @Id
    @JsonSerialize(using = ObjectIdSerializer.class)
    @JsonDeserialize(using = ObjectIdDeserializer.class)
    private ObjectId id;

    @JsonSerialize(using = ObjectIdSerializer.class)
    @JsonDeserialize(using = ObjectIdDeserializer.class)
    private ObjectId userId;

    private String title;

    private String content;

    private LocalDate date;
}
