const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { generateTreeTextRepresentation, generateFamilyTreeSummary } = require('./treeTextService');

const generatePDFReport = async (reportData) => {
  try {
    // Create reports directory if it doesn't exist
    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const timestamp = Date.now();
    // Sanitize filename: remove special characters, replace spaces with underscores
    const sanitizedName = reportData.patientName
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .substring(0, 50); // Limit length
    const filename = `report_${sanitizedName}_${timestamp}.pdf`;
    const filepath = path.join(reportsDir, filename);

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    doc.fontSize(24).font('Helvetica-Bold').text('GENETIC RISK ASSESSMENT REPORT', {
      align: 'center'
    });

    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text('Confidential Medical Document', {
      align: 'center'
    });

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // doc.fontSize(14).font('Helvetica-Bold').text('PATIENT INFORMATION', {
    //   underline: true
    // });
    // doc.moveDown(0.5);

    // doc.fontSize(11).font('Helvetica');
    // doc.text(`Patient Name: ${reportData.patientName}`, { width: 500 });
    // doc.text(`Condition: ${reportData.condition}`, { width: 500 });
    // doc.text(`Report Generated: ${new Date(reportData.generatedAt).toLocaleDateString()}`, { width: 500 });
    // doc.moveDown(1);

    // doc.fontSize(14).font('Helvetica-Bold').text('RISK SUMMARY', {
    //   underline: true
    // });
    // doc.moveDown(0.5);

    // doc.rect(50, doc.y, 500, 60).stroke();
    // doc.fontSize(12).font('Helvetica-Bold').text(`Genetic Risk: ${reportData.totalRisk}%`, {
    //   x: 60,
    //   y: doc.y + 10
    // });
    // doc.fontSize(11).font('Helvetica').text(`Risk Level: ${reportData.riskLevel}`, {
    //   x: 60,
    //   y: doc.y + 5
    // });
    // doc.moveDown(4);

    // doc.fontSize(14).font('Helvetica-Bold').text('FAMILY MEDICAL HISTORY', {
    //   underline: true
    // });
    // doc.moveDown(0.5);

    // if (reportData.affectedAncestors && Array.isArray(reportData.affectedAncestors) && reportData.affectedAncestors.length > 0) {
    //   doc.fontSize(11).font('Helvetica');
    //   reportData.affectedAncestors.forEach((ancestor, index) => {
    //     const generationName = {
    //       1: 'Parent',
    //       2: 'Grandparent',
    //       3: 'Great-grandparent',
    //       4: 'Great-great-grandparent'
    //     }[ancestor.generation] || 'Ancestor';

    //     doc.text(`${index + 1}. ${ancestor.name} (${generationName}) - ${ancestor.risk}% contribution`, {
    //       width: 500
    //     });
    //   });
    // } else {
    //   doc.fontSize(11).font('Helvetica').text('No affected ancestors found', {
    //     width: 500
    //   });
    // }

    // doc.moveDown(1);

    // if (reportData.treeData && reportData.treeData.length > 0) {
    //   doc.addPage();
    //   doc.fontSize(14).font('Helvetica-Bold').text('FAMILY HEREDITY TREE', {
    //     underline: true
    //   });
    //   doc.moveDown(0.5);

    //   const treeSummary = generateFamilyTreeSummary(
    //     reportData.treeData,
    //     reportData.patientName,
    //     reportData.condition
    //   );

    //   doc.fontSize(10).font('Helvetica').text(treeSummary, {
    //     width: 500
    //   });

    //   doc.moveDown(1);


    //   const treeText = generateTreeTextRepresentation(
    //     reportData.treeData,
    //     reportData.patientName
    //   );

    //   doc.fontSize(9).font('Courier').text(treeText, {
    //     width: 500
    //   });
    // }

    if (reportData.aiReport) {
      doc.fontSize(14).font('Helvetica-Bold').text('AI-GENERATED MEDICAL ANALYSIS', {
        underline: true
      });
      doc.moveDown(0.5);

      doc.fontSize(10).font('Helvetica').text(reportData.aiReport, {
        width: 500,
        align: 'justify'
      });
    }
    doc.moveDown(0.5);
    doc.fontSize(14).font('Helvetica-Bold').text(
      'This report is for informational purposes only and should not be considered as medical advice. Please consult with a healthcare professional for personalized medical guidance.',
      {
        align: 'center',
        width: 500
      }
    );

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        resolve({
          success: true,
          filename: filename,
          filepath: filepath,
          url: `/reports/${filename}`
        });
      });

      stream.on('error', (err) => {
        reject({
          success: false,
          error: err.message
        });
      });

      doc.on('error', (err) => {
        reject({
          success: false,
          error: err.message
        });
      });
    });
  } catch (error) {
    console.error('Error generating PDF report:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = { generatePDFReport };
