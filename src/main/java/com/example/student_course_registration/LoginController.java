package com.example.student_course_registration;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import java.io.IOException;
import java.util.Map;

public class LoginController {
    @FXML private TextField usernameField;
    @FXML private PasswordField passwordField;
    @FXML private Label messageLabel;

    public static Student currentStudent;

    @FXML
    public void initialize() {
        // Clear any existing student session
        currentStudent = null;

        // Clear any existing message
        if (messageLabel != null) {
            messageLabel.setText("");
        }
    }

    @FXML
    protected void handleLogin() {
        try {
            String username = usernameField.getText().trim();
            String password = passwordField.getText();

            // Validate input
            if (username.isEmpty() || password.isEmpty()) {
                messageLabel.setText("Please enter both username and password");
                return;
            }

            // Load students and check credentials
            Map<String, Student> students = FileHandler.loadAllStudents();

            if (students.containsKey(username)) {
                Student student = students.get(username);

                // In a real application, you would verify the password here
                // For demonstration purposes, we're accepting any password
                currentStudent = student;

                // Load dashboard
                try {
                    FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("/com/example/student_course_registration/dashboard.fxml"));
                    Scene scene = new Scene(fxmlLoader.load());
                    Main.getMainStage().setScene(scene);
                    Main.getMainStage().setTitle("Student Dashboard - " + student.getName());
                } catch (IOException e) {
                    System.err.println("Error loading dashboard: " + e.getMessage());
                    messageLabel.setText("Error loading dashboard. Please try again.");
                    e.printStackTrace();
                }
            } else {
                messageLabel.setText("Invalid username or password");
                // Clear password field for security
                passwordField.clear();
            }
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            messageLabel.setText("An error occurred. Please try again.");
            e.printStackTrace();
        }
    }

    @FXML
    protected void handleRegister() {
        try {
            FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("/com/example/student_course_registration/register.fxml"));
            Scene scene = new Scene(fxmlLoader.load());
            Main.getMainStage().setScene(scene);
            Main.getMainStage().setTitle("Student Registration");
        } catch (IOException e) {
            System.err.println("Error loading registration page: " + e.getMessage());
            messageLabel.setText("Error loading registration page. Please try again.");
            e.printStackTrace();
        }
    }

    // Helper method to clear sensitive data
    private void clearFields() {
        usernameField.clear();
        passwordField.clear();
        messageLabel.setText("");
    }

    // Method to handle logout (can be called from other controllers)
    public static void logout() {
        currentStudent = null;
    }
}