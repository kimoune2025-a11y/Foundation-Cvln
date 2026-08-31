import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import {
  ENTITIES,
  RELATIONS,
  BASELINE,
  DOCTRINE,
  getEntity,
  getRelationsFor,
  validateRegistry,
  exportRegistry,
  getUiTree,
} from '@/lib/registry/cvlnRegistry'

// MongoDB connection
let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const method = request.method
  const { searchParams } = new URL(request.url)

  try {
    // -------------------------------------------------------------
    //  CVLN GROUP ENTITY REGISTRY  (read-only, canonical, frozen v1)
    // -------------------------------------------------------------

    // GET /api/entities  (optional ?type= & ?status= & ?q=)
    if (route === '/entities' && method === 'GET') {
      let list = ENTITIES
      const type = searchParams.get('type')
      const status = searchParams.get('status')
      const q = searchParams.get('q')
      if (type) list = list.filter((e) => e.type === type)
      if (status) list = list.filter((e) => e.status === status)
      if (q) {
        const qq = q.toLowerCase()
        list = list.filter(
          (e) =>
            e.name.toLowerCase().includes(qq) ||
            e.entity_id.toLowerCase().includes(qq) ||
            (e.declared_role || '').toLowerCase().includes(qq)
        )
      }
      return handleCORS(NextResponse.json({ count: list.length, entities: list }))
    }

    // GET /api/entities/{entity_id}
    if (path[0] === 'entities' && path.length === 2 && method === 'GET') {
      const entity = getEntity(path[1])
      if (!entity) {
        return handleCORS(NextResponse.json({ error: `Entity ${path[1]} not found` }, { status: 404 }))
      }
      return handleCORS(NextResponse.json({ entity, relations: getRelationsFor(entity.entity_id) }))
    }

    // GET /api/relations  (optional ?from= & ?to= & ?type=)
    if (route === '/relations' && method === 'GET') {
      let list = RELATIONS
      const from = searchParams.get('from')
      const to = searchParams.get('to')
      const type = searchParams.get('type')
      if (from) list = list.filter((r) => r.from === from)
      if (to) list = list.filter((r) => r.to === to)
      if (type) list = list.filter((r) => r.type === type)
      return handleCORS(NextResponse.json({ count: list.length, relations: list }))
    }

    // GET /api/registry/export  (versioned JSON snapshot)
    if (route === '/registry/export' && method === 'GET') {
      return handleCORS(NextResponse.json(exportRegistry()))
    }

    // GET /api/registry/validate  (integrity report)
    if (route === '/registry/validate' && method === 'GET') {
      return handleCORS(NextResponse.json(validateRegistry()))
    }

    // GET /api/registry/baseline  (Foundation Baseline v1 + doctrine)
    if (route === '/registry/baseline' && method === 'GET') {
      return handleCORS(NextResponse.json({ baseline: BASELINE, doctrine: DOCTRINE }))
    }

    // GET /api/registry/tree  (UI tree derived from the canonical registry)
    if (route === '/registry/tree' && method === 'GET') {
      return handleCORS(NextResponse.json({ tree: getUiTree() }))
    }

    // -------------------------------------------------------------
    //  Contact capture (existing)
    // -------------------------------------------------------------
    if (route === '/contact' && method === 'POST') {
      const body = await request.json()
      const email = (body.email || '').trim()
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      if (!emailOk) {
        return handleCORS(NextResponse.json({ error: 'Une adresse e-mail valide est requise.' }, { status: 400 }))
      }
      const db = await connectToMongo()
      const contactObj = {
        id: uuidv4(),
        email,
        name: (body.name || '').trim(),
        message: (body.message || '').trim(),
        created_at: new Date(),
      }
      await db.collection('contacts').insertOne(contactObj)
      const { _id, ...clean } = contactObj
      return handleCORS(NextResponse.json({ success: true, contact: clean }))
    }

    if (route === '/contact' && method === 'GET') {
      const db = await connectToMongo()
      const contacts = await db.collection('contacts').find({}).sort({ created_at: -1 }).limit(1000).toArray()
      const cleaned = contacts.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleaned))
    }

    // -------------------------------------------------------------
    //  Root / status (existing)
    // -------------------------------------------------------------
    if ((route === '/root' || route === '/') && method === 'GET') {
      return handleCORS(NextResponse.json({ message: 'Hello World' }))
    }

    if (route === '/status' && method === 'POST') {
      const body = await request.json()
      if (!body.client_name) {
        return handleCORS(NextResponse.json({ error: 'client_name is required' }, { status: 400 }))
      }
      const db = await connectToMongo()
      const statusObj = { id: uuidv4(), client_name: body.client_name, timestamp: new Date() }
      await db.collection('status_checks').insertOne(statusObj)
      return handleCORS(NextResponse.json(statusObj))
    }

    if (route === '/status' && method === 'GET') {
      const db = await connectToMongo()
      const statusChecks = await db.collection('status_checks').find({}).limit(1000).toArray()
      const cleaned = statusChecks.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleaned))
    }

    return handleCORS(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }))
  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json({ error: 'Internal server error' }, { status: 500 }))
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
