import "./globals.css";
import PreloadProvider from "./component/loader_section/PreloadProvider";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PreloadProvider>{children}</PreloadProvider>
        
      </body>
    </html>
  );
}
