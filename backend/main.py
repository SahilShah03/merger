from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from templates import generate_report
import os
import shutil

def ensure_upload_dir():
    if not os.path.exists('uploads'):
        os.makedirs('uploads')

app = FastAPI()

@app.post("/generate-report")
async def generate_report_endpoint(file: UploadFile = File(...)):
    if not file.filename.endswith('.nessus'):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a .nessus file.")
    ensure_upload_dir()
    file_path = os.path.join('uploads', file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    report_path = generate_report(file_path)
    if not os.path.exists(report_path):
        raise HTTPException(status_code=500, detail="Failed to generate report file")
    return FileResponse(report_path, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", filename="vulnerability_report.docx") 