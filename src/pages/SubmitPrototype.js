import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const SubmitPrototype = () => {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [hasPhysicalPrototype, setHasPhysicalPrototype] = useState(false);
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [academicYear, setAcademicYear] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchStudents();
    fetchDepartments();
    fetchSupervisors();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return alert("No access token found!");

    try {
      const response = await api.get("user/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserRole(response.data.role);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user role:", error);
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await api.get("users/students/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchDepartments = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await api.get("departments/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchSupervisors = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await api.get("users/supervisors/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSupervisors(response.data);
    } catch (error) {
      console.error("Error fetching supervisors:", error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
    e.target.value = ""; // Reset file input after selection
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) return alert("You need to log in first!");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("abstract", abstract);
    formData.append("has_physical_prototype", hasPhysicalPrototype);
    formData.append("department", selectedDepartment);  
    formData.append("academic_year", academicYear);
    formData.append("supervisor", supervisor);

    if (userRole === "admin" && selectedStudent) {
      formData.append("student", selectedStudent);
    }

    attachments.forEach((file) => {
      formData.append("attachments[]", file);
    });

    console.log("Submitting Prototype Data:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      await api.post("prototypes/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Prototype submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting prototype:", error);
      console.error("Server response:", error.response?.data);
      alert(error.response?.data?.detail || "Failed to submit prototype.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{userRole === "admin" ? "Add Prototype (Admin)" : "Submit New Prototype"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        
        <label>Abstract:</label>
        <textarea placeholder="Abstract" value={abstract} onChange={(e) => setAbstract(e.target.value)} required />
        
        <label>Department:</label>
        <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} required>
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>

        <label>Academic Year:</label>
        <input
          type="text"
          placeholder="e.g. 2024/2025"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          required
        />

        <label>Supervisor:</label>
        <select value={supervisor} onChange={(e) => setSupervisor(e.target.value)} required>
          <option value="">Select Supervisor</option>
          {supervisors.map((sup) => (
            <option key={sup.id} value={sup.id}>{sup.name}</option>
          ))}
        </select>

        <label>Attachments:</label>
        <input type="file" multiple onChange={handleFileChange} />
        <ul>
          {attachments.map((file, index) => (
            <li key={index}>
              {file.name} <button type="button" onClick={() => removeAttachment(index)}>Remove</button>
            </li>
          ))}
        </ul>
        
        <label>
          <input type="checkbox" checked={hasPhysicalPrototype} onChange={(e) => setHasPhysicalPrototype(e.target.checked)} />
          Has Physical Prototype?
        </label>

        {userRole === "admin" && (
          <>
            <label>Assign to Student:</label>
            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required>
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>{student.email}</option>
              ))}
            </select>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : userRole === "admin" ? "Add Prototype" : "Submit Prototype"}
        </button>
      </form>
    </div>
  );
};

export default SubmitPrototype;
