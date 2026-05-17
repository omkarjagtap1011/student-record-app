import { useState, useEffect } from "react";

const StudentModal = ({ student, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
        course: "",
        phone: "",
        enrollmentDate: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (student) {
            setFormData({
                name: student.name || "",
                email: student.email || "",
                age: student.age || "",
                course: student.course || "",
                phone: student.phone || "",
                enrollmentDate: student.enrollmentDate
                    ? new Date(student.enrollmentDate).toISOString().split("T")[0]
                    : "",
            });
        }
    }, [student]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit({
                ...formData,
                age: Number(formData.age),
            });
        } catch {
            // error handled in parent
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="student-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{student ? "Edit Student" : "Add New Student"}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="modal-form-grid">
                        <div className="form-group">
                            <label className="form-label" htmlFor="modal-name">Full Name</label>
                            <input
                                id="modal-name"
                                type="text"
                                name="name"
                                className="form-input"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="modal-email">Email</label>
                            <input
                                id="modal-email"
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="modal-age">Age</label>
                            <input
                                id="modal-age"
                                type="number"
                                name="age"
                                className="form-input"
                                placeholder="20"
                                min="1"
                                value={formData.age}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="modal-course">Course</label>
                            <input
                                id="modal-course"
                                type="text"
                                name="course"
                                className="form-input"
                                placeholder="Computer Science"
                                value={formData.course}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="modal-phone">Phone</label>
                            <input
                                id="modal-phone"
                                type="text"
                                name="phone"
                                className="form-input"
                                placeholder="+91 9876543210"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="modal-enrollment">Enrollment Date</label>
                            <input
                                id="modal-enrollment"
                                type="date"
                                name="enrollmentDate"
                                className="form-input"
                                value={formData.enrollmentDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <span className="btn-loading">
                                    <span className="btn-spinner"></span>
                                    {student ? "Updating..." : "Adding..."}
                                </span>
                            ) : (
                                student ? "Update Student" : "Add Student"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentModal;
