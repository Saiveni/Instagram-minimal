import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Image as ImageIcon, Phone, Video, Info, File, Music, Paperclip, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { uploadToCloudinary } from '@/lib/cloudinary';
import type { Conversation, Message, UserProfile } from '@/types';

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (text: string, mediaUrl?: string, mediaType?: string) => void;
  onBack?: () => void;
}

export const ChatWindow = ({ conversation, messages, currentUserId, onSendMessage, onBack }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const otherUser = conversation?.participantProfiles?.find(p => p.uid !== currentUserId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File size must be less than 50MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      const mediaUrl = result.url;
      const mediaType = file.type.startsWith('image/') ? 'image' 
        : file.type.startsWith('video/') ? 'video'
        : file.type.startsWith('audio/') ? 'audio'
        : 'document';
      
      onSendMessage('', mediaUrl, mediaType);
      toast({
        title: 'Success',
        description: 'Media sent successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload media',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Send className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
          <p className="text-muted-foreground">Send private photos and messages to a friend</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          {/* Back button for mobile */}
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherUser?.avatarUrl} />
            <AvatarFallback>{otherUser?.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{otherUser?.displayName}</p>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isOwn = message.senderId === currentUserId;
          const hasMedia = message.mediaUrl;
          const mediaType = message.mediaUrl ? (
            message.mediaUrl.includes('video') ? 'video' :
            message.mediaUrl.includes('audio') ? 'audio' : 'image'
          ) : null;
          
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl overflow-hidden ${
                  isOwn
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {hasMedia && mediaType === 'image' && (
                  <img src={message.mediaUrl} alt="Shared media" className="w-full max-w-sm rounded-t-2xl" />
                )}
                {hasMedia && mediaType === 'video' && (
                  <video src={message.mediaUrl} controls className="w-full max-w-sm rounded-t-2xl" />
                )}
                {hasMedia && mediaType === 'audio' && (
                  <div className="p-3">
                    <audio src={message.mediaUrl} controls className="w-full" />
                  </div>
                )}
                {message.text && (
                  <p className="text-sm px-4 py-2">{message.text}</p>
                )}
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={uploading ? "Uploading..." : "Message..."}
            className="flex-1"
            disabled={uploading}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSend}
            disabled={!newMessage.trim() || uploading}
            className="text-primary font-semibold"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
