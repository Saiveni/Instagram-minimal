import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

const mockUsers = [
  { id: '1', username: 'johndoe', displayName: 'John Doe', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john' },
  { id: '2', username: 'janedoe', displayName: 'Jane Doe', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane' },
  { id: '3', username: 'alexsmith', displayName: 'Alex Smith', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
];

const mockTags = ['photography', 'travel', 'food', 'fashion', 'fitness', 'art', 'music', 'nature'];

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.displayName.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTags = mockTags.filter((tag) =>
    tag.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search"
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {focused && query && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
        >
          {filteredUsers.length > 0 && (
            <div className="p-2">
              <p className="text-xs text-muted-foreground px-2 mb-2">Accounts</p>
              {filteredUsers.map((user) => (
                <Link
                  key={user.id}
                  to={`/profile/${user.username}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.displayName}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filteredTags.length > 0 && (
            <div className="p-2 border-t border-border">
              <p className="text-xs text-muted-foreground px-2 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2 px-2">
                {filteredTags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/search?tag=${tag}`}
                    className="text-sm text-primary hover:underline"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {filteredUsers.length === 0 && filteredTags.length === 0 && (
            <p className="p-4 text-center text-muted-foreground text-sm">No results found</p>
          )}
        </motion.div>
      )}
    </div>
  );
};
