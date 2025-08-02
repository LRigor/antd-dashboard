import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { App as AntApp } from 'antd';
import "./globals.css";

export const metadata = {
  title: "Ant Design",
  description: "Ant Design Page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <AntApp>
              {children}
            </AntApp>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
