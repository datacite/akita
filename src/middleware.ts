import { NextRequest, NextResponse } from 'next/server'
import { isBot } from './utils/helpers'
 
export function middleware(request: NextRequest) {
  
  const url = request.nextUrl
  url.searchParams.set('isBot', JSON.stringify(isBot(request)))

  return NextResponse.rewrite(url)
}