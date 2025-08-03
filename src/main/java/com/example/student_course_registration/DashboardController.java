package com.example.student_course_registration;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.chart.BarChart;
import javafx.scene.chart.XYChart;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import javafx.animation.Timeline;
import javafx.animation.KeyFrame;
import javafx.util.Duration;
import java.time.ZoneOffset;

public class DashboardController {
    @FXML private Label welcomeLabel;
    @FXML private Label messageLabel;
    @FXML private Label dateTimeLabel;
    @FXML private Label lastUpdateLabel;
    @FXML private Label programLabel;
    @FXML private Label semesterLabel;
    @FXML private Label emailLabel;
    @FXML private Label coursesLabel;
    @FXML private Label userLoginLabel;
    @FXML private BarChart<String, Number> courseChart;

    private Timeline clockTimeline;

    @FXML
    public void initialize() {
        try {
            if (LoginController.currentStudent == null) {
                handleLogout();
                return;
            }

            // Setup initial state
            setupClock();
            updateDashboard();
            setupCourseChart();

            // Initial update
            updateDateTime();
            updateLastRefreshed();

        } catch (Exception e) {
            System.err.println("Error initializing dashboard: " + e.getMessage());
            if (messageLabel != null) {
                messageLabel.setText("Error loading dashboard information");
            }
            e.printStackTrace();
        }
    }

    private void setupClock() {
        if (clockTimeline != null) {
            clockTimeline.stop();
        }
        clockTimeline = new Timeline(new KeyFrame(Duration.seconds(1), e -> updateDateTime()));
        clockTimeline.setCycleCount(Timeline.INDEFINITE);
        clockTimeline.play();
    }

    private void setupCourseChart() {
        if (courseChart != null) {
            XYChart.Series<String, Number> series = new XYChart.Series<>();
            series.getData().add(new XYChart.Data<>("Jan", 2));
            series.getData().add(new XYChart.Data<>("Feb", 3));
            series.getData().add(new XYChart.Data<>("Mar", 2));
            series.getData().add(new XYChart.Data<>("Apr", 4));
            series.getData().add(new XYChart.Data<>("May", 1));
            series.getData().add(new XYChart.Data<>("Jun", 1));

            courseChart.getData().clear();
            courseChart.getData().add(series);
            courseChart.setAnimated(false);

            // Style the chart bars
            series.getData().forEach(data -> {
                data.getNode().setStyle("-fx-bar-fill: #2d1f4d;");
            });
        }
    }

    private void updateDateTime() {
        LocalDateTime utcNow = LocalDateTime.now(ZoneOffset.UTC);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        if (dateTimeLabel != null) {
            dateTimeLabel.setText("Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): " +
                    utcNow.format(formatter));
        }
    }

    private void updateLastRefreshed() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        if (lastUpdateLabel != null) {
            lastUpdateLabel.setText("Last updated: " + now.format(formatter));
        }
    }

    private void updateDashboard() {
        if (LoginController.currentStudent != null) {
            Student student = LoginController.currentStudent;

            // Update welcome message
            welcomeLabel.setText("Welcome back, " + student.getName() + "!");

            // Set user login
            userLoginLabel.setText("Current User's Login: " + student.getUsername());

            // Update student information
            programLabel.setText(student.getProgram());
            semesterLabel.setText(student.getSemester());
            emailLabel.setText(student.getEmail());

            // Update courses count
            int courseCount = student.getRegisteredCourses() != null ?
                    student.getRegisteredCourses().size() : 0;
            coursesLabel.setText(String.valueOf(courseCount));

            // Update last refresh time
            updateLastRefreshed();
            if (messageLabel != null) {
                messageLabel.setText("Dashboard loaded successfully!");
            }
        }
    }

    @FXML
    protected void handleRegisterCourses() {
        try {
            FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource(
                    "/com/example/student_course_registration/course-registration.fxml"));
            Scene scene = new Scene(fxmlLoader.load());
            Main.getMainStage().setScene(scene);
            Main.getMainStage().setTitle("Course Registration");
        } catch (IOException e) {
            System.err.println("Error loading course registration: " + e.getMessage());
            if (messageLabel != null) {
                messageLabel.setText("Error loading course registration page");
            }
            e.printStackTrace();
        }
    }

    @FXML
    protected void handleViewCourses() {
        try {
            FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource(
                    "/com/example/student_course_registration/view-courses.fxml"));
            Scene scene = new Scene(fxmlLoader.load());
            Main.getMainStage().setScene(scene);
            Main.getMainStage().setTitle("My Courses");
        } catch (IOException e) {
            System.err.println("Error loading courses view: " + e.getMessage());
            if (messageLabel != null) {
                messageLabel.setText("Error loading courses view page");
            }
            e.printStackTrace();
        }
    }

    @FXML
    protected void handleLogout() {
        try {
            if (clockTimeline != null) {
                clockTimeline.stop();
            }
            LoginController.currentStudent = null;

            FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource(
                    "/com/example/student_course_registration/login.fxml"));
            Scene scene = new Scene(fxmlLoader.load());
            Main.getMainStage().setScene(scene);
            Main.getMainStage().setTitle("Student Login");
        } catch (IOException e) {
            System.err.println("Error during logout: " + e.getMessage());
            if (messageLabel != null) {
                messageLabel.setText("Error returning to login page");
            }
            e.printStackTrace();
        }
    }

    @FXML
    protected void handleRefresh() {
        updateDashboard();
        updateDateTime();
        setupCourseChart();
        if (messageLabel != null) {
            messageLabel.setText("Dashboard refreshed successfully!");
        }
    }

    public void cleanup() {
        if (clockTimeline != null) {
            clockTimeline.stop();
        }
    }
}