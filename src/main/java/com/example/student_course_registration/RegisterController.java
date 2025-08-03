package com.example.student_course_registration;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import java.io.IOException;
import java.util.Map;

public class RegisterController {
    @FXML private TextField usernameField;
    @FXML private PasswordField passwordField;
    @FXML private PasswordField confirmPasswordField;
    @FXML private TextField nameField;
    @FXML private TextField emailField;
    @FXML private TextField programField;
    @FXML private TextField semesterField;
    @FXML private Label messageLabel;

    @FXML
    protected void handleRegister() {
        String username = usernameField.getText().trim();
        String password = passwordField.getText();
        String confirmPassword = confirmPasswordField.getText();
        String name = nameField.getText().trim();
        String email = emailField.getText().trim();
        String program = programField.getText().trim();
        String semester = semesterField.getText().trim();

        // Validation
        if (username.isEmpty() || password.isEmpty() || confirmPassword.isEmpty() ||
                name.isEmpty() || email.isEmpty() || program.isEmpty() || semester.isEmpty()) {
            messageLabel.setText("All fields are required");
            return;
        }

        if (!password.equals(confirmPassword)) {
            messageLabel.setText("Passwords do not match");
            return;
        }

        // Debug information
        System.out.println("Data directory path: " + FileHandler.getDataDirectoryPath());
        System.out.println("Data file exists before save: " + FileHandler.doesDataFileExist());

        // Check if username already exists
        Map<String, Student> students = FileHandler.loadAllStudents();
        if (students.containsKey(username)) {
            messageLabel.setText("Username already exists");
            return;
        }

        // Create new student
        Student newStudent = new Student(username, name, email, program, semester);
        FileHandler.saveStudent(newStudent);

        // Check if file was created
        System.out.println("Data file exists after save: " + FileHandler.doesDataFileExist());

        // Show success message and redirect to login
        messageLabel.setText("Registration successful! Please login.");
        try {
            handleBackToLogin();
        } catch (IOException e) {
            messageLabel.setText("Error returning to login page: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @FXML
    protected void handleBackToLogin() throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("/com/example/student_course_registration/login.fxml"));
        Scene scene = new Scene(fxmlLoader.load());
        Main.getMainStage().setScene(scene);
    }
}