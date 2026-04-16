import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

/**
 * CustomSelect Component with Portal Support
 * Solves Z-Index and clipping issues globally.
 */
const CustomSelect = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Sélectionner...", 
  label = "", 
  icon: Icon,
  className = "",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const portalRef = useRef(null);

  const selectedOption = options.find(opt => String(opt.value) === String(value));

  // Function to update dropdown position
  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(event.target);
      const isOutsidePortal = portalRef.current && !portalRef.current.contains(event.target);
      
      if (isOutsideDropdown && isOutsidePortal) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", updateCoords, true);
      window.addEventListener("resize", updateCoords);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", updateCoords, true);
      window.removeEventListener("resize", updateCoords);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (isOpen) {
      updateCoords();
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`flex flex-col gap-2 w-full ${className} ${disabled ? 'opacity-60' : ''}`} ref={dropdownRef}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 ml-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleDropdown}
          disabled={disabled}
          className={`w-full flex items-center justify-between px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 transition-all shadow-inner text-sm font-medium ${isOpen ? 'border-amber-700/80 ring-1 ring-amber-700/50' : ''} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon size={18} className="text-stone-500" />}
            <span className={selectedOption ? "text-stone-100" : "text-stone-500"}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown 
            size={18} 
            className={`text-stone-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {isOpen && createPortal(
          <div 
            ref={portalRef}
            className="fixed z-[9999] mt-2 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            style={{ 
              top: `${coords.top}px`, 
              left: `${coords.left}px`, 
              width: `${coords.width}px` 
            }}
          >
            <ul className="max-h-60 overflow-y-auto py-2 custom-scrollbar">
              {options.length === 0 ? (
                <li className="px-4 py-3 text-xs text-stone-500 italic">Aucune option disponible</li>
              ) : (
                options.map((opt) => (
                  <li
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`px-4 py-3 text-sm font-medium cursor-pointer transition-all ${
                      String(value) === String(opt.value)
                        ? "bg-amber-500/20 text-amber-400 border-l-4 border-amber-500" 
                        : "text-stone-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent"
                    }`}
                  >
                    {opt.label}
                  </li>
                ))
              )}
            </ul>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
