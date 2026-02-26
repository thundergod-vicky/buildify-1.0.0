"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getSocket } from "@/lib/socket";
import { auth } from "@/lib/auth";
import { api } from "@/lib/api";
import { 
  User, 
  Role, 
  ChatMessage as BaseChatMessage 
} from "@/types";
import { 
  Search, 
  Send, 
  Image as ImageIcon, 
  Mic, 
  Link as LinkIcon, 
  User as UserIcon,
  ChevronRight,
  Users as DirectoryIcon,
  Clock,
  X,
  Check,
  Loader2,
  Play,
  Pause,
  ArrowLeft
} from "lucide-react";
import { cn, resolveImageUrl } from "@/lib/utils";
import { toast } from "react-toastify";

interface Message extends Omit<BaseChatMessage, 'createdAt' | 'message'> {
  id: string;
  senderId: string;
  receiverId: string;
  message?: string;
  mediaUrl?: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'VOICE' | 'LINK';
  timestamp: string;
}

type ChatContact = Pick<User, 'id' | 'name' | 'email' | 'role' | 'parentOf' | 'profileImage'>;

interface ChatRequest {
  id: string;
  senderId: string;
  receiverId: string;
  firstMessage: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  sender?: ChatContact;
  receiver?: ChatContact;
}

const VoicePlayer = ({ url, isSender }: { url: string; isSender: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime || 0);
  };

  const onLoadedMetadata = () => {
    setDuration(audioRef.current?.duration || 0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={cn(
      "flex items-center gap-3 p-2.5 rounded-2xl min-w-[220px] transition-all",
      isSender ? "bg-white/10 backdrop-blur-sm border border-white/10" : "bg-white border border-gray-100 shadow-sm"
    )}>
      <button 
        onClick={togglePlay}
        className={cn(
          "size-9 rounded-xl flex items-center justify-center transition-all active:scale-95",
          isSender ? "bg-white text-orange-600 hover:bg-gray-100" : "bg-orange-600 text-white hover:bg-orange-700 shadow-md shadow-orange-100"
        )}
      >
        {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current ml-0.5" />}
      </button>
      
      <div className="flex-1 space-y-1.5">
        <div className="h-1.5 bg-black/5 rounded-full overflow-hidden relative group cursor-pointer">
          <div 
            className={cn("h-full transition-all duration-150 rounded-full", isSender ? "bg-white" : "bg-orange-600")}
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div className={cn(
          "flex justify-between items-center text-[10px] tabular-nums font-bold font-urbanist tracking-tighter",
          isSender ? "text-white/80" : "text-gray-400"
        )}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      <audio 
        ref={audioRef} 
        src={url} 
        onTimeUpdate={onTimeUpdate} 
        onLoadedMetadata={onLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="hidden" 
      />
    </div>
  );
};

export function MessagesView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'messages' | 'requests' | 'directory'>('messages');
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [pendingRequests, setPendingRequests] = useState<ChatRequest[]>([]); 
  const [sentRequests, setSentRequests] = useState<ChatRequest[]>([]); 
  const [directoryUsers, setDirectoryUsers] = useState<ChatContact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isTyping, setIsTyping] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const [showListOnMobile, setShowListOnMobile] = useState(true);

  // Media states
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchChatList = useCallback(async () => {
    try {
      const token = auth.getToken();
      if (!token) return;
      const res = await api.get<ChatContact[]>('/chat/contacts', token);
      setContacts(res);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  }, []);

  const fetchPendingRequests = useCallback(async () => {
    try {
      const token = auth.getToken();
      if (!token) return;
      const res = await api.get<ChatRequest[]>('/chat/requests', token);
      setPendingRequests(res);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  }, []);

  const fetchSentRequests = useCallback(async () => {
    try {
      const token = auth.getToken();
      if (!token) return;
      const res = await api.get<ChatRequest[]>('/chat/sent-requests', token);
      setSentRequests(res);
    } catch (err) {
      console.error("Error fetching sent requests:", err);
    }
  }, []);

  const fetchDirectory = useCallback(async () => {
    try {
      const token = auth.getToken();
      if (!token) return;
      
      let res: ChatContact[] = [];
      if (user?.role === Role.STUDENT || user?.role === Role.PARENT) {
        res = await api.get<ChatContact[]>('/users/teachers', token);
      } else if (user?.role === Role.TEACHER || user?.role === Role.ADMIN) {
        const [students, parents] = await Promise.all([
          api.get<ChatContact[]>('/users/students', token),
          api.get<ChatContact[]>('/users/parents', token)
        ]);
        res = [...students, ...parents];
      }
      setDirectoryUsers(res);
    } catch (err) {
      console.error("Error fetching directory:", err);
    }
  }, [user]);

  const fetchMessages = useCallback(async (contactId: string) => {
    try {
      const token = auth.getToken();
      if (!token) return;
      const res = await api.get<Message[]>(`/chat/messages/${contactId}`, token);
      setMessages(res);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }, []);

  const selectionStatus = useMemo(() => {
    if (!selectedContact) return 'NONE';
    if (contacts.find(c => c.id === selectedContact.id)) return 'APPROVED';
    const sentReq = sentRequests.find(r => r.receiverId === selectedContact.id && r.status === 'PENDING');
    if (sentReq) return 'PENDING_SENT';
    if (user?.role === Role.STUDENT || user?.role === Role.PARENT) {
        if (selectedContact.role === Role.TEACHER || selectedContact.role === Role.ADMIN) {
            return 'NEEDS_REQUEST';
        }
    }
    return 'APPROVED'; 
  }, [selectedContact, contacts, sentRequests, user]);

  useEffect(() => {
    fetchChatList();
    fetchSentRequests();
    if (user?.role === Role.TEACHER || user?.role === Role.ADMIN) {
      fetchPendingRequests();
    }
    fetchDirectory();
  }, [fetchChatList, fetchPendingRequests, fetchSentRequests, fetchDirectory, user]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message: Message) => {
        if (selectedContact && (message.senderId === selectedContact.id || message.receiverId === selectedContact.id)) {
          setMessages((prev) => [...prev, message]);
        }
        fetchChatList();
      });

      socket.on("messageSent", (message: Message) => {
        if (selectedContact && message.receiverId === selectedContact.id) {
          setMessages((prev) => [...prev, message]);
        }
      });

      socket.on("userTyping", (data: { senderId: string; isTyping: boolean }) => {
        if (selectedContact && data.senderId === selectedContact.id) {
          setRemoteTyping(data.isTyping);
        }
      });

      socket.on("newChatRequest", () => {
        if (user?.role === Role.TEACHER || user?.role === Role.ADMIN) {
          fetchPendingRequests();
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("newMessage");
        socket.off("messageSent");
        socket.off("userTyping");
        socket.off("newChatRequest");
      }
    };
  }, [selectedContact, socket, user, fetchChatList, fetchPendingRequests]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSelectContact = (contact: ChatContact) => {
    setSelectedContact(contact);
    setMessages([]); 
    fetchMessages(contact.id);
    setShowListOnMobile(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact || !socket) return;

    if (selectionStatus === 'NEEDS_REQUEST') {
        socket.emit("sendRequest", {
            receiverId: selectedContact.id,
            firstMessage: newMessage
        }, (res: { success: boolean; error?: string }) => {
            if (res.success) {
                toast.success("Request sent!");
                fetchSentRequests();
                setNewMessage("");
            } else {
                toast.error(res.error);
            }
        });
        return;
    }

    socket.emit("sendMessage", {
      receiverId: selectedContact.id,
      message: newMessage,
      type: 'TEXT'
    });
    setNewMessage("");
  };

  // Image Upload Logic
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedContact || !socket) return;

    try {
        setIsUploading(true);
        const res = await api.upload<{ url: string }>('/content/upload', file, auth.getToken()!);
        
        socket.emit("sendMessage", {
            receiverId: selectedContact.id,
            mediaUrl: res.url,
            type: 'IMAGE'
        });
        toast.success("Image sent");
    } catch (err: unknown) {
        toast.error("Upload failed: " + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Voice Recording Logic
  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            if (audioChunksRef.current.length > 0) {
                 await uploadVoiceNote(audioBlob);
            }
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingTime(0);
        recordingIntervalRef.current = setInterval(() => {
            setRecordingTime((prev) => prev + 1);
        }, 1000);
    } catch {
        toast.error("Error accessing microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
        audioChunksRef.current = [];
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
        toast.info("Recording cancelled");
    }
  };

  const uploadVoiceNote = async (blob: Blob) => {
    if (!selectedContact || !socket) return;
    try {
        setIsUploading(true);
        const file = new File([blob], 'voice_note.webm', { type: blob.type });
        const res = await api.upload<{ url: string }>('/content/upload', file, auth.getToken()!);
        
        socket.emit("sendMessage", {
            receiverId: selectedContact.id,
            mediaUrl: res.url,
            type: 'VOICE'
        });
    } catch (err: unknown) {
        toast.error("Failed to send voice note: " + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
        setIsUploading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const token = auth.getToken();
      if (!token) return;
      await api.post(`/chat/request/${requestId}/handle`, { status: 'APPROVED' }, token);
      fetchPendingRequests();
      fetchChatList();
      toast.success("Request accepted!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error handling request");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const token = auth.getToken();
      if (!token) return;
      await api.post(`/chat/request/${requestId}/handle`, { status: 'REJECTED' }, token);
      fetchPendingRequests();
      toast.info("Request rejected");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error handling request");
    }
  };

  const handleTypingStart = () => {
    if (!isTyping && selectedContact && socket && selectionStatus === 'APPROVED') {
      setIsTyping(true);
      socket.emit("typing", { receiverId: selectedContact.id, isTyping: true });
      
      setTimeout(() => {
        setIsTyping(false);
        socket.emit("typing", { receiverId: selectedContact.id, isTyping: false });
      }, 3000);
    }
  };

  const getMediaUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const filteredDirectory = directoryUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-64px-72px)] lg:h-[calc(100vh-64px)] overflow-hidden bg-gray-50/50">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleImageChange} 
      />

      {/* List Sidebar */}
      <div className={cn(
        "w-full lg:w-80 bg-white border-r border-gray-100 flex flex-col shrink-0 overflow-hidden transition-all duration-300",
        !showListOnMobile && "hidden lg:flex"
      )}>
        {/* ... (Sidebar logic remains the same) ... */}
        <div className="p-4 space-y-4 shrink-0">
          <h1 className="text-2xl font-bold font-urbanist text-gray-900">Messages</h1>
          
          <div className="flex p-1 bg-gray-50 rounded-lg">
            <button 
              onClick={() => setActiveTab('messages')}
              className={cn(
                "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === 'messages' ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Chats
            </button>
            {(user?.role === Role.TEACHER || user?.role === Role.ADMIN) && (
              <button 
                onClick={() => setActiveTab('requests')}
                className={cn(
                  "flex-1 py-1.5 text-sm font-medium rounded-md transition-all relative",
                  activeTab === 'requests' ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                Requests
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 size-4 bg-orange-600 text-white text-[10px] rounded-full flex items-center justify-center">
                    {pendingRequests.length}
                  </span>
                )}
              </button>
            )}
            <button 
              onClick={() => setActiveTab('directory')}
              className={cn(
                "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === 'directory' ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Directory
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 minimal-scrollbar" data-lenis-prevent>
          {activeTab === 'messages' && (
            <div className="space-y-1">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all group text-left",
                    selectedContact?.id === contact.id ? "bg-orange-50" : "hover:bg-gray-50"
                  )}
                >
                  <div className="size-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold shrink-0 overflow-hidden">
                      {contact.profileImage ? (
                        <img 
                          src={resolveImageUrl(contact.profileImage)} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                      contact.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                      <span className="text-[10px] text-gray-400">Live</span>
                    </div>
                    <div className="flex items-center gap-1">
                       <p className="text-xs text-gray-500 truncate italic">
                        {contact.role === 'PARENT' && contact.parentOf?.[0]?.student?.name 
                          ? `(Parent of ${contact.parentOf[0].student.name})`
                          : contact.role}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              {contacts.length === 0 && (
                <div className="text-center py-10 px-4">
                  <UserIcon className="size-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm font-urbanist">No conversations yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-2">
              {pendingRequests.map((req) => (
                <div key={req.id} className="p-4 bg-white border border-gray-100 rounded-xl space-y-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold shrink-0 overflow-hidden">
                      {req.sender?.profileImage ? (
                        <img 
                          src={resolveImageUrl(req.sender.profileImage)} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        req.sender?.name.charAt(0)
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm truncate">{req.sender?.name}</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">{req.sender?.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100 break-words leading-relaxed">
                    &quot;{req.firstMessage}&quot;
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAcceptRequest(req.id)}
                      className="flex-1 py-1.5 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleRejectRequest(req.id)}
                      className="flex-1 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
              {pendingRequests.length === 0 && (
                <div className="text-center py-10 px-4">
                  <p className="text-gray-400 text-sm font-urbanist">No pending requests.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'directory' && (
            <div className="space-y-1">
              {filteredDirectory.map((target) => (
                <button
                  key={target.id}
                  onClick={() => handleSelectContact(target)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                    selectedContact?.id === target.id ? "bg-orange-50" : "hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                        "size-10 rounded-full flex items-center justify-center font-bold shrink-0 overflow-hidden",
                        target.role === 'TEACHER' ? "bg-green-100 text-green-600" :
                        target.role === 'PARENT' ? "bg-blue-100 text-blue-600" :
                        "bg-orange-100 text-orange-600"
                    )}>
                      {target.profileImage ? (
                        <img 
                          src={resolveImageUrl(target.profileImage)} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        target.name.charAt(0)
                      )}
                    </div>
                    <div className="text-left min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">{target.name}</h4>
                      <p className="text-[10px] text-gray-400 uppercase">
                        {target.role === 'PARENT' && target.parentOf?.[0]?.student?.name 
                          ? `Parent of ${target.parentOf[0].student.name}`
                          : target.role}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col bg-white overflow-hidden relative transition-all duration-300",
        showListOnMobile && "hidden lg:flex"
      )}>
        {selectedContact ? (
          <>
            {/* Header */}
            <div className="h-16 border-b border-gray-100 px-4 sm:px-6 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md z-10 sticky top-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <button 
                  onClick={() => setShowListOnMobile(true)}
                  className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-orange-600 transition-colors"
                >
                  <ArrowLeft className="size-5" />
                </button>
                <div className="size-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold overflow-hidden shrink-0">
                   {selectedContact.profileImage ? (
                     <img 
                       src={resolveImageUrl(selectedContact.profileImage)} 
                       alt="Avatar" 
                       className="w-full h-full object-cover"
                     />
                   ) : (
                     selectedContact.name.charAt(0)
                   )}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{selectedContact.name}</h2>
                  <p className={cn(
                    "text-[10px] font-medium transition-colors",
                    (remoteTyping || isUploading) ? "text-orange-500" : "text-green-500"
                  )}>
                    {isUploading ? "Sending..." : remoteTyping ? "Typing..." : "Online"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <LinkIcon className="size-5 cursor-pointer hover:text-orange-600 transition-colors" />
                <Search className="size-5 cursor-pointer hover:text-orange-600 transition-colors" />
              </div>
            </div>

            {/* Messages */}
            <div 
              className="flex-1 overflow-y-auto p-6 space-y-4 minimal-scrollbar"
              data-lenis-prevent
            >
              {selectionStatus === 'PENDING_SENT' ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
                    <div className="size-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                        <Clock className="size-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Request Sent</h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">
                            Your message request has been sent to <strong>{selectedContact.name}</strong>. 
                            You can start chatting once they accept.
                        </p>
                    </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2 opacity-60">
                    <DirectoryIcon className="size-12" />
                    <p className="font-urbanist">
                        {selectionStatus === 'NEEDS_REQUEST' 
                            ? `Send a request message to start chatting with ${selectedContact.name}`
                            : "No messages yet. Send your first message below!"}
                    </p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div 
                    key={msg.id || `msg-${idx}`}
                    className={cn(
                      "flex w-full mb-2",
                      msg.senderId === user?.id ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[75%] space-y-1",
                      msg.senderId === user?.id ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed",
                        msg.senderId === user?.id 
                          ? "bg-orange-600 text-white rounded-tr-none" 
                          : "bg-gray-100 text-gray-900 rounded-tl-none"
                      )}>
                        {msg.message}
                        {msg.mediaUrl && (
                          <div className="mt-2 rounded-lg overflow-hidden border border-black/5 bg-black/5 min-w-[150px] sm:min-w-[200px] max-w-full">
                            {msg.type === 'IMAGE' && msg.mediaUrl && (
                               <img 
                                 src={getMediaUrl(msg.mediaUrl)} 
                                 className="w-full h-auto block object-contain max-h-[300px]" 
                                 alt="Shared attachment" 
                               />
                            )}
                            {msg.type === 'VOICE' && msg.mediaUrl && (
                                <VoicePlayer url={getMediaUrl(msg.mediaUrl)} isSender={msg.senderId === user?.id} />
                            )}
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-gray-400 px-1 font-medium flex items-center gap-1 uppercase tracking-tighter">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Container */}
            <div className="p-4 border-t border-gray-100 bg-white shrink-0">
              {selectionStatus === 'PENDING_SENT' ? (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-center">
                    <p className="text-xs font-bold text-red-600 animate-pulse">
                        Wait for the teacher to accept the request
                    </p>
                </div>
              ) : isRecording ? (
                <div className="flex items-center gap-4 bg-orange-50 p-2 rounded-2xl border border-orange-100 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-2 px-4 flex-1">
                        <div className="size-2 bg-red-600 rounded-full animate-pulse" />
                        <span className="text-sm font-bold text-gray-900 font-urbanist">{formatTime(recordingTime)}</span>
                        <span className="text-xs text-orange-600 italic ml-2">Recording voice note...</span>
                    </div>
                    <div className="flex gap-2 pr-2">
                        <button 
                            onClick={cancelRecording}
                            className="bg-gray-200 text-gray-600 p-2.5 rounded-xl hover:bg-gray-300 transition-colors"
                        >
                            <X className="size-5" />
                        </button>
                        <button 
                            onClick={stopRecording}
                            className="bg-orange-600 text-white p-2.5 rounded-xl hover:bg-orange-700 transition-all shadow-md shadow-orange-100"
                        >
                            <Check className="size-5" />
                        </button>
                    </div>
                </div>
              ) : (
                <form 
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-2 rounded-2xl transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 focus-within:border-orange-200"
                >
                  <div className="flex items-center gap-1 px-1 shrink-0">
                    <button 
                        type="button" 
                        onClick={handleImageClick}
                        disabled={isUploading}
                        className="p-2 text-gray-400 hover:text-orange-600 transition-colors disabled:opacity-50"
                    >
                        {isUploading ? <Loader2 className="size-5 animate-spin" /> : <ImageIcon className="size-5" />}
                    </button>
                    <button 
                        type="button" 
                        onClick={startRecording}
                        disabled={isUploading}
                        className="p-2 text-gray-400 hover:text-orange-600 transition-colors disabled:opacity-50"
                    >
                        <Mic className="size-5" />
                    </button>
                  </div>
                  <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTypingStart();
                    }}
                    placeholder={selectionStatus === 'NEEDS_REQUEST' ? "Enter your request message..." : "Type your message..."}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim() || isUploading}
                    className="bg-orange-600 text-white p-2.5 rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:bg-gray-400 transition-all shadow-md shadow-orange-100 shrink-0"
                  >
                    <Send className="size-5" />
                  </button>
                </form>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white text-center p-10 animate-in fade-in zoom-in duration-500">
            <div className="size-24 bg-orange-50 rounded-3xl flex items-center justify-center text-orange-600 mb-8 shadow-xl shadow-orange-50/50 group rotate-3">
              <Send className="size-10 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300" />
            </div>
            <h2 className="text-4xl font-bold font-urbanist text-gray-900 mb-3 tracking-tight">Your Messages</h2>
            <p className="text-gray-500 max-w-sm font-medium leading-relaxed">
              Communicate instantly with students and teachers. Select a chat from the left or browse the **Directory** to start your conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
