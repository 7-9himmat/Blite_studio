import { SvgIcon } from '@mui/material';

export default function Logo(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 100 100">
      {/* Left Upward Arrow (Primary Blue) */}
      <path 
        d="M20,80 L20,35 L40,20 L40,45 L60,30 L60,80 L20,80" 
        fill="#2563EB" 
      />
      {/* Top Folding Arrow (Lighter Blue) */}
      <path 
        d="M40,20 L80,20 L80,50 L40,50 L40,20" 
        fill="#3B82F6" 
        opacity="0.9"
      />
      {/* Bottom Folding Arrow (Darker Blue) */}
      <path 
        d="M20,80 L60,80 L60,50 L20,50 L20,80" 
        fill="#1D4ED8" 
        opacity="0.8"
      />
    </SvgIcon>
  );
}