
import { HiLightBulb } from "react-icons/hi";
import '../../styles/components/theme/change-theme.scss';
import { useTheme } from './ThemeContext';
import { GiNightSleep } from "react-icons/gi";


export const ChangeTheme = () => {
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
   <section className="change-theme">
    <div className="change-theme-container" onClick={toggleTheme} style={{cursor:'pointer'}}>
      
      {isDarkTheme? (
      
      <HiLightBulb 
        className={`change-theme-icon ${isDarkTheme ? 'dark' : 'light'}`}
        size={15}
        title={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
      />) :
      
       <GiNightSleep
        className={`change-theme-icon ${isDarkTheme ? 'dark' : 'light'}`}
        size={15}
        title={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
      />
      }
    </div>
   </section>
  )
}
