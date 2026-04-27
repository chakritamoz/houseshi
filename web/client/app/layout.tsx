// next root layout
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Houseshi",
    description: "A home inventory management system",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html
            lang="en"
            suppressHydrationWarning={true}
            data-lt-installed={true}
        >
            <body className={inter.className}>{children}</body>
        </html >
    )
}