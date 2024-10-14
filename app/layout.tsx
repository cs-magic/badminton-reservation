import './globals.css';

export const metadata = {
  title: '羽毛球预约',
  description: '羽毛球场地预约系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        <script type="text/javascript" src={`//api.map.baidu.com/api?v=3.0&ak=${process.env.NEXT_PUBLIC_BAIDU_MAP_AK}`}></script>
      </head>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
