module com.example.student_course_registration {
    requires javafx.controls;
    requires javafx.fxml;


    opens com.example.student_course_registration to javafx.fxml;
    exports com.example.student_course_registration;
}