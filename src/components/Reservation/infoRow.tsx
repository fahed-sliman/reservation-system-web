import { useTheme } from "../../context/ThemeContext";

// InfoRow.tsx
interface Props {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const InfoRow: React.FC<Props> = ({ icon, label, value }) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center gap-2">
      <div className={`text-orange-500`}>{icon}</div>
      <div className="flex flex-col">
        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
        <span className={`${theme === 'dark' ? 'text-white' : 'text-black'} font-semibold`}>{value}</span>
      </div>
    </div>
  );
};

export default InfoRow;
