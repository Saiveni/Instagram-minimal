import { SearchBar } from '@/components/search/SearchBar';
import { motion } from 'framer-motion';

const categories = ['For You', 'Travel', 'Architecture', 'Food', 'Art', 'Style', 'Music'];
const mockImages = Array.from({ length: 24 }, (_, i) => `https://picsum.photos/seed/${i + 1}/400/400`);

const SearchPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <SearchBar />
      
      <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            className="px-4 py-1.5 bg-muted rounded-lg text-sm font-medium whitespace-nowrap hover:bg-muted/80"
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1 mt-4">
        {mockImages.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.02 }}
            className={`${i % 10 === 0 ? 'col-span-2 row-span-2' : ''} aspect-square bg-muted cursor-pointer`}
          >
            <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
