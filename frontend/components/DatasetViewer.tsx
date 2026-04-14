"use client";
import React, { useState } from 'react';
import { Search, RotateCcw, Filter, ChevronLeft, ChevronRight, Hash, Type, AlertCircle, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DatasetViewerProps {
  data: any[];
  columns: string[];
  stats?: {
    rows: number;
    cols: number;
    column_types: Record<string, string>;
    missing_values: Record<string, number>;
  };
}

export default function DatasetViewer({ data = [], columns = [], stats }: DatasetViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredData = data.filter(row => 
    columns.some(col => 
      row[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getTypeIcon = (col: string) => {
    const type = stats?.column_types[col]?.toLowerCase() || '';
    if (type.includes('int') || type.includes('float')) return <Hash className="w-3 h-3" />;
    return <Type className="w-3 h-3" />;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Total Records</p>
            <p className="text-xl font-bold text-white">{stats.rows.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Features</p>
            <p className="text-xl font-bold text-indigo-400">{stats.cols}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Null Values</p>
            <p className="text-xl font-bold text-rose-400">
              {Object.values(stats.missing_values).reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Data Quality</p>
            <p className="text-xl font-bold text-emerald-400">98.4%</p>
          </div>
        </div>
      )}

      {/* Table Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text"
            placeholder="Search dataset in real-time..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 ring-indigo-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
        
        <div className="flex items-center gap-2">
            <button className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-slate-400 hover:text-white transition-colors">
                <RotateCcw className="w-4 h-4" />
            </button>
            <button className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Filter</span>
            </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="rounded-2xl border border-white/5 bg-slate-900/50 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/5">
                {columns.map((col) => (
                  <th key={col} className="px-5 py-4 min-w-[150px]">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1 bg-white/5 rounded text-slate-400">{getTypeIcon(col)}</span>
                        <span className="font-bold text-slate-300 uppercase text-[10px] tracking-widest">{col}</span>
                      </div>
                      {stats?.missing_values[col] > 0 && (
                        <div className="flex items-center gap-1 text-rose-400">
                          <AlertCircle className="w-3 h-3" />
                          <span className="text-[9px] font-bold">{stats.missing_values[col]}</span>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, i) => (
                <tr key={i} className="border-b border-white/[0.02] hover:bg-indigo-500/[0.02] transition-colors">
                  {columns.map((col) => (
                    <td key={col} className="px-5 py-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {row[col]?.toString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing <span className="text-white font-bold">{(currentPage-1)*rowsPerPage + 1}</span> to <span className="text-white font-bold">{Math.min(currentPage*rowsPerPage, filteredData.length)}</span> of <span className="text-white font-bold">{filteredData.length}</span> entries
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 rounded-lg bg-white/5 text-slate-400 disabled:opacity-20 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 rounded-lg bg-white/5 text-slate-400 disabled:opacity-20 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
