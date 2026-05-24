import React, { useState } from 'react';
import { Payment } from '../types';
import { Filter, DollarSign, Download, ArrowUpRight, ArrowDownLeft, Receipt, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaymentsViewProps {
  payments: Payment[];
  searchQuery: string;
}

export default function PaymentsView({ payments, searchQuery }: PaymentsViewProps) {
  const [filter, setFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all');

  const filteredPayments = payments.filter((pay) => {
    const matchesQuery =
      pay.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.item.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === 'all') return matchesQuery;
    return matchesQuery && pay.status === filter;
  });

  const totalSuccessful = payments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 select-none">
        <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#121315] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
              Total Settled
            </span>
            <span className="text-xl font-bold font-sans tracking-tight text-neutral-950 dark:text-neutral-50 block mt-1">
              ${totalSuccessful.toLocaleString()}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
            <ArrowUpRight size={18} />
          </div>
        </div>

        <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#121315] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
              Awaiting Settlement
            </span>
            <span className="text-xl font-bold font-sans tracking-tight text-neutral-950 dark:text-neutral-50 block mt-1">
              $450
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-500 flex items-center justify-center border border-amber-500/10">
            <ArrowDownLeft size={18} />
          </div>
        </div>

        <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#121315] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
              Failure / Refund Rate
            </span>
            <span className="text-xl font-bold font-sans tracking-tight text-neutral-950 dark:text-neutral-50 block mt-1">
              4.2%
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 dark:bg-rose-400/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
            <AlertTriangle size={18} />
          </div>
        </div>
      </div>

      {/* Control Tools Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#121315] p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-neutral-400" />
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mr-2">Status</span>
          <div className="flex gap-1.5 bg-neutral-100 dark:bg-neutral-900/60 p-1 rounded-xl">
            {(['all', 'success', 'pending', 'failed'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-3 py-1.5 rounded-lg text-2xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  filter === opt
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            alert('Financial transaction report exported to spreadsheet successfully.');
          }}
          className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/40 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Download size={14} />
          <span>Export Ledger</span>
        </button>
      </div>

      {/* Payments Ledger table matches highly detailed admin aesthetic */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#121315] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-900/40 text-4xs font-mono font-bold tracking-widest text-neutral-400 uppercase border-b border-neutral-100 dark:border-neutral-800/60">
                <th className="py-4 px-6">Transaction ID</th>
                <th className="py-4 px-6">Member / Contributor</th>
                <th className="py-4 px-6">Asset Item name</th>
                <th className="py-4 px-6">Payout Split</th>
                <th className="py-4 px-6 font-semibold">Payment Date</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
              <AnimatePresence mode="popLayout">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-400 dark:text-neutral-500">
                      <p className="text-xs font-semibold">No transactions match queries</p>
                      <span className="text-4xs uppercase tracking-widest block mt-1">Stripe hook logs empty</span>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((pay) => (
                    <motion.tr
                      key={pay.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors"
                    >
                      {/* ID Row */}
                      <td className="py-4.5 px-6 font-mono text-xs font-semibold text-neutral-400 select-all">
                        {pay.id.toUpperCase()}
                      </td>

                      {/* Contributor */}
                      <td className="py-4.5 px-6">
                        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                          {pay.memberName}
                        </span>
                      </td>

                      {/* Asset item */}
                      <td className="py-4.5 px-6">
                        <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 truncate max-w-xs">
                          <Receipt size={13} className="text-neutral-400 shrink-0" />
                          <span>{pay.item}</span>
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-4.5 px-6">
                        <span className="text-xs font-bold font-sans text-neutral-900 dark:text-neutral-50">
                          ${pay.amount.toLocaleString()}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4.5 px-6 font-mono text-xs font-semibold text-neutral-500">
                        {pay.date}
                      </td>

                      {/* Custom State Labels */}
                      <td className="py-4.5 px-6">
                        <span
                          className={`text-4xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                            pay.status === 'success'
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : pay.status === 'pending'
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                              : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {pay.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
