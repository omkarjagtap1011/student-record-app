import express from "express";
import Student from "../models/Student.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// GET /api/students - Get all students
router.get("/", async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET /api/students/:id - Get single student
router.get("/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// POST /api/students - Add new student
router.post("/", async (req, res) => {
    try {
        const { name, email, age, course, phone, enrollmentDate } = req.body;

        // Check if email already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: "A student with this email already exists." });
        }

        const student = new Student({
            name,
            email,
            age,
            course,
            phone,
            enrollmentDate: enrollmentDate || Date.now(),
        });

        const savedStudent = await student.save();
        res.status(201).json({ message: "Student added successfully", student: savedStudent });
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// PUT /api/students/:id - Update student
router.put("/:id", async (req, res) => {
    try {
        const { name, email, age, course, phone, enrollmentDate } = req.body;

        // Check if email already exists for another student
        if (email) {
            const existingStudent = await Student.findOne({ email, _id: { $ne: req.params.id } });
            if (existingStudent) {
                return res.status(400).json({ message: "Another student with this email already exists." });
            }
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            { name, email, age, course, phone, enrollmentDate },
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// DELETE /api/students/:id - Delete student
router.delete("/:id", async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);

        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
