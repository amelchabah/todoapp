import '../globals.scss'; // Assure-toi que le fichier SCSS est importé
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

const Layout = ({ children }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <>
      <button onClick={toggleTheme} className="secondary themebutton" title="Switch dark/light mode">
        {isDarkMode ? <span>🌞</span> : <span>🌙</span>}
      </button>
      <main>{children}</main>
    </>
  );
};

export default MyApp;
