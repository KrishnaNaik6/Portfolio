import { motion } from "framer-motion";

const Animated = ({ children, height = 'auto', width = '100%' }) => {
    const variants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -50, scale: 0.9 },
    };

    return (
        <motion.div
            style={{ height: height, width: width }}
            className="bg-inherit rounded-xl"
            variants={variants}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
};

export default Animated;
