import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const ReviewPrototype = () => {
  const { id } = useParams(); // Get prototype ID from URL
  const navigate = useNavigate();
  const [prototype, setPrototype] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchPrototype();
  }, []);

  const fetchPrototype = async () => {
    try {
      const response = await api.get(`prototypes/${id}/`);
      setPrototype(response.data);
    } catch (error) {
      console.error("Error fetching prototype:", error);
      alert("Failed to load prototype details.");
      navigate("/dashboard");
    }
  };

  const handleReview = async (approved) => {
    if (!feedback) {
      alert("Please provide feedback before submitting.");
      return;
    }

    try {
      await api.post(`prototypes/${id}/review_prototype/`, {
        approved,
        feedback,
      });

      alert("Review submitted successfully.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  if (!prototype) return <p>Loading prototype details...</p>;

  return (
    <div>
      <h2>Review Prototype</h2>
      <p><strong>Title:</strong> {prototype.title}</p>
      <p><strong>Abstract:</strong> {prototype.abstract}</p>
      <p><strong>Student:</strong> {prototype.student_email}</p>
      <p><strong>Approval Status:</strong> {prototype.approved === null ? "Pending ⏳" : prototype.approved ? "Approved ✅" : "Rejected ❌"}</p>

      <label>Feedback:</label>
      <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} required />

      <button onClick={() => handleReview(true)}>Approve</button>
      <button onClick={() => handleReview(false)}>Reject</button>
      <button onClick={() => navigate("/dashboard")}>Cancel</button>
    </div>
  );
};

export default ReviewPrototype;
