import 'server-only'

import { NextResponse } from 'next/server'
import { envServer } from '@/shared/config/env.server'
import { getAccessTokenFromCookies, getRefreshTokenFromCookies, setAuthCookies } from '@/shared/lib/auth/server'
import { proxyAuthPost } from '@/shared/lib/auth/proxyAuthGateway'
import type { components as AuthGatewayComponents } from '@/shared/api/authGateway.schema'

type TokenPairResponse = AuthGatewayComponents['schemas']['TokenPairResponse']

function joinUrl(base: string, path: string) {
  const baseTrimmed = base.endsWith('/') ? base.slice(0, -1) : base
  const pathTrimmed = path.startsWith('/') ? path : `/${path}`
  return `${baseTrimmed}${pathTrimmed}`
}

function shouldHaveBody(method: string) {
  return !['GET', 'HEAD'].includes(method.toUpperCase())
}

function filterRequestHeaders(headers: Headers) {
  const out = new Headers(headers)
  out.delete('host')
  out.delete('connection')
  out.delete('content-length')
  return out
}

function filterResponseHeaders(headers: Headers) {
  const out = new Headers(headers)
  out.delete('set-cookie')
  out.delete('set-cookie2' as any)
  return out
}

async function proxyOnce(req: Request, upstreamUrl: URL, accessToken?: string) {
  const headers = filterRequestHeaders(req.headers)
  if (accessToken) {
    headers.set('authorization', `Bearer ${accessToken}`)
  } else {
    headers.delete('authorization')
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    cache: 'no-store',
  }

  if (shouldHaveBody(req.method)) {
    init.body = await req.arrayBuffer()
  }

  return fetch(upstreamUrl, init)
}

async function tryRefreshTokens(): Promise<{ ok: true; accessToken?: string } | { ok: false }> {
  const refreshToken = getRefreshTokenFromCookies()
  if (!refreshToken) return { ok: false }

  const result = await proxyAuthPost<TokenPairResponse>('/v1/auth/refresh', { refresh_token: refreshToken })
  if (!result.ok) return { ok: false }

  setAuthCookies(result.data)
  return { ok: true, accessToken: result.data.accessToken }
}

async function handle(req: Request, { params }: { params: { path: string[] } }) {
  const url = new URL(req.url)
  const path = params.path.join('/')

  const upstream = new URL(joinUrl(envServer.platformApiBaseUrl, path))
  upstream.search = url.search

  const accessToken = getAccessTokenFromCookies()
  let res = await proxyOnce(req, upstream, accessToken)

  if (res.status === 401) {
    const refreshed = await tryRefreshTokens()
    if (refreshed.ok) {
      res = await proxyOnce(req, upstream, refreshed.accessToken ?? getAccessTokenFromCookies())
    }
  }

  const body = await res.arrayBuffer()
  return new NextResponse(body, { status: res.status, headers: filterResponseHeaders(res.headers) })
}

export async function GET(req: Request, ctx: { params: { path: string[] } }) {
  return handle(req, ctx)
}
export async function POST(req: Request, ctx: { params: { path: string[] } }) {
  return handle(req, ctx)
}
export async function PUT(req: Request, ctx: { params: { path: string[] } }) {
  return handle(req, ctx)
}
export async function PATCH(req: Request, ctx: { params: { path: string[] } }) {
  return handle(req, ctx)
}
export async function DELETE(req: Request, ctx: { params: { path: string[] } }) {
  return handle(req, ctx)
}
