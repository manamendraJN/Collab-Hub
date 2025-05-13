import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { toast } from "react-toastify";

export default function ReportGenerator({ selectedProjectId, projectName }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!selectedProjectId) {
      toast.error("Please select a project to generate a report.");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`/api/tasks/report/${selectedProjectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate report");
      }

      const blob = await response.blob();
      if (blob.size < 1000) {
        console.error("Received PDF is too small:", blob.size, "bytes");
        throw new Error("Generated PDF is invalid or empty");
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${projectName.replace(/[^a-zA-Z0-9]/g, "_")}_Task_Report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-2 mb-5"
    >
      <motion.button
        id="report-generator-button"
        onClick={handleGenerateReport}
        disabled={isGenerating}
        className={`flex items-center space-x-2 py-1.5 px-4 rounded-md transition-colors ${
          isGenerating
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
        whileHover={{ scale: isGenerating ? 1 : 1.03 }}
        whileTap={{ scale: isGenerating ? 1 : 0.98 }}
      >
        <FileText size={16} />
        <span>{isGenerating ? "Generating..." : "Generate Report"}</span>
      </motion.button>
    </motion.div>
  );
}