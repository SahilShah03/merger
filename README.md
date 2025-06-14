# Nessus Report Aggregator & Analyzer

A web-based platform for merging and analyzing multiple Nessus scan files into a structured Word document report.

## Features

- Upload multiple Nessus files (.nessus/.xml)
- Merge and analyze vulnerabilities by IP address
- Sort vulnerabilities by severity (Critical → High → Medium → Low)
- Generate professional Word document reports
- Customize report headers with company details

## Project Structure

```
nessus-analyzer/
├── frontend/           # React frontend application
├── backend/           # Python FastAPI backend
└── README.md
```

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Run the backend server:
```bash
uvicorn main:app --reload
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run the development server:
```bash
npm start
```

## Technologies Used

- Frontend: React.js, Material-UI
- Backend: Python, FastAPI
- Document Generation: python-docx
- XML Processing: xml.etree.ElementTree

## MIT License

Copyright (c) 2025 Sahil Shah

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell    
copies of the Software, and to permit persons to whom the Software is        
furnished to do so, subject to the following conditions:                     

The above copyright notice and this permission notice shall be included in   
all copies or substantial portions of the Software.                          

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR   
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,     
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE  
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER       
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING      
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
IN THE SOFTWARE.


Design & Developed by Sahil Shah
#   A u d i t I Q  
 #   A u d i t I Q x  
 #   A u d i t I Q o x  
 #   A u d i t I Q o x  
 #   m e r g e r  
 