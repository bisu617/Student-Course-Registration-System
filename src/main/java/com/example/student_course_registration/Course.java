package com.example.student_course_registration;

import java.io.Serializable;
import java.util.Objects;

public class Course implements Serializable {

    private static final long serialVersionUID = -8047738126990029227L;

    private final String code;
    private final String name;
    private final int credits;

    public Course(String code, String name, int credits) {
        this.code = Objects.requireNonNull(code, "Course code cannot be null");
        this.name = Objects.requireNonNull(name, "Course name cannot be null");
        this.credits = credits;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public int getCredits() {
        return credits;
    }

    @Override
    public String toString() {
        return String.format("%s - %s (%d Credits)", code, name, credits);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Course course = (Course) o;
        return Objects.equals(code, course.code);
    }

    @Override
    public int hashCode() {
        return Objects.hash(code);
    }
}