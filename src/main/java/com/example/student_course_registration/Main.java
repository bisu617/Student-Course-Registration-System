package com.example.student_course_registration;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.ButtonType;
import javafx.stage.Stage;
import java.io.IOException;

public class Main extends Application {
    private static Stage mainStage;

    @Override
    public void start(Stage stage) throws IOException {
        mainStage = stage;

        // Add confirmation dialog on window close
        stage.setOnCloseRequest(event -> {
            event.consume();
            Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
            alert.setTitle("Confirm Exit");
            alert.setHeaderText("Are you sure you want to exit?");
            alert.setContentText("Any unsaved changes will be lost.");

            if (alert.showAndWait().get() == ButtonType.OK) {
                stage.close();
            }
        });

        FXMLLoader fxmlLoader = new FXMLLoader(Main.class.getResource("/com/example/student_course_registration/login.fxml"));
        Scene scene = new Scene(fxmlLoader.load());
        stage.setTitle("Student Course Registration System");
        stage.setScene(scene);
        stage.show();
    }

    public static Stage getMainStage() {
        return mainStage;
    }

    public static void main(String[] args) {
        launch();
    }
}