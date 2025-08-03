package com.example.student_course_registration;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.*;
import java.io.IOException;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import java.io.IOException;

public class ProfileController {
    @FXML private TextField nameField;
    @FXML private TextField emailField;
    @FXML private TextField programField;
    @FXML private TextField semesterField;
    @FXML private Label messageLabel;

    @FXML
    public void initialize() {
        Student student = LoginController.currentStudent;
        nameField.setText(student.getName());
        emailField.setText(student.getEmail());
        programField.setText(student.getProgram());
        semesterField.setText(student.getSemester());
    }

    @FXML
    protected void handleSave() {
        Student student = LoginController.currentStudent;
        student.setName(nameField.getText());
        student.setEmail(emailField.getText());
        student.setProgram(programField.getText());
        student.setSemester(semesterField.getText());

        FileHandler.saveStudent(student);
        messageLabel.setText("Profile updated successfully!");
    }

    @FXML
    protected void handleBack() throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("dashboard.fxml"));
        Scene scene = new Scene(fxmlLoader.load());
        HelloApplication.getMainStage().setScene(scene);
    }
}