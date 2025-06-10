import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Divider,
  Snackbar,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import ImageIcon from '@mui/icons-material/Image';

const steps = ['Upload Files', 'Company Details', 'Generate Report'];

const successMessages = [
  '🎉 Report generated and downloaded successfully! Thank you for using Nessus Report Aggregator.',
  '🚀 Your Nessus report is ready! Download complete.',
  '✅ Success! Your vulnerability report is now available.',
  '🥳 All done! Your report has been created and saved.',
  '📄 Your professional report is ready for review!'
];

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [companyDetails, setCompanyDetails] = useState({
    company_name: '',
    report_date: '',
    prepared_by: '',
    additional_details: '',
    report_filename: 'vulnerability-report.docx',
    description: '',
    cost_center: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [history, setHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/xml': ['.nessus', '.xml'],
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
      setError('');
    },
  });

  const validateFields = () => {
    const errors = {};
    if (!companyDetails.company_name.trim()) errors.company_name = 'Company name is required';
    if (!companyDetails.report_date) errors.report_date = 'Report date is required';
    if (!companyDetails.prepared_by.trim()) errors.prepared_by = 'Prepared by is required';
    if (!companyDetails.report_filename.trim()) {
      errors.report_filename = 'Filename is required';
    } else if (!companyDetails.report_filename.trim().toLowerCase().endsWith('.docx')) {
      errors.report_filename = 'Filename must end with .docx';
    }
    return errors;
  };

  const handleCompanyDetailsChange = (e) => {
    setCompanyDetails({
      ...companyDetails,
      [e.target.name]: e.target.value,
    });
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoFile(null);
      setLogoPreview(null);
    }
  };

  const handleNext = async () => {
    if (activeStep === 0 && files.length === 0) {
      showSnackbar('Please upload at least one Nessus file', 'error');
      return;
    }

    if (activeStep === 1) {
      const errors = validateFields();
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) {
        showSnackbar('Please fix the errors in the form', 'error');
        return;
      }
    }

    if (activeStep === 1) {
      setLoading(true);
      setError('');
      try {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('files', file);
        });
        
        // Add company details as form fields
        formData.append('company_name', companyDetails.company_name);
        formData.append('report_date', companyDetails.report_date);
        formData.append('prepared_by', companyDetails.prepared_by);
        formData.append('additional_details', companyDetails.additional_details);
        formData.append('report_filename', companyDetails.report_filename || 'vulnerability-report.docx');
        formData.append('description', companyDetails.description);
        formData.append('cost_center', companyDetails.cost_center);
        if (logoFile) {
          formData.append('logo', logoFile);
        }

        const response = await axios.post('https://merger-ua6a.onrender.com/generate-report', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
        });

        // Use the filename from the form or fallback
        const downloadFilename = companyDetails.report_filename && companyDetails.report_filename.endsWith('.docx')
          ? companyDetails.report_filename
          : 'vulnerability-report.docx';

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', downloadFilename);
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Add to history
        setHistory((prev) => [
          ...prev,
          {
            type: 'report',
            name: downloadFilename,
            files: files.map(f => f.name),
            timestamp: new Date(),
            blobUrl: url,
          },
        ]);

        // Show a random success message
        const randomMsg = successMessages[Math.floor(Math.random() * successMessages.length)];
        showSnackbar(randomMsg, 'success');
      } catch (err) {
        console.error('Error:', err);
        showSnackbar(err.response?.data?.detail || 'Error generating report', 'error');
      } finally {
        setLoading(false);
      }
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleRemoveFile = (filename) => {
    setFiles((prev) => prev.filter((file) => file.name !== filename));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Paper
              {...getRootProps()}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.300',
              }}
            >
              <input {...getInputProps()} />
              <Typography>
                {isDragActive
                  ? 'Drop the files here...'
                  : 'Drag and drop Nessus files here, or click to select files'}
              </Typography>
            </Paper>
            {files.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Selected Files:</Typography>
                {files.map((file) => (
                  <Box key={file.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ flexGrow: 1 }}>{file.name}</Typography>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemoveFile(file.name)}
                      sx={{ minWidth: 0, ml: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Company Information
            </Typography>
            <TextField
              fullWidth
              label="Company Name"
              name="company_name"
              value={companyDetails.company_name}
              onChange={handleCompanyDetailsChange}
              required
              sx={{ mb: 2 }}
              error={!!fieldErrors.company_name}
              helperText={fieldErrors.company_name}
            />
            <TextField
              fullWidth
              label="Prepared By"
              name="prepared_by"
              value={companyDetails.prepared_by}
              onChange={handleCompanyDetailsChange}
              required
              sx={{ mb: 2 }}
              error={!!fieldErrors.prepared_by}
              helperText={fieldErrors.prepared_by}
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Report Details
            </Typography>
            <TextField
              fullWidth
              label="Report Date"
              name="report_date"
              type="date"
              value={companyDetails.report_date}
              onChange={handleCompanyDetailsChange}
              required
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
              error={!!fieldErrors.report_date}
              helperText={fieldErrors.report_date}
            />
            <TextField
              fullWidth
              label="Description of Report"
              name="description"
              value={companyDetails.description}
              onChange={handleCompanyDetailsChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Cost Center"
              name="cost_center"
              value={companyDetails.cost_center}
              onChange={handleCompanyDetailsChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Additional Details"
              name="additional_details"
              value={companyDetails.additional_details}
              onChange={handleCompanyDetailsChange}
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Report Filename"
              name="report_filename"
              value={companyDetails.report_filename}
              onChange={handleCompanyDetailsChange}
              required
              sx={{ mb: 2 }}
              error={!!fieldErrors.report_filename}
              helperText={fieldErrors.report_filename || 'Only .docx files are allowed (e.g., my-report.docx)'}
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Company Logo (optional)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
                sx={{ mr: 2 }}
              >
                Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleLogoChange}
                />
              </Button>
              {logoPreview && (
                <Box sx={{ ml: 2 }}>
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    style={{ maxHeight: 48, maxWidth: 120, borderRadius: 4, border: '1px solid #ccc' }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  // History section
  const renderHistory = () => (
    <Box sx={{ mt: 6 }}>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 2 }}>
        History (this session)
      </Typography>
      {history.length === 0 ? (
        <Typography color="text.secondary">No reports generated yet.</Typography>
      ) : (
        history.map((entry, idx) => (
          <Box key={idx} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Report: <b>{entry.name}</b>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Uploaded Files: {entry.files.join(', ')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generated: {format(new Date(entry.timestamp), 'yyyy-MM-dd HH:mm:ss')}
            </Typography>
            {entry.blobUrl && (
              <Button
                size="small"
                variant="outlined"
                sx={{ mt: 1 }}
                href={entry.blobUrl}
                download={entry.name}
              >
                Download Again
              </Button>
            )}
          </Box>
        ))
      )}
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* AuditIQo Logo and Branding */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
        <img src="/logo1.png" alt="AuditIQo Logo" style={{ height: 56, marginBottom: 4 }} />
      
      </Box>
      {/* Progress bar at the top when loading */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Nessus Report Aggregator
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {renderStepContent(activeStep)}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={loading || activeStep === steps.length - 1}
        >
          {loading ? <CircularProgress size={24} /> : activeStep === steps.length - 2 ? 'Generate Report' : 'Next'}
        </Button>
      </Box>

      {renderHistory()}

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}

export default App; 