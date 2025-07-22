import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import AddEditNoticeModal from './modals/AddEditNoticeModal';

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getNotices();
      setNotices(response.notice || []);
    } catch (error) {
      toast.error("Could not load notices.");
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleOpenModal = (notice = null) => {
    setEditingNotice(notice);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setEditingNotice(null);
      setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      const toastId = toast.loading('Deleting notice...');
      try {
        await apiService.deleteNotice(id);
        toast.success('Notice deleted.', { id: toastId });
        fetchNotices();
      } catch (error) {
        toast.error(error.message || 'Failed to delete notice.', { id: toastId });
      }
    }
  };
  
  const getTypeColor = (type) => ({
    emergency: 'bg-red-100 text-red-800 border-red-200',
    general: 'bg-blue-100 text-blue-800 border-blue-200',
    patient: 'bg-green-100 text-green-800 border-green-200',
    doctor: 'bg-purple-100 text-purple-800 border-purple-200'
  }[type] || 'bg-gray-100 text-gray-800 border-gray-200');

  return (
    <>
      <PageHeader
        title="Notice Board"
        subtitle="Manage hospital-wide announcements and notices."
        actions={<Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4" /> Add Notice</Button>}
      />

      {loading ? (
        <div className="flex justify-center p-16"><Spinner size="lg"/></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.map((notice) => (
            <div key={notice._id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getTypeColor(notice.type)}`}>
                    {notice.type.charAt(0).toUpperCase() + notice.type.slice(1)}
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(notice)}><Edit className="w-4 h-4 text-gray-500"/></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(notice._id)}><Trash2 className="w-4 h-4 text-gray-500"/></Button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{notice.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{notice.description}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                {notice.link && (
                  <a href={notice.link} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    <Eye className="w-3 h-3 mr-1" /> View Link
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <AddEditNoticeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchNotices}
        notice={editingNotice}
      />
    </>
  );
};

export default NoticesPage;