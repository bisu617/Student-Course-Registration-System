package com.example.student_course_registration;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.VBox;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

public class CourseRegistrationController {
    @FXML private ListView<Course> availableCoursesListView;
    @FXML private Label messageLabel;
    @FXML private Label studentInfoLabel;
    private List<Course> courses;

    @FXML
    public void initialize() {
        try {
            if (LoginController.currentStudent == null) {
                handleBack();
                return;
            }

            updateStudentInfo();
            courses = FileHandler.loadCourses();

            if (courses == null || courses.isEmpty()) {
                messageLabel.setText("No courses available for registration");
                return;
            }

            setupListView();
            updateAvailableCoursesList();

        } catch (Exception e) {
            System.err.println("Error initializing course registration: " + e.getMessage());
            messageLabel.setText("Error loading courses");
            e.printStackTrace();
        }
    }

    private void setupListView() {
        availableCoursesListView.setCellFactory(param -> new ListCell<Course>() {
            private final Label titleLabel = new Label();
            private final Label detailsLabel = new Label();
            private final VBox container = new VBox(5);

            {
                titleLabel.getStyleClass().add("course-title");
                detailsLabel.getStyleClass().add("course-details");
                container.getStyleClass().add("course-container");
                container.getChildren().addAll(titleLabel, detailsLabel);
            }

            @Override
            protected void updateItem(Course course, boolean empty) {
                super.updateItem(course, empty);
                if (empty || course == null) {
                    setText(null);
                    setGraphic(null);
                } else {
                    titleLabel.setText(String.format("%s - %s", course.getCode(), course.getName()));
                    detailsLabel.setText(String.format("%d Credits", course.getCredits()));

                    titleLabel.setWrapText(true);
                    detailsLabel.setWrapText(true);

                    double width = getListView().getWidth() - 20;
                    titleLabel.setMaxWidth(width);
                    detailsLabel.setMaxWidth(width);

                    setGraphic(container);
                }
            }
        });

        availableCoursesListView.widthProperty().addListener((obs, oldVal, newVal) ->
                availableCoursesListView.refresh());
    }

    private void updateStudentInfo() {
        Student student = LoginController.currentStudent;
        studentInfoLabel.setText(String.format("""
            Name: %s
            Student ID: %s
            Program: %s
            Semester: %s
            Registered Courses: %d""",
                student.getName(),
                student.getUsername(),
                student.getProgram(),
                student.getSemester(),
                student.getRegisteredCourses().size()));
    }

    private void updateAvailableCoursesList() {
        availableCoursesListView.getItems().clear();
        courses.stream()
                .filter(course -> !LoginController.currentStudent.getRegisteredCourses().contains(course))
                .forEach(course -> availableCoursesListView.getItems().add(course));

        int availableCourses = availableCoursesListView.getItems().size();
        messageLabel.setText(availableCourses == 0 ?
                "No more courses available for registration" :
                String.format("Found %d available course%s",
                        availableCourses,
                        availableCourses == 1 ? "" : "s"));
    }

    @FXML
    protected void handleRegister() {
        Course selectedCourse = availableCoursesListView.getSelectionModel().getSelectedItem();
        if (selectedCourse == null) {
            showAlert(Alert.AlertType.WARNING, "Selection Required",
                    "Please select a course to register");
            return;
        }

        try {
            if (LoginController.currentStudent.getRegisteredCourses().contains(selectedCourse)) {
                showAlert(Alert.AlertType.ERROR, "Already Registered",
                        "You are already registered for this course: " + selectedCourse.getCode());
                return;
            }

            if (showConfirmation("Confirm Registration",
                    String.format("Do you want to register for %s - %s?",
                            selectedCourse.getCode(), selectedCourse.getName()))) {
                LoginController.currentStudent.registerCourse(selectedCourse);
                FileHandler.saveStudent(LoginController.currentStudent);
                updateAvailableCoursesList();
                updateStudentInfo();

                showAlert(Alert.AlertType.INFORMATION, "Course Registration",
                        String.format("Successfully registered for %s - %s",
                                selectedCourse.getCode(), selectedCourse.getName()));
            }
        } catch (Exception e) {
            System.err.println("Error registering for course: " + e.getMessage());
            showAlert(Alert.AlertType.ERROR, "Registration Failed",
                    "Could not register for the course. Please try again.");
            e.printStackTrace();
        }
    }

    @FXML
    protected void handleBack() {
        try {
            FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource(
                    "/com/example/student_course_registration/dashboard.fxml"));
            Scene scene = new Scene(fxmlLoader.load());
            Main.getMainStage().setScene(scene);
            Main.getMainStage().setTitle("Student Dashboard");
        } catch (IOException e) {
            System.err.println("Error returning to dashboard: " + e.getMessage());
            showAlert(Alert.AlertType.ERROR, "Navigation Error",
                    "Could not return to dashboard. Please try again.");
            e.printStackTrace();
        }
    }

    private void showAlert(Alert.AlertType type, String title, String content) {
        Alert alert = new Alert(type);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(content);
        alert.showAndWait();
    }

    private boolean showConfirmation(String title, String content) {
        Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(content);
        Optional<ButtonType> result = alert.showAndWait();
        return result.isPresent() && result.get() == ButtonType.OK;
    }
}