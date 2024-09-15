// src/pages/_app.jsx
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
      <header>
        <button onClick={toggleTheme}>
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </header>
      <main>{children}</main>
    </>
  );
};

export default MyApp;
