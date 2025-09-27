// AnimatedBlock.jsx
import { motion } from "framer-motion";
import './Animated.css'

const Animated = ({ children, height = 'auto', width = '100%' }) => {
    const variants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -50, scale: 0.9 },
    };

    return (
        <motion.div
            style={{ height: height, width: width }}
            className="p-6 bg-white rounded-xl shadow-md"
            variants={variants}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
        >
            {children} {/* this allows ANY content inside */}
        </motion.div>
    );
};

export default Animated;
