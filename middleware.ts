import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {

    // const path = request.nextUrl.pathname;
    // const token = localStorage.getItem("token")

    // if (path.startsWith("/main") && !token) {
    //     return NextResponse.redirect(new URL("/auth", request.url))
    // }

    // if (path.startsWith("/auth") && token) {
    //     return NextResponse.redirect(new URL("/main", request.url))
    // }

    // return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
}