import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx"; // For Excel export
import jsPDF from "jspdf"; // For PDF export
import "jspdf-autotable"; // For PDF table formatting

export default function TeamProductivityReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/report/productivity`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) throw new Error(`Failed to fetch report: ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
        setError(null);
      } else {
        throw new Error(data.message || "Failed to fetch report");
      }
    } catch (err) {
      setError(err.message);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  // Function to download report as Excel
  const downloadExcel = () => {
    if (!report) return;

    const data = report.members.map(member => ({
      Member: `${member.username} (${member.email})`,
      "Total Projects": member.total,
      Completed: member.completed,
      "In Progress": member.inProgress,
      "At Risk": member.atRisk,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Team Productivity");
    XLSX.writeFile(wb, "Team_Productivity_Report.xlsx");
  };

  // Function to download report as PDF
  const downloadPDF = () => {
    if (!report) return;

    const doc = new jsPDF();
    doc.text("Team Productivity Report", 20, 10);

    const tableData = report.members.map(member => [
      `${member.username} (${member.email})`,
      member.total,
      member.completed,
      member.inProgress,
      member.atRisk,
    ]);

    doc.autoTable({
      head: [["Member", "Total Projects", "Completed", "In Progress", "At Risk"]],
      body: tableData,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] }, // Blue header
    });

    doc.save("Team_Productivity_Report.pdf");
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <svg className="w-8 h-8 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Team Productivity Report
          </h2>
          <p className="text-gray-600 mt-1">
            View productivity metrics for team members across all projects.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={fetchReport}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9H4m0 0H3m17 0h1m-1 0a8.001 8.001 0 01-15.356 2m15.356-2H20m-1-7v5h-.582m-14.774 2A8.001 8.001 0 0119.418 9H20m0 0V4" />
            </svg>
            Refresh
          </button>
          {report && (
            <>
              <button
                onClick={downloadExcel}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Excel
              </button>
              <button
                onClick={downloadPDF}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                PDF
              </button>
            </>
          )}
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
          <svg className="w-6 h-6 animate-spin text-blue-500 mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p className="text-gray-700">Loading report...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Error: {error}</p>
        </div>
      )}

      {/* Report Table */}
      {report && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Member Productivity</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-50 text-gray-700">
                  <th className="border border-gray-200 p-3 text-left">Member</th>
                  <th className="border border-gray-200 p-3 text-center">Total Projects</th>
                  <th className="border border-gray-200 p-3 text-center">Completed</th>
                  <th className="border border-gray-200 p-3 text-center">In Progress</th>
                  <th className="border border-gray-200 p-3 text-center">At Risk</th>
                </tr>
              </thead>
              <tbody>
                {report.members.map((member, index) => (
                  <tr
                    key={member.email}
                    className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="border border-gray-200 p-3">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {member.username} ({member.email})
                      </div>
                    </td>
                    <td className="border border-gray-200 p-3 text-center">{member.total}</td>
                    <td className="border border-gray-200 p-3 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {member.completed}
                      </span>
                    </td>
                    <td className="border border-gray-200 p-3 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        {member.inProgress}
                      </span>
                    </td>
                    <td className="border border-gray-200 p-3 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {member.atRisk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}