import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";
import StudentModal from "../components/StudentModal";

const Dashboard = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const { admin, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/students");
            setStudents(res.data);
        } catch (error) {
            toast.error("Failed to fetch students");
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = () => {
        setEditingStudent(null);
        setShowModal(true);
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setShowModal(true);
    };

    const handleDeleteStudent = async (id) => {
        try {
            await api.delete(`/api/students/${id}`);
            toast.success("Student deleted successfully");
            setDeleteConfirm(null);
            fetchStudents();
        } catch (error) {
            toast.error("Failed to delete student");
        }
    };

    const handleModalSubmit = async (formData) => {
        try {
            if (editingStudent) {
                await api.put(`/api/students/${editingStudent._id}`, formData);
                toast.success("Student updated successfully");
            } else {
                await api.post("/api/students", formData);
                toast.success("Student added successfully");
            }
            setShowModal(false);
            setEditingStudent(null);
            fetchStudents();
        } catch (error) {
            const msg = error.response?.data?.message || "Operation failed";
            toast.error(msg);
            throw error;
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
        toast.info("Logged out successfully");
    };

    const filteredStudents = students.filter(
        (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="dashboard-page">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <div className="sidebar-logo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                            <path d="M2 17L12 22L22 17"/>
                            <path d="M2 12L12 17L22 12"/>
                        </svg>
                    </div>
                    <div>
                        <h2 className="sidebar-title">StudentRec</h2>
                        <p className="sidebar-subtitle">Admin Panel</p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <a href="#" className="sidebar-link active">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                            <path d="M16 3.13a4 4 0 010 7.75"/>
                        </svg>
                        Students
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-admin">
                        <div className="sidebar-avatar">
                            {admin?.email?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div className="sidebar-admin-info">
                            <span className="sidebar-admin-role">Administrator</span>
                            <span className="sidebar-admin-email">{admin?.email}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="sidebar-logout-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                            <polyline points="16,17 21,12 16,7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Student Records</h1>
                        <p className="dashboard-desc">Manage and view all student information</p>
                    </div>
                    <button onClick={handleAddStudent} className="btn-add-student">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Add Student
                    </button>
                </header>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card stat-card-1">
                        <div className="stat-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                                <path d="M16 3.13a4 4 0 010 7.75"/>
                            </svg>
                        </div>
                        <div>
                            <p className="stat-label">Total Students</p>
                            <p className="stat-value">{students.length}</p>
                        </div>
                    </div>
                    <div className="stat-card stat-card-2">
                        <div className="stat-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                                <path d="M6 12v5c0 2 6 3 6 3s6-1 6-3v-5"/>
                            </svg>
                        </div>
                        <div>
                            <p className="stat-label">Courses</p>
                            <p className="stat-value">{new Set(students.map((s) => s.course)).size}</p>
                        </div>
                    </div>
                </div>

                {/* Search & Table */}
                <div className="table-container">
                    <div className="table-header">
                        <div className="search-wrapper">
                            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="M21 21l-4.35-4.35"/>
                            </svg>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search by name, email or course..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <span className="table-count">
                            {filteredStudents.length} record{filteredStudents.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {loading ? (
                        <div className="table-loading">
                            <div className="spinner"></div>
                            <p>Loading students...</p>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="table-empty">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <line x1="19" y1="8" x2="19" y2="14"/>
                                <line x1="22" y1="11" x2="16" y2="11"/>
                            </svg>
                            <p className="empty-title">
                                {searchTerm ? "No students match your search" : "No students yet"}
                            </p>
                            <p className="empty-desc">
                                {searchTerm ? "Try adjusting your search terms" : "Click 'Add Student' to get started"}
                            </p>
                        </div>
                    ) : (
                        <div className="table-scroll">
                            <table className="students-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Age</th>
                                        <th>Course</th>
                                        <th>Phone</th>
                                        <th>Enrolled</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((student) => (
                                        <tr key={student._id}>
                                            <td>
                                                <div className="student-name-cell">
                                                    <div className="student-avatar">
                                                        {student.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span>{student.name}</span>
                                                </div>
                                            </td>
                                            <td className="text-muted">{student.email}</td>
                                            <td>{student.age}</td>
                                            <td>
                                                <span className="course-badge">{student.course}</span>
                                            </td>
                                            <td className="text-muted">{student.phone}</td>
                                            <td className="text-muted">{formatDate(student.enrollmentDate)}</td>
                                            <td>
                                                <div className="action-btns">
                                                    <button
                                                        onClick={() => handleEditStudent(student)}
                                                        className="btn-action btn-edit"
                                                        title="Edit"
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(student._id)}
                                                        className="btn-action btn-delete"
                                                        title="Delete"
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                            <polyline points="3,6 5,6 21,6"/>
                                                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                                                            <line x1="10" y1="11" x2="10" y2="17"/>
                                                            <line x1="14" y1="11" x2="14" y2="17"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Student Modal */}
            {showModal && (
                <StudentModal
                    student={editingStudent}
                    onSubmit={handleModalSubmit}
                    onClose={() => {
                        setShowModal(false);
                        setEditingStudent(null);
                    }}
                />
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-modal-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="15" y1="9" x2="9" y2="15"/>
                                <line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                        </div>
                        <h3>Delete Student</h3>
                        <p>Are you sure you want to delete this student? This action cannot be undone.</p>
                        <div className="delete-modal-actions">
                            <button onClick={() => setDeleteConfirm(null)} className="btn-cancel">
                                Cancel
                            </button>
                            <button onClick={() => handleDeleteStudent(deleteConfirm)} className="btn-confirm-delete">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
