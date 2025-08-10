import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SidebarProvider } from '../contexts/SidebarContext';
import { App as AntApp, ConfigProvider } from 'antd';
import { antdConfig } from '../lib/antd.config';
import "./globals.css";

export const metadata = {
  title: "Ant Design",
  description: "Ant Design Page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ThemeProvider>
          <AuthProvider>
            <SidebarProvider>
              <ConfigProvider {...antdConfig}>
                <AntApp>
                  {children}
                </AntApp>
              </ConfigProvider>
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
