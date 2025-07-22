import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ActionCard = ({ to, icon: Icon, title, description, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    emerald: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
    amber: 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
    rose: 'from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700',
    violet: 'from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700',
    cyan: 'from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700',
  };

  return (
    <motion.div whileHover={{ scale: 1.03, y: -5 }} className="w-full">
      <Link to={to} className="block group">
        <div className="relative p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-slate-700">
            <div className={`absolute -top-5 -right-5 w-24 h-24 bg-gradient-to-br ${colorClasses[color]} rounded-full opacity-10 dark:opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="relative z-10">
                <div className={`p-4 inline-block bg-gradient-to-br ${colorClasses[color]} text-white rounded-xl shadow-md mb-4`}>
                    <Icon className="w-8 h-8"/>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4">{description}</p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 transition-all duration-300">
                    Go to section <ArrowRight className="w-4 h-4"/>
                </div>
            </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ActionCard;