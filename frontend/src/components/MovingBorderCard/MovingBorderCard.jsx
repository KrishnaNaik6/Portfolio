// MovingBorderCard.jsx (Enhanced)
import React from 'react';
import './MovingBorderCard.css';

const MovingBorderCard = ({
    children,
    className = '',
    borderType = 'gradient',
    speed = '3s',
    colors = ['#e11a1aff', '#40cb09ff', '#8bcf8dff', '#0b4f87ff'],
    borderRadius = '16px',
    backgroundColor = '#1a1a1a',
    padding = '2rem',
    width = '100vh',
    height = 'auto',
    onClick,
    style = {},
    interactive = true
}) => {

    const cardStyle = {
        '--animation-speed': speed,
        '--gradient-colors': colors.join(', '),
        '--border-radius': borderRadius,
        '--background-color': backgroundColor,
        '--card-padding': padding,
        '--card-width': width,
        '--card-height': height,
        '--color-1': colors[0],
        '--color-2': colors[1],
        '--color-3': colors[2],
        '--color-4': colors[3],
        ...style
    };

    const cardClass = `moving-border-card ${borderType} ${className} ${interactive ? 'interactive' : ''
        }`.trim();

    const renderBorderElements = () => {
        if (borderType === 'rotating') {
            return (
                <div className="border-elements-container">
                    {colors.map((color, index) => (
                        <div
                            key={index}
                            className="border-element"
                            style={{
                                '--animation-delay': `-${index}s`,
                                borderColor: color
                            }}
                        />
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div
            className={cardClass}
            style={cardStyle}
            onClick={onClick}
        >
            {renderBorderElements()}
            <div className="card-content">
                {children}
            </div>
        </div>
    );
};

export default MovingBorderCard;