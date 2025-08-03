package com.example.student_course_registration;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FileHandler {
    private static final String DATA_DIR = System.getProperty("user.dir") + File.separator + "data";
    private static final String STUDENTS_FILE = "students.dat";
    private static final String COURSES_FILE = "courses.dat";

    static {
        createDataDirectory();
        clearAndInitializeCourses(); // Changed to always initialize courses on startup
    }

    private static void createDataDirectory() {
        try {
            File directory = new File(DATA_DIR);
            if (!directory.exists()) {
                boolean created = directory.mkdirs();
                if (created) {
                    System.out.println("Created data directory at: " + directory.getAbsolutePath());
                } else {
                    System.err.println("Failed to create directory at: " + directory.getAbsolutePath());
                }
            }
            System.out.println("Data directory path: " + directory.getAbsolutePath());
        } catch (SecurityException e) {
            System.err.println("Error creating data directory: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // New method to ensure fresh course initialization
    private static void clearAndInitializeCourses() {
        File coursesFile = new File(DATA_DIR + File.separator + COURSES_FILE);
        if (coursesFile.exists()) {
            if (!coursesFile.delete()) {
                System.err.println("Failed to delete existing courses file");
            }
        }
        initializeDefaultCourses();
    }

    private static void initializeDefaultCourses() {
        List<Course> defaultCourses = new ArrayList<>();
        // Creating default courses with consistent data
        defaultCourses.add(new Course("CS101", "Introduction to Programming", 3));
        defaultCourses.add(new Course("CS102", "Data Structures", 3));
        defaultCourses.add(new Course("CS201", "Database Management", 3));
        defaultCourses.add(new Course("CS202", "Web Development", 3));
        defaultCourses.add(new Course("CS301", "Software Engineering", 4));

        // Save courses and verify they were saved correctly
        saveCourses(defaultCourses);

        // Verify courses were saved
        List<Course> loadedCourses = loadCourses();
        if (loadedCourses == null || loadedCourses.isEmpty()) {
            System.err.println("Failed to initialize courses properly");
        } else {
            System.out.println("Successfully initialized " + loadedCourses.size() + " courses");
        }
    }

    public static void saveStudent(Student student) {
        createDataDirectory();

        File file = new File(DATA_DIR + File.separator + STUDENTS_FILE);
        System.out.println("Data file exists before save: " + file.exists());

        Map<String, Student> students = loadAllStudents();
        students.put(student.getUsername(), student);

        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(file))) {
            oos.writeObject(students);
            System.out.println("Successfully saved student data to: " + file.getAbsolutePath());
            System.out.println("Data file exists after save: " + file.exists());
        } catch (IOException e) {
            System.err.println("Error saving student data: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @SuppressWarnings("unchecked")
    public static Map<String, Student> loadAllStudents() {
        File file = new File(DATA_DIR + File.separator + STUDENTS_FILE);
        if (!file.exists()) {
            System.out.println("No existing student data file found at: " + file.getAbsolutePath());
            return new HashMap<>();
        }

        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file))) {
            Map<String, Student> students = (Map<String, Student>) ois.readObject();
            System.out.println("Successfully loaded student data from: " + file.getAbsolutePath());
            return students;
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Error loading student data: " + e.getMessage());
            e.printStackTrace();
            backupCorruptedFile(file);
            return new HashMap<>();
        }
    }

    public static void saveCourses(List<Course> courses) {
        if (courses == null || courses.isEmpty()) {
            System.err.println("Attempting to save null or empty course list");
            return;
        }

        File file = new File(DATA_DIR + File.separator + COURSES_FILE);
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(file))) {
            oos.writeObject(courses);
            System.out.println("Successfully saved " + courses.size() + " courses to: " + file.getAbsolutePath());
        } catch (IOException e) {
            System.err.println("Error saving courses: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @SuppressWarnings("unchecked")
    public static List<Course> loadCourses() {
        File file = new File(DATA_DIR + File.separator + COURSES_FILE);
        if (!file.exists()) {
            System.out.println("No existing courses file found. Initializing default courses.");
            initializeDefaultCourses();
            return loadCourses(); // Recursive call after initialization
        }

        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file))) {
            List<Course> courses = (List<Course>) ois.readObject();
            if (courses == null || courses.isEmpty()) {
                System.err.println("Loaded course list is null or empty. Reinitializing...");
                clearAndInitializeCourses();
                return loadCourses();
            }
            System.out.println("Successfully loaded " + courses.size() + " courses from: " + file.getAbsolutePath());
            // Print each course for verification
            for (Course course : courses) {
                System.out.println("Loaded course: " + course.getCode() + " - " + course.getName());
            }
            return courses;
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Error loading courses: " + e.getMessage());
            e.printStackTrace();
            backupCorruptedFile(file);
            clearAndInitializeCourses();
            return loadCourses();
        }
    }

    private static void backupCorruptedFile(File file) {
        if (file.exists()) {
            try {
                String backupPath = file.getAbsolutePath() + ".backup." + System.currentTimeMillis();
                Files.copy(file.toPath(), Paths.get(backupPath));
                System.out.println("Created backup of corrupted file: " + backupPath);
                file.delete();
            } catch (IOException e) {
                System.err.println("Error creating backup of corrupted file: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }

    public static String getDataDirectoryPath() {
        return DATA_DIR;
    }

    public static boolean doesDataFileExist() {
        File file = new File(DATA_DIR + File.separator + STUDENTS_FILE);
        return file.exists();
    }

    public static boolean doesCoursesFileExist() {
        File file = new File(DATA_DIR + File.separator + COURSES_FILE);
        return file.exists();
    }

    public static void clearAllData() {
        File studentsFile = new File(DATA_DIR + File.separator + STUDENTS_FILE);
        File coursesFile = new File(DATA_DIR + File.separator + COURSES_FILE);

        if (studentsFile.exists()) {
            studentsFile.delete();
            System.out.println("Deleted students data file");
        }

        if (coursesFile.exists()) {
            coursesFile.delete();
            System.out.println("Deleted courses data file");
        }

        // Reinitialize default courses
        clearAndInitializeCourses();
    }
}