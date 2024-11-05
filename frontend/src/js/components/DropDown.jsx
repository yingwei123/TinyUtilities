import React from 'react';

const DropDown = ({ isVisible, dropDownItems, position, direction, onItemClick }) => {
    return (
        <div className={`${position} ${isVisible ? 'show' : ''}`}>
            <div className={`feature-container ${direction}`}>
                {dropDownItems.map((item, index) => (
                    <div key={index} className="dropdown-item" onClick={() => onItemClick(item)}>
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DropDown;