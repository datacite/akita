/* istanbul ignore file */

import { NextRequest, NextResponse, userAgent } from 'next/server'
 
export function middleware(request: NextRequest) {
  
  const url = request.nextUrl
  url.searchParams.set('isBot', JSON.stringify(isBot(request)))

  return NextResponse.rewrite(url)
}


const CUSTOM_BOTS = /Google-InspectionTool|GoogleOther|Google-Extended/i

const isBot = (request: NextRequest) => {
  const ua = request.headers.get('user-agent') || ''
  return userAgent(request).isBot || CUSTOM_BOTS.test(ua)
}
