'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import ReportFamilyTree from '@/components/ReportFamilyTree';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

function ReportPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [familyTreeData, setFamilyTreeData] = useState(null);
  const [loadingTree, setLoadingTree] = useState(false);

  useEffect(() => {
    // Validate token exists
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Get report data from URL params or session storage
    const storedReport = sessionStorage.getItem('riskReport');
    
    if (storedReport) {
      try {
        const parsedReport = JSON.parse(storedReport);
        
        // Validate report data structure
        if (!parsedReport.patientName || !parsedReport.condition) {
          throw new Error('Invalid report data structure');
        }
        
        setReportData(parsedReport);
        setLoading(false);
        
        // Fetch family tree data
        if (parsedReport.personId) {
          fetchFamilyTree(parsedReport.personId);
        }
      } catch (err) {
        console.error('Error parsing report data:', err);
        setError('Failed to load report data. Please calculate risk again.');
        setLoading(false);
        // Clear invalid data
        sessionStorage.removeItem('riskReport');
      }
    } else {
      setError('No report data found. Please calculate risk first.');
      setLoading(false);
    }
  }, [router]);

  const handleExportPDF = async () => {
    if (!reportData) {
      setError('No report data to export');
      return;
    }

    setExporting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_URL}/generate-report-pdf`,
        {
          patientName: reportData.patientName,
          condition: reportData.condition,
          totalRisk: reportData.totalRisk,
          riskLevel: reportData.riskLevel,
          affectedAncestors: reportData.affectedAncestors,
          aiReport: reportData.aiReport,
          generatedAt: reportData.generatedAt,
          treeData: familyTreeData || []
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        // Check if response contains base64 (production) or URL (development)
        if (response.data.data.base64) {
          // Production: Download from base64
          const base64 = response.data.data.base64;
          const byteCharacters = atob(base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = response.data.data.filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        } else {
          // Development: Download from URL
          const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}${response.data.data.url}`;
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = response.data.data.filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
      } else {
        setError(response.data.error || 'Failed to generate PDF');
        // Clear session storage on error
        sessionStorage.removeItem('riskReport');
      }
    } catch (err) {
      console.error('Error exporting PDF:', err);
      setError(err.response?.data?.error || 'Failed to export PDF');
      // Clear session storage on error
      sessionStorage.removeItem('riskReport');
    } finally {
      setExporting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('riskReport');
    router.push('/login');
  };

  const fetchFamilyTree = async (personId) => {
    try {
      setLoadingTree(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/tree/${personId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setFamilyTreeData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching family tree:', err);
      // Don't show error to user, just skip tree display
    } finally {
      setLoadingTree(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error && !reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-red-600 text-center mb-4">
            <p className="text-lg font-semibold">{error}</p>
          </div>
          <Link
            href="/dashboard"
            className="block w-full text-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🧬</span>
            <h1 className="text-2xl font-bold text-indigo-900">Heredity</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2"
            >
              <span>📥</span>
              <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {exportSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mx-4 mt-4">
          ✓ PDF exported successfully!
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mx-4 mt-4">
          ✗ {error}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {reportData && (
          <div className="space-y-6">
            {/* Report Header */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Genetic Risk Assessment Report
              </h2>
              <p className="text-gray-600">
                Generated on {new Date(reportData.generatedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Patient Information */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Patient Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Patient Name</p>
                  <p className="text-lg text-gray-900">{reportData.patientName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Condition</p>
                  <p className="text-lg text-gray-900">{reportData.condition}</p>
                </div>
              </div>
            </div>

            {/* Risk Summary */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Risk Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Risk Percentage */}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border-2 border-indigo-200">
                  <p className="text-sm text-indigo-600 font-semibold mb-2">Genetic Risk</p>
                  <p className="text-4xl font-bold text-indigo-900">{reportData.totalRisk}%</p>
                </div>

                {/* Risk Level */}
                <div className={`rounded-lg p-6 border-2 ${
                  reportData.riskLevel === 'High' ? 'bg-red-50 border-red-200' :
                  reportData.riskLevel === 'Medium' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-green-50 border-green-200'
                }`}>
                  <p className={`text-sm font-semibold mb-2 ${
                    reportData.riskLevel === 'High' ? 'text-red-600' :
                    reportData.riskLevel === 'Medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    Risk Level
                  </p>
                  <p className={`text-4xl font-bold ${
                    reportData.riskLevel === 'High' ? 'text-red-900' :
                    reportData.riskLevel === 'Medium' ? 'text-yellow-900' :
                    'text-green-900'
                  }`}>
                    {reportData.riskLevel}
                  </p>
                </div>

                {/* Affected Ancestors Count */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-2 border-purple-200">
                  <p className="text-sm text-purple-600 font-semibold mb-2">Affected Ancestors</p>
                  <p className="text-4xl font-bold text-purple-900">
                    {reportData.affectedAncestors?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Family History */}
            {reportData.affectedAncestors && reportData.affectedAncestors.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Family Medical History</h3>
                
                <div className="space-y-4">
                  {reportData.affectedAncestors.map((ancestor, index) => {
                    const generationName = {
                      1: 'Parent',
                      2: 'Grandparent',
                      3: 'Great-grandparent',
                      4: 'Great-great-grandparent'
                    }[ancestor.generation] || 'Ancestor';

                    return (
                      <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900">{ancestor.name}</p>
                            <p className="text-sm text-gray-600">{generationName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-indigo-600">{ancestor.risk}%</p>
                            <p className="text-xs text-gray-600">genetic contribution</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Family Tree Visualization */}
            {familyTreeData && familyTreeData.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Family Heredity Tree</h3>
                
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Legend:</strong> 
                    <span className="ml-4">🔵 Blue = No conditions</span>
                    <span className="ml-4">🔴 Red = Has medical conditions</span>
                    <span className="ml-4">⭐ Gold border = Current patient</span>
                  </p>
                </div>

                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  {loadingTree ? (
                    <div className="h-[500px] flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Loading family tree...</p>
                      </div>
                    </div>
                  ) : (
                    <ReportFamilyTree 
                      treeData={familyTreeData} 
                      patientName={reportData.patientName}
                    />
                  )}
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>How to use:</strong> Drag to pan, scroll to zoom, use controls in top-left corner. 
                    The tree shows your family structure with medical conditions highlighted in red.
                  </p>
                </div>
              </div>
            )}

            {/* AI Analysis Report */}
            {reportData.aiReport && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">AI-Generated Medical Analysis</h3>
                
                <div className="prose prose-sm max-w-none">
                  <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {reportData.aiReport}
                  </div>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> This report is for informational purposes only and should not be considered as medical advice. 
                Please consult with a healthcare professional for personalized medical guidance and treatment recommendations.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <Link
                href="/dashboard"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                ← Back to Dashboard
              </Link>
              
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {exporting ? 'Exporting...' : '📥 Export as PDF'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    }>
      <ReportPageContent />
    </Suspense>
  );
}
