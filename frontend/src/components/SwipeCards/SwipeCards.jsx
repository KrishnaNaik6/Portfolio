import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// const cards = [
//   { id: 1, text: "Card 1" },
//   { id: 2, text: "Card 2" },
//   { id: 3, text: "Card 3" },
//   { id: 4, text: "Card 4" },
// ];

export default function SwipeCards({ cards }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleSwipe = (dir) => {
    setDirection(dir === "right" ? 1 : -1);
    setIndex((prev) => (prev + 1) % cards.length);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative w-80 h-96">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={cards[index].id}
            className="absolute w-full h-full bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl font-bold"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1.2}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              x: direction * 300, // smooth exit in swipe direction
              rotate: direction * 15, // rotate based on direction
              transition: { duration: 0.4 },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onDragEnd={(e, info) => {
              if (info.offset.x > 100) handleSwipe("right");
              else if (info.offset.x < -100) handleSwipe("left");
            }}
          >
            {console.log("the cards", cards)}
            {/* <div>
              <p>{cards[index].name}</p>
              <p>{cards[index].descriptio}</p>
              <p>{cards[index].link.g}</p>
              <p>{cards[index].collabed}</p>
            </div> */}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
