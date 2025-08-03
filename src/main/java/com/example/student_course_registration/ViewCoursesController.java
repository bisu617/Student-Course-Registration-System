package com.example.student_course_registration;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import java.io.IOException;
import java.util.List;

public class ViewCoursesController {
    @FXML private TableView<Course> coursesTable;
    @FXML private TableColumn<Course, String> codeColumn;
    @FXML private TableColumn<Course, String> nameColumn;
    @FXML private TableColumn<Course, Integer> creditsColumn;
    @FXML private TableColumn<Course, Void> actionColumn;
    @FXML private Label messageLabel;

    @FXML
    public void initialize() {
        try {
            setupTable();
            loadCourses();
        } catch (Exception e) {
            System.err.println("Error initializing view courses: " + e.getMessage());
            messageLabel.setText("Error loading courses");
            e.printStackTrace();
        }
    }

    private void setupTable() {
        // Set up the columns
        codeColumn.setCellValueFactory(new PropertyValueFactory<>("code"));
        nameColumn.setCellValueFactory(new PropertyValueFactory<>("name"));
        creditsColumn.setCellValueFactory(new PropertyValueFactory<>("credits"));

        // Setup the action column with delete button
        actionColumn.setCellFactory(param -> new TableCell<>() {
            private final Button deleteButton = new Button("Delete");

            {
                deleteButton.setOnAction(event -> {
                    Course course = getTableView().getItems().get(getIndex());
                    handleDeleteCourse(course);
                });

                deleteButton.setStyle(
                        "-fx-background-color: #f44336;" +
                                "-fx-text-fill: white;" +
                                "-fx-font-weight: bold;" +
                                "-fx-padding: 5 10;" +
                                "-fx-background-radius: 5;"
                );
            }

            @Override
            protected void updateItem(Void item, boolean empty) {
                super.updateItem(item, empty);
                if (empty) {
                    setGraphic(null);
                } else {
                    setGraphic(deleteButton);
                }
            }
        });
    }

    private void loadCourses() {
        if (LoginController.currentStudent != null) {
            List<Course> registeredCourses = LoginController.currentStudent.getRegisteredCourses();
            if (registeredCourses != null) {
                coursesTable.getItems().clear();
                coursesTable.getItems().addAll(registeredCourses);
            }

            if (coursesTable.getItems().isEmpty()) {
                messageLabel.setText("No courses registered yet");
            } else {
                messageLabel.setText(coursesTable.getItems().size() + " courses registered");
            }
        }
    }

    private void handleDeleteCourse(Course course) {
        Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
        alert.setTitle("Confirm Delete");
        alert.setHeaderText("Delete Course Registration");
        alert.setContentText("Are you sure you want to delete " + course.getName() + "?");

        if (alert.showAndWait().get() == ButtonType.OK) {
            if (LoginController.currentStudent != null) {
                LoginController.currentStudent.unregisterCourse(course);
                try {
                    FileHandler.saveStudent(LoginController.currentStudent);
                    loadCourses(); // Refresh the table
                    messageLabel.setText("Course deleted successfully");
                } catch (Exception e) {
                    System.err.println("Error saving student data: " + e.getMessage());
                    messageLabel.setText("Error deleting course");
                    e.printStackTrace();
                }
            }
        }
    }

    @FXML
    protected void handleBack() {
        try {
            FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource(
                    "/com/example/student_course_registration/dashboard.fxml"));
            Scene scene = new Scene(fxmlLoader.load());
            Main.getMainStage().setScene(scene);
            Main.getMainStage().setTitle("Dashboard");
        } catch (IOException e) {
            System.err.println("Error returning to dashboard: " + e.getMessage());
            messageLabel.setText("Error returning to dashboard");
            e.printStackTrace();
        }
    }
}