"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadDataset } from "@/lib/api";
import { UploadCloud, FileType, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLoading(true);
      setError("");
      try {
        const data = await uploadDataset(selectedFile);
        setPreview(data);
        localStorage.setItem("dataset_info", JSON.stringify(data));
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to upload file. Check API server.");
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Dataset Upload</h1>
        <p className="mt-2 text-gray-500">Upload your CSV dataset for FAIR assessment.</p>
      </div>

      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className={`mx-auto h-16 w-16 mb-4 ${isDragActive ? "text-indigo-500" : "text-gray-400"}`} />
        <p className="text-xl font-medium text-gray-700">Drag & drop your CSV file here</p>
        <p className="text-gray-500 mt-2">or click to browse from your computer</p>
      </div>

      {loading && (
        <div className="mt-8 text-center text-indigo-600 font-medium">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
          Processing Dataset...
        </div>
      )}

      {error && (
        <div className="mt-8 bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {preview && !loading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FileType className="text-indigo-600" /> {preview.filename}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {preview.shape.rows} Rows • {preview.shape.cols} Columns
                </p>
              </div>
              <button 
                onClick={() => router.push("/dashboard")}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow transition-transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                Analyze Bias <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-x-auto">
              <h4 className="font-medium mb-4">Data Preview</h4>
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase">
                  <tr>
                    {preview.columns.slice(0, 8).map((col: string) => (
                      <th key={col} className="px-4 py-3 border-b">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.preview.slice(0, 5).map((row: any, i: number) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      {preview.columns.slice(0, 8).map((col: string) => (
                        <td key={col} className="px-4 py-3 text-gray-700 truncate max-w-[150px]">
                          {row[col]?.toString()}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.columns.length > 8 && (
                <p className="text-center text-sm text-gray-500 mt-4 italic">Showing first 8 columns. Data truncated.</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
