// // middleware.ts (root directory)
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const allowedRoles = ["SuperAdmin", "SubAdmin"];

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
  
//   // Split path segments and filter out empty strings
//   const segments = pathname.split("/").filter(Boolean);
//   const firstSegment = segments[0]; // role candidate
  
//   // ✅ Rule 1: Allow routes with no first segment (like /login, /, /unauthorized)
//   if (!firstSegment) {
//     return NextResponse.next();
//   }
  
//   // ✅ Rule 2: Allow routes where first segment is an allowed role
//   if (allowedRoles.includes(firstSegment)) {
//     return NextResponse.next();
//   }
  
//   // ✅ Rule 3: Allow specific public routes (like login, unauthorized page itself)
//   const publicRoutes = ["login", "register", "forget-password", "dashboard", "unauthorized"];
//   if (publicRoutes.includes(firstSegment)) {
//     return NextResponse.next();
//   }
  
//   // ❌ Rule 4: Redirect all other routes to unauthorized page
//   const url = req.nextUrl.clone();
//   url.pathname = "/unauthorized";
//   url.search = ""; // Clear any query parameters
//   return NextResponse.redirect(url);
// }

// export const config = {
//   // Match all routes except API routes, static files, and Next.js internals
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
//   ],
// };
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedRoles = ["SuperAdmin", "SubAdmin"];

export function middleware(req: NextRequest) {
  // const { pathname } = req.nextUrl;
  // const segments = pathname.split("/").filter(Boolean);
  // const firstSegment = segments[0];

  // // Rule 1: Allow root or home (e.g., /, /login, /unauthorized etc.)
  // if (!firstSegment) {
  //   return NextResponse.next();
  // }

  // // Rule 2: Allow SuperAdmin / SubAdmin role-based routes
  // if (allowedRoles.includes(firstSegment)) {
  //   return NextResponse.next();
  // }

  // // Rule 3: Allow public routes
  // const publicRoutes = ["login", "register", "forget-password", "dashboard", "unauthorized"];
  // if (publicRoutes.includes(firstSegment)) {
  //   return NextResponse.next();
  // }

  // // Rule 4: Allow degree/year routes like /BCA/2025/...
  // // (match if URL has exactly 3 segments: degree/year/login OR register)
  // if (segments.length >= 3) {
  //   const [degree, year, action] = segments;
  //   const allowedActions = ["login", "register"];
  //   if (allowedActions.includes(action)) {
  //     return NextResponse.next();
  //   }
  // }

  // // Default: redirect unauthorized
  // const url = req.nextUrl.clone();
  // url.pathname = "/unauthorized";
  // url.search = "";
  // return NextResponse.redirect(url);
  return null
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
