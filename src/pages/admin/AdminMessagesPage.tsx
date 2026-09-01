import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/common/Toast';
import { ContactMessage } from '../../types/database';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  MessageSquare,
  Mail,
  Calendar,
  CheckCircle,
  Trash2,
  RefreshCw,
  MailOpen,
  User,
} from 'lucide-react';

export const AdminMessagesPage: React.FC = () => {
  const { messages, fetchMessages, markMessageAsRead, deleteMessage } = usePortfolio();
  const { success, error } = useToast();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [msgToDelete, setMsgToDelete] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter((m) => {
    if (filter === 'unread') return !m.is_read;
    return true;
  });

  const handleSelectMessage = (msg: ContactMessage) => {
    setSelectedMsg(msg);
    if (!msg.is_read) {
      markMessageAsRead(msg.id, true);
    }
  };

  const handleToggleRead = async (msg: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markMessageAsRead(msg.id, !msg.is_read);
      success(`Marked as ${!msg.is_read ? 'read' : 'unread'}`);
    } catch {
      error('Failed to update message status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!msgToDelete) return;
    try {
      await deleteMessage(msgToDelete.id);
      success('Message deleted');
      if (selectedMsg?.id === msgToDelete.id) {
        setSelectedMsg(null);
      }
      setMsgToDelete(null);
    } catch {
      error('Failed to delete message');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Contact Messages</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Inquiries received from your portfolio contact form.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMessages}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>

          <div className="flex bg-white/[0.04] p-1 rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'all' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'unread' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Unread ({messages.filter((m) => !m.is_read).length})
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List Column */}
        <div className="lg:col-span-5 space-y-3">
          {filteredMessages.length === 0 ? (
            <Card className="p-8 text-center bg-[#0d0f17]/95 border-white/[0.08]">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No messages in inbox.</p>
            </Card>
          ) : (
            filteredMessages.map((msg) => (
              <Card
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                hoverEffect
                className={`p-4 bg-[#0d0f17]/95 border cursor-pointer transition-all ${
                  selectedMsg?.id === msg.id
                    ? 'border-sky-500/50 bg-sky-500/[0.04]'
                    : !msg.is_read
                    ? 'border-sky-500/30'
                    : 'border-white/[0.06]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {!msg.is_read && <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />}
                    <span className="text-xs font-bold text-white truncate max-w-[160px]">
                      {msg.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-300 truncate mb-1">
                  {msg.subject || 'No Subject'}
                </p>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {msg.message}
                </p>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/[0.04]">
                  <span className="text-[10px] text-sky-400 font-mono">{msg.email}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleToggleRead(msg, e)}
                      className="p-1 text-slate-400 hover:text-sky-400 transition-colors"
                      title={msg.is_read ? 'Mark unread' : 'Mark read'}
                    >
                      <MailOpen className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMsgToDelete(msg);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Selected Message Detail Column */}
        <div className="lg:col-span-7">
          {selectedMsg ? (
            <Card className="p-6 sm:p-8 bg-[#0d0f17]/95 border-white/[0.08] space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {selectedMsg.subject || 'Direct Inquiry'}
                  </h2>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-sky-400 font-semibold">
                      <User className="w-3.5 h-3.5" />
                      {selectedMsg.name}
                    </span>
                    <span>•</span>
                    <a
                      href={`mailto:${selectedMsg.email}`}
                      className="hover:text-sky-300 font-mono"
                    >
                      {selectedMsg.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject || 'Portfolio Inquiry'}`}>
                    <Button variant="primary" size="sm" leftIcon={<Mail className="w-3.5 h-3.5" />}>
                      Reply via Email
                    </Button>
                  </a>
                  <button
                    onClick={() => setMsgToDelete(selectedMsg)}
                    className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Message Content
                </p>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                  {selectedMsg.message}
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-500 pt-4 border-t border-white/[0.04]">
                Received: {new Date(selectedMsg.created_at).toLocaleString()}
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center bg-[#0d0f17]/95 border-white/[0.08] h-full flex flex-col items-center justify-center">
              <Mail className="w-10 h-10 text-slate-600 mb-2" />
              <h3 className="text-sm font-bold text-white mb-1">Select a Message</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Click on any message from the left inbox to view full details and reply.
              </p>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(msgToDelete)}
        onClose={() => setMsgToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Message"
        message="Permanently remove this contact message?"
      />
    </div>
  );
};
