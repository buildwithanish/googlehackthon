"use client";
import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Filter, ChevronLeft, ChevronRight, Hash, Type, AlertCircle, BarChart3, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDatasetProfile } from '@/lib/api';

interface DatasetViewerProps {
  data: any[];
  columns: string[];
  stats?: any;
  fileId?: string;
}

export default function DatasetViewer({ data = [], columns = [], stats: initialStats, fileId }: DatasetViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState(initialStats);
  const rowsPerPage = 10;

  useEffect(() => {
    setStats(initialStats);
  }, [initialStats]);

  useEffect(() => {
    if (fileId && (!stats || stats.rows === "Calculating...")) {
      const poll = setInterval(async () => {
        try {
          const profile = await getDatasetProfile(fileId);
          if (profile && profile.status !== "processing") {
            setStats(profile);
            clearInterval(poll);
          }
        } catch (e) {
          console.error("Polling failed", e);
        }
      }, 3000);
      return () => clearInterval(poll);
    }
  }, [fileId, stats]);

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
      {/* Universal Data Summary */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-black italic flex items-center gap-2 tracking-widest text-indigo-400">
          <BarChart3 className="w-5 h-5" /> DATASET INTELLIGENCE
        </h3>
        {initialStats?.domain && (
            <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">AI Domain: {initialStats.domain}</span>
            </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
            <Hash className="w-10 h-10" />
          </div>
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Total Records</p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-white">{stats?.rows ? stats.rows.toLocaleString() : data.length.toLocaleString()}</p>
            {stats?.rows === "Calculating..." && <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
            <Type className="w-10 h-10" />
          </div>
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Features (Cols)</p>
          <p className="text-xl font-bold text-indigo-400">{stats?.cols || columns.length}</p>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
            <AlertCircle className="w-10 h-10" />
          </div>
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Missing Values</p>
          <p className="text-xl font-bold text-rose-400">
            {stats?.missing_total !== undefined ? stats.missing_total : stats?.missing_values ? Object.values(stats.missing_values as Record<string, number>).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0) : "0"}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
            <BarChart3 className="w-10 h-10" />
          </div>
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Analysis Mode</p>
          <p className="text-xl font-bold text-emerald-400">
            {stats?.numeric_count ? `${stats.numeric_count}N / ${stats.categorical_count}C` : "Universal"}
          </p>
        </div>
      </div>

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
                      {(stats?.missing_values?.[col] ?? 0) > 0 && (
                        <div className="flex items-center gap-1 text-rose-400">
                          <AlertCircle className="w-3 h-3" />
                          <span className="text-[9px] font-bold">{stats?.missing_values?.[col]}</span>
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
