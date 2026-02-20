// ExcavatorBucketIcon.jsx
const ExcavatorBucketIcon = ({ className }) => (
 <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 45 35" // mărit cu 5px pe lățime și înălțime
    width="45"
    height="35"
    className={className}
    fill="currentColor"
  >
    {/* Cupa */}
    <path d="M12 27 L35 27 L31 19 L15 19 Z" />

    {/* Brațul lateral */}
    <rect x="15" y="14" width="2" height="7" />
    <rect x="30" y="14" width="2" height="7" />

    {/* Pârghia superioară de prindere */}
    <rect x="15" y="11" width="19" height="2" rx="0.5" />
  </svg>
);

export default ExcavatorBucketIcon;