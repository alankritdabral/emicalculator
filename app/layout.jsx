import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: 'Loan Refinance & EMI Calculator',
  description: 'Calculate your loan EMIs, automatic outstanding amount based on issue date and 21st cutoff rule, and compare savings with special interest rates.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* html2canvas and jszip for WhatsApp share */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" strategy="beforeInteractive" />

        {/* Firebase Compat SDKs */}
        <Script src="https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js" strategy="beforeInteractive" />
        <Script src="https://www.gstatic.com/firebasejs/10.13.1/firebase-auth-compat.js" strategy="beforeInteractive" />
        <Script src="https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore-compat.js" strategy="beforeInteractive" />
        <Script src="https://www.gstatic.com/firebasejs/10.13.1/firebase-functions-compat.js" strategy="beforeInteractive" />
        
        {/* Initialize Firebase */}
        <Script src="/firebase-config.js" strategy="beforeInteractive" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
